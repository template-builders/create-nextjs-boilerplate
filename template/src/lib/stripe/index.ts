import Stripe from "stripe";
import { StripePlan } from "@better-auth/stripe"

export const userLimits = {
  basic: {
    projects: 5, 
    analyses: 5,
    annotations: 5
  },
  plus: {
    projects: 10, 
    analyses: 50,
    annotations: 25,
  },
  pro: {
    projects: 25, 
    analyses: 500,
    annotations: 250
  }
}

export const subscriptionFeatures = [
  {
    name: "Basic",
    monthlyPrice: 0,
    annualPrice: 0,
    popular: false,
    limitations: userLimits.basic,
    buttonText: "Get started for Free",
    description: "Perfect for individuals and small teams getting started",
    features: [
      `Up to ${userLimits.basic.projects} projects`,
      `Up to ${userLimits.basic.analyses} analyses`,
      `Up to ${userLimits.basic.annotations} annotations`
    ]
  },
  {
    name: "Plus",
    monthlyPrice: 20,
    annualPrice: parseFloat((192 / 12).toFixed(2)),
    popular: true,
    limitations: userLimits.plus,
    buttonText: "Start Free Trial",
    description: "Ideal for those who want an ideal developer experience",
    features: [
      `Up to ${userLimits.plus.projects} projects`,
      `Up to ${userLimits.plus.analyses} analyses`,
      `Up to ${userLimits.plus.annotations} annotations`
    ]
  },
  {
    name: "Pro",
    monthlyPrice: 40,
    annualPrice: parseFloat((384 / 12).toFixed(2)),
    popular: false,
    limitations: userLimits.pro,
    buttonText: "Subscribe today",
    description: "For those who use heavily analyses and extensive project reads",
    features: [
      `Up to ${userLimits.pro.projects} projects`,
      `Up to ${userLimits.pro.analyses} analyses`,
      `Up to ${userLimits.pro.annotations} annotations`
    ]
  }
]

export const stripePlans: StripePlan[] = [
  {
    name: "basic",
    priceId: process.env.STRIPE_BASIC_ID,
    lookupKey: "basic_monthly",
    limits: userLimits.basic,
    group: "basic"
  },
  {
    name: "plus",
    priceId: process.env.STRIPE_PLUS_MONTHLY_ID,
    annualDiscountPriceId: process.env.STRIPE_PLUS_ANNUALLY_ID,
    lookupKey: "plus_monthly",
    annualDiscountLookupKey: "plus_annual",
    limits: userLimits.plus,
    group: "plus"
  },
  {
    name: "pro",
    priceId: process.env.STRIPE_PRO_MONTHLY_ID,
    annualDiscountPriceId: process.env.STRIPE_PRO_ANNUALLY_ID,
    lookupKey: "pro_monthly",
    annualDiscountLookupKey: "pro_annual",
    limits: userLimits.pro,
    freeTrial: {
      days: 14
    }
  },
]