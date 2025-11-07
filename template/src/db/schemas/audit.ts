import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const auditLogs = pgTable("audit_logs", {
    id: uuid("id").primaryKey(),
    event: text("name").notNull(),
    description: text("name").notNull(),
    referenceId: text("reference_id"),
    device: text("device"),
    browser: text("browser"),
    system: text("system"),
    email: text("email"),
    createdAt: timestamp("created_at").defaultNow(),

})