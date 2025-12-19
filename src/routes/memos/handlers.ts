import type { RouteHandler } from "@hono/zod-openapi";
import type { ListRoute, CreateRoute, GetRoute, EditRoute, RemoveRoute } from "./routes";
import { memos } from "@/db/models";
import db from "@/db";
import { HttpStatusCodes, HttpStatusPhrases } from "@/utils/http-status";
import { eq } from "drizzle-orm";

export const list: RouteHandler<ListRoute> = async (c) => {
  // const { tags } = c.req.valid("query");
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

export const edit: RouteHandler<EditRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  /* This is throw an UNPROCESSABLE_ENTITY error
   * when nothing is given in updates, but whatever */

  const [memo] = await db.update(memos)
    .set(updates)
    .where(eq(memos.id, id))
    .returning();

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

export const remove: RouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const result = await db.delete(memos).where(eq(memos.id, id));

  if (result.rowsAffected === 0) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
