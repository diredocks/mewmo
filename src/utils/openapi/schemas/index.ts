import { HttpStatusPhrases } from "@/utils/http-status/index.ts";
import createMessageObjectSchema from "./create-message-object.ts";

export { default as IdParamsSchema } from "./id-params.ts";
export { default as createErrorSchema } from "./create-error-schema.ts";
export { default as createMessageObjectSchema } from "./create-message-object.ts";
export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
