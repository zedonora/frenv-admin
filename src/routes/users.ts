// 사용자 관리 API
import { Hono } from 'hono';
import { AdminUser } from '../middleware/auth';

interface Env {
  AUTH_DB: D1Database;
}

const users = new Hono<{ Bindings: Env }>();

// 사용자 목록
users.get('/', async (c) => {
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = parseInt(c.req.query('offset') || '0');
  const search = c.req.query('search') || '';

  let query = `
    SELECT id, email, name, role, plan, registered_from, stripe_customer_id, created_at
    FROM users
  `;
  const params: string[] = [];

  if (search) {
    query += ' WHERE email LIKE ? OR name LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit.toString(), offset.toString());

  const result = await c.env.AUTH_DB.prepare(query).bind(...params).all();

  // 전체 수 조회
  let countQuery = 'SELECT COUNT(*) as total FROM users';
  if (search) {
    countQuery += ' WHERE email LIKE ? OR name LIKE ?';
  }
  const countResult = search
    ? await c.env.AUTH_DB.prepare(countQuery).bind(`%${search}%`, `%${search}%`).first<{ total: number }>()
    : await c.env.AUTH_DB.prepare(countQuery).first<{ total: number }>();

  return c.json({
    users: result.results,
    total: countResult?.total || 0,
    limit,
    offset
  });
});

// 사용자 상세
users.get('/:id', async (c) => {
  const id = c.req.param('id');

  const user = await c.env.AUTH_DB.prepare(`
    SELECT id, email, name, role, plan, registered_from, stripe_customer_id, stripe_subscription_id, created_at
    FROM users WHERE id = ?
  `).bind(id).first();

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  // API Key 수
  const keyCount = await c.env.AUTH_DB.prepare(
    'SELECT COUNT(*) as count FROM api_keys WHERE user_id = ?'
  ).bind(id).first<{ count: number }>();

  return c.json({ user, apiKeyCount: keyCount?.count || 0 });
});

// 사용자 수정
users.patch('/:id', async (c) => {
  const currentUser = c.get('user') as AdminUser;
  const id = c.req.param('id');
  const { role, plan, name } = await c.req.json<{
    role?: string;
    plan?: string;
    name?: string;
  }>();

  const updates: string[] = [];
  const params: string[] = [];

  // role 변경은 superadmin만 가능
  if (role) {
    if (currentUser.role !== 'superadmin') {
      return c.json({ error: 'Only superadmin can change user roles' }, 403);
    }
    // superadmin role은 변경 불가 (보호)
    if (role === 'superadmin') {
      return c.json({ error: 'Cannot assign superadmin role' }, 403);
    }
    updates.push('role = ?');
    params.push(role);
  }

  if (plan) {
    updates.push('plan = ?');
    params.push(plan);
  }
  if (name !== undefined) {
    updates.push('name = ?');
    params.push(name);
  }

  if (updates.length === 0) {
    return c.json({ error: 'No fields to update' }, 400);
  }

  params.push(id);
  await c.env.AUTH_DB.prepare(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`
  ).bind(...params).run();

  return c.json({ success: true });
});

// 사용자 삭제
users.delete('/:id', async (c) => {
  const id = c.req.param('id');

  // API Key도 함께 삭제
  await c.env.AUTH_DB.prepare('DELETE FROM api_keys WHERE user_id = ?').bind(id).run();
  await c.env.AUTH_DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();

  return c.json({ success: true });
});

// 통계
users.get('/stats/overview', async (c) => {
  const total = await c.env.AUTH_DB.prepare('SELECT COUNT(*) as count FROM users').first<{ count: number }>();

  const byPlan = await c.env.AUTH_DB.prepare(`
    SELECT plan, COUNT(*) as count FROM users GROUP BY plan
  `).all();

  const byRole = await c.env.AUTH_DB.prepare(`
    SELECT role, COUNT(*) as count FROM users GROUP BY role
  `).all();

  const recent = await c.env.AUTH_DB.prepare(`
    SELECT COUNT(*) as count FROM users WHERE created_at > datetime('now', '-7 days')
  `).first<{ count: number }>();

  return c.json({
    total: total?.count || 0,
    byPlan: byPlan.results,
    byRole: byRole.results,
    newThisWeek: recent?.count || 0
  });
});

export default users;
