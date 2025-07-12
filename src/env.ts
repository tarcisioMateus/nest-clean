import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  PRIVATE_KEY: z.string(),
  PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envSchema>
