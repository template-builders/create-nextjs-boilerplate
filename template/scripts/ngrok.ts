import ngrok from "@ngrok/ngrok"
import * as dotenv from "dotenv"

(async function() {
    dotenv.config()

    const AUTH_TOKEN = process.env.NGROK_AUTHTOKEN
    const DOMAIN = process.env.NGROK_DOMAIN
    if (!AUTH_TOKEN) {
        console.error("NGROK_AUTHTOKEN is not set in the environment variables.")
        process.exit(1)
    }
    if (!DOMAIN) {
        console.error("NGROK_DOMAIN is not set in the environment variables.")
        process.exit(1)
    }

    
    const listener = await ngrok.forward({
        authtoken: AUTH_TOKEN,
        addr: 3000,
        domain: DOMAIN,
    })

    console.log(`ngrok tunnel established at: ${listener.url()}`)
})()

process.stdin.resume()