import Stripe from "stripe";
import { StripePlan } from "@better-auth/stripe"

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
  typescript: true
});

export const USER_LIMITS = {
  basic: {projects: 3, analyses: 10},
  plus: {projects: 10, analyses: 50},
  pro: {projects: 25, analyses: 500}
}

// Always define the lookup keys in this format '<plan>_<interval>_<currency> for clarity'
// e.g. 'pro_monthly_usd', 'pro_annual_usd'

export const stripePlans: StripePlan[] = [
  {
    name: "plus",
    lookupKey: "plus_monthly_usd",
    annualDiscountLookupKey: "plus_annual_usd",
    limits: USER_LIMITS.plus
  },
  {
    name: "pro",
    lookupKey: "pro_monthly_usd",
    annualDiscountLookupKey: "pro_annual_usd",
    limits: USER_LIMITS.pro,
    freeTrial: {
      days: 14,
    }
  },
]