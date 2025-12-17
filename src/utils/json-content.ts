import type { ZodSchema } from "./types";

const jsonContent = <
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

export default jsonContent;
