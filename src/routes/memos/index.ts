import { createRouter } from "@/utils";

import * as routes from "./routes.ts";
import * as handlers from "./handlers.ts";

const memos = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.get, handlers.get);

export default memos;
