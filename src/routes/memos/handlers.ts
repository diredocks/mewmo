import type { RouteHandler } from "@hono/zod-openapi";
import type { ListRoute, CreateRoute, GetRoute } from "./routes";
import { memos } from "@/db/models";
import db from "@/db";
import { HttpStatusCodes, HttpStatusPhrases } from "@/utils/http-status";

export const list: RouteHandler<ListRoute> = async (c) => {
  const memos = await db.query.memos.findMany();
  return c.json(memos);
}

export const create: RouteHandler<CreateRoute> = async (c) => {
  const memo = c.req.valid("json");
  const [inserted] = await db.insert(memos).values(memo).returning();
  return c.json(inserted, HttpStatusCodes.OK);
}

export const get: RouteHandler<GetRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const memo = await db.query.memos.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!memo) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(memo, HttpStatusCodes.OK);
}
