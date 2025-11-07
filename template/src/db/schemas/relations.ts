import { relations } from "drizzle-orm";
import { user } from "./auth";
import { usage } from "./usage";

export const userRelations = relations(user, ({ many }) => ({
    usage: many(usage)
}))

export const usageRelations = relations(usage, ({one}) => ({
    user: one(user, {
        fields: [usage.referenceId],
        references: [user.id]
    })
}))