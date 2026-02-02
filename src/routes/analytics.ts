// 전체 서비스 분석 API
import { Hono } from 'hono';

interface Env {
  AUTH_DB: D1Database;
  PULSE_DB: D1Database;
  I18N_DB: D1Database;
}

const analytics = new Hono<{ Bindings: Env }>();

// 전체 대시보드 통계
analytics.get('/dashboard', async (c) => {
  // 사용자 통계
  const userStats = await c.env.AUTH_DB.prepare(`
    SELECT
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM users WHERE created_at > datetime('now', '-7 days')) as new_users_week,
      (SELECT COUNT(*) FROM api_keys) as total_api_keys,
      (SELECT COUNT(*) FROM api_usage WHERE timestamp > datetime('now', '-1 day')) as api_requests_today
  `).first();

  // 상품 통계
  const productStats = await c.env.PULSE_DB.prepare(`
    SELECT
      (SELECT COUNT(*) FROM products) as total_products,
      (SELECT COUNT(*) FROM products WHERE is_rising = 1) as rising_products
  `).first();

  // 포스트 통계
  const postStats = await c.env.PULSE_DB.prepare(`
    SELECT
      (SELECT COUNT(*) FROM posts) as total_posts,
      (SELECT COUNT(*) FROM posts WHERE status = 'published') as published_posts
  `).first();

  // 번역 통계
  const i18nStats = await c.env.I18N_DB.prepare(`
    SELECT COUNT(*) as total_translations FROM translations
  `).first();

  return c.json({
    users: userStats,
    products: productStats,
    posts: postStats,
    i18n: i18nStats
  });
});

// API 사용량 트렌드
analytics.get('/api-usage', async (c) => {
  const days = parseInt(c.req.query('days') || '7');

  const daily = await c.env.AUTH_DB.prepare(`
    SELECT DATE(timestamp) as date, COUNT(*) as count
    FROM api_usage
    WHERE timestamp > datetime('now', '-${days} days')
    GROUP BY DATE(timestamp)
    ORDER BY date
  `).all();

  const byEndpoint = await c.env.AUTH_DB.prepare(`
    SELECT endpoint, COUNT(*) as count
    FROM api_usage
    WHERE timestamp > datetime('now', '-${days} days')
    GROUP BY endpoint
    ORDER BY count DESC
    LIMIT 10
  `).all();

  const byUser = await c.env.AUTH_DB.prepare(`
    SELECT u.email, COUNT(*) as count
    FROM api_usage au
    JOIN users u ON au.user_id = u.id
    WHERE au.timestamp > datetime('now', '-${days} days')
    GROUP BY au.user_id
    ORDER BY count DESC
    LIMIT 10
  `).all();

  return c.json({
    daily: daily.results,
    byEndpoint: byEndpoint.results,
    topUsers: byUser.results
  });
});

// 사용자 성장 추이
analytics.get('/user-growth', async (c) => {
  const days = parseInt(c.req.query('days') || '30');

  const growth = await c.env.AUTH_DB.prepare(`
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM users
    WHERE created_at > datetime('now', '-${days} days')
    GROUP BY DATE(created_at)
    ORDER BY date
  `).all();

  const byPlan = await c.env.AUTH_DB.prepare(`
    SELECT plan, COUNT(*) as count FROM users GROUP BY plan
  `).all();

  const byService = await c.env.AUTH_DB.prepare(`
    SELECT registered_from, COUNT(*) as count FROM users GROUP BY registered_from
  `).all();

  return c.json({
    daily: growth.results,
    byPlan: byPlan.results,
    byService: byService.results
  });
});

export default analytics;
