(function () {
  const KEY_VISITOR = 'dic_visitor_id';
  const KEY_SESSION = 'dic_session_id';
  const KEY_SESSION_AT = 'dic_session_at';
  const KEY_LOCAL_METRICS = 'dic_local_metrics';
  const SESSION_TTL_MS = 30 * 60 * 1000;
  const METRICS_RETENTION_DAYS = 30;

  function now() {
    return Date.now();
  }

  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function dateOffsetKey(base, offsetDays) {
    const d = new Date(base);
    d.setDate(d.getDate() + offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function uid(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
  }

  function getVisitorId() {
    let id = localStorage.getItem(KEY_VISITOR);
    if (!id) {
      id = uid('v');
      localStorage.setItem(KEY_VISITOR, id);
    }
    return id;
  }

  function getSessionId() {
    const current = now();
    const last = Number(localStorage.getItem(KEY_SESSION_AT) || '0');
    const existingSid = localStorage.getItem(KEY_SESSION);
    const expired = !existingSid || (current - last > SESSION_TTL_MS);
    const sid = expired ? uid('s') : existingSid;

    // Keep sid/at update in one place for readability.
    localStorage.setItem(KEY_SESSION, sid);
    localStorage.setItem(KEY_SESSION_AT, String(current));
    return sid;
  }

  function loadLocalMetrics() {
    try {
      return JSON.parse(localStorage.getItem(KEY_LOCAL_METRICS) || '{}');
    } catch {
      return {};
    }
  }

  function saveLocalMetrics(data) {
    localStorage.setItem(KEY_LOCAL_METRICS, JSON.stringify(data));
  }

  function purgeOldMetrics(metrics, today) {
    const cutoffKey = dateOffsetKey(today, -METRICS_RETENTION_DAYS);
    const pruneMap = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      Object.keys(obj).forEach((k) => {
        if (k < cutoffKey) delete obj[k];
      });
    };

    pruneMap(metrics.pv_by_date);
    pruneMap(metrics.uu_by_date);

    // Legacy cleanup: drop old heavy format if still present.
    if (metrics.uu_visitors) delete metrics.uu_visitors;
  }

  function bumpLocalCounters() {
    const metrics = loadLocalMetrics();
    const today = todayKey();

    metrics.pv_total = Number(metrics.pv_total || 0) + 1;
    if (!metrics.pv_by_date) metrics.pv_by_date = {};
    metrics.pv_by_date[today] = Number(metrics.pv_by_date[today] || 0) + 1;

    if (!metrics.uu_by_date) metrics.uu_by_date = {};
    // Store only per-day flag, not visitor ID arrays.
    if (metrics.uu_visited_today !== today) {
      metrics.uu_visited_today = today;
      metrics.uu_by_date[today] = Number(metrics.uu_by_date[today] || 0) + 1;
    }

    purgeOldMetrics(metrics, today);
    saveLocalMetrics(metrics);
  }

  function sendToServer(payload) {
    const endpoint = window.DIC_ANALYTICS_ENDPOINT || ((location.protocol === 'http:' || location.protocol === 'https:')
      ? (location.origin + location.pathname.replace(/\/[^/]*$/, '/') + 'api/comments.php')
      : '');
    if (!endpoint) return;

    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
      return;
    }

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  }

  const visitorId = getVisitorId();
  const sessionId = getSessionId();
  const payload = {
    type: 'pageview',
    path: location.pathname + location.search,
    referrer: document.referrer || '',
    visitor_id: visitorId,
    session_id: sessionId,
    ts: new Date().toISOString(),
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
  };

  bumpLocalCounters();
  sendToServer({ action: 'metrics_track', payload });
})();
