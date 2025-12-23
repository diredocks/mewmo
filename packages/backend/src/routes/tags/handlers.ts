import type { RouteHandler } from "@hono/zod-openapi";
import type { ListRoute, GetRoute, RemoveRoute } from "./routes";
import { db } from "@/db";
import { tags, memosToTags } from "@/db/models";
import { eq } from "drizzle-orm";
import { handleNotFound } from "@/utils/openapi/handlers";
import { HttpStatusCodes } from "@/utils/http-status";

async function loadMemosByIds(ids: number[]) {
  if (!ids.length) return [];

  const rows = await db.query.memos.findMany({
    where: (fields, operators) =>
      operators.inArray(fields.id, ids),
    with: { memosToTags: { with: { tag: true } } }
  });

  return rows.map(row => {
    const { memosToTags, ...memo } = row;
    return { ...memo, tags: memosToTags.map(mt => mt.tag.name), };
  });
}

export const list: RouteHandler<ListRoute> = async (c) => {
  const tags = await db.query.tags.findMany();
  return c.json(tags);
};

export const get: RouteHandler<GetRoute> = async (c) => {
  const row = await db.query.tags.findFirst({
    where: eq(tags.id, c.req.valid("param").id),
    with: { memosToTags: { columns: { memoId: true } } }
  });

  if (!row) return handleNotFound(c);

  const { memosToTags, ...tag } = row;

  const memoIds = memosToTags.map(mt => mt.memoId);
  const memos = await loadMemosByIds(memoIds);

  return c.json({ ...tag, memos });
};

export const remove: RouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const affected = await db.transaction(async (tx) => {
    await tx.delete(memosToTags).where(eq(memosToTags.tagId, id));
    const res = await tx.delete(tags).where(eq(tags.id, id));
    if (!res.rowsAffected) return 0;
    return res.rowsAffected;
  });

  return affected
    ? c.body(null, HttpStatusCodes.NO_CONTENT)
    : handleNotFound(c);
};
