import { z } from 'zod';

const routeIdScheme = z.object({
  params: z.object({
    id: z.string().refine((value) => /^[0-9]+$/.test(value), {
      message: 'Value must be a string consisting of numbers'
    })
  })
});

export default routeIdScheme;
