import { version } from "../package.json";
import { logger } from "hono/logger";
import { Scalar } from "@scalar/hono-api-reference";
import { createRouter } from "@/utils";
import { onError, notFound, serveEmojiFavicon } from "@/middlewares";

import env from "@/env";
import { index, memos } from "@/routes";

const app = createRouter();

app.use(logger())
  .use(serveEmojiFavicon('📝'));

app.onError(onError);
app.notFound(notFound);

app.openAPIRegistry.registerComponent(
  'securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

if (env.NODE_ENV === "dev") {
  app.doc("/openapi", {
    openapi: "3.0.0",
    info: {
      version,
      title: "Mewmos API",
    },
  });

  app.get("/reference", Scalar({
    url: "/openapi",
    layout: "classic",
    defaultHttpClient: {
      targetKey: "js",
      clientKey: "fetch",
    },
  }));
}

// register routes
[index, memos].forEach((r) => {
  app.route("/", r);
});

export default app;
