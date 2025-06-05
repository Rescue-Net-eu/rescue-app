import { Module } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { MissionsController } from './missions.controller';
import { PrismaModule } from '../prisma.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [PrismaModule],
  providers: [MissionsService, ChatGateway],
  controllers: [MissionsController],
})
export class MissionsModule {}
