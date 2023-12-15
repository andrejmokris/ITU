import { z } from 'zod';

const newEventScheme = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
    imageURL: z.string().url().optional(),
    startDate: z.string().datetime()
  })
});

export default newEventScheme;
