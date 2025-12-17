import type { Hook } from "@hono/zod-openapi";
import { UNPROCESSABLE_ENTITY } from "./http-status/http-status-codes";

const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json(
      {
        success: result.success,
        message: result.error.issues[0]?.message,
        error: {
          name: result.error.name,
          issues: result.error.issues,
        },
      },
      UNPROCESSABLE_ENTITY,
    );
  }
};

export default defaultHook;
