import { z } from 'zod';

const newCommentScheme = z.object({
  body: z.object({
    text: z.string()
  })
});

export default newCommentScheme;
