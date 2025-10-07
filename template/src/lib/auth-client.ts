import { createAuthClient } from "better-auth/react"
import {twoFactorClient, emailOTPClient,  } from "better-auth/client/plugins"
import { passkeyClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    // This will resolve to the below even if removed, but here for clarify
    baseURL: process.env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    secret: process.env.BETTER_AUTH_SECRET,
    plugins: [
        twoFactorClient({
            onTwoFactorRedirect() {
                window.location.href = "/2FA"
            },
        }),
        emailOTPClient(),
        passkeyClient()
    ]
})