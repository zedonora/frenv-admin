// English 서비스 관리 API
// Supabase 데이터를 프록시하여 관리
import { Hono } from 'hono';

interface Env {
  AUTH_DB: D1Database;
  CONFIG_KV: KVNamespace;
}

const english = new Hono<{ Bindings: Env }>();

// Supabase 설정 (KV에서 가져옴)
async function getSupabaseConfig(kv: KVNamespace) {
  const config = await kv.get('english_supabase_config', 'json') as {
    url: string;
    serviceKey: string;
  } | null;
  return config;
}

// Supabase API 호출 헬퍼
async function supabaseQuery(
  kv: KVNamespace,
  table: string,
  options: {
    select?: string;
    filter?: Record<string, string>;
    order?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  const config = await getSupabaseConfig(kv);
  if (!config) {
    throw new Error('Supabase 설정이 없습니다. CONFIG_KV에 english_supabase_config를 설정하세요.');
  }

  let url = `${config.url}/rest/v1/${table}?`;

  if (options.select) {
    url += `select=${options.select}&`;
  }

  if (options.filter) {
    Object.entries(options.filter).forEach(([key, value]) => {
      url += `${key}=${value}&`;
    });
  }

  if (options.order) {
    url += `order=${options.order}&`;
  }

  if (options.limit) {
    url += `limit=${options.limit}&`;
  }

  if (options.offset) {
    url += `offset=${options.offset}&`;
  }

  const response = await fetch(url, {
    headers: {
      'apikey': config.serviceKey,
      'Authorization': `Bearer ${config.serviceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'count=exact'
    }
  });

  const total = parseInt(response.headers.get('content-range')?.split('/')[1] || '0');
  const data = await response.json();

  return { data, total };
}

// ========== 학습 통계 ==========

// 전체 통계
english.get('/stats', async (c) => {
  try {
    const config = await getSupabaseConfig(c.env.CONFIG_KV);
    if (!config) {
      return c.json({
        error: 'Supabase 설정 필요',
        setup: '관리자가 CONFIG_KV에 english_supabase_config를 설정해야 합니다.'
      }, 400);
    }

    // 여러 테이블 통계 조회
    const [vocabResult, lessonsResult, logsResult, apiUsageResult] = await Promise.all([
      supabaseQuery(c.env.CONFIG_KV, 'vocab_items', { select: 'id', limit: 1 }),
      supabaseQuery(c.env.CONFIG_KV, 'daily_lessons', { select: 'id', limit: 1 }),
      supabaseQuery(c.env.CONFIG_KV, 'study_logs', { select: 'id', limit: 1 }),
      supabaseQuery(c.env.CONFIG_KV, 'api_usage_logs', { select: 'id', limit: 1 })
    ]);

    return c.json({
      totalVocab: vocabResult.total,
      totalLessons: lessonsResult.total,
      totalStudyLogs: logsResult.total,
      totalApiCalls: apiUsageResult.total
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// ========== 어휘 관리 ==========

// 어휘 목록
english.get('/vocab', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');
    const search = c.req.query('search') || '';

    let filter: Record<string, string> = {};
    if (search) {
      filter['or'] = `(word.ilike.*${search}*,definition.ilike.*${search}*)`;
    }

    const result = await supabaseQuery(c.env.CONFIG_KV, 'vocab_items', {
      select: '*',
      filter,
      order: 'next_review_date.asc',
      limit,
      offset
    });

    return c.json({
      vocab: result.data,
      total: result.total,
      limit,
      offset
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// 어휘 상세
english.get('/vocab/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const result = await supabaseQuery(c.env.CONFIG_KV, 'vocab_items', {
      select: '*',
      filter: { id: `eq.${id}` }
    });

    if (!result.data || result.data.length === 0) {
      return c.json({ error: '어휘를 찾을 수 없습니다' }, 404);
    }

    return c.json({ vocab: result.data[0] });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// ========== 레슨 관리 ==========

// 레슨 목록
english.get('/lessons', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '30');
    const offset = parseInt(c.req.query('offset') || '0');

    const result = await supabaseQuery(c.env.CONFIG_KV, 'daily_lessons', {
      select: '*',
      order: 'date.desc',
      limit,
      offset
    });

    return c.json({
      lessons: result.data,
      total: result.total,
      limit,
      offset
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// 레슨 상세
english.get('/lessons/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const result = await supabaseQuery(c.env.CONFIG_KV, 'daily_lessons', {
      select: '*',
      filter: { id: `eq.${id}` }
    });

    if (!result.data || result.data.length === 0) {
      return c.json({ error: '레슨을 찾을 수 없습니다' }, 404);
    }

    return c.json({ lesson: result.data[0] });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// ========== 학습 기록 ==========

// 학습 기록 목록
english.get('/study-logs', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');
    const type = c.req.query('type') || '';

    let filter: Record<string, string> = {};
    if (type) {
      filter['activity_type'] = `eq.${type}`;
    }

    const result = await supabaseQuery(c.env.CONFIG_KV, 'study_logs', {
      select: '*',
      filter,
      order: 'created_at.desc',
      limit,
      offset
    });

    return c.json({
      logs: result.data,
      total: result.total,
      limit,
      offset
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// ========== API 사용량 ==========

// API 사용 기록
english.get('/api-usage', async (c) => {
  try {
    const days = parseInt(c.req.query('days') || '7');
    const limit = parseInt(c.req.query('limit') || '100');

    const result = await supabaseQuery(c.env.CONFIG_KV, 'api_usage_logs', {
      select: '*',
      order: 'created_at.desc',
      limit
    });

    // 일별 집계
    const dailyUsage: Record<string, { count: number; tokens: number }> = {};
    const endpointUsage: Record<string, number> = {};

    if (Array.isArray(result.data)) {
      result.data.forEach((log: any) => {
        const date = log.created_at?.split('T')[0];
        if (date) {
          if (!dailyUsage[date]) {
            dailyUsage[date] = { count: 0, tokens: 0 };
          }
          dailyUsage[date].count++;
          dailyUsage[date].tokens += log.tokens || 0;
        }

        if (log.endpoint) {
          endpointUsage[log.endpoint] = (endpointUsage[log.endpoint] || 0) + 1;
        }
      });
    }

    return c.json({
      raw: result.data,
      total: result.total,
      daily: Object.entries(dailyUsage).map(([date, stats]) => ({ date, ...stats })),
      byEndpoint: Object.entries(endpointUsage).map(([endpoint, count]) => ({ endpoint, count }))
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// ========== 리더보드 ==========

// 리더보드 목록
english.get('/leaderboard', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');

    const result = await supabaseQuery(c.env.CONFIG_KV, 'leaderboard', {
      select: '*',
      order: 'score.desc',
      limit
    });

    return c.json({
      leaderboard: result.data,
      total: result.total
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// ========== 설정 관리 ==========

// Supabase 설정 저장
english.post('/config', async (c) => {
  try {
    const { supabaseUrl, supabaseServiceKey } = await c.req.json<{
      supabaseUrl: string;
      supabaseServiceKey: string;
    }>();

    if (!supabaseUrl || !supabaseServiceKey) {
      return c.json({ error: 'supabaseUrl과 supabaseServiceKey가 필요합니다' }, 400);
    }

    await c.env.CONFIG_KV.put('english_supabase_config', JSON.stringify({
      url: supabaseUrl,
      serviceKey: supabaseServiceKey
    }));

    return c.json({ success: true, message: 'Supabase 설정이 저장되었습니다' });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// Supabase 설정 확인
english.get('/config', async (c) => {
  try {
    const config = await getSupabaseConfig(c.env.CONFIG_KV);
    return c.json({
      configured: !!config,
      url: config?.url || null
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default english;
