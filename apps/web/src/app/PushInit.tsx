'use client';

import { useEffect } from 'react';
import api from '../utils/api';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default function PushInit() {
  useEffect(() => {
    const register = async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const registration = await navigator.serviceWorker.register('/service-worker.js');

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidKey ? urlBase64ToUint8Array(vapidKey) : undefined,
        });
      }

      await api('/api/push/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${document.cookie.replace('token=', '')}`,
        },
        body: JSON.stringify({ platform: 'web', token: JSON.stringify(subscription) }),
      });
    };

    register();
  }, []);

  return null;
}
