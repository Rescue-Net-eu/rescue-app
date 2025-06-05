self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: event.data.text() };
    }
  }
  const options = {
    body: data.body || '',
  };
  if (data.url) {
    options.data = { url: data.url };
  }
  event.waitUntil(self.registration.showNotification(data.title || 'Notification', options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url;
  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});
