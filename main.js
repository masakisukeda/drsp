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
    '/membership': 'membership/index.html',
    '/membership/kiyaku': 'membership/kiyaku/index.html',
    '/inquiry': 'inquiry/index.html',
    '/privacy': 'privacy/index.html',
    '/slide': 'slide/index.html',
    '/slide/membership': 'slide/membership/index.html',
    '/slide/spot': 'slide/spot/index.html',
    '/eiri/spot': 'eiri/spot/index.html',
    '/eiri/community': 'eiri/community/index.html',
    '/eiri/lport': 'eiri/lport/index.html',
    '/eiri/speakingcircles': 'eiri/speakingcircles/index.html',
    '/hieiri/ai-bu': 'hieiri/ai-bu/index.html',
  };

  const selectors = 'a[href^="/"], link[href^="/"], script[src^="/"], img[src^="/"], video[src^="/"]';
  for (const el of document.querySelectorAll(selectors)) {
    const attr = el.tagName === 'SCRIPT' || el.tagName === 'IMG' || el.tagName === 'VIDEO' ? 'src' : 'href';
    const val = el.getAttribute(attr);
    if (!val || val.startsWith('//')) continue;

    const [pathOnly, tail = ''] = val.split(/(?=[?#])/);
    // assets等はそのままパスを結合、ページパスはlinkMapを参照
    if (pathOnly.startsWith('/assets/')) {
      el.setAttribute(attr, `${up}${pathOnly.slice(1)}${tail}`);
    } else {
      const mapped = linkMap[pathOnly];
      if (mapped) {
        el.setAttribute(attr, `${up}${mapped}${tail}`);
      } else if (pathOnly.endsWith('.css') || pathOnly.endsWith('.js')) {
        // styles.cssやmain.jsなどルート直下のアセット
        el.setAttribute(attr, `${up}${pathOnly.slice(1)}${tail}`);
      }
    }
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

// ── TOP: X/noteポストをJSONから読み込み（最新6件） ──
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

    const chip = document.createElement('span');
    const source = (post.source || 'x').toLowerCase();
    chip.className = `social-chip social-chip--${source}`;
    chip.textContent = source === 'note' ? 'no+e' : 'X';

    const avatar = document.createElement('img');
    avatar.className = 'x-post-avatar';
    avatar.src = post.avatar || './assets/wp/ushi_00_500.webp';
    avatar.alt = post.avatarAlt || post.name || 'アイコン';

    const date = document.createElement('span');
    date.className = 'x-post-date';
    date.textContent = post.date || '';

    meta.appendChild(chip);
    meta.appendChild(avatar);

    const text = document.createElement('p');
    text.className = 'x-post-text';
    text.textContent = post.text || '';

    anchor.appendChild(meta);
    anchor.appendChild(text);
    anchor.appendChild(date);
    return anchor;
  };

  fetch('/assets/data/x-posts.json', { cache: 'no-store' })
    .then((res) => {
      if (!res.ok) throw new Error('x-posts.json fetch failed');
      return res.json();
    })
    .then((json) => {
      const posts = Array.isArray(json?.posts) ? json.posts : [];
      const latest = posts
        .filter((post) => post && post.url && post.text)
        .sort((a, b) => parseDate(b.date) - parseDate(a.date))
        .slice(0, 6);

      if (latest.length === 0) return;

      list.textContent = '';
      for (const post of latest) {
        list.appendChild(createPostCard(post));
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
      { selector: '.page-speakingcircles .mvv-grid', slideSelector: ':scope > article', slidesPerView: 1.1 },
      { selector: '.page-ai-bu .concept-grid--swipe', slideSelector: ':scope > article', slidesPerView: 1.1 },
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
        .mobile-swiper-pagination .swiper-pagination-bullet { width: 8px; height: 8px; margin: 0 4px; background: #bdbdbd; opacity: 1; }
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

// ── フッター: note 最新3件 ──
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

  const fallbackHTML = list.innerHTML;
  const NOTE_RSS_URL = 'https://note.com/disa_pr/rss';
  const DATA_URLS = [
    '/assets/data/x-posts.json',
    './assets/data/x-posts.json',
    '../assets/data/x-posts.json',
    '../../assets/data/x-posts.json'
  ];

  list.classList.add('note-rss-list');
  list.setAttribute('aria-busy', 'true');

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const parseDate = (value) => {
    if (!value) return new Date(0);
    const normalized = String(value).replaceAll('.', '-');
    const d = new Date(normalized);
    return Number.isNaN(d.getTime()) ? new Date(0) : d;
  };

  const formatDateLabel = (value) => {
    const d = parseDate(value);
    if (d.getTime() === 0) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  };

  const renderItems = (items) => {
    list.innerHTML = items
      .map((item) => {
        const datePrefix = item.date ? `${escapeHtml(item.date)}｜` : '';
        return `<li><a href="${item.url}" target="_blank" rel="noopener noreferrer">${datePrefix}${escapeHtml(item.text)}</a></li>`;
      })
      .join('');
  };

  const fetchText = async (url) => {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        Accept: 'application/rss+xml, application/xml, text/xml, text/plain, */*'
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  };

  const parseNoteRss = (xmlText) => {
    const xml = new DOMParser().parseFromString(xmlText, 'application/xml');
    if (xml.querySelector('parsererror')) throw new Error('Invalid RSS XML');
    return Array.from(xml.querySelectorAll('item'))
      .map((item) => ({
        url: (item.querySelector('link')?.textContent || '').trim(),
        text: (item.querySelector('title')?.textContent || '').trim(),
        date: formatDateLabel((item.querySelector('pubDate')?.textContent || '').trim())
      }))
      .filter((item) => item.url && item.text)
      .slice(0, 3);
  };

  const fetchLatestNoteFromRss = async () => {
    const readers = [
      async () => parseNoteRss(await fetchText(NOTE_RSS_URL)),
      async () => parseNoteRss(await fetchText(`https://api.allorigins.win/raw?url=${encodeURIComponent(NOTE_RSS_URL)}`)),
      async () => {
        const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(NOTE_RSS_URL)}&api_key=&count=3`;
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        if (json.status !== 'ok') throw new Error('rss2json failed');
        return (json.items || [])
          .map((item) => ({
            url: item.link || '',
            text: item.title || '',
            date: formatDateLabel(item.pubDate || '')
          }))
          .filter((item) => item.url && item.text)
          .slice(0, 3);
      }
    ];

    for (const reader of readers) {
      try {
        const items = await reader();
        if (items.length) return items;
      } catch (_) {
        // Try next RSS reader.
      }
    }

    throw new Error('note rss not reachable');
  };

  const fetchJsonWithFallback = async () => {
    for (const url of DATA_URLS) {
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) continue;
        return await response.json();
      } catch (_) {
        // Try next candidate URL.
      }
    }
    throw new Error('x-posts.json not reachable');
  };

  fetchLatestNoteFromRss()
    .then((latest) => {
      if (!latest.length) throw new Error('no note posts from rss');
      renderItems(latest);
    })
    .catch(() => fetchJsonWithFallback())
    .then((json) => {
      if (!json) return;
      const posts = Array.isArray(json?.posts) ? json.posts : [];
      const latest = posts
        .filter((post) => post && post.source === 'note' && post.url && post.text)
        .sort((a, b) => parseDate(b.date) - parseDate(a.date))
        .slice(0, 3)
        .map((post) => ({
          url: post.url,
          text: post.text,
          date: formatDateLabel(post.date)
        }));

      if (latest.length === 0) throw new Error('no note posts');
      renderItems(latest);
    })
    .catch(() => {
      list.innerHTML = fallbackHTML;
    })
    .finally(() => {
      list.removeAttribute('aria-busy');
    });
})();
