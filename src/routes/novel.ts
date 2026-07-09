// Novel 서비스 관리 API — Supabase(PostgREST) 프록시
// 화 목록 / 문체지표(대사%·반복도 시계열) / 독자 피드백 수집·조회
import { Hono } from 'hono';

interface Env {
  CONFIG_KV: KVNamespace;
  NOVEL_SUPABASE_URL?: string;
  NOVEL_SUPABASE_SERVICE_KEY?: string;
}

const novel = new Hono<{ Bindings: Env }>();

async function getSupabaseConfig(env: Env) {
  if (env.NOVEL_SUPABASE_URL && env.NOVEL_SUPABASE_SERVICE_KEY) {
    return { url: env.NOVEL_SUPABASE_URL, serviceKey: env.NOVEL_SUPABASE_SERVICE_KEY };
  }
  // 폴백: KV (novel은 invest와 같은 Supabase 프로젝트를 재사용)
  return (await env.CONFIG_KV.get('novel_supabase_config', 'json')) as
    { url: string; serviceKey: string } | null;
}

async function sbFetch(
  env: Env,
  path: string,
  opts: { method?: string; body?: string; prefer?: string } = {}
): Promise<any> {
  const config = await getSupabaseConfig(env);
  if (!config) throw new Error('Supabase 미설정: NOVEL_SUPABASE_URL / NOVEL_SUPABASE_SERVICE_KEY');
  const headers: Record<string, string> = {
    apikey: config.serviceKey,
    Authorization: `Bearer ${config.serviceKey}`,
    'Content-Type': 'application/json',
  };
  if (opts.prefer) headers['Prefer'] = opts.prefer;
  const init: Record<string, unknown> = { method: opts.method || 'GET', headers };
  if (opts.body) init.body = opts.body;
  // fetch는 CF Workers/DOM 타입 오버로드가 겹쳐 TS2589(추론 폭발)를 유발 → any 경유
  const doFetch = fetch as (input: string, init?: unknown) => Promise<any>;
  return doFetch(`${config.url}/rest/v1/${path}`, init);
}

// 설정 확인
novel.get('/config', async (c) => {
  const config = await getSupabaseConfig(c.env);
  return c.json({ configured: !!config });
});

// 확정 화 목록
novel.get('/episodes', async (c) => {
  try {
    const res = await sbFetch(c.env, 'novel_episodes?select=*&order=ep.asc');
    return c.json({ episodes: await res.json() });
  } catch (e: any) {
    return c.json({ error: e.message, episodes: [] }, 500);
  }
});

// 문체 지표(시계열: 대사%·서술%·반복도)
novel.get('/metrics', async (c) => {
  try {
    const res = await sbFetch(c.env, 'novel_style_metrics?select=*&order=ep.asc');
    return c.json({ metrics: await res.json() });
  } catch (e: any) {
    return c.json({ error: e.message, metrics: [] }, 500);
  }
});

// 피드백 목록
novel.get('/feedback', async (c) => {
  try {
    const res = await sbFetch(c.env, 'novel_feedback?select=*&order=created_at.desc&limit=100');
    return c.json({ feedback: await res.json() });
  } catch (e: any) {
    return c.json({ error: e.message, feedback: [] }, 500);
  }
});

// 피드백 추가(웹 입력)
novel.post('/feedback', async (c) => {
  try {
    const body = await c.req.json<{ content: string; ep?: number | null; source?: string }>();
    if (!body.content?.trim()) return c.json({ error: '내용이 비었습니다' }, 400);
    const res = await sbFetch(c.env, 'novel_feedback', {
      method: 'POST',
      prefer: 'return=representation',
      body: JSON.stringify([{
        content: body.content.trim(),
        ep: body.ep ?? null,
        source: body.source || 'web',
      }]),
    });
    const rows = await res.json();
    return c.json({ ok: true, item: Array.isArray(rows) ? rows[0] : rows });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// 피드백 반영 토글
novel.patch('/feedback/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json<{ applied: boolean }>();
    await sbFetch(c.env, `novel_feedback?id=eq.${id}`, {
      method: 'PATCH',
      prefer: 'return=minimal',
      body: JSON.stringify({ applied: !!body.applied }),
    });
    return c.json({ ok: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default novel;
