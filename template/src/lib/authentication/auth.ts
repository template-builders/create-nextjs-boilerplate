import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, twoFactor, phoneNumber, admin, apiKey, createAuthMiddleware } from "better-auth/plugins";
import { stripe } from "@better-auth/stripe"
import { passkey } from "better-auth/plugins/passkey";
import { db } from "@/db"; 
import {schemaTables} from "@/db/schemas"
import { verificationEmail, otpEmail, resetPassword } from "../resend/password";
import { usageMetrics, stripePlans, cyclableMetrics } from "../stripe";
import Stripe from "stripe";
import { usage } from "@/db/schemas/usage";
import { stripeEventHandler } from "../stripe/event-handler";
import { sendChangeEmail } from "../resend/change-email";
import { addMonthsUTC, nowUTC } from "../cron/date";
import { accessControl, moderatorRole, userRole, adminRole, ownerRole } from "./permissions"
import { and, eq, inArray } from "drizzle-orm";
import { toTitle } from "@/utils/format";
import { createBetterAuthAudit, createRequestAudit, createStripeEventAudit } from "../logger";

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
    typescript: true
});

export const auth = betterAuth({
    account: {
        accountLinking: {
            enabled: true
        },

    },
    user: {
        deleteUser: {
            enabled: true,
            beforeDelete: async (auth, request) => {
                const userData = await db.query.user.findFirst({where: (user, {eq}) => eq(user.id, auth.id)})
                await stripeClient.customers.del(userData!.stripeCustomerId as string)

                if (request) {
                    const event = "User deleted"
                    const detail = "User information deleted"
                    const description = "User deleted in from database"
                    createRequestAudit(request, {event, detail, description, status: "SUCCESS"}, auth.id)
                }
            }
        },
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async (data, request) => {
                await sendChangeEmail(data.newEmail, data.url)
            }
        }
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user, ctx) => {

                    if (ctx) {
                        const basePath = new URL(ctx.request?.url ?? "").pathname
                        const provider = basePath?.includes("callback") ? toTitle(basePath.substring(basePath.lastIndexOf("/") + 1)) : "Email/Password"
                        const event = "User created"
                        const detail = `User created via ${provider}`
                        const description = "New user added to database"
                        createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, user.id)
                    }
                    const periodStart = nowUTC()
                    const periodEnd = addMonthsUTC(periodStart, 1)

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
                        ...usageMetrics.map((metric) => createUsage(metric)) 
                    ])
                },
            },
            update: {
                after: async (user, ctx) => {
                    if (ctx) {
                        const event = "User updated"
                        const detail = "User information updated"
                        const description = "User updated in database"
                        createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, user.id)
                    }
                }
            }
        },
        account: {
            create: {
                after: async(account, ctx) => {
                    if (ctx) {
                        const event = "Account created"
                        const detail = "Account information linked"
                        const description = "Account added in database"
                        createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, account.userId)
                    }
                }
            },
            update: {
                after: async(account, ctx) => {
                    if (ctx) {
                        const event = "Account updated"
                        const detail = "Account information updated"
                        const description = "Account updated in database"
                        createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, account.userId)
                    }
                }
            }
        },
        session: {
            create: {
                after: async(session, ctx) => {
                    if (ctx) {
                        const event = "Session created"
                        const detail = "New session initialized"
                        const description = "New session added in database"
                        createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, session.userId)
                    }
                }
            },
            update: {
                after: async(session, ctx) => {
                    if (ctx) {
                        const event = "Session updated"
                        const detail = "Session has updated"
                        const description = "Session updated in database"
                        createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, session.userId)
                    }
                }
            }
        }
    },
    trustedOrigins: [`${process.env.BETTER_AUTH_URL}`],
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
		level: "debug",
		log: (level, message, ...args) => {
			console.log(`[${level}] ${message}`, ...args);
            console.log("testing")
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
        }
    },
    emailVerification: {
      sendVerificationEmail: async ({user, url, token}, request) => {
        await verificationEmail(user, url)
      },
      sendOnSignIn: true,
      sendOnSignUp: true,
      autoSignInAfterVerification: true
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        },
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!
        },
        microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID!,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET!
        }
    },
    plugins: [
        admin({
            ac: accessControl,
            roles: {
                user: userRole,
                moderator: moderatorRole,
                admin: adminRole,
                owner: ownerRole
            }
        }),
        phoneNumber(),
        emailOTP({
            otpLength: 8,
            expiresIn: 300,
            async sendVerificationOTP({email, otp, type}) {
                await otpEmail(email, otp)
            },
        }),
        twoFactor({
            otpOptions: {
                digits: 8,
                async sendOTP ({user, otp}, request) {
                    await otpEmail(user.email, otp)
                },
            }
        }),
        stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
            createCustomerOnSignUp: true,
            onEvent: stripeEventHandler,
            subscription: {
                enabled: true,
                plans: stripePlans,
                onSubscriptionCancel: async ({event, subscription, stripeSubscription, cancellationDetails}) => {
                },
                onSubscriptionDeleted: async ({event, stripeSubscription, subscription: currentSubscription}) => {
                    const periodStart = nowUTC()
                    const periodEnd = addMonthsUTC(periodStart, 1)

                    await Promise.all([
                        db.update(usage).set({
                            count: 0,
                            periodStart,
                            periodEnd
                        }).where(and(eq(usage.referenceId, currentSubscription.referenceId), inArray(usage.metric, cyclableMetrics)))
                    ])
                },
                onSubscriptionComplete: async ({event, subscription, stripeSubscription, plan}) => {

                },
                onSubscriptionUpdate: async ({event, subscription}) => {
                    
                }
            }
        }),
        passkey(),
        apiKey()
    ]
});
