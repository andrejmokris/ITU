import { z } from 'zod';

const newReviewScheme = z.object({
  body: z.object({
    shopId: z.number(),
    rating: z.number(),
    comment: z.string()
  })
});

export default newReviewScheme;
