// TODO: Transactions (in function)

import type { RouteHandler } from "@hono/zod-openapi";
import type { ListRoute, CreateRoute, GetRoute, EditRoute, RemoveRoute } from "./routes";
import { memos, tags, memosToTags } from "@/db/models";
import { db } from "@/db";
import { HttpStatusCodes, HttpStatusPhrases } from "@/utils/http-status";
import { sql, eq, inArray, desc } from "drizzle-orm";

async function syncTags(memoId: number, tagNames: string[]) {
  await db.delete(memosToTags).where(eq(memosToTags.memoId, memoId));

  if (!tagNames.length) return;

  const existingTags = await db.query.tags.findMany({
    where(fields, operators) {
      return operators.inArray(fields.name, tagNames);
    },
  });

  const tagMap = new Map(existingTags.map(t => [t.name, t.id]));
  const missing = tagNames.filter(t => !tagMap.has(t));

  if (missing.length) {
    const inserted = await db.insert(tags).values(missing.map(name => ({ name }))).returning();
    inserted.forEach(t => tagMap.set(t.name!, t.id));
  }

  await db.insert(memosToTags).values([...tagMap.values()].map(tagId => ({ memoId, tagId })));
}

async function loadMemoById(id: number) {
  const row = await db.query.memos.findFirst({
    where: eq(memos.id, id),
    with: { memosToTags: { with: { tag: true } } },
  });
  if (!row) return null;
  const { memosToTags, ...memo } = row;
  return { ...memo, tags: memosToTags.map(mt => mt.tag.name) };
}

async function handleNotFound(c: any) {
  return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
}

export const list: RouteHandler<ListRoute> = async (c) => {
  const { tags: filterTags, page, limit } = c.req.valid("query");
  const offset = (page - 1) * limit;

  const memoFilter = filterTags?.length
    ? inArray(
      memos.id,
      db.select({ id: memosToTags.memoId })
        .from(memosToTags)
        .innerJoin(tags, eq(tags.id, memosToTags.tagId))
        .where(inArray(tags.name, filterTags))
        .groupBy(memosToTags.memoId)
        .having(sql`count(distinct ${tags.name}) = ${filterTags.length}`)
    )
    : undefined;

  const [totalResult, data] = await Promise.all([
    db.select({ count: sql<number>`count(*)` })
      .from(memos)
      .where(memoFilter),

    db.query.memos.findMany({
      where: memoFilter,
      limit,
      offset,
      with: {
        memosToTags: {
          with: {
            tag: true
          }
        }
      },
      orderBy: [desc(memos.createdAt)]
    })
  ]);

  const formattedData = data.map(row => {
    const { memosToTags, ...memo } = row;
    return { ...memo, tags: memosToTags.map(mt => mt.tag.name) };
  });

  return c.json({
    data: formattedData,
    page,
    limit,
    total: totalResult[0]?.count ?? 0,
  }, HttpStatusCodes.OK);
};

export const get: RouteHandler<GetRoute> = async (c) => {
  const memo = await loadMemoById(c.req.valid("param").id);
  return memo ? c.json(memo, HttpStatusCodes.OK) : handleNotFound(c);
};

export const edit: RouteHandler<EditRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const updated = await db.update(memos)
    .set(updates)
    .where(eq(memos.id, id))
    .returning({ id: memos.id });

  if (!updated.length) return handleNotFound(c);

  if (updates.tags) {
    await syncTags(id, updates.tags);
  }

  const memo = await loadMemoById(id);
  return memo ? c.json(memo, HttpStatusCodes.OK) : handleNotFound(c);
};

export const create: RouteHandler<CreateRoute> = async (c) => {
  const { tags = [], ...memoData } = c.req.valid("json");
  const [row] = await db.insert(memos).values(memoData).returning({ id: memos.id });
  if (!row) throw new Error("Insert memo failed");

  await syncTags(row.id, tags);
  const memo = await loadMemoById(row.id);
  if (!memo) throw new Error("Inserted memo not found");

  return c.json(memo, HttpStatusCodes.OK);
};

export const remove: RouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const affected = await db.transaction(async (tx) => {
    const usedTags = await tx
      .select({ tagId: memosToTags.tagId })
      .from(memosToTags)
      .where(eq(memosToTags.memoId, id));

    await tx.delete(memosToTags).where(eq(memosToTags.memoId, id));

    const res = await tx.delete(memos).where(eq(memos.id, id));
    if (!res.rowsAffected) return 0;

    if (!usedTags.length) return res.rowsAffected;

    const tagIds = usedTags.map(t => t.tagId);

    const stillUsed = await tx
      .select({ tagId: memosToTags.tagId })
      .from(memosToTags)
      .where(inArray(memosToTags.tagId, tagIds))
      .groupBy(memosToTags.tagId);

    const stillUsedIds = new Set(stillUsed.map(t => t.tagId));

    const orphanIds = tagIds.filter(id => !stillUsedIds.has(id));

    if (orphanIds.length) {
      await tx.delete(tags).where(inArray(tags.id, orphanIds));
    }

    return res.rowsAffected;
  });

  return affected
    ? c.body(null, HttpStatusCodes.NO_CONTENT)
    : handleNotFound(c);
};
