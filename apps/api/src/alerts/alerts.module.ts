import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { PrismaModule } from '../prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/alerts',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          cb(null, `image-${uniqueSuffix}${extension}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  ],
  providers: [AlertsService],
  controllers: [AlertsController],
})
export class AlertsModule {}
