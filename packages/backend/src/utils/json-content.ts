import type { ZodSchema } from "./types";

export const jsonContent = <
  T extends ZodSchema,
>(schema: T,
  description: string,
  required?: boolean,
) => {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
    required,
  };
};
