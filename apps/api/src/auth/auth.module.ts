import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule, JwtModule.register({ secret: 'secret' })],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
