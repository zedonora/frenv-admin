// 블로그 포스트 관리 API
import { Hono } from 'hono';

interface Env {
  PULSE_DB: D1Database;
}

const posts = new Hono<{ Bindings: Env }>();

// 포스트 목록
posts.get('/', async (c) => {
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = parseInt(c.req.query('offset') || '0');
  const status = c.req.query('status');
  const category = c.req.query('category');

  let query = 'SELECT * FROM posts WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const result = await c.env.PULSE_DB.prepare(query).bind(...params).all();

  // 전체 수
  let countQuery = 'SELECT COUNT(*) as total FROM posts WHERE 1=1';
  const countParams: any[] = [];
  if (status) {
    countQuery += ' AND status = ?';
    countParams.push(status);
  }
  if (category) {
    countQuery += ' AND category = ?';
    countParams.push(category);
  }

  const countResult = await c.env.PULSE_DB.prepare(countQuery).bind(...countParams).first<{ total: number }>();

  return c.json({
    posts: result.results,
    total: countResult?.total || 0,
    limit,
    offset
  });
});

// 포스트 상세
posts.get('/:id', async (c) => {
  const id = c.req.param('id');

  const post = await c.env.PULSE_DB.prepare(
    'SELECT * FROM posts WHERE id = ?'
  ).bind(id).first();

  if (!post) {
    return c.json({ error: 'Post not found' }, 404);
  }

  return c.json({ post });
});

// 포스트 생성
posts.post('/', async (c) => {
  const body = await c.req.json<{
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    category?: string;
    status?: string;
    cover_image?: string;
  }>();

  if (!body.title || !body.slug || !body.content) {
    return c.json({ error: 'title, slug, and content are required' }, 400);
  }

  const id = crypto.randomUUID();

  await c.env.PULSE_DB.prepare(`
    INSERT INTO posts (id, slug, title, content, excerpt, category, status, cover_image, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).bind(
    id,
    body.slug,
    body.title,
    body.content,
    body.excerpt || null,
    body.category || 'general',
    body.status || 'draft',
    body.cover_image || null
  ).run();

  return c.json({ success: true, id }, 201);
});

// 포스트 수정
posts.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<{
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    category?: string;
    status?: string;
    cover_image?: string;
  }>();

  const updates: string[] = [];
  const params: any[] = [];

  const fields = ['title', 'slug', 'content', 'excerpt', 'category', 'status', 'cover_image'];
  for (const field of fields) {
    if (body[field as keyof typeof body] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(body[field as keyof typeof body]);
    }
  }

  if (updates.length === 0) {
    return c.json({ error: 'No fields to update' }, 400);
  }

  updates.push('updated_at = datetime(\'now\')');
  params.push(id);

  await c.env.PULSE_DB.prepare(
    `UPDATE posts SET ${updates.join(', ')} WHERE id = ?`
  ).bind(...params).run();

  return c.json({ success: true });
});

// 포스트 삭제
posts.delete('/:id', async (c) => {
  const id = c.req.param('id');

  await c.env.PULSE_DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();

  return c.json({ success: true });
});

// 통계
posts.get('/stats/overview', async (c) => {
  const total = await c.env.PULSE_DB.prepare('SELECT COUNT(*) as count FROM posts').first<{ count: number }>();

  const byStatus = await c.env.PULSE_DB.prepare(`
    SELECT status, COUNT(*) as count FROM posts GROUP BY status
  `).all();

  const byCategory = await c.env.PULSE_DB.prepare(`
    SELECT category, COUNT(*) as count FROM posts GROUP BY category
  `).all();

  return c.json({
    total: total?.count || 0,
    byStatus: byStatus.results,
    byCategory: byCategory.results
  });
});

export default posts;
