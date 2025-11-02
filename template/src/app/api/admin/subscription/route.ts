import { NextRequest, NextResponse } from "next/server";
import { stripeClient } from "@/lib/auth";
import { Subscription } from "@better-auth/stripe";
import { ActionTypes } from "@/app/(admin)/admin/users/ManageSubscription";

type ExtendedSubscription = Subscription & {
    action?: ActionTypes
    months?: number
    seats?: number
    plan?: "basic" | "plus" | "pro"
}

const PLUS_MONTHLY_ID = process.env.STRIPE_PLUS_MONTHLY_ID!
const PRO_MONTHLY_ID = process.env.STRIPE_PRO_MONTHLY_ID!

const planRank = {
    [PLUS_MONTHLY_ID]: 1,
    [PRO_MONTHLY_ID]: 2,
};

const priceMap = {
    "plus": PLUS_MONTHLY_ID,
    "pro": PRO_MONTHLY_ID
}

function isUpgrade(currentPrice: string, targetPrice: string) {
    return planRank[currentPrice] < planRank[targetPrice] 
}

async function getSubAndItem(subscriptionId: string) {
    const subscription = await stripeClient.subscriptions.retrieve(subscriptionId, {
        expand: ["items.data.price.product", "latest_invoice.payment_intent"]
    })
    const item = subscription.items.data[0]    
    return {subscription, item}
}

export async function POST(request: NextRequest) {
    const body: ExtendedSubscription = await request.json()
    const idempotencyKey = request.headers.get("x-idempotency-key") ?? crypto.randomUUID();
    let data;
    try {
        if (body.action === "modify") {
            if (!body.stripeSubscriptionId) {
                await stripeClient.subscriptions.create({
                    customer: body.stripeCustomerId!,
                    items: [{ price: body.plan === "plus" ? PLUS_MONTHLY_ID : PRO_MONTHLY_ID}]
                }, {idempotencyKey})
            } else if(body.plan === "basic") {
                await stripeClient.subscriptions.update(body.stripeSubscriptionId, {
                    cancel_at_period_end: true
                }, {idempotencyKey})
            } else {
                const { item } = await getSubAndItem(body.stripeSubscriptionId)
                data = await stripeClient.subscriptions.update(body.stripeSubscriptionId, {
                    items: [{id: item.id, price: priceMap[body.plan]}],
                    proration_behavior: "none",
                    
                }, {idempotencyKey})
            }
        } else if (body.action === "remove-cancellation" && body.stripeSubscriptionId) {
            await stripeClient.subscriptions.update(body.stripeSubscriptionId, {
                cancel_at_period_end: false
            })
        }
        return NextResponse.json({message: "Successfully handled action", success: true, id: body.referenceId})
    } catch (e) {
        console.log(e)
        throw new Error("Failed to process action")
    }
}