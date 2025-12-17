import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import memos from "./model";

export const selectMemosSchema = createSelectSchema(memos, {
  id: f => f.min(1).openapi({
    description: "ID of memo",
  }),
  content: f => f.openapi({
    description: "Content of memo",
    example: "The quick brown fox jumps over the lazy dog",
  }),
  createdAt: f => f.openapi({
    description: "Timestamp of memo creation",
    example: new Date()
  }),
  updatedAt: f => f.openapi({
    description: "Timestamp of memo update",
    example: new Date()
  })
});

export const insertMemosSchema = createInsertSchema(memos, {
  content: f => f
    .min(1).max(280)
    .openapi({
      description: "Content of memo",
      example: "The quick brown fox jumps over the lazy dog"
    })
}).required({
  content: true
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
