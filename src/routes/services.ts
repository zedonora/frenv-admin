import { Hono } from 'hono';

interface Env {
  AUTH_DB: D1Database;
  PULSE_DB: D1Database;
  I18N_DB: D1Database;
}

const services = new Hono<{ Bindings: Env }>();

type ServiceTarget = {
  key: string;
  name: string;
  url: string;
  healthUrl: string;
  category: 'worker' | 'pages' | 'streamlit' | 'render' | 'koyeb';
};

const SERVICE_TARGETS: ServiceTarget[] = [
  { key: 'auth', name: 'Auth', url: 'https://auth.frenv.pe.kr', healthUrl: 'https://auth.frenv.pe.kr/health', category: 'worker' },
  { key: 'pulse', name: 'Pulse', url: 'https://pulse.frenv.pe.kr', healthUrl: 'https://pulse.frenv.pe.kr/health', category: 'worker' },
  { key: 'config', name: 'Config', url: 'https://config.frenv.pe.kr', healthUrl: 'https://config.frenv.pe.kr/health', category: 'worker' },
  { key: 'common', name: 'Common', url: 'https://common.frenv.pe.kr', healthUrl: 'https://common.frenv.pe.kr/monitor/status', category: 'worker' },
  { key: 'admin', name: 'Admin', url: 'https://admin.frenv.pe.kr', healthUrl: 'https://admin.frenv.pe.kr/health', category: 'worker' },
  { key: 'english', name: 'English', url: 'https://english.frenv.pe.kr', healthUrl: 'https://english.frenv.pe.kr', category: 'pages' },
  { key: 'game', name: 'Game', url: 'https://game.frenv.pe.kr', healthUrl: 'https://game.frenv.pe.kr', category: 'pages' },
  { key: 'blog', name: 'Blog', url: 'https://blog.frenv.pe.kr', healthUrl: 'https://blog.frenv.pe.kr', category: 'pages' },
  { key: 'rise', name: 'Rise', url: 'https://rise.frenv.pe.kr', healthUrl: 'https://rise.frenv.pe.kr', category: 'pages' },
  { key: 'cdn', name: 'CDN', url: 'https://cdn.frenv.pe.kr', healthUrl: 'https://cdn.frenv.pe.kr', category: 'pages' },
  { key: 'webtoon', name: 'Webtoon', url: 'https://webtoon.frenv.pe.kr', healthUrl: 'https://webtoon.frenv.pe.kr', category: 'streamlit' },
  { key: 'invest', name: 'Invest', url: 'https://invest.frenv.pe.kr', healthUrl: 'https://invest.frenv.pe.kr/api/health', category: 'render' },
  { key: 'log', name: 'Log', url: 'https://log.frenv.pe.kr', healthUrl: 'https://log.frenv.pe.kr', category: 'koyeb' }
];

function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value) || 0;
  return 0;
}

async function checkServiceHealth(target: ServiceTarget) {
  const start = Date.now();
  try {
    const res = await fetch(target.healthUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'frenv-admin-monitor/1.0' }
    });
    const latencyMs = Date.now() - start;
    const ok = res.ok;

    let payload: unknown = null;
    try {
      payload = await res.clone().json();
    } catch {
      payload = await res.text();
    }

    const statusText = ok ? 'up' : 'down';
    const availability = ok ? 100 : 0;
    return {
      key: target.key,
      name: target.name,
      url: target.url,
      category: target.category,
      status: statusText,
      httpStatus: res.status,
      latencyMs,
      availability,
      detail: payload
    };
  } catch (error: any) {
    return {
      key: target.key,
      name: target.name,
      url: target.url,
      category: target.category,
      status: 'down',
      httpStatus: 0,
      latencyMs: Date.now() - start,
      availability: 0,
      detail: error?.message || 'health check failed'
    };
  }
}

services.get('/overview', async (c) => {
  const [userStats, apiUsageStats, pulseStats, i18nStats, healthChecks, commonR2] = await Promise.all([
    c.env.AUTH_DB.prepare(`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM users WHERE created_at > datetime('now', '-1 day')) AS new_users_24h
    `).first(),
    c.env.AUTH_DB.prepare(`
      SELECT
        (SELECT COUNT(*) FROM api_usage WHERE timestamp > datetime('now', '-1 day')) AS requests_24h,
        (SELECT COUNT(*) FROM api_usage WHERE timestamp > datetime('now', '-7 day')) AS requests_7d
    `).first(),
    c.env.PULSE_DB.prepare(`
      SELECT
        (SELECT COUNT(*) FROM products) AS total_products,
        (SELECT COUNT(*) FROM posts) AS total_posts
    `).first(),
    c.env.I18N_DB.prepare(`
      SELECT COUNT(*) AS total_translations FROM translations
    `).first(),
    Promise.all(SERVICE_TARGETS.map((target) => checkServiceHealth(target))),
    fetch('https://common.frenv.pe.kr/monitor/r2').then((r) => r.json()).catch(() => null)
  ]);

  const usageByService = [
    {
      key: 'auth',
      name: 'Auth',
      metric: 'API 요청(24h)',
      value: toNumber(apiUsageStats?.requests_24h),
      unit: 'req'
    },
    {
      key: 'auth-users',
      name: 'Auth Users',
      metric: '신규 사용자(24h)',
      value: toNumber(userStats?.new_users_24h),
      unit: 'users'
    },
    {
      key: 'pulse',
      name: 'Pulse',
      metric: '상품 수',
      value: toNumber(pulseStats?.total_products),
      unit: 'items'
    },
    {
      key: 'posts',
      name: 'Posts',
      metric: '포스트 수',
      value: toNumber(pulseStats?.total_posts),
      unit: 'posts'
    },
    {
      key: 'config',
      name: 'Config/i18n',
      metric: '번역 키 수',
      value: toNumber(i18nStats?.total_translations),
      unit: 'keys'
    },
    {
      key: 'common',
      name: 'Common R2',
      metric: '오브젝트 수',
      value: toNumber((commonR2 as any)?.usage?.objectCount),
      unit: 'files'
    }
  ];

  const upCount = healthChecks.filter((item) => item.status === 'up').length;
  const downCount = healthChecks.length - upCount;
  const avgLatency = healthChecks.length
    ? Math.round(healthChecks.reduce((acc, cur) => acc + cur.latencyMs, 0) / healthChecks.length)
    : 0;

  return c.json({
    summary: {
      totalServices: healthChecks.length,
      upServices: upCount,
      downServices: downCount,
      availabilityPercent: healthChecks.length ? Number(((upCount / healthChecks.length) * 100).toFixed(1)) : 0,
      avgLatencyMs: avgLatency,
      requests24h: toNumber(apiUsageStats?.requests_24h),
      requests7d: toNumber(apiUsageStats?.requests_7d)
    },
    services: healthChecks,
    usage: usageByService,
    updatedAt: new Date().toISOString()
  });
});

export default services;
