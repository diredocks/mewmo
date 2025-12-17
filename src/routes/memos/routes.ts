import { insertMemosSchema, selectMemosSchema } from "@/db/memos/schema";
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
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectMemosSchema),
      "The list of memos"
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

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetRoute = typeof get;
