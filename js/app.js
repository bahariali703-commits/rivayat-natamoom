const feedGrid = document.querySelector('#feed-grid');
const status = document.querySelector('#sync-status');
const template = document.querySelector('#post-template');
const dialog = document.querySelector('#post-dialog');
const closeDialog = document.querySelector('#close-dialog');

const FEED = {
  generatedAt: '2026-09-01T08:48:07+0000',
  posts: [
    {
      id: '18147828451534938',
      caption: 'غرب تهران شلوغ است؛ اما خرید مردم کمتر شده است.\n\nدر ستارخان، صادقیه و اکباتان، خیابان‌ها همچنان پررفت‌وآمدند؛ اما افزایش هزینه‌های زندگی، اجاره، خوراک و رفت‌وآمد، قدرت خرید بسیاری از مردم را کاهش داده است. شلوغی خیابان همیشه به معنی رونق خرید نیست.\n\nشما در محله‌تان فشار اقتصادی را بیشتر در کدام هزینه احساس می‌کنید؟ نام محله و تجربه‌تان را بنویسید.\n\n#غرب_تهران #ستارخان #صادقیه #اکباتان #جنت_آباد #تهرانسر #مرزداران #چیتگر #قدرت_خرید #گرانی #هزینه_زندگی #کاسبی #گزارش_مردمی #اقتصاد_خانوار #روایت_های_ناتموم',
      mediaType: 'VIDEO',
      productType: 'REELS',
      permalink: 'https://www.instagram.com/reel/DcvRIWhDLmS/',
      thumbnailUrl: 'assets/west-tehran-reel-cover.jpg',
      mediaUrl: 'assets/west-tehran-reel.mp4',
      timestamp: '2026-09-01T08:48:07+0000',
      username: 'rivayat_natamoom2006'
    }
  ]
};

const toJalaliDate = (value) => new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Tehran'
}).format(new Date(value));

const describePost = (post) => post.productType === 'REELS' || post.mediaType === 'VIDEO' ? 'ریلز' : 'پست';
const postTitle = (caption) => (caption || 'پست تازه از روایت‌های ناتموم').split(/\n|[.!؟]/)[0].trim() || 'پست تازه از روایت‌های ناتموم';

function openPost(post) {
  document.querySelector('#dialog-kind').textContent = describePost(post);
  document.querySelector('#dialog-title').textContent = postTitle(post.caption);
  document.querySelector('#dialog-date').textContent = toJalaliDate(post.timestamp);
  document.querySelector('#dialog-caption').textContent = post.caption || 'این پست کپشن ندارد.';
  const link = document.querySelector('#dialog-link');
  link.href = post.permalink;
  const media = document.querySelector('#dialog-media');
  media.replaceChildren();
  if (post.mediaType === 'VIDEO' && post.mediaUrl) {
    const video = document.createElement('video');
    video.controls = true;
    video.preload = 'metadata';
    video.poster = post.thumbnailUrl || '';
    video.src = post.mediaUrl;
    video.addEventListener('error', () => {
      media.replaceChildren(createImage(post));
    }, { once: true });
    media.append(video);
  } else {
    media.append(createImage(post));
  }
  dialog.showModal();
}

function createImage(post) {
  const image = document.createElement('img');
  image.src = post.thumbnailUrl || post.mediaUrl;
  image.alt = `تصویر واقعی ${describePost(post)} از @${post.username || 'rivayat_natamoom2006'}`;
  return image;
}

function renderFeed(posts) {
  feedGrid.replaceChildren();
  if (!posts?.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'هنوز پست واقعی برای نمایش دریافت نشده است.';
    feedGrid.append(empty);
    return;
  }
  posts.forEach((post) => {
    const node = template.content.cloneNode(true);
    const button = node.querySelector('.post-open');
    const image = node.querySelector('.post-image');
    image.src = post.thumbnailUrl || post.mediaUrl;
    image.alt = `کاور واقعی ${describePost(post)} از روایت‌های ناتموم`;
    node.querySelector('.media-label').textContent = describePost(post);
    node.querySelector('.post-date').textContent = toJalaliDate(post.timestamp);
    node.querySelector('.post-title').textContent = postTitle(post.caption);
    node.querySelector('.post-caption').textContent = post.caption || 'بدون کپشن';
    button.addEventListener('click', () => openPost(post));
    feedGrid.append(node);
  });
}

function loadFeed() {
  renderFeed(FEED.posts);
  status.textContent = `آخرین همگام‌سازی: ${toJalaliDate(FEED.generatedAt)} — ${FEED.posts.length} محتوای واقعی`;
}

closeDialog.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
loadFeed();

