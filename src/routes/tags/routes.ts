import { selectTagsSchema } from "@/db/memos/schema";
import { jsonContent } from "@/utils";
import { HttpStatusCodes } from "@/utils/http-status";
import { createErrorSchema, IdParamsSchema, notFoundSchema } from "@/utils/openapi/schemas";
import { createRoute, z } from "@hono/zod-openapi";

const tags = ["tags"];
const path = "tags";

export const list = createRoute({
  method: "get",
  path,
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectTagsSchema.omit({ memos: true })),
      "List of tags"
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
      selectTagsSchema,
      "The requested tag",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Tag not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
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
      description: "Tag deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Tag not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  }
});

export type ListRoute = typeof list;
export type GetRoute = typeof get;
export type RemoveRoute = typeof remove;
