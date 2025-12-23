import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "./default-hook";

export function createRouter() {
  return new OpenAPIHono({
    strict: false,
    defaultHook
  })
};
