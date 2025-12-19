import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "@hono/zod-openapi";
import memos from "./model";

export const tagsSchema = z
  .array(z
    .string()
    .min(1)
    .max(24)
  )
  .max(10)
  .transform(tags => [...new Set(tags)])
  .openapi({
    example: ["work", "docs"],
  });

export const selectMemosSchema = createSelectSchema(memos, {
  id: f => f.min(1).openapi({
    description: "Unique identifier for the memo",
    example: 42,
  }),
  content: f => f.openapi({
    description: "Text content of the memo",
    example: "Pick up groceries on the way home",
  }),
  // tags: f => f.openapi({
  //   description: "List of tags associated with the memo",
  // }),
  createdAt: f => f.openapi({
    description: "Date and time when the memo was created",
    example: "2024-10-03T12:34:56.789Z",
  }),
  updatedAt: f => f.openapi({
    description: "Date and time when the memo was last updated",
    example: "2024-10-03T13:10:21.456Z",
  }),
});

export const insertMemosSchema = createInsertSchema(memos, {
  content: f =>
    f.min(1)
      .max(280)
      .openapi({
        description: "Text content of the memo to create",
        example: "Finish the API documentation",
      }),
  // tags: () => tagsSchema.openapi({
  //   description: "Optional tags for categorizing the memo",
  // }),
})
  .required({
    content: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const editMemoSchema = insertMemosSchema.partial();
