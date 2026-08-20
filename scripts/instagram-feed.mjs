export function normalizeInstagramMedia(media) {
  return {
    id: String(media.id),
    caption: media.caption || '',
    mediaType: media.media_type || 'IMAGE',
    productType: media.media_product_type || 'FEED',
    permalink: media.permalink,
    thumbnailUrl: media.thumbnail_url || (media.media_type === 'IMAGE' ? media.media_url : null),
    mediaUrl: media.media_url || null,
    timestamp: media.timestamp,
    username: media.username || 'rivayat_natamoom2006'
  };
}

export function buildFeed(media) {
  return {
    schemaVersion: 1,
    source: 'Instagram API',
    generatedAt: new Date().toISOString(),
    account: 'rivayat_natamoom2006',
    posts: media.map(normalizeInstagramMedia)
  };
}

