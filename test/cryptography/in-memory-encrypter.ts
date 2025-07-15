import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'

export class InMemoryEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return `${payload}`
  }
}
