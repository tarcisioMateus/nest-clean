import { UseCaseError } from '@/core/errors/use-case-error'

export class CredentialsError extends Error implements UseCaseError {
  constructor() {
    super(`Credentials Error`)
  }
}
