import { UseCaseError } from '@/core/errors/use-case-error'

export class UnableToMakeChangesError extends Error implements UseCaseError {
  constructor(description: string) {
    super(`Unable to make changes ${description}`)
  }
}
