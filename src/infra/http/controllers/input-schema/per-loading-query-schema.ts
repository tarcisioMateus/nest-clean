import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { DEFAULT_PER_LOADING } from '@/core/repositories/loading-params'

export const perLoadingQuerySchema = z
  .string()
  .optional()
  .transform(Number)
  .default(DEFAULT_PER_LOADING)
  .pipe(z.number().min(1))

export type PerLoadingQuerySchema = z.infer<typeof perLoadingQuerySchema>

export const zodPerLoadingQueryValidationPipe =
  new ZodValidationPipe<PerLoadingQuerySchema>(perLoadingQuerySchema)
