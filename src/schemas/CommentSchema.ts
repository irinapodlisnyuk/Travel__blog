import { z } from "zod";

export const CommentExtendedSchema = z.object({
  id: z.number(),
  post_id: z.number(),
  author_name: z.string(),
  comment: z.string(),
  created_at: z.string(),
});

export const CommentListSchema = z.array(CommentExtendedSchema);

export type CommentExtended = z.infer<typeof CommentExtendedSchema>;
