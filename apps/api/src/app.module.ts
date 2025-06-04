import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InvitationsModule } from './invitations/invitations.module';
import { MembershipsModule } from './memberships/memberships.module';
import { MissionsModule } from './missions/missions.module';
import { AlertsModule } from './alerts/alerts.module';
import { PasswordResetModule } from './password-reset/password-reset.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    InvitationsModule,
    MembershipsModule,
    MissionsModule,
    AlertsModule,
    PasswordResetModule,
  ],
})
export class AppModule {}
