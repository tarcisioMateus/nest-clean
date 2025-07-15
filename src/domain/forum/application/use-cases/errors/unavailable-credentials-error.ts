import { UseCaseError } from '@/core/errors/use-case-error'

export class UnavailableCredentialsError extends Error implements UseCaseError {
  constructor(credential: string) {
    super(`Unavailable Credentials ${credential}`)
  }
}
