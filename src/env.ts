import { config } from "dotenv";
import { z } from "zod";

config({ quiet: true });

const EnvSchema = z.object({
  NODE_ENV: z.literal(["dev", "production"]).default("dev"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url().default("file:mewmo.db"),
});

export type env = z.infer<typeof EnvSchema>;

const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error("Invalid env:", error.message);
  process.exit(1);
}

export default env!;
