import { HashCompare } from '@/domain/forum/application/cryptography/hash-compare'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

export class InMemoryHasher implements HashCompare, HashGenerator {
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hash') === hash
  }

  async hash(plain: string): Promise<string> {
    return plain.concat('-hash')
  }
}
