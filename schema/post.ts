import { z } from 'zod';

export const postSchema = z.object({
  title: z.string(),
  authorEmail: z.string().email(),
  content: z.string(),
});

export type Post = z.infer<typeof postSchema>;
