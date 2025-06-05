import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma.module';
import { InvitationsModule } from './invitations/invitations.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MembershipsModule } from './memberships/memberships.module';
import { MissionsModule } from './missions/missions.module';
import { AlertsModule } from './alerts/alerts.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { PushModule } from './push/push.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    PrismaModule,
    InvitationsModule,
    AuthModule,
    UsersModule,
    MembershipsModule,
    MissionsModule,
    AlertsModule,
    PasswordResetModule,
    PushModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
