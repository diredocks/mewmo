import { editMemoSchema, insertMemosSchema, selectMemosSchema, tagsSchema } from "@/db/memos/schema";
import { jsonContent } from "@/utils";
import { HttpStatusCodes } from "@/utils/http-status";
import { createErrorSchema, IdParamsSchema, notFoundSchema } from "@/utils/openapi/schemas";
import { createRoute, z } from "@hono/zod-openapi";

const tags = ["memos"];
const path = "memos";

export const list = createRoute({
  method: "get",
  path,
  tags,
  request: {
    query: z.object({
      tags: tagsSchema.optional(),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(10),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        data: z.array(selectMemosSchema).openapi({
          description: "The list of memos for the current page",
        }),
        page: z.number().int().min(1).openapi({
          description: "Current page number",
          example: 1,
        }),
        limit: z.number().int().min(1).openapi({
          description: "Number of memos per page",
          example: 10,
        }),
        total: z.number().int().min(0).openapi({
          description: "Total number of memos matching the query",
          example: 42,
        }),
      }),
      "Paginated list of memos with metadata"
    ),
  },
  security: [{ Bearer: [] }],
});

export const create = createRoute({
  method: "post",
  path,
  tags,
  request: {
    body: jsonContent(insertMemosSchema,
      "The momo to create",
      true),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectMemosSchema,
      "The created memo"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertMemosSchema),
      "The validation error(s)",
    ),
  },
  security: [{ Bearer: [] }],
});

export const get = createRoute({
  method: "get",
  path: `${path}/{id}`,
  request: {
    params: IdParamsSchema
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectMemosSchema,
      "The requested memo",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Memo not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  }
});

export const edit = createRoute({
  path: `${path}/{id}`,
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContent(
      editMemoSchema,
      "The task updates",
      true
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectMemosSchema,
      "The updated memo",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Memo not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(editMemoSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  }
});

export const remove = createRoute({
  path: `${path}/{id}`,
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Memo deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Memo not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  }
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetRoute = typeof get;
export type EditRoute = typeof edit;
export type RemoveRoute = typeof remove;
