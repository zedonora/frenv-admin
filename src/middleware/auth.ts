// Admin 인증 미들웨어
import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';

interface Env {
  AUTH_DB: D1Database;
  JWT_SECRET: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  plan: string;
}

// JWT Payload 타입
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  plan: string;
  iat: number;
  exp: number;
}

// Base64URL 디코딩
function base64UrlDecode(data: string): string {
  let base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

// HMAC-SHA256 서명 생성
async function createSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const signatureArray = Array.from(new Uint8Array(signature));
  const signatureBase64 = btoa(String.fromCharCode(...signatureArray));
  return signatureBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// JWT 토큰 검증
async function verifyJwt(token: string, secret: string): Promise<JwtPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerEncoded, payloadEncoded, signature] = parts;
    const dataToVerify = `${headerEncoded}.${payloadEncoded}`;
    const expectedSignature = await createSignature(dataToVerify, secret);

    if (signature !== expectedSignature) return null;

    const payload: JwtPayload = JSON.parse(base64UrlDecode(payloadEncoded));

    // 만료 체크
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Admin 인증 미들웨어
 * - Admin role만 접근 가능
 */
export async function adminAuth(c: Context<{ Bindings: Env }>, next: Next) {
  // 로그인 페이지와 헬스 체크는 인증 제외
  const path = new URL(c.req.url).pathname;
  if (path === '/login' || path === '/health') {
    return next();
  }

  const token = getCookie(c, 'token');

  if (!token) {
    // API 요청이면 401, 페이지 요청이면 로그인 리다이렉트
    const accept = c.req.header('Accept') || '';
    if (accept.includes('application/json') || path.startsWith('/api/')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    return c.redirect('/login');
  }

  const payload = await verifyJwt(token, c.env.JWT_SECRET);

  if (!payload) {
    const accept = c.req.header('Accept') || '';
    if (accept.includes('application/json') || path.startsWith('/api/')) {
      return c.json({ error: 'Invalid token' }, 401);
    }
    return c.redirect('/login');
  }

  // Admin role 체크
  if (payload.role !== 'admin') {
    return c.json({ error: 'Admin access required' }, 403);
  }

  // 사용자 정보 컨텍스트에 저장
  c.set('user', {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
    plan: payload.plan
  } as AdminUser);

  await next();
}
