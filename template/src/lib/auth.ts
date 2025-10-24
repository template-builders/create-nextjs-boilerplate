import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, twoFactor, phoneNumber, admin } from "better-auth/plugins";
import { stripe } from "@better-auth/stripe"
import { passkey } from "better-auth/plugins/passkey";
import { db } from "@/db"; 
import {schemaTables} from "@/db/schemas"
import { verificationEmail, otpEmail, resetPassword } from "./resend/password";
import { stripePlans } from "./stripe";
import Stripe from "stripe";
import { subscription } from "@/db/schemas/auth";
import { usage } from "@/db/schemas/plan";

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
    typescript: true
  });

export const auth = betterAuth({
    account: {
        accountLinking: {
            enabled: true
        }
    },
    trustedOrigins: [`https://${process.env.NGROK_DOMAIN}`, `${process.env.BETTER_AUTH_URL}`],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schemaTables
    }),
    advanced: {
        database: {
            generateId: () => crypto.randomUUID()
        }
    },
    logger: {
		disabled: false,
		disableColors: false,
		level: "error",
		log: (level, message, ...args) => {
			console.log(`[${level}] ${message}`, ...args);
		}
	},
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({user, url, token}, request) => {
            await resetPassword(user.email, url)
        },
        onPasswordReset: async ({ user }, request) => {
            console.log(`Password for user ${user.email} has been reset.`);
        },
    },
    emailVerification: {
      sendVerificationEmail: async ({user, url, token}, request) => {
        await verificationEmail(user, url)
      },
      sendOnSignUp: true,
      autoSignInAfterVerification: true
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            redirectUri: "http://localhost:3000/api/auth/callback/github"
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        },
    },
    plugins: [
        admin(),
        phoneNumber(),
        emailOTP({
            otpLength: 8,
            expiresIn: 300,
            async sendVerificationOTP({email, otp, type}) {
                const data = await otpEmail(email, otp)
            },
        }),
        twoFactor({
            otpOptions: {
                digits: 8,
                async sendOTP ({user, otp}, request) {
                    const data = await otpEmail(user.email, otp)
                },
            }
        }),
        stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
            createCustomerOnSignUp: true,
            async onCustomerCreate({user, stripeCustomer}, ctx) {
                const subscriptionData = await stripeClient.subscriptions.create({
                    customer: stripeCustomer.id,
                    items: [{price: process.env.STRIPE_BASIC_ID}]
                })
                const periodStart = new Date(subscriptionData.items.data[0].current_period_start * 1000);
                const periodEnd   = new Date(subscriptionData.items.data[0].current_period_end   * 1000);
                async function createSubscription() {

                    return db.insert(subscription).values({
                        id: crypto.randomUUID(),
                        plan: "basic",
                        referenceId: user.id,
                        stripeCustomerId: stripeCustomer.id,
                        stripeSubscriptionId: subscriptionData.id,
                        status: "active",
                        periodStart,
                        periodEnd,
                        cancelAtPeriodEnd: subscriptionData.cancel_at_period_end,
                        seats: 1,
                    })
                }
                async function createUsage(metric: string) {
                    return db.insert(usage).values({
                        referenceId: user.id,
                        metric,
                        periodStart,
                        periodEnd,
                        count: 0,
                        updatedAt: new Date()
                    })
                }
                await Promise.all([
                    createSubscription(),
                    ...["projects", "analyses", "annotations"].map((metric) => createUsage(metric)) 
                ])
            },
            subscription: {
                enabled: true,
                plans: stripePlans
            }
        }),
        passkey()
    ]
});