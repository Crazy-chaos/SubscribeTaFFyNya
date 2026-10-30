/* 聊天组 Service Worker：只负责接收推送、弹通知、点击回到对应会话 */

self.addEventListener('install', function () {
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {
    var data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch (e) {
        data = { title: '聊天组', body: event.data ? event.data.text() : '有新消息' };
    }
    var title = data.title || '聊天组';
    var options = {
        body: data.body || '有新消息',
        icon: '/123/emoji_23.avif',
        badge: '/123/emoji_23.avif',
        tag: data.tag || 'taffy-chat',
        renotify: true,
        data: { url: data.url || '/chat/' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    var url = (event.notification.data && event.notification.data.url) || '/chat/';
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
            for (var i = 0; i < list.length; i++) {
                var c = list[i];
                if (c.url.indexOf('/chat/') >= 0 && 'focus' in c) {
                    c.navigate(url);
                    return c.focus();
                }
            }
            if (self.clients.openWindow) return self.clients.openWindow(url);
        })
    );
});
