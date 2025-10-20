import {
    pgTable,
    json,
    text,
    timestamp,
    boolean,
    integer,
    uuid,
    pgEnum,
    primaryKey
} from "drizzle-orm/pg-core";
import { user } from "./auth";

// export const plans = pgTable("plans", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   code: text("code").notNull().unique(),
//   name: text("name").notNull(),
//   stripeProductId: text("stripe_product_id").notNull().unique(),
//   monthlyPriceId: text("monthly_price_id").unique(),
//   annualPriceId: text("annual_price_id").unique(),
//   monthlyLookupKey: text("monthly_lookup_key"),
//   annualLookupKey: text("annual_lookup_key"),
//   amountCents: integer("amount_cents").notNull(),
//   currency: text("currency").notNull().default("usd"),
//   features: json("features").notNull().default({})
// });

// export const planLimits = pgTable("plan_limits", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   planId: uuid("plan_id").notNull().references(() => plans.id, { onDelete: "cascade" }),
//   isActive: boolean("is_active").notNull().default(true),
//   projectsLimit: integer("projects_limit"),
//   analysesLimit: integer("analyses_limit"),
// });

export const usage = pgTable("usage", {
  referenceId: text("reference_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  metric: text("metric").notNull(),             
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  count: integer("count").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
}, (t) => [primaryKey({ columns: [t.metric, t.referenceId, t.periodEnd, t.periodStart] })]);