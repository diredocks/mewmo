import { relations } from "drizzle-orm";
import { sqliteTable, integer, text, primaryKey } from "drizzle-orm/sqlite-core";

export const memos = sqliteTable("memos", {
  id: integer({ mode: "number" })
    .primaryKey({ autoIncrement: true }),
  content: text().notNull(),
  createdAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export const memosRelations = relations(memos, ({ many }) => ({
  memosToTags: many(memosToTags),
}));

export const tags = sqliteTable('tags', {
  id: integer({ mode: "number" })
    .primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
})

export const tagsRelations = relations(tags, ({ many }) => ({
  memosToTags: many(memosToTags),
}))

export const memosToTags = sqliteTable('memosToTags',
  {
    memoId: integer('memoId').notNull().references(() => memos.id),
    tagId: integer('tagId').notNull().references(() => tags.id),
  },
  (t) => [
    primaryKey({ columns: [t.memoId, t.tagId] })
  ]
)

export const memosToTagsRelations = relations(memosToTags, ({ one }) => ({
  tag: one(tags, {
    fields: [memosToTags.tagId],
    references: [tags.id],
  }),
  memo: one(memos, {
    fields: [memosToTags.memoId],
    references: [memos.id],
  }),
}));
