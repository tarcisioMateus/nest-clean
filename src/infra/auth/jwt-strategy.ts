import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'
import { EnvService } from '../env/env.service'

const userPayloadSchema = z.object({
  sub: z.uuid(),
})
export type UserPayload = z.infer<typeof userPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private env: EnvService) {
    const publicKey = env.get('PUBLIC_KEY')

    super({
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  validate(token: UserPayload) {
    return userPayloadSchema.parse(token)
  }
}
