import Stripe from "stripe";
import { StripePlan } from "@better-auth/stripe"

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
  typescript: true
});

export const USER_LIMITS = {
  basic: {
    projects: 5, 
    analyses: 5
  },
  plus: {
    projects: 10, 
    analyses: 50
  },
  pro: {
    projects: 25, 
    analyses: 500
  }
}

export const stripePlans: StripePlan[] = [
  {
    name: "plus",
    lookupKey: "plus_monthly",
    annualDiscountLookupKey: "plus_annual",
    limits: USER_LIMITS.plus,
    group: "plus"
  },
  {
    name: "pro",
    lookupKey: "pro_monthly",
    annualDiscountLookupKey: "pro_annual",
    limits: USER_LIMITS.pro,
    freeTrial: {
      days: 14
    }
  },
]