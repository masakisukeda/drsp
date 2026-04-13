// ── イントロオーバーレイ（初回訪問時のみ） ──
(function () {
  const overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  // 2回目以降はすぐ消す
  if (sessionStorage.getItem('disa-intro-seen')) {
    overlay.remove();
    return;
  }
  sessionStorage.setItem('disa-intro-seen', '1');

  // スクロールをロック
  document.body.style.overflow = 'hidden';

  let triggered = false;
  let wheelTotal = 0;
  const WHEEL_THRESHOLD = 400; // この量スクロールしたら発火

  function collapse() {
    if (triggered) return;
    triggered = true;

    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchmove', onTouch);

    // Phase 1: ロゴ・ヒントを先にフェードアウト
    const logo = overlay.querySelector('.intro-logo');
    const hint = overlay.querySelector('.intro-hint');
    if (logo) { logo.style.transition = 'opacity 0.2s ease'; logo.style.opacity = '0'; }
    if (hint) { hint.style.transition = 'opacity 0.15s ease'; hint.style.opacity = '0'; }

    // Phase 2: 黒カードをヒーロー位置へ吸い込む
    setTimeout(() => {
      const hero = document.querySelector('.hero');
      if (hero) {
        const r = hero.getBoundingClientRect();
        const scaleX = r.width / window.innerWidth;
        const scaleY = r.height / window.innerHeight;
        const tx = r.left + r.width / 2 - window.innerWidth / 2;
        const ty = r.top + r.height / 2 - window.innerHeight / 2;
        overlay.style.transform =
          `translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY})`;
        overlay.style.borderRadius = '12px';
      }
      overlay.style.opacity = '0';
      document.body.style.overflow = '';
      setTimeout(() => overlay.remove(), 1000);
    }, 180);
  }

  function onWheel(e) {
    wheelTotal += Math.abs(e.deltaY);
    if (wheelTotal >= WHEEL_THRESHOLD) collapse();
  }

  let touchStartY = 0;
  function onTouch(e) {
    const dy = Math.abs(touchStartY - e.touches[0].clientY);
    if (dy >= 80) collapse();
  }

  // ホイール累積・タッチスワイプ・クリックで起動
  window.addEventListener('wheel',      onWheel, { passive: true });
  window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchmove',  onTouch, { passive: true });
  overlay.addEventListener('click',     collapse);
})();

// ── ローカル(file://)閲覧時の内部リンク補正 ──
(function () {
  if (window.location.protocol !== 'file:') return;

  const siteMarker = '/drsp-inspired-site/';
  const pathName = decodeURIComponent(window.location.pathname);
  const markerIndex = pathName.lastIndexOf(siteMarker);
  if (markerIndex === -1) return;

  const subPath = pathName.slice(markerIndex + siteMarker.length);
  const currentDir = subPath.replace(/[^/]*$/, '');
  const depth = currentDir.split('/').filter(Boolean).length;
  const up = depth > 0 ? '../'.repeat(depth) : './';

  const linkMap = {
    '/': 'index.html',
    '/about': 'about/index.html',
    '/eiri': 'eiri/index.html',
    '/hieiri': 'hieiri/index.html',
    '/member': 'member/index.html',
    '/member/masakisukeda': 'member/masakisukeda/index.html',
    '/inquiry': 'inquiry/index.html',
    '/eiri/spot': 'eiri/spot/index.html',
    '/eiri/community': 'eiri/community/index.html',
    '/eiri/lport': 'eiri/lport/index.html',
    '/eiri/speakingcircles': 'eiri/speakingcircles/index.html',
  };

  for (const a of document.querySelectorAll('a[href^="/"]')) {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('//')) continue;

    const [pathOnly, tail = ''] = href.split(/(?=[?#])/);
    const mapped = linkMap[pathOnly];
    if (!mapped) continue;
    a.setAttribute('href', `${up}${mapped}${tail}`);
  }
})();

// ── モバイル: ハンバーガーメニュー ──
(function () {
  const wraps = document.querySelectorAll('.site-header .header-wrap');
  if (wraps.length === 0) return;

  const mq = window.matchMedia('(max-width: 960px)');
  const closeAll = () => {
    for (const wrap of wraps) {
      const btn = wrap.querySelector('.menu-toggle');
      if (!btn) continue;
      wrap.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'メニューを開く');
    }
  };

  for (const wrap of wraps) {
    const nav = wrap.querySelector('nav');
    if (!nav) continue;

    let btn = wrap.querySelector('.menu-toggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'menu-toggle';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'メニューを開く');
      btn.innerHTML = '<span class="menu-toggle-bar" aria-hidden="true"></span>';
      wrap.insertBefore(btn, nav);
    }

    btn.addEventListener('click', function () {
      const open = wrap.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    });

    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        if (!mq.matches) return;
        closeAll();
      });
    });
  }

  document.addEventListener('click', (e) => {
    if (!mq.matches) return;
    const insideHeader = e.target instanceof Element && e.target.closest('.site-header .header-wrap');
    if (!insideHeader) closeAll();
  });

  window.addEventListener('resize', () => {
    if (!mq.matches) closeAll();
  });
})();

// ── タイプ文字: 画面内に入ったら開始 ──
(function () {
  const lines = document.querySelectorAll('.typing-line');
  if (lines.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('typing-start');
        observer.unobserve(entry.target);
      }
    },
    {
      threshold: 0,
      rootMargin: '0px 0px 80% 0px'
    }
  );

  for (const line of lines) {
    observer.observe(line);
  }
})();

// ── 画像読み込み最適化（未設定分のみ） ──
(function () {
  const images = document.querySelectorAll('img');
  for (const img of images) {
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
    if (!img.hasAttribute('loading') && !img.closest('.hero, .site-header .logo')) {
      img.setAttribute('loading', 'lazy');
    }
  }
})();

// ── 動画読み込み最適化（ヒーロー以外はビューポート内のみ再生） ──
(function () {
  const videos = Array.from(document.querySelectorAll('video'));
  if (videos.length === 0) return;

  const heroVideos = videos.filter((v) => v.classList.contains('hero-bg'));
  const normalVideos = videos.filter((v) => !v.classList.contains('hero-bg'));

  // ヒーロー動画は見た目維持のため軽め読み込みに固定
  for (const video of heroVideos) {
    if (!video.hasAttribute('preload')) video.setAttribute('preload', 'metadata');
  }

  if (normalVideos.length === 0) return;

  for (const video of normalVideos) {
    video.setAttribute('preload', 'none');
    video.removeAttribute('autoplay');
    video.autoplay = false;
  }

  const safePlay = (video) => {
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  if (!('IntersectionObserver' in window)) {
    for (const video of normalVideos) safePlay(video);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target;
        if (entry.isIntersecting) {
          safePlay(video);
        } else {
          video.pause();
        }
      }
    },
    {
      threshold: 0.15,
      rootMargin: '120px 0px 120px 0px'
    }
  );

  for (const video of normalVideos) observer.observe(video);
})();

// ── TOP: XポストをJSONから読み込み（最新3件） ──
(function () {
  const list = document.querySelector('.x-posts-list');
  if (!list) return;

  const parseDate = (value) => {
    const normalized = String(value || '').trim().replace(/\./g, '-');
    const timestamp = Date.parse(normalized);
    return Number.isNaN(timestamp) ? 0 : timestamp;
  };

  const createPostCard = (post) => {
    const anchor = document.createElement('a');
    anchor.className = 'x-post';
    anchor.href = post.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';

    const meta = document.createElement('div');
    meta.className = 'x-post-meta';

    const avatar = document.createElement('img');
    avatar.className = 'x-post-avatar';
    avatar.src = post.avatar || './assets/wp/ushi_00_500.webp';
    avatar.alt = post.avatarAlt || post.name || 'アイコン';

    const name = document.createElement('span');
    name.className = 'x-post-name';
    name.textContent = post.name || '';

    const handle = document.createElement('span');
    handle.className = 'x-post-handle';
    handle.textContent = post.handle || '';

    const date = document.createElement('span');
    date.className = 'x-post-date';
    date.textContent = post.date || '';

    meta.appendChild(avatar);
    meta.appendChild(name);
    meta.appendChild(handle);
    meta.appendChild(date);

    const text = document.createElement('p');
    text.className = 'x-post-text';
    text.textContent = post.text || '';

    anchor.appendChild(meta);
    anchor.appendChild(text);
    return anchor;
  };

  fetch('./assets/data/x-posts.json', { cache: 'no-store' })
    .then((res) => {
      if (!res.ok) throw new Error('x-posts.json fetch failed');
      return res.json();
    })
    .then((json) => {
      const posts = Array.isArray(json?.posts) ? json.posts : [];
      const latest = posts
        .filter((post) => post && post.url && post.text)
        .sort((a, b) => parseDate(b.date) - parseDate(a.date))
        .slice(0, 3);

      if (latest.length === 0) return;

      list.textContent = '';
      for (const post of latest) {
        list.appendChild(createPostCard(post));
      }

      if (typeof window.initMobileRichSwipers === 'function') {
        window.initMobileRichSwipers();
      }
    })
    .catch(() => {});
})();

// ── モバイル: スワイプ干渉回避のため flip 系AOSを無効化 ──
(function () {
  if (!window.matchMedia('(max-width: 768px)').matches) return;
  const flipTargets = document.querySelectorAll('[data-aos^="flip"]');
  for (const el of flipTargets) {
    el.removeAttribute('data-aos');
    el.removeAttribute('data-aos-delay');
  }
})();

// ── モバイル: Swiper.js 共通カルーセル化（ドット + 矢印） ──
(function () {
  const initMobileRichSwipers = () => {
    if (!window.matchMedia('(max-width: 768px)').matches) return;

    const carouselTargets = [
      { selector: '.partner-grid', slideSelector: ':scope > div', slidesPerView: 2.2 },
      { selector: '.member-grid', slideSelector: ':scope > video', slidesPerView: 1.25 },
      { selector: '.page-spot .member-cards', slideSelector: ':scope > article', slidesPerView: 1.1 },
      { selector: '.page-member .member-cards', slideSelector: ':scope > article', slidesPerView: 1.1 },
      { selector: '.page-sukeda .tile-grid', slideSelector: ':scope > article', slidesPerView: 1.1 },
      { selector: '.page-membership .support-grid--3', slideSelector: ':scope > div', slidesPerView: 1.1 },
      { selector: '.page-speakingcircles .concept-grid--3', slideSelector: ':scope > article', slidesPerView: 1.1 },
      { selector: '.page-speakingcircles .mvv-grid', slideSelector: ':scope > article', slidesPerView: 1.1 },
      { selector: '.x-posts-list', slideSelector: ':scope > .x-post', slidesPerView: 1.1 },
      { selector: '.service-grid', slideSelector: ':scope > article', slidesPerView: 1.1 },
      { selector: '.page-about .support-grid', slideSelector: ':scope > div', slidesPerView: 1.1 }
    ];

    const ensureCss = () => {
      if (document.getElementById('mobile-swiper-style')) return;
      const style = document.createElement('style');
      style.id = 'mobile-swiper-style';
      style.textContent = `
        .mobile-rich-swiper.swiper { overflow: hidden; }
        .mobile-swiper-controls { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 10px; }
        .mobile-swiper-btn { width: 34px; height: 34px; border-radius: 999px; border: 1px solid #222; background: #fff; color: #111; font-size: 20px; line-height: 1; cursor: pointer; }
        .mobile-swiper-pagination { position: static; width: auto; }
        .mobile-swiper-pagination .swiper-pagination-bullet { width: 8px; height: 8px; margin: 0 4px !important; background: #bdbdbd; opacity: 1; }
        .mobile-swiper-pagination .swiper-pagination-bullet-active { background: #111; }
      `;
      document.head.appendChild(style);
    };

    const loadSwiper = () => new Promise((resolve, reject) => {
      if (window.Swiper) {
        resolve();
        return;
      }

      if (!document.querySelector('link[data-swiper-mobile="1"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
        link.setAttribute('data-swiper-mobile', '1');
        document.head.appendChild(link);
      }

      const existing = document.querySelector('script[data-swiper-mobile="1"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load Swiper')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
      script.async = true;
      script.setAttribute('data-swiper-mobile', '1');
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Swiper'));
      document.body.appendChild(script);
    });

    const toSwiper = (track, conf, idx) => {
      if (!track || track.closest('.mobile-rich-swiper')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'mobile-rich-swiper swiper';
      track.parentNode.insertBefore(wrapper, track);
      wrapper.appendChild(track);

      track.classList.add('swiper-wrapper');
      track.style.overflowX = 'visible';
      track.style.scrollSnapType = 'none';
      track.style.paddingBottom = '0';
      track.style.gap = '0';

      const slides = Array.from(track.querySelectorAll(conf.slideSelector));
      for (const slide of slides) {
        slide.classList.add('swiper-slide');
        slide.style.flex = '0 0 auto';
        slide.style.scrollSnapAlign = 'unset';
      }

      const controls = document.createElement('div');
      controls.className = 'mobile-swiper-controls';
      controls.innerHTML = `
        <button class="mobile-swiper-btn mobile-swiper-prev-${idx}" type="button" aria-label="前へ">‹</button>
        <div class="mobile-swiper-pagination mobile-swiper-pagination-${idx}" aria-hidden="true"></div>
        <button class="mobile-swiper-btn mobile-swiper-next-${idx}" type="button" aria-label="次へ">›</button>
      `;
      wrapper.insertAdjacentElement('afterend', controls);

      new Swiper(wrapper, {
        slidesPerView: conf.slidesPerView || 1.1,
        spaceBetween: 12,
        grabCursor: true,
        watchOverflow: true,
        pagination: { el: `.mobile-swiper-pagination-${idx}`, clickable: true },
        navigation: { nextEl: `.mobile-swiper-next-${idx}`, prevEl: `.mobile-swiper-prev-${idx}` }
      });
    };

    loadSwiper()
      .then(() => {
        if (!window.Swiper) return;
        ensureCss();
        let serial = 0;
        for (const conf of carouselTargets) {
          const tracks = document.querySelectorAll(conf.selector);
          for (const track of tracks) {
            serial += 1;
            toSwiper(track, conf, serial);
          }
        }
      })
      .catch(() => {});
  };

  window.initMobileRichSwipers = initMobileRichSwipers;
  initMobileRichSwipers();
})();

const targets = document.querySelectorAll("[data-aos]");

if (targets.length > 0) {
  const parseBoolean = (value, fallback = true) => {
    if (value === undefined) return fallback;
    if (typeof value !== "string") return fallback;
    return value.toLowerCase() !== "false";
  };

  for (const el of targets) {
    const duration = Number.parseInt(el.dataset.aosDuration || "700", 10);
    const delay = Number.parseInt(el.dataset.aosDelay || "0", 10);
    const easing = el.dataset.aosEasing || "cubic-bezier(0.2, 0.6, 0.2, 1)";
    el.style.transitionDuration = `${duration}ms`;
    el.style.transitionDelay = `${delay}ms`;
    el.style.transitionTimingFunction = easing;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const once = parseBoolean(entry.target.dataset.aosOnce, true);
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-animate");
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          entry.target.classList.remove("aos-animate");
        }
      }
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px -4% 0px"
    }
  );

for (const el of targets) {
  observer.observe(el);
}
}

// ── フッター: note RSS 最新3件 ──
(function () {
  const footerSections = Array.from(document.querySelectorAll('.site-footer section'));
  const targetSection = footerSections.find((section) => {
    const heading = section.querySelector('h3');
    return heading && heading.textContent.includes('no+e 強化月間中');
  });

  if (!targetSection) return;

  const heading = targetSection.querySelector('h3');
  if (heading && !heading.querySelector('a')) {
    const headingLink = document.createElement('a');
    headingLink.href = 'https://note.com/disa_pr';
    headingLink.target = '_blank';
    headingLink.rel = 'noopener noreferrer';
    headingLink.textContent = heading.textContent.trim();
    heading.textContent = '';
    heading.append(headingLink);
  }

  const list = targetSection.querySelector('ul');
  if (!list) return;

  const RSS_URL = 'https://note.com/disa_pr/rss';
  const fallbackHTML = list.innerHTML;

  list.classList.add('note-rss-list');
  list.setAttribute('aria-busy', 'true');

  const escapeHtml = (value) => value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const formatDateLabel = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  };

  const normalizeItems = (items) => items
    .map((item) => ({
      title: (item.title || '').trim(),
      link: (item.link || '').trim(),
      date: formatDateLabel(item.pubDate || item.isoDate || item.date || '')
    }))
    .filter((item) => item.title && item.link)
    .slice(0, 3);

  const parseRssXml = (xmlText) => {
    const xml = new DOMParser().parseFromString(xmlText, 'application/xml');
    const parserError = xml.querySelector('parsererror');
    if (parserError) throw new Error('RSS parse error');

    const items = Array.from(xml.querySelectorAll('channel > item')).map((item) => ({
      title: item.querySelector('title')?.textContent || '',
      link: item.querySelector('link')?.textContent || '',
      pubDate: item.querySelector('pubDate')?.textContent || ''
    }));

    return normalizeItems(items);
  };

  const fetchJson = async (url) => {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  };

  const fetchText = async (url) => {
    const response = await fetch(url, { headers: { Accept: 'application/xml,text/xml,*/*' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  };

  const loadFromRss2Json = async () => {
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&count=3`;
    const data = await fetchJson(url);
    if (!data || data.status !== 'ok' || !Array.isArray(data.items)) {
      throw new Error('rss2json invalid response');
    }
    return normalizeItems(data.items);
  };

  const loadFromAllOrigins = async () => {
    const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_URL)}`;
    const xmlText = await fetchText(url);
    return parseRssXml(xmlText);
  };

  const loadFromDirectRss = async () => {
    const xmlText = await fetchText(RSS_URL);
    return parseRssXml(xmlText);
  };

  const renderItems = (items) => {
    list.innerHTML = items
      .map((item) => {
        const datePrefix = item.date ? `${escapeHtml(item.date)}｜` : '';
        return `<li><a href="${item.link}" target="_blank" rel="noopener noreferrer">${datePrefix}${escapeHtml(item.title)}</a></li>`;
      })
      .join('');
  };

  const loadRss = async () => {
    try {
      const loaders = [loadFromRss2Json, loadFromAllOrigins, loadFromDirectRss];
      let latestItems = [];

      for (const load of loaders) {
        try {
          latestItems = await load();
        } catch (_error) {
          latestItems = [];
        }
        if (latestItems.length > 0) break;
      }

      if (latestItems.length === 0) throw new Error('all feed loaders failed');
      renderItems(latestItems);
    } catch (_error) {
      list.innerHTML = fallbackHTML;
    } finally {
      list.removeAttribute('aria-busy');
    }
  };

  const start = () => {
    if (start.started) return;
    start.started = true;
    loadRss();
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        start();
        observer.disconnect();
      }
    }, {
      threshold: 0.01,
      rootMargin: '0px 0px 400px 0px'
    });
    observer.observe(targetSection);
  } else {
    window.addEventListener('load', start, { once: true });
  }
})();
