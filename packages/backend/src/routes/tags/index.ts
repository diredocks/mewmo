import { createRouter } from "@/utils";

import * as routes from "./routes.ts";
import * as handlers from "./handlers.ts";

export const tags = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.get, handlers.get)
  .openapi(routes.remove, handlers.remove);
