// Frenv Admin Dashboard
// admin.frenv.pe.kr
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { adminAuth } from './middleware/auth';
import usersRoutes from './routes/users';
import apiKeysRoutes from './routes/api-keys';
import productsRoutes from './routes/products';
import postsRoutes from './routes/posts';
import translationsRoutes from './routes/translations';
import analyticsRoutes from './routes/analytics';
import englishRoutes from './routes/english';
import { getDashboardPage, getLoginPage } from './pages/dashboard';

export interface Env {
  AUTH_DB: D1Database;
  PULSE_DB: D1Database;
  I18N_DB: D1Database;
  CONFIG_KV: KVNamespace;
  JWT_SECRET: string;
  ENVIRONMENT: string;
  ADMIN_EMAIL: string;
}

const app = new Hono<{ Bindings: Env }>();

// CORS 설정 - admin만 허용
app.use('*', cors({
  origin: [
    'https://admin.frenv.pe.kr',
    'https://auth.frenv.pe.kr',
    'http://localhost:8787'
  ],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}));

// 로깅
app.use('*', logger());

// 로그인 페이지 (인증 불필요)
app.get('/login', (c) => {
  return c.html(getLoginPage());
});

// 디버그: 쿠키 상태 확인
app.get('/debug/cookies', async (c) => {
  const { getCookie } = await import('hono/cookie');
  const token = getCookie(c, 'token');
  const allCookies = c.req.header('Cookie');

  return c.json({
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 50) + '...' : null,
    cookieHeader: allCookies || 'No cookies',
    jwtSecretSet: !!c.env.JWT_SECRET
  });
});

// 인증 미들웨어 적용 (login 제외)
app.use('*', adminAuth);

// API 라우트 등록
app.route('/api/users', usersRoutes);
app.route('/api/api-keys', apiKeysRoutes);
app.route('/api/products', productsRoutes);
app.route('/api/posts', postsRoutes);
app.route('/api/translations', translationsRoutes);
app.route('/api/analytics', analyticsRoutes);
app.route('/api/english', englishRoutes);

// 대시보드 페이지
app.get('/', (c) => {
  return c.html(getDashboardPage());
});

app.get('/users', (c) => c.html(getDashboardPage('users')));
app.get('/api-keys', (c) => c.html(getDashboardPage('api-keys')));
app.get('/products', (c) => c.html(getDashboardPage('products')));
app.get('/posts', (c) => c.html(getDashboardPage('posts')));
app.get('/translations', (c) => c.html(getDashboardPage('translations')));
app.get('/analytics', (c) => c.html(getDashboardPage('analytics')));
app.get('/english', (c) => c.html(getDashboardPage('english')));

// 헬스 체크
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'frenv-admin',
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT
  });
});

// 404
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// 에러 핸들러
app.onError((err, c) => {
  console.error('Admin service error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
