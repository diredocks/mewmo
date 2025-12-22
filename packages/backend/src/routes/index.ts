import { createRoute, type RouteHandler } from "@hono/zod-openapi";
import { createRouter, jsonContent } from "@/utils";
import { z } from '@hono/zod-openapi'
import { HttpStatusCodes } from "@/utils/http-status";
import { version } from "../../package.json";

const route = createRoute({
  tags: ["Index"],
  method: "get",
  path: "/",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string().default("Hello from Mewmo ~(=^･ω･^)"),
        version: z.string()
      }),
      "Entry point of backend api")
  },
});

const handler: RouteHandler<typeof route> = (c) => {
  return c.json({ message: "Hello from Mewmo ~(=^･ω･^)", version }, HttpStatusCodes.OK);
};

export const index = createRouter().openapi(route, handler);
export { memos } from "./memos";
export { tags } from "./tags";
