# Admin Service

**Domain:** `admin.frenv.pe.kr`
**Type:** Cloudflare Worker
**Tech:** Hono + D1 (Multiple DBs) + KV + Supabase Proxy
**GitHub:** [zedonora/frenv-admin](https://github.com/zedonora/frenv-admin)
**Cloudflare Worker:** `frenv-admin-production`
**CI/CD:** GitHub Actions (push to main → auto deploy)

---

## 역할

통합 관리 대시보드로 **모든 frenv 서비스**를 중앙에서 관리합니다.

| 서비스 | 관리 항목 |
|--------|----------|
| **Auth** | 사용자, API Key, 결제 |
| **Pulse** | 상품/트렌드, 블로그 포스트 |
| **Config** | 테마, 언어, i18n 캐시 |
| **Common** | R2 파일 스토리지, 이미지 |
| **English** | 학습 통계, 프로필/권한 관리 (Supabase) |
| **Game** | 게임 미리보기, 정보 |
| **Invest** | 서비스 상태, 연결 정보 |

---

## 접근 권한

⚠️ **Admin role 사용자만 접근 가능**

Auth Service의 JWT 토큰을 사용하며, `role: 'admin'`인 사용자만 허용됩니다.

---

## 페이지 구조

```
/                   대시보드 Overview (전체 통계)
/login              로그인 (Auth Service로 리다이렉트)
/analytics          API 사용량 분석

# Auth 서비스
/users              사용자 관리
/api-keys           API Key 관리

# Pulse 서비스
/products           상품/트렌드 관리
/posts              블로그 포스트 관리

# Config 서비스
/config             테마/언어 설정 관리
/translations       번역 관리

# Common 서비스
/common             R2 파일 스토리지 관리

# English 서비스
/english            학습 관리 (통계, 프로필/권한)

# Game 서비스
/game               게임 미리보기, 정보

# Invest 서비스
/invest             투자 서비스 상태, 정보
```

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

### English (Supabase Proxy)
```
GET    /api/english/config     Supabase 설정 확인
POST   /api/english/config     Supabase 설정 저장
GET    /api/english/stats      학습 통계
GET    /api/english/vocab      어휘 목록
GET    /api/english/vocab/:id  어휘 상세
GET    /api/english/lessons    레슨 목록
GET    /api/english/lessons/:id  레슨 상세
GET    /api/english/study-logs 학습 기록
GET    /api/english/api-usage  API 사용량
GET    /api/english/leaderboard  리더보드
GET    /api/english/profiles   프로필 목록
GET    /api/english/profiles/:id  프로필 상세
PATCH  /api/english/profiles/:id  프로필 수정 (API 권한 등)
POST   /api/english/profiles/bulk-approve  일괄 권한 변경
```

### Analytics
```
GET    /api/analytics/dashboard  전체 대시보드 통계
GET    /api/analytics/api-usage  API 사용량 트렌드
GET    /api/analytics/user-growth  사용자 성장 추이
```

---

## Database & Storage Bindings

| Binding | Resource | 용도 |
|---------|----------|------|
| AUTH_DB | trend-hunter-auth-db (D1) | 사용자, API Key, 결제 |
| PULSE_DB | trend-hunter-db (D1) | 상품, 트렌드, 포스트 |
| I18N_DB | frenv-i18n-db (D1) | 번역 데이터 |
| CONFIG_KV | CONFIG_KV (KV) | 설정 캐시 |

### 외부 서비스 연동

| 서비스 | 연동 방식 |
|--------|----------|
| English (Supabase) | REST API Proxy (service_role key) |
| Common (R2) | API 호출 (common.frenv.pe.kr) |
| Config | API 호출 (config.frenv.pe.kr) |
| Invest | API 호출 (invest.frenv.pe.kr) |

---

## 개발 명령어

```bash
cd /Users/ykkim/private/2025/code/frenv/admin

# 로컬 개발
npm run dev

# 타입 체크
npm run typecheck

# 개발 환경 배포
npm run deploy

# 프로덕션 배포 (admin.frenv.pe.kr)
wrangler deploy --env production

# GitHub Actions (push하면 자동 배포)
git push origin main
```

---

## 환경 변수 / Secrets

```bash
# 필수 시크릿 설정
wrangler secret put JWT_SECRET --env production
wrangler secret put ENGLISH_SUPABASE_URL --env production
wrangler secret put ENGLISH_SUPABASE_SERVICE_KEY --env production
```

| Secret | 설명 |
|--------|------|
| `JWT_SECRET` | Auth Service와 동일한 JWT 시크릿 |
| `ENGLISH_SUPABASE_URL` | `https://xxx.supabase.co` |
| `ENGLISH_SUPABASE_SERVICE_KEY` | Supabase service_role JWT 키 |

---

## 디렉토리 구조

```
admin/
├── .claude/
│   └── CLAUDE.md           # 이 파일
├── src/
│   ├── index.ts            # 앱 엔트리, 라우팅
│   ├── middleware/
│   │   └── auth.ts         # JWT 인증 미들웨어
│   ├── routes/
│   │   ├── users.ts        # 사용자 API
│   │   ├── api-keys.ts     # API Key API
│   │   ├── products.ts     # 상품 API
│   │   ├── posts.ts        # 포스트 API
│   │   ├── translations.ts # 번역 API
│   │   ├── analytics.ts    # 분석 API
│   │   └── english.ts      # English Supabase Proxy
│   └── pages/
│       └── dashboard.ts    # 대시보드 HTML 렌더링
├── wrangler.toml           # Cloudflare 설정
└── package.json
```

---

## English 프로필/권한 관리

### API 권한 시스템
English 서비스의 AI 교정 등 API 소모 기능은 **관리자 승인**이 필요합니다.

- `api_access_approved: true` → AI 기능 사용 가능
- `api_access_approved: false` → AI 기능 차단

### 권한 관리 방법
1. admin.frenv.pe.kr/english 접속
2. "프로필/권한 관리" 탭 클릭
3. 사용자별 "승인됨/미승인" 버튼으로 토글
4. 또는 "전체 승인/해제" 버튼 사용

---

## 주요 변경 시 동기화

이 서비스에 주요 변경이 있을 때 아래 파일도 업데이트:

- [ ] `/Users/ykkim/private/2025/code/frenv/.claude/CLAUDE.md` - Services 섹션
- [ ] 각 서비스의 `.claude/CLAUDE.md` - Admin 연동 정보

**변경 유형:**
- API 엔드포인트 추가/변경
- 페이지 추가
- 권한 로직 변경
- 새 서비스 연동
