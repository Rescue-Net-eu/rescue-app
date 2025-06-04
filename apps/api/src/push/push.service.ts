import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as admin from 'firebase-admin';
import * as apn from 'apn';

@Injectable()
export class PushService {
  private apnProvider: apn.Provider | null = null;

  constructor(private prisma: PrismaService) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const firebaseCred = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8'),
      );
      if (!admin.apps.length) {
        admin.initializeApp({ credential: admin.credential.cert(firebaseCred) });
      }
    }

    if (process.env.APNS_KEY_FILE) {
      this.apnProvider = new apn.Provider({
        token: {
          key: process.env.APNS_KEY_FILE,
          keyId: process.env.APNS_KEY_ID || '',
          teamId: process.env.APNS_TEAM_ID || '',
        },
        production: false,
      });
    }
  }

  async registerToken(userId: string, platform: string, token: string) {
    return this.prisma.pushToken.upsert({
      where: { token },
      update: { lastSeen: new Date(), userId, platform },
      create: { userId, platform, token },
    });
  }

  async sendAlertNotification(alert: { id: string; title: string; country: string; region?: string }) {
    const tokens = await this.prisma.pushToken.findMany({ where: { } });
    const androidTokens = tokens.filter(t => t.platform === 'android').map(t => t.token);
    const iosTokens = tokens.filter(t => t.platform === 'ios').map(t => t.token);

    if (androidTokens.length > 0 && admin.apps.length) {
      const message: admin.messaging.MulticastMessage = {
        notification: {
          title: `\uD83D\uDEA8 New Alert: ${alert.title}`,
          body: `${alert.country}`,
        },
        data: { alertId: alert.id },
        tokens: androidTokens,
      };
      await admin.messaging().sendMulticast(message);
    }

    if (iosTokens.length > 0 && this.apnProvider) {
      const notification = new apn.Notification();
      notification.alert = {
        title: `\uD83D\uDEA8 New Alert: ${alert.title}`,
        body: `${alert.country}`,
      };
      notification.payload = { alertId: alert.id };
      notification.topic = process.env.APNS_BUNDLE_ID || '';
      await this.apnProvider.send(notification, iosTokens);
    }
  }
}
