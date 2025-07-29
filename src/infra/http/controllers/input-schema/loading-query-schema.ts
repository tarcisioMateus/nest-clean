import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { DEFAULT_LOADING } from '@/core/repositories/loading-params'

export const loadingQuerySchema = z
  .string()
  .optional()
  .transform(Number)
  .default(DEFAULT_LOADING)
  .pipe(z.number().min(1))

export type LoadingQuerySchema = z.infer<typeof loadingQuerySchema>

export const zodLoadingQueryValidationPipe =
  new ZodValidationPipe<LoadingQuerySchema>(loadingQuerySchema)
