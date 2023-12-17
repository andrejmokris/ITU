import { z } from 'zod';

const newMarketItemScheme = z.object({
  body: z.object({
    title: z.string().min(5),
    description: z.string(),
    price: z.string(),
    size: z.string(),
    image: z.any()
  })
});

export default newMarketItemScheme;
