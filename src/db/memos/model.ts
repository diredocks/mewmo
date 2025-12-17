import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const memos = sqliteTable("memos", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  content: text().notNull(),
  createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
})

export default memos;
