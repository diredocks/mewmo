import { createRouter } from "@/utils";

import * as routes from "./routes.ts";
import * as handlers from "./handlers.ts";

export const memos = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.get, handlers.get)
  .openapi(routes.edit, handlers.edit)
  .openapi(routes.remove, handlers.remove);
