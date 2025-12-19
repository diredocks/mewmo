import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

const memos = sqliteTable("memos", {
  id: integer({ mode: "number" })
    .primaryKey({ autoIncrement: true }),

  content: text().notNull(),

  // tags: text({ mode: "json" })
  //   .$type<string[]>()
  //   .notNull()
  //   .$defaultFn(() => []),

  createdAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date()),

  updatedAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export default memos;
