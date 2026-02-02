// API Key 관리 API
import { Hono } from 'hono';

interface Env {
  AUTH_DB: D1Database;
}

const apiKeys = new Hono<{ Bindings: Env }>();

// API Key 목록 (모든 사용자)
apiKeys.get('/', async (c) => {
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = parseInt(c.req.query('offset') || '0');
  const userId = c.req.query('user_id');

  let query = `
    SELECT ak.id, ak.user_id, ak.key_prefix, ak.name, ak.last_used_at, ak.created_at,
           u.email as user_email, u.name as user_name, u.plan as user_plan
    FROM api_keys ak
    JOIN users u ON ak.user_id = u.id
  `;
  const params: string[] = [];

  if (userId) {
    query += ' WHERE ak.user_id = ?';
    params.push(userId);
  }

  query += ' ORDER BY ak.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit.toString(), offset.toString());

  const result = await c.env.AUTH_DB.prepare(query).bind(...params).all();

  // 전체 수
  let countQuery = 'SELECT COUNT(*) as total FROM api_keys';
  if (userId) {
    countQuery += ' WHERE user_id = ?';
  }
  const countResult = userId
    ? await c.env.AUTH_DB.prepare(countQuery).bind(userId).first<{ total: number }>()
    : await c.env.AUTH_DB.prepare(countQuery).first<{ total: number }>();

  return c.json({
    keys: result.results,
    total: countResult?.total || 0,
    limit,
    offset
  });
});

// API Key 사용량 조회
apiKeys.get('/:id/usage', async (c) => {
  const id = c.req.param('id');
  const days = parseInt(c.req.query('days') || '7');

  const usage = await c.env.AUTH_DB.prepare(`
    SELECT DATE(timestamp) as date, endpoint, COUNT(*) as count
    FROM api_usage
    WHERE api_key_id = ? AND timestamp > datetime('now', '-${days} days')
    GROUP BY DATE(timestamp), endpoint
    ORDER BY date DESC, count DESC
  `).bind(id).all();

  const daily = await c.env.AUTH_DB.prepare(`
    SELECT DATE(timestamp) as date, COUNT(*) as count
    FROM api_usage
    WHERE api_key_id = ? AND timestamp > datetime('now', '-${days} days')
    GROUP BY DATE(timestamp)
    ORDER BY date DESC
  `).bind(id).all();

  return c.json({
    byEndpoint: usage.results,
    daily: daily.results
  });
});

// API Key 삭제
apiKeys.delete('/:id', async (c) => {
  const id = c.req.param('id');

  await c.env.AUTH_DB.prepare('DELETE FROM api_keys WHERE id = ?').bind(id).run();

  return c.json({ success: true });
});

// 통계
apiKeys.get('/stats/overview', async (c) => {
  const total = await c.env.AUTH_DB.prepare('SELECT COUNT(*) as count FROM api_keys').first<{ count: number }>();

  const activeToday = await c.env.AUTH_DB.prepare(`
    SELECT COUNT(DISTINCT api_key_id) as count FROM api_usage WHERE timestamp > datetime('now', '-1 day')
  `).first<{ count: number }>();

  const requestsToday = await c.env.AUTH_DB.prepare(`
    SELECT COUNT(*) as count FROM api_usage WHERE timestamp > datetime('now', '-1 day')
  `).first<{ count: number }>();

  const requestsWeek = await c.env.AUTH_DB.prepare(`
    SELECT COUNT(*) as count FROM api_usage WHERE timestamp > datetime('now', '-7 days')
  `).first<{ count: number }>();

  return c.json({
    totalKeys: total?.count || 0,
    activeKeysToday: activeToday?.count || 0,
    requestsToday: requestsToday?.count || 0,
    requestsThisWeek: requestsWeek?.count || 0
  });
});

export default apiKeys;
