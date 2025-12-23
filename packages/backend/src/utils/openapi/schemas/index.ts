import { HttpStatusPhrases } from "@/utils/http-status/index.ts";
import { createMessageObjectSchema } from "./create-message-object.ts";

export { IdParamsSchema } from "./id-params.ts";
export { createErrorSchema } from "./create-error-schema.ts";
export { createMessageObjectSchema } from "./create-message-object.ts";
export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
