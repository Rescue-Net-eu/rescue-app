import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import * as admin from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.FIREBASE_SERVICE_ACCOUNT && !admin.apps.length) {
    const firebaseCred = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8'),
    );
    admin.initializeApp({ credential: admin.credential.cert(firebaseCred) });
  }

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
