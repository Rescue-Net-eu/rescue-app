import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { PrismaModule } from '../prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/alerts',
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const random = Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname).toLowerCase();
          const safeName = `alert-${timestamp}-${random}${ext}`;
          cb(null, safeName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimes.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Invalid file type. Only JPEG, PNG, and GIF are allowed.'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  ],
  providers: [AlertsService],
  controllers: [AlertsController],
})
export class AlertsModule {}
