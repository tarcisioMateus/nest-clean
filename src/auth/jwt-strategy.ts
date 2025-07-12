import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Env } from 'src/env'
import { z } from 'zod'

const userPayloadSchema = z.object({
  sub: z.uuid(),
})
type UserPayload = z.infer<typeof userPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService<Env, true>) {
    const publicKey = config.get('PUBLIC_KEY', { infer: true })

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
