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
