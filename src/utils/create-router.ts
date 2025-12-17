import { OpenAPIHono } from "@hono/zod-openapi";
import defaultHook from "./default-hook";

function createRouter() {
  return new OpenAPIHono({
    strict: false,
    defaultHook
  })
};

export default createRouter;
