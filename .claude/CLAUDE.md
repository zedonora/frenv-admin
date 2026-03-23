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
| **Webtoon** | 인스타툰 제작/운영 상태, 설정 안내 |

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

# Webtoon 서비스
/webtoon            웹툰 서비스 운영 정보
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


## Frontend Design Skills (GPT-5.4 "frontend-skill" Style)
프론트엔드 UI/UX 작업 시 다음의 최적화 규칙을 반드시 준수합니다 (news.hada.io/topic?id=27687 기반).

- **Working Model**: 코드 작성 전 비주얼 테시스(분위기/재질), 콘텐츠 플랜(Hero->Support), 인터랙션 테시스(2~3개의 모션) 기획.
- **Beautiful Defaults**: 타이포그래피와 컴포지션 중심. 풀블리드(Full-bleed) 히어로 선호, 가장 큰 텍스트는 브랜드/제품명, 카드 없는 레이아웃 기본.
- **Landing Pages 시퀀스**: Hero → Support → Detail → Final CTA.
- **Hero 규칙**: 단일 컴포지션, 브랜드 우선, Hero 영역 내 카드/통계 스트립/로고 클라우드 금지. 고정 헤더가 있다면 Hero와 합쳐서 초기 뷰포트 내에 렌더링.
- **Apps/관리자 화면**: Linear 앱 수준의 절제된 디자인. 차분한 서피스 위계, 강한 타이포와 여백, 적은 색상. 인터랙션 시에만 카드 사용. 마케팅 카피 금지(방향/상태/액션을 명확히 하는 유틸리티 카피 사용).
- **Imagery**: 내러티브가 있는 실제 현장 사진 선호(추상 그라디언트, 가짜 3D 지양). 첫 화면에 강력한 비주얼 앵커 필수.
- **Copy**: 제품 언어 사용. 카피를 30% 줄여서 더 낫다면 삭제. 헤드라인만으로도 페이지의 목적이 의미 전달되어야 함.
- **Motion**: 존재감과 위계를 위한 의도적 모션 최소 2~3개 구현 (히어로 진입 시퀀스, 스크롤 연동, 구조적 호버/리빌 트랜지션). 단순 노이즈 효과 금지.
- **Hard Rules (절대 규칙)**:
  1) 기본 카드 스타일 사용 금지 지양
  2) 섹션당 하나의 지배적 아이디어만 창출
  3) 폰트(서체) 2개 초과 금지
  4) 포인트(액센트) 컬러 1개 초과 금지
  5) 의미 없는 필러(Filler) 카피 금지
- **Litmus Checks (자가 진단)**: 1) 첫 화면에서 브랜드가 명확한가? 2) 텍스트를 스캔하는 데 몇 초면 충분한가? 3) 카드가 정말 필요한가? 4) 모션이 시각적 위계 구조를 개선했는가?


## GStack & Commercialization Strategy (Vibe Coding)
프로젝트 기획 및 코딩 시 반드시 다음 상업화 가이드를 숙지하고 gstack(28개 역할 스킬)을 활용하세요.

- **gstack 설치**: `git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack` (MIT License)
- **가이드맵 문서**: `frenv/docs/vibe-coding-playbook/05-commercialization-strategy.md`
- **frenv 스킬 활용(4단계)**: 기획(`/autoplan`, `/design-consultation`), 리뷰(`/review`, `/codex`), QA(`/qa`, `/cso`), 배포(`/ship`, `/land-and-deploy`) 등 각 단계에 맞춰 AI 전문가 역할을 소환하여 1인 창업의 속도와 완성도를 압축(efforts compression)합니다.
- **상품화 우선순위 (Tier 1~3)**: 
  - Tier 1 (`english`, `webtoon`, `invest`): Stripe/AdSense 연동 우선 개발 (즉각적 글로벌 수익 창출 목표).
  - Tier 2 (`blog`, `rise`, `game`, `portal`): 체류 시간 및 트래픽 극대화를 위한 구조와 SEO 해킹 우선.
  - Tier 3 (`admin`, `auth`, `common`, `config`, `pulse`, `cdn`, `sdk`, `log`): 제로 유지보수, 서버리스 안정성에만 몰두 (불필요한 기능 개발 엄금).
