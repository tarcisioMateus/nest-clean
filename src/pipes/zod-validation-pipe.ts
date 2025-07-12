import { PipeTransform, BadRequestException } from '@nestjs/common'
import { z, ZodError } from 'zod'
import { zodErrorExtractor } from '../utils/zod-error-extractor'

export class ZodValidationPipe<T> implements PipeTransform<T, T> {
  constructor(private schema: z.ZodType<T>) {}

  transform(value: T): T {
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'ZodValidationError',
          statusCode: 400,
          error: zodErrorExtractor(error.message),
        })
      }
      throw new BadRequestException('Validation failed')
    }
  }
}
