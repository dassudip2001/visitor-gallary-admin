import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { date, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  material: varchar({ length: 255 }).notNull(),
  description: text(),
  createdAt: date().notNull().defaultNow(),
  updatedAt: date().notNull().defaultNow(),
});

export type InsertProduct = InferInsertModel<typeof productsTable>;
export type ProductSelect = InferSelectModel<typeof productsTable>;
