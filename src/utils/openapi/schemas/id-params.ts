import { z } from "@hono/zod-openapi";

const IdParamsSchema = z.object({
  id: z.coerce.number().openapi({
    param: {
      name: "id",
      in: "path",
      required: true,
    },
    required: ["id"],
    example: 1,
  }),
});

export default IdParamsSchema;
