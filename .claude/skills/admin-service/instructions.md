# Admin Service Development Guide

## Overview

Admin Service는 모든 frenv 서비스를 통합 관리하는 대시보드입니다.
Cloudflare Workers에서 실행되며, 여러 D1 데이터베이스에 접근합니다.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Dashboard                          │
│                  admin.frenv.pe.kr                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   AUTH_DB   │  │  PULSE_DB   │  │   I18N_DB   │        │
│  │  (Users,    │  │ (Products,  │  │(Translations)│        │
│  │  API Keys)  │  │   Posts)    │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Key Files

- `src/index.ts` - 메인 앱 및 라우팅
- `src/middleware/auth.ts` - Admin 인증 미들웨어
- `src/routes/*.ts` - API 엔드포인트
- `src/pages/dashboard.ts` - 대시보드 HTML 페이지

## Development Guidelines

### 1. 새 API 엔드포인트 추가

```typescript
// src/routes/new-feature.ts
import { Hono } from 'hono';

interface Env {
  AUTH_DB: D1Database;
  // 필요한 DB 바인딩 추가
}

const newFeature = new Hono<{ Bindings: Env }>();

newFeature.get('/', async (c) => {
  // 구현
  return c.json({ data });
});

export default newFeature;
```

### 2. 대시보드 페이지 추가

`src/pages/dashboard.ts`의 `getDashboardPage` 함수에서:

1. 사이드바에 네비게이션 추가
2. `loadXxx()` 함수 구현
3. HTML 렌더링 추가

### 3. 권한 체크

모든 API는 `adminAuth` 미들웨어로 보호됩니다.
Admin role이 아닌 사용자는 403 응답을 받습니다.

## Common Tasks

### 사용자 플랜 변경
```bash
# API 호출
curl -X PATCH https://admin.frenv.pe.kr/api/users/{id} \
  -H "Cookie: token=xxx" \
  -d '{"plan": "pro"}'
```

### 번역 캐시 초기화
```bash
curl -X POST https://admin.frenv.pe.kr/api/translations/cache/clear \
  -H "Cookie: token=xxx" \
  -d '{"lang": "ko"}'
```

## Deployment

GitHub에 push하면 자동으로 배포됩니다.

수동 배포:
```bash
npm run deploy:production
```
