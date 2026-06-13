import type { SessionPageFixture } from './SessionPage.types'

export const sessionPageFixture: SessionPageFixture = {
  sessions: [
    {
      id: 'session-current',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      ipAddress: '190.45.12.8',
      expiresAt: new Date('2026-06-12T09:14:00'),
      lastSeenAt: null,
      createdAt: new Date('2026-06-01T09:14:00'),
      isCurrent: true,
    },
    {
      id: 'session-iphone',
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
      ipAddress: '190.45.12.8',
      expiresAt: new Date('2026-06-10T11:02:00'),
      lastSeenAt: new Date('2026-06-05T15:10:00'),
      createdAt: new Date('2026-05-28T11:02:00'),
      isCurrent: false,
    },
    {
      id: 'session-windows',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
      ipAddress: '88.12.5.140',
      expiresAt: new Date('2026-06-08T08:40:00'),
      lastSeenAt: new Date('2026-06-04T08:40:00'),
      createdAt: new Date('2026-05-12T08:40:00'),
      isCurrent: false,
    },
  ],
}
