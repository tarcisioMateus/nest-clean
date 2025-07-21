import { Module } from '@nestjs/common'
import { AuthModule } from '@/infra/auth/auth.module'
import { HttpModule } from './http/http.module'
import { EnvModule } from './env/env.module'

@Module({
  imports: [EnvModule, AuthModule, HttpModule],
})
export class AppModule {}
