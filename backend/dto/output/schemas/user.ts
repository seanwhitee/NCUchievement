import z from "zod";

export const user = z.object({
  id: z.string(),
  username: z.string(),
  roleId: z.string(),
  collectionCount: z.int(),
});
