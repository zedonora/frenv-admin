// 상품/트렌드 관리 API
import { Hono } from 'hono';

interface Env {
  PULSE_DB: D1Database;
}

const products = new Hono<{ Bindings: Env }>();

// 상품 목록
products.get('/', async (c) => {
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = parseInt(c.req.query('offset') || '0');
  const category = c.req.query('category');
  const search = c.req.query('search');

  let query = 'SELECT * FROM products WHERE 1=1';
  const params: any[] = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }

  query += ' ORDER BY rank ASC, scraped_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const result = await c.env.PULSE_DB.prepare(query).bind(...params).all();

  // 전체 수
  let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
  const countParams: any[] = [];
  if (category) {
    countQuery += ' AND category = ?';
    countParams.push(category);
  }
  if (search) {
    countQuery += ' AND name LIKE ?';
    countParams.push(`%${search}%`);
  }

  const countResult = await c.env.PULSE_DB.prepare(countQuery).bind(...countParams).first<{ total: number }>();

  return c.json({
    products: result.results,
    total: countResult?.total || 0,
    limit,
    offset
  });
});

// 상품 상세
products.get('/:id', async (c) => {
  const id = c.req.param('id');

  const product = await c.env.PULSE_DB.prepare(
    'SELECT * FROM products WHERE id = ?'
  ).bind(id).first();

  if (!product) {
    return c.json({ error: 'Product not found' }, 404);
  }

  return c.json({ product });
});

// 상품 수정
products.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<{
    name?: string;
    price?: number;
    category?: string;
    rank?: number;
    is_rising?: boolean;
    rising_score?: number;
    rising_reason?: string;
  }>();

  const updates: string[] = [];
  const params: any[] = [];

  const fields = ['name', 'price', 'category', 'rank', 'is_rising', 'rising_score', 'rising_reason'];
  for (const field of fields) {
    if (body[field as keyof typeof body] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(body[field as keyof typeof body]);
    }
  }

  if (updates.length === 0) {
    return c.json({ error: 'No fields to update' }, 400);
  }

  params.push(id);
  await c.env.PULSE_DB.prepare(
    `UPDATE products SET ${updates.join(', ')} WHERE id = ?`
  ).bind(...params).run();

  return c.json({ success: true });
});

// 상품 삭제
products.delete('/:id', async (c) => {
  const id = c.req.param('id');

  await c.env.PULSE_DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();

  return c.json({ success: true });
});

// 카테고리 통계
products.get('/stats/overview', async (c) => {
  const total = await c.env.PULSE_DB.prepare('SELECT COUNT(*) as count FROM products').first<{ count: number }>();

  const byCategory = await c.env.PULSE_DB.prepare(`
    SELECT category, COUNT(*) as count FROM products GROUP BY category
  `).all();

  const rising = await c.env.PULSE_DB.prepare(
    'SELECT COUNT(*) as count FROM products WHERE is_rising = 1'
  ).first<{ count: number }>();

  return c.json({
    total: total?.count || 0,
    byCategory: byCategory.results,
    risingCount: rising?.count || 0
  });
});

export default products;
