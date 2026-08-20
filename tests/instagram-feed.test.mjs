import { describe, expect, it } from 'vitest';
import { buildFeed, normalizeInstagramMedia } from '../scripts/instagram-feed.mjs';

describe('Instagram feed normalisation', () => {
  const media = {
    id: '17960501783983557',
    caption: 'یک روایت واقعی',
    media_type: 'VIDEO',
    media_product_type: 'REELS',
    media_url: 'https://cdn.example.test/reel.mp4',
    thumbnail_url: 'https://cdn.example.test/cover.jpg',
    permalink: 'https://www.instagram.com/reel/example/',
    timestamp: '2026-08-20T17:33:53+0000',
    username: 'rivayat_natamoom2006'
  };

  it('keeps real API fields and maps a reel cover', () => {
    expect(normalizeInstagramMedia(media)).toMatchObject({
      id: '17960501783983557',
      productType: 'REELS',
      thumbnailUrl: 'https://cdn.example.test/cover.jpg',
      permalink: 'https://www.instagram.com/reel/example/'
    });
  });

  it('builds an auditable feed envelope without fabricated posts', () => {
    const feed = buildFeed([media]);
    expect(feed.account).toBe('rivayat_natamoom2006');
    expect(feed.posts).toHaveLength(1);
    expect(feed.posts[0].caption).toBe('یک روایت واقعی');
  });
});

