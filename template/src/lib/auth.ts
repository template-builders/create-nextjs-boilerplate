import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, twoFactor, phoneNumber, admin } from "better-auth/plugins";
import { stripe } from "@better-auth/stripe"
import { passkey } from "better-auth/plugins/passkey";
import { db } from "@/db"; 
import { subscription } from "@/db/schemas/auth"
import { usage } from "@/db/schemas/plan"
import {schemaTables} from "@/db/schemas"
import { verificationEmail, otpEmail, resetPassword } from "./resend/password";
import { stripePlans } from "./stripe";
import Stripe from "stripe";

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
                const start = new Date()
                const end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                function createSubscription() {
                    return db.insert(subscription).values({
                        id: crypto.randomUUID(),
                        plan: "basic",
                        referenceId: user.id,
                        stripeCustomerId: user.stripeCustomerId,
                        status: "active",
                        periodStart: start,
                        periodEnd: end,
                    })
                }
                function createUsage(metric: string) {
                    return db.insert(usage).values({
                        referenceId: user.id,
                        metric,
                        periodStart: start,
                        periodEnd: end,
                        count: 0,
                        updatedAt: start
                    })
                }
                await Promise.all([
                    createSubscription(),
                    ...["projects", "analyses"].map((metric) => createUsage(metric)) 
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