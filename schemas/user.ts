import { z } from 'zod'

export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8)
})
