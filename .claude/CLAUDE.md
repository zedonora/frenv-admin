# Admin Service

**Domain:** `admin.frenv.pe.kr`
**Type:** Cloudflare Worker
**Tech:** Hono + D1 (Multiple DBs)
**GitHub:** [zedonora/frenv-admin](https://github.com/zedonora/frenv-admin)
**Cloudflare Worker:** `frenv-admin`
**CI/CD:** GitHub Actions (push to main → auto deploy)

---

## 역할

통합 관리 대시보드로 모든 frenv 서비스를 중앙에서 관리합니다.

- **Auth Service 관리:** 사용자, API Key, 결제
- **Pulse Service 관리:** 상품/트렌드, 블로그 포스트
- **Config Service 관리:** 번역, 테마
- **전체 서비스 분석:** API 사용량, 사용자 통계

---

## 접근 권한

⚠️ **Admin role 사용자만 접근 가능**

Auth Service의 JWT 토큰을 사용하며, `role: 'admin'`인 사용자만 허용됩니다.

---

## API Endpoints

### Users (Auth DB)
```
GET    /api/users              사용자 목록
GET    /api/users/:id          사용자 상세
PATCH  /api/users/:id          사용자 수정 (role, plan, name)
DELETE /api/users/:id          사용자 삭제
GET    /api/users/stats/overview  사용자 통계
```

### API Keys (Auth DB)
```
GET    /api/api-keys           API Key 목록
GET    /api/api-keys/:id/usage API Key 사용량
DELETE /api/api-keys/:id       API Key 삭제
GET    /api/api-keys/stats/overview  API Key 통계
```

### Products (Pulse DB)
```
GET    /api/products           상품 목록
GET    /api/products/:id       상품 상세
PATCH  /api/products/:id       상품 수정
DELETE /api/products/:id       상품 삭제
GET    /api/products/stats/overview  상품 통계
```

### Posts (Pulse DB)
```
GET    /api/posts              포스트 목록
GET    /api/posts/:id          포스트 상세
POST   /api/posts              포스트 생성
PATCH  /api/posts/:id          포스트 수정
DELETE /api/posts/:id          포스트 삭제
GET    /api/posts/stats/overview  포스트 통계
```

### Translations (i18n DB)
```
GET    /api/translations/languages  언어 목록
GET    /api/translations       번역 목록
POST   /api/translations       번역 추가
PATCH  /api/translations/:id   번역 수정
DELETE /api/translations/:id   번역 삭제
POST   /api/translations/cache/clear  캐시 초기화
GET    /api/translations/stats/overview  번역 통계
```

### Analytics
```
GET    /api/analytics/dashboard  전체 대시보드 통계
GET    /api/analytics/api-usage  API 사용량 트렌드
GET    /api/analytics/user-growth  사용자 성장 추이
```

---

## Database Bindings

| Binding | Database | 용도 |
|---------|----------|------|
| AUTH_DB | trend-hunter-auth-db | 사용자, API Key, 결제 |
| PULSE_DB | trend-hunter-db | 상품, 트렌드, 포스트 |
| I18N_DB | frenv-i18n-db | 번역 데이터 |
| CONFIG_KV | CONFIG_KV | 설정 캐시 |

---

## 페이지 구조

```
/                   대시보드 Overview
/login              로그인 (Auth Service로 리다이렉트)
/analytics          전체 서비스 분석
/users              사용자 관리
/api-keys           API Key 관리
/products           상품/트렌드 관리
/posts              블로그 포스트 관리
/translations       번역 관리
```

---

## 개발 명령어

```bash
cd /Users/ykkim/private/2025/code/frenv/admin

# 로컬 개발
npm run dev

# 타입 체크
npm run typecheck

# 배포 (GitHub Actions - push하면 자동 배포)
git push origin main

# 또는 수동 배포
npm run deploy:production

# 시크릿 설정 (Auth와 동일한 JWT_SECRET 사용)
wrangler secret put JWT_SECRET --env production
```

---

## 환경 변수 / Secrets

```
JWT_SECRET          Auth Service와 동일한 JWT 시크릿
```

---

## 주요 변경 시 동기화

이 서비스에 주요 변경이 있을 때 아래 파일도 업데이트:

- [ ] `/Users/ykkim/private/2025/code/frenv/.claude/CLAUDE.md` - Services 섹션에 Admin 추가
- [ ] `/Users/ykkim/private/2025/code/frenv/.claude/docs/api-reference.md` - Admin API 섹션

**변경 유형:**
- API 엔드포인트 추가/변경
- 페이지 추가
- 권한 로직 변경
