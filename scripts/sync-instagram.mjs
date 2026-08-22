import { writeFile } from 'node:fs/promises';
import { buildFeed } from './instagram-feed.mjs';

const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
const userId = process.env.INSTAGRAM_USER_ID;

if (!accessToken || !userId) {
  throw new Error('INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID must be configured as repository secrets.');
}

const fields = ['id', 'caption', 'media_type', 'media_product_type', 'media_url', 'thumbnail_url', 'permalink', 'timestamp', 'username'].join(',');
const apiHosts = ['https://graph.instagram.com/v26.0', 'https://graph.facebook.com/v26.0'];
const failures = [];
let payload;

for (const apiHost of apiHosts) {
  const url = new URL(`${apiHost}/${userId}/media`);
  url.searchParams.set('fields', fields);
  url.searchParams.set('limit', '12');
  url.searchParams.set('access_token', accessToken);

  const response = await fetch(url);
  if (response.ok) {
    payload = await response.json();
    console.log(`Official Instagram feed read through ${new URL(apiHost).host}.`);
    break;
  }

  const detail = (await response.text()).slice(0, 500);
  failures.push(`${new URL(apiHost).host}: ${response.status} ${detail}`);
}

if (!payload) throw new Error(`Instagram API request failed. ${failures.join(' | ')}`);
const feed = buildFeed(payload.data || []);
await writeFile(new URL('../data/instagram-feed.json', import.meta.url), `${JSON.stringify(feed, null, 2)}\n`);
console.log(`Synced ${feed.posts.length} real Instagram post(s).`);
