import { Module } from '@nestjs/common'

import { AuthModule } from '@/infra/auth/auth.module'
import { HttpModule } from './http/http.module'
import { EnvModule } from './env/env.module'
import { EventsModule } from './events/events.module'

@Module({
  imports: [EnvModule, AuthModule, HttpModule, EventsModule],
})
export class AppModule {}
