import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

export const idParamSchema = z.uuid()

export type IdParamSchema = z.infer<typeof idParamSchema>

export const zodIdParamValidationPipe = new ZodValidationPipe<IdParamSchema>(
  idParamSchema,
)
