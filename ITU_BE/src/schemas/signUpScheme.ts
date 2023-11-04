import { z } from 'zod';

const signUpScheme = z.object({
  body: z.object({
    full_name: z.string({
      required_error: 'Full name is required'
    }),
    email: z
      .string({
        required_error: 'Email is required'
      })
      .email('Not a valid email'),

    password: z
      .string({
        required_error: 'Password is required'
      })
      .min(5, { message: 'Must be 5 or more characters long' })
  })
});

export default signUpScheme;
