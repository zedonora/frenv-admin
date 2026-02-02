// 번역 관리 API
import { Hono } from 'hono';

interface Env {
  I18N_DB: D1Database;
  CONFIG_KV: KVNamespace;
}

const translations = new Hono<{ Bindings: Env }>();

// 언어 목록
translations.get('/languages', async (c) => {
  const result = await c.env.I18N_DB.prepare(`
    SELECT code, name, native_name, icon, is_active, created_at
    FROM languages ORDER BY code
  `).all();

  return c.json({ languages: result.results });
});

// 번역 목록
translations.get('/', async (c) => {
  const lang = c.req.query('lang') || 'ko';
  const namespace = c.req.query('namespace');
  const limit = parseInt(c.req.query('limit') || '100');
  const offset = parseInt(c.req.query('offset') || '0');

  let query = 'SELECT * FROM translations WHERE lang = ?';
  const params: any[] = [lang];

  if (namespace) {
    query += ' AND namespace = ?';
    params.push(namespace);
  }

  query += ' ORDER BY namespace, key LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const result = await c.env.I18N_DB.prepare(query).bind(...params).all();

  // 네임스페이스 목록
  const namespaces = await c.env.I18N_DB.prepare(`
    SELECT DISTINCT namespace FROM translations WHERE lang = ? ORDER BY namespace
  `).bind(lang).all();

  return c.json({
    translations: result.results,
    namespaces: namespaces.results.map((n: any) => n.namespace),
    limit,
    offset
  });
});

// 번역 수정
translations.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const { value } = await c.req.json<{ value: string }>();

  if (!value) {
    return c.json({ error: 'value is required' }, 400);
  }

  await c.env.I18N_DB.prepare(`
    UPDATE translations SET value = ?, source = 'manual', updated_at = datetime('now') WHERE id = ?
  `).bind(value, id).run();

  return c.json({ success: true });
});

// 번역 추가
translations.post('/', async (c) => {
  const { lang, namespace, key, value } = await c.req.json<{
    lang: string;
    namespace: string;
    key: string;
    value: string;
  }>();

  if (!lang || !namespace || !key || !value) {
    return c.json({ error: 'lang, namespace, key, and value are required' }, 400);
  }

  const id = crypto.randomUUID();

  await c.env.I18N_DB.prepare(`
    INSERT INTO translations (id, lang, namespace, key, value, source, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'manual', datetime('now'), datetime('now'))
  `).bind(id, lang, namespace, key, value).run();

  return c.json({ success: true, id }, 201);
});

// 번역 삭제
translations.delete('/:id', async (c) => {
  const id = c.req.param('id');

  await c.env.I18N_DB.prepare('DELETE FROM translations WHERE id = ?').bind(id).run();

  return c.json({ success: true });
});

// 캐시 초기화
translations.post('/cache/clear', async (c) => {
  const { lang, namespace } = await c.req.json<{ lang?: string; namespace?: string }>();

  if (lang && namespace) {
    await c.env.CONFIG_KV.delete(`i18n:${lang}:${namespace}`);
  } else if (lang) {
    await c.env.CONFIG_KV.delete(`i18n:${lang}:all`);
    // 특정 언어의 모든 네임스페이스 캐시 삭제는 KV list가 필요하므로 생략
  }

  return c.json({ success: true, cleared: { lang, namespace } });
});

// 통계
translations.get('/stats/overview', async (c) => {
  const byLang = await c.env.I18N_DB.prepare(`
    SELECT lang, COUNT(*) as count FROM translations GROUP BY lang
  `).all();

  const bySource = await c.env.I18N_DB.prepare(`
    SELECT source, COUNT(*) as count FROM translations GROUP BY source
  `).all();

  const byNamespace = await c.env.I18N_DB.prepare(`
    SELECT namespace, COUNT(*) as count FROM translations WHERE lang = 'ko' GROUP BY namespace
  `).all();

  return c.json({
    byLanguage: byLang.results,
    bySource: bySource.results,
    byNamespace: byNamespace.results
  });
});

export default translations;
