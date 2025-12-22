import { HttpStatusCodes, HttpStatusPhrases } from "@/utils/http-status";

export async function handleNotFound(c: any) {
  return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
}
