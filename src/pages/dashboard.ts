// Admin Dashboard 페이지 - 한국어 버전

export function getLoginPage(): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>관리자 로그인 - Frenv</title>
      <link rel="icon" href="https://cdn.frenv.pe.kr/favicon.ico">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
        }
        .container {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 48px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .logo {
          text-align: center;
          margin-bottom: 32px;
        }
        .logo h1 {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .logo p { color: rgba(255,255,255,0.6); font-size: 14px; margin-top: 8px; }
        .admin-badge {
          display: inline-block;
          background: linear-gradient(135deg, #f43f5e, #ec4899);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          margin-top: 16px;
          letter-spacing: 1px;
        }
        .info {
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 24px;
          font-size: 14px;
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
        }
        button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <h1>Frenv Admin</h1>
          <p>통합 관리 대시보드</p>
          <span class="admin-badge">ADMIN ONLY</span>
        </div>
        <div class="info">
          관리자 권한이 필요합니다.<br>
          Auth 서비스에서 관리자 계정으로 로그인해주세요.
        </div>
        <button onclick="window.location.href='https://auth.frenv.pe.kr/login?service=admin&redirect=https://admin.frenv.pe.kr'">
          로그인하기
        </button>
      </div>
    </body>
    </html>
  `;
}

export function getDashboardPage(section: string = 'overview'): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${getSectionTitle(section)} - Frenv Admin</title>
      <link rel="icon" href="https://cdn.frenv.pe.kr/favicon.ico">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --bg-primary: #0a0a0f;
          --bg-secondary: #12121a;
          --bg-card: rgba(255, 255, 255, 0.02);
          --border-color: rgba(255, 255, 255, 0.06);
          --text-primary: #ffffff;
          --text-secondary: rgba(255, 255, 255, 0.6);
          --text-muted: rgba(255, 255, 255, 0.4);
          --accent-primary: #667eea;
          --accent-secondary: #764ba2;
          --accent-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
          --radius-sm: 8px;
          --radius-md: 12px;
          --radius-lg: 16px;
          --radius-xl: 24px;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--bg-primary);
          min-height: 100vh;
          color: var(--text-primary);
          line-height: 1.5;
        }

        .layout { display: flex; min-height: 100vh; }

        /* 사이드바 */
        .sidebar {
          width: 260px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          padding: 24px 16px;
          position: fixed;
          height: 100vh;
          overflow-y: auto;
        }

        .sidebar-header {
          padding: 0 12px 24px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 24px;
        }

        .sidebar-logo {
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .sidebar-badge {
          display: inline-block;
          background: linear-gradient(135deg, #f43f5e, #ec4899);
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 600;
          margin-top: 8px;
          letter-spacing: 0.5px;
        }

        .nav-section { margin-bottom: 28px; }

        .nav-section-title {
          color: var(--text-muted);
          font-size: 11px;
          text-transform: uppercase;
          margin-bottom: 12px;
          padding-left: 12px;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
          transition: all 0.2s ease;
        }

        .nav-item:hover {
          background: rgba(102, 126, 234, 0.1);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: var(--accent-gradient);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .nav-icon { font-size: 18px; }

        /* 메인 컨텐츠 */
        .main {
          flex: 1;
          margin-left: 260px;
          padding: 32px 40px;
          background: var(--bg-primary);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .header h1 {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .header-actions { display: flex; gap: 12px; align-items: center; }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: var(--accent-gradient);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }

        .user-name { font-size: 14px; font-weight: 500; }
        .user-role { font-size: 11px; color: var(--text-muted); }

        .btn-logout {
          background: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 10px 20px;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn-logout:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        /* 통계 카드 */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 24px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          border-color: rgba(102, 126, 234, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .stat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .stat-card h3 {
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 500;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          background: var(--accent-gradient);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .stat-card .value {
          font-size: 36px;
          font-weight: 700;
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-card .change {
          font-size: 12px;
          color: var(--success);
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .stat-card .change.negative { color: var(--danger); }

        /* 카드 */
        .card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 28px;
          margin-bottom: 24px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .card-header h2 {
          font-size: 18px;
          font-weight: 600;
        }

        /* 테이블 */
        .table-wrapper { overflow-x: auto; }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        th {
          text-align: left;
          color: var(--text-muted);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          font-weight: 600;
        }

        td {
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          font-size: 14px;
        }

        tr:hover td {
          background: rgba(102, 126, 234, 0.03);
        }

        tr:last-child td { border-bottom: none; }

        /* 뱃지 */
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .badge-superadmin {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }
        .badge-admin {
          background: rgba(244, 63, 94, 0.15);
          color: #fb7185;
        }
        .badge-user {
          background: rgba(102, 126, 234, 0.15);
          color: #818cf8;
        }
        .badge-free {
          background: rgba(148, 163, 184, 0.15);
          color: #94a3b8;
        }
        .badge-pro {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }
        .badge-enterprise {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
        }
        .badge-published {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }
        .badge-draft {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
        }

        /* 버튼 */
        .btn {
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: var(--accent-gradient);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
        }

        .btn-danger {
          background: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .btn-danger:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .loading {
          text-align: center;
          padding: 60px;
          color: var(--text-secondary);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty {
          text-align: center;
          padding: 60px;
          color: var(--text-muted);
        }

        /* 필터/검색 */
        .filters {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .filters input, .filters select {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 14px;
          min-width: 200px;
          transition: all 0.2s ease;
        }

        .filters input:focus, .filters select:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .filters input::placeholder {
          color: var(--text-muted);
        }

        /* 서비스 상태 카드 */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          margin-top: 24px;
        }

        .service-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s ease;
        }

        .service-card:hover {
          border-color: rgba(102, 126, 234, 0.3);
        }

        .service-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .service-info h4 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
        .service-info p { font-size: 12px; color: var(--text-muted); }

        .service-status {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--success);
        }

        .status-dot.offline { background: var(--danger); }

        /* 코드 스타일 */
        code {
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 8px;
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
        }

        /* 액션 버튼 그룹 */
        .action-buttons {
          display: flex;
          gap: 8px;
        }
      </style>
    </head>
    <body>
      <div class="layout">
        <nav class="sidebar">
          <div class="sidebar-header">
            <div class="sidebar-logo">Frenv Admin</div>
            <div class="sidebar-badge" id="userRoleBadge">ADMIN</div>
          </div>

          <div class="nav-section">
            <div class="nav-section-title">대시보드</div>
            <a href="/" class="nav-item ${section === 'overview' ? 'active' : ''}">
              <span class="nav-icon">📊</span> 개요
            </a>
            <a href="/analytics" class="nav-item ${section === 'analytics' ? 'active' : ''}">
              <span class="nav-icon">📈</span> 분석
            </a>
          </div>

          <div class="nav-section">
            <div class="nav-section-title">Auth 서비스</div>
            <a href="/users" class="nav-item ${section === 'users' ? 'active' : ''}">
              <span class="nav-icon">👤</span> 사용자 관리
            </a>
            <a href="/api-keys" class="nav-item ${section === 'api-keys' ? 'active' : ''}">
              <span class="nav-icon">🔑</span> API 키 관리
            </a>
          </div>

          <div class="nav-section">
            <div class="nav-section-title">Pulse 서비스</div>
            <a href="/products" class="nav-item ${section === 'products' ? 'active' : ''}">
              <span class="nav-icon">📦</span> 상품 관리
            </a>
            <a href="/posts" class="nav-item ${section === 'posts' ? 'active' : ''}">
              <span class="nav-icon">📝</span> 포스트 관리
            </a>
          </div>

          <div class="nav-section">
            <div class="nav-section-title">Config 서비스</div>
            <a href="/translations" class="nav-item ${section === 'translations' ? 'active' : ''}">
              <span class="nav-icon">🌐</span> 번역 관리
            </a>
          </div>

          <div class="nav-section">
            <div class="nav-section-title">English 서비스</div>
            <a href="/english" class="nav-item ${section === 'english' ? 'active' : ''}">
              <span class="nav-icon">📚</span> 학습 관리
            </a>
          </div>
        </nav>

        <main class="main">
          <div class="header">
            <h1>${getSectionTitle(section)}</h1>
            <div class="header-actions">
              <div class="user-info">
                <div class="user-avatar" id="userAvatar">A</div>
                <div>
                  <div class="user-name" id="userName">관리자</div>
                  <div class="user-role" id="userEmail">admin@frenv.pe.kr</div>
                </div>
              </div>
              <button class="btn-logout" onclick="logout()">로그아웃</button>
            </div>
          </div>

          <div id="content">
            <div class="loading">
              <div class="loading-spinner"></div>
              <p>데이터를 불러오는 중...</p>
            </div>
          </div>
        </main>
      </div>

      <script>
        const section = '${section}';
        let currentUser = null;

        async function init() {
          // 현재 사용자 정보 로드
          try {
            const userRes = await fetch('https://auth.frenv.pe.kr/auth/me', { credentials: 'include' });
            if (userRes.ok) {
              const userData = await userRes.json();
              currentUser = userData.user;
              updateUserInfo();
            }
          } catch (e) {
            console.log('사용자 정보 로드 실패');
          }

          // 섹션별 데이터 로드
          switch(section) {
            case 'overview': await loadOverview(); break;
            case 'analytics': await loadAnalytics(); break;
            case 'users': await loadUsers(); break;
            case 'api-keys': await loadApiKeys(); break;
            case 'products': await loadProducts(); break;
            case 'posts': await loadPosts(); break;
            case 'translations': await loadTranslations(); break;
            case 'english': await loadEnglish(); break;
          }
        }

        function updateUserInfo() {
          if (!currentUser) return;
          document.getElementById('userName').textContent = currentUser.name || '관리자';
          document.getElementById('userEmail').textContent = currentUser.email;
          document.getElementById('userAvatar').textContent = (currentUser.name || currentUser.email)[0].toUpperCase();
          document.getElementById('userRoleBadge').textContent = currentUser.role?.toUpperCase() || 'ADMIN';
        }

        async function loadOverview() {
          try {
            const res = await fetch('/api/analytics/dashboard', { credentials: 'include' });
            if (!res.ok) throw new Error('API 오류');
            const data = await res.json();

            document.getElementById('content').innerHTML = \`
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-card-header">
                    <h3>전체 사용자</h3>
                    <div class="stat-icon">👥</div>
                  </div>
                  <div class="value">\${data.users?.total_users || 0}</div>
                  <div class="change">+\${data.users?.new_users_week || 0} 이번 주</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-header">
                    <h3>API 키</h3>
                    <div class="stat-icon">🔑</div>
                  </div>
                  <div class="value">\${data.users?.total_api_keys || 0}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-header">
                    <h3>오늘 API 요청</h3>
                    <div class="stat-icon">📡</div>
                  </div>
                  <div class="value">\${data.users?.api_requests_today || 0}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-header">
                    <h3>등록된 상품</h3>
                    <div class="stat-icon">📦</div>
                  </div>
                  <div class="value">\${data.products?.total_products || 0}</div>
                  <div class="change">🔥 \${data.products?.rising_products || 0} 급상승</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-header">
                    <h3>블로그 포스트</h3>
                    <div class="stat-icon">📝</div>
                  </div>
                  <div class="value">\${data.posts?.total_posts || 0}</div>
                  <div class="change">\${data.posts?.published_posts || 0} 게시됨</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-header">
                    <h3>번역 항목</h3>
                    <div class="stat-icon">🌐</div>
                  </div>
                  <div class="value">\${data.i18n?.total_translations || 0}</div>
                </div>
              </div>

              <div class="card">
                <div class="card-header">
                  <h2>서비스 현황</h2>
                </div>
                <div class="services-grid">
                  <div class="service-card">
                    <div class="service-icon" style="background: linear-gradient(135deg, #667eea, #764ba2);">🔐</div>
                    <div class="service-info">
                      <h4>Auth Service</h4>
                      <p>auth.frenv.pe.kr</p>
                    </div>
                    <div class="service-status">
                      <span class="status-dot"></span>
                      정상
                    </div>
                  </div>
                  <div class="service-card">
                    <div class="service-icon" style="background: linear-gradient(135deg, #f43f5e, #ec4899);">📊</div>
                    <div class="service-info">
                      <h4>Pulse API</h4>
                      <p>pulse.frenv.pe.kr</p>
                    </div>
                    <div class="service-status">
                      <span class="status-dot"></span>
                      정상
                    </div>
                  </div>
                  <div class="service-card">
                    <div class="service-icon" style="background: linear-gradient(135deg, #10b981, #059669);">⚙️</div>
                    <div class="service-info">
                      <h4>Config Service</h4>
                      <p>config.frenv.pe.kr</p>
                    </div>
                    <div class="service-status">
                      <span class="status-dot"></span>
                      정상
                    </div>
                  </div>
                  <div class="service-card">
                    <div class="service-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">🚀</div>
                    <div class="service-info">
                      <h4>Rise</h4>
                      <p>rise.frenv.pe.kr</p>
                    </div>
                    <div class="service-status">
                      <span class="status-dot"></span>
                      정상
                    </div>
                  </div>
                  <div class="service-card">
                    <div class="service-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">📰</div>
                    <div class="service-info">
                      <h4>Blog</h4>
                      <p>blog.frenv.pe.kr</p>
                    </div>
                    <div class="service-status">
                      <span class="status-dot"></span>
                      정상
                    </div>
                  </div>
                  <div class="service-card">
                    <div class="service-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">📁</div>
                    <div class="service-info">
                      <h4>CDN</h4>
                      <p>cdn.frenv.pe.kr</p>
                    </div>
                    <div class="service-status">
                      <span class="status-dot"></span>
                      정상
                    </div>
                  </div>
                  <div class="service-card">
                    <div class="service-icon" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">📚</div>
                    <div class="service-info">
                      <h4>English</h4>
                      <p>english.frenv.pe.kr</p>
                    </div>
                    <div class="service-status">
                      <span class="status-dot"></span>
                      정상
                    </div>
                  </div>
                  <div class="service-card">
                    <div class="service-icon" style="background: linear-gradient(135deg, #84cc16, #65a30d);">🎮</div>
                    <div class="service-info">
                      <h4>Game</h4>
                      <p>game.frenv.pe.kr</p>
                    </div>
                    <div class="service-status">
                      <span class="status-dot"></span>
                      정상
                    </div>
                  </div>
                  <div class="service-card">
                    <div class="service-icon" style="background: linear-gradient(135deg, #eab308, #ca8a04);">💰</div>
                    <div class="service-info">
                      <h4>Invest</h4>
                      <p>invest.frenv.pe.kr</p>
                    </div>
                    <div class="service-status">
                      <span class="status-dot offline"></span>
                      개발 중
                    </div>
                  </div>
                </div>
              </div>
            \`;
          } catch (e) {
            showError('대시보드 데이터를 불러오지 못했습니다.');
          }
        }

        async function loadAnalytics() {
          try {
            const res = await fetch('/api/analytics/api-usage?days=7', { credentials: 'include' });
            if (!res.ok) throw new Error('API 오류');
            const data = await res.json();

            document.getElementById('content').innerHTML = \`
              <div class="card">
                <div class="card-header"><h2>API 사용량 (최근 7일)</h2></div>
                <div class="table-wrapper">
                  <table>
                    <tr><th>날짜</th><th>요청 수</th></tr>
                    \${data.daily?.map(d => \`<tr><td>\${d.date}</td><td>\${d.count.toLocaleString()}</td></tr>\`).join('') || '<tr><td colspan="2" class="empty">데이터 없음</td></tr>'}
                  </table>
                </div>
              </div>
              <div class="card">
                <div class="card-header"><h2>인기 엔드포인트</h2></div>
                <div class="table-wrapper">
                  <table>
                    <tr><th>엔드포인트</th><th>요청 수</th></tr>
                    \${data.byEndpoint?.map(e => \`<tr><td><code>\${e.endpoint}</code></td><td>\${e.count.toLocaleString()}</td></tr>\`).join('') || '<tr><td colspan="2" class="empty">데이터 없음</td></tr>'}
                  </table>
                </div>
              </div>
            \`;
          } catch (e) {
            showError('분석 데이터를 불러오지 못했습니다.');
          }
        }

        async function loadUsers() {
          try {
            const res = await fetch('/api/users', { credentials: 'include' });
            if (!res.ok) throw new Error('API 오류');
            const data = await res.json();

            document.getElementById('content').innerHTML = \`
              <div class="card">
                <div class="card-header">
                  <h2>사용자 목록 (\${data.total}명)</h2>
                </div>
                <div class="filters">
                  <input type="text" placeholder="이메일 또는 이름으로 검색..." id="searchInput">
                </div>
                <div class="table-wrapper">
                  <table>
                    <tr><th>이메일</th><th>이름</th><th>권한</th><th>플랜</th><th>가입 경로</th><th>가입일</th><th>관리</th></tr>
                    \${data.users?.map(u => \`
                      <tr>
                        <td>\${u.email}</td>
                        <td>\${u.name || '-'}</td>
                        <td><span class="badge badge-\${u.role}">\${u.role}</span></td>
                        <td><span class="badge badge-\${u.plan}">\${u.plan}</span></td>
                        <td>\${u.registered_from || 'auth'}</td>
                        <td>\${new Date(u.created_at).toLocaleDateString('ko-KR')}</td>
                        <td>
                          <div class="action-buttons">
                            <button class="btn btn-secondary" onclick="editUser('\${u.id}')">수정</button>
                          </div>
                        </td>
                      </tr>
                    \`).join('') || '<tr><td colspan="7" class="empty">사용자가 없습니다</td></tr>'}
                  </table>
                </div>
              </div>
            \`;
          } catch (e) {
            showError('사용자 목록을 불러오지 못했습니다.');
          }
        }

        async function loadApiKeys() {
          try {
            const res = await fetch('/api/api-keys', { credentials: 'include' });
            if (!res.ok) throw new Error('API 오류');
            const data = await res.json();

            document.getElementById('content').innerHTML = \`
              <div class="card">
                <div class="card-header"><h2>API 키 목록 (\${data.total}개)</h2></div>
                <div class="table-wrapper">
                  <table>
                    <tr><th>키</th><th>이름</th><th>사용자</th><th>플랜</th><th>마지막 사용</th><th>생성일</th><th>관리</th></tr>
                    \${data.keys?.map(k => \`
                      <tr>
                        <td><code>\${k.key_prefix}...</code></td>
                        <td>\${k.name || '-'}</td>
                        <td>\${k.user_email}</td>
                        <td><span class="badge badge-\${k.user_plan}">\${k.user_plan}</span></td>
                        <td>\${k.last_used_at ? new Date(k.last_used_at).toLocaleDateString('ko-KR') : '사용 안함'}</td>
                        <td>\${new Date(k.created_at).toLocaleDateString('ko-KR')}</td>
                        <td>
                          <div class="action-buttons">
                            <button class="btn btn-secondary" onclick="viewUsage('\${k.id}')">사용량</button>
                            <button class="btn btn-danger" onclick="deleteKey('\${k.id}')">삭제</button>
                          </div>
                        </td>
                      </tr>
                    \`).join('') || '<tr><td colspan="7" class="empty">API 키가 없습니다</td></tr>'}
                  </table>
                </div>
              </div>
            \`;
          } catch (e) {
            showError('API 키 목록을 불러오지 못했습니다.');
          }
        }

        async function loadProducts() {
          try {
            const res = await fetch('/api/products', { credentials: 'include' });
            if (!res.ok) throw new Error('API 오류');
            const data = await res.json();

            document.getElementById('content').innerHTML = \`
              <div class="card">
                <div class="card-header"><h2>상품 목록 (\${data.total}개)</h2></div>
                <div class="filters">
                  <input type="text" placeholder="상품명으로 검색..." id="searchInput">
                  <select id="categoryFilter">
                    <option value="">전체 카테고리</option>
                    <option value="beauty">뷰티</option>
                    <option value="tech">테크</option>
                    <option value="fun">재미</option>
                  </select>
                </div>
                <div class="table-wrapper">
                  <table>
                    <tr><th>순위</th><th>상품명</th><th>가격</th><th>카테고리</th><th>급상승</th><th>관리</th></tr>
                    \${data.products?.map(p => \`
                      <tr>
                        <td>#\${p.rank || '-'}</td>
                        <td>\${p.name}</td>
                        <td>\${p.price?.toLocaleString() || '-'} \${p.currency || ''}</td>
                        <td>\${p.category || '-'}</td>
                        <td>\${p.is_rising ? '🔥 ' + (p.rising_score || '') : '-'}</td>
                        <td>
                          <div class="action-buttons">
                            <button class="btn btn-secondary" onclick="editProduct('\${p.id}')">수정</button>
                            <button class="btn btn-danger" onclick="deleteProduct('\${p.id}')">삭제</button>
                          </div>
                        </td>
                      </tr>
                    \`).join('') || '<tr><td colspan="6" class="empty">상품이 없습니다</td></tr>'}
                  </table>
                </div>
              </div>
            \`;
          } catch (e) {
            showError('상품 목록을 불러오지 못했습니다.');
          }
        }

        async function loadPosts() {
          try {
            const res = await fetch('/api/posts', { credentials: 'include' });
            if (!res.ok) throw new Error('API 오류');
            const data = await res.json();

            document.getElementById('content').innerHTML = \`
              <div class="card">
                <div class="card-header">
                  <h2>포스트 목록 (\${data.total}개)</h2>
                  <button class="btn btn-primary" onclick="createPost()">+ 새 포스트</button>
                </div>
                <div class="table-wrapper">
                  <table>
                    <tr><th>제목</th><th>슬러그</th><th>카테고리</th><th>상태</th><th>생성일</th><th>관리</th></tr>
                    \${data.posts?.map(p => \`
                      <tr>
                        <td>\${p.title}</td>
                        <td><code>\${p.slug}</code></td>
                        <td>\${p.category || '-'}</td>
                        <td><span class="badge badge-\${p.status}">\${p.status === 'published' ? '게시됨' : '임시저장'}</span></td>
                        <td>\${new Date(p.created_at).toLocaleDateString('ko-KR')}</td>
                        <td>
                          <div class="action-buttons">
                            <button class="btn btn-secondary" onclick="editPost('\${p.id}')">수정</button>
                            <button class="btn btn-danger" onclick="deletePost('\${p.id}')">삭제</button>
                          </div>
                        </td>
                      </tr>
                    \`).join('') || '<tr><td colspan="6" class="empty">포스트가 없습니다</td></tr>'}
                  </table>
                </div>
              </div>
            \`;
          } catch (e) {
            showError('포스트 목록을 불러오지 못했습니다.');
          }
        }

        async function loadTranslations() {
          try {
            const res = await fetch('/api/translations?lang=ko', { credentials: 'include' });
            if (!res.ok) throw new Error('API 오류');
            const data = await res.json();

            document.getElementById('content').innerHTML = \`
              <div class="card">
                <div class="card-header">
                  <h2>번역 관리</h2>
                  <button class="btn btn-secondary" onclick="clearCache()">캐시 초기화</button>
                </div>
                <div class="filters">
                  <select id="langFilter" onchange="filterTranslations()">
                    <option value="ko">한국어 (ko)</option>
                    <option value="en">English (en)</option>
                    <option value="ja">日本語 (ja)</option>
                    <option value="zh">中文 (zh)</option>
                  </select>
                  <select id="nsFilter" onchange="filterTranslations()">
                    <option value="">전체 네임스페이스</option>
                    \${data.namespaces?.map(ns => \`<option value="\${ns}">\${ns}</option>\`).join('')}
                  </select>
                </div>
                <div class="table-wrapper">
                  <table>
                    <tr><th>네임스페이스</th><th>키</th><th>값</th><th>소스</th><th>관리</th></tr>
                    \${data.translations?.slice(0, 50).map(t => \`
                      <tr>
                        <td>\${t.namespace}</td>
                        <td><code>\${t.key}</code></td>
                        <td>\${t.value?.substring(0, 50)}\${t.value?.length > 50 ? '...' : ''}</td>
                        <td>\${t.source}</td>
                        <td><button class="btn btn-secondary" onclick="editTranslation('\${t.id}')">수정</button></td>
                      </tr>
                    \`).join('') || '<tr><td colspan="5" class="empty">번역 항목이 없습니다</td></tr>'}
                  </table>
                </div>
              </div>
            \`;
          } catch (e) {
            showError('번역 목록을 불러오지 못했습니다.');
          }
        }

        function showError(message) {
          document.getElementById('content').innerHTML = \`
            <div class="card">
              <div class="empty">
                <p style="font-size: 48px; margin-bottom: 16px;">😕</p>
                <p>\${message}</p>
                <button class="btn btn-primary" style="margin-top: 16px;" onclick="location.reload()">다시 시도</button>
              </div>
            </div>
          \`;
        }

        async function logout() {
          await fetch('https://auth.frenv.pe.kr/auth/logout', { method: 'POST', credentials: 'include' });
          window.location.href = '/login';
        }

        // 액션 함수들
        async function editUser(id) {
          const action = prompt('변경할 값을 입력하세요:\\n- 권한: admin 또는 user\\n- 플랜: free, pro, enterprise\\n- 이름: 새 이름');
          if (!action) return;

          let body = {};
          if (action === 'admin' || action === 'user') {
            body = { role: action };
          } else if (action === 'free' || action === 'pro' || action === 'enterprise') {
            body = { plan: action };
          } else {
            body = { name: action };
          }

          const res = await fetch('/api/users/' + id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body)
          });

          if (res.ok) {
            alert('수정되었습니다!');
            loadUsers();
          } else {
            const data = await res.json();
            alert(data.error || '수정에 실패했습니다.');
          }
        }

        function viewUsage(id) { alert('API 키 사용량 조회: ' + id); }

        async function deleteKey(id) {
          if (!confirm('정말 이 API 키를 삭제하시겠습니까?')) return;
          await fetch('/api/api-keys/' + id, { method: 'DELETE', credentials: 'include' });
          loadApiKeys();
        }

        function editProduct(id) { alert('상품 수정: ' + id); }

        async function deleteProduct(id) {
          if (!confirm('정말 이 상품을 삭제하시겠습니까?')) return;
          await fetch('/api/products/' + id, { method: 'DELETE', credentials: 'include' });
          loadProducts();
        }

        function createPost() { alert('새 포스트 작성 폼'); }
        function editPost(id) { alert('포스트 수정: ' + id); }

        async function deletePost(id) {
          if (!confirm('정말 이 포스트를 삭제하시겠습니까?')) return;
          await fetch('/api/posts/' + id, { method: 'DELETE', credentials: 'include' });
          loadPosts();
        }

        function editTranslation(id) { alert('번역 수정: ' + id); }

        async function clearCache() {
          await fetch('/api/translations/cache/clear', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: '{}'
          });
          alert('캐시가 초기화되었습니다!');
        }

        function filterTranslations() { /* 구현 예정 */ }

        async function loadEnglish() {
          // 먼저 설정 확인
          const configRes = await fetch('/api/english/config', { credentials: 'include' });
          const configData = await configRes.json();

          if (!configData.configured) {
            document.getElementById('content').innerHTML = \`
              <div class="card">
                <div class="card-header"><h2>Supabase 연동 설정</h2></div>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">
                  English 서비스는 Supabase를 사용합니다. 관리를 위해 Supabase 설정이 필요합니다.
                </p>
                <div class="filters" style="flex-direction: column; gap: 16px;">
                  <input type="text" id="supabaseUrl" placeholder="Supabase URL (예: https://xxx.supabase.co)" style="width: 100%;">
                  <input type="password" id="supabaseKey" placeholder="Supabase Service Role Key" style="width: 100%;">
                  <button class="btn btn-primary" onclick="saveEnglishConfig()">설정 저장</button>
                </div>
              </div>
            \`;
            return;
          }

          try {
            // 통계 로드
            const [statsRes, lessonsRes, vocabRes, logsRes] = await Promise.all([
              fetch('/api/english/stats', { credentials: 'include' }),
              fetch('/api/english/lessons?limit=10', { credentials: 'include' }),
              fetch('/api/english/vocab?limit=10', { credentials: 'include' }),
              fetch('/api/english/study-logs?limit=20', { credentials: 'include' })
            ]);

            const [stats, lessons, vocab, logs] = await Promise.all([
              statsRes.json(),
              lessonsRes.json(),
              vocabRes.json(),
              logsRes.json()
            ]);

            document.getElementById('content').innerHTML = \`
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-card-header">
                    <h3>총 어휘</h3>
                    <div class="stat-icon">📝</div>
                  </div>
                  <div class="value">\${stats.totalVocab || 0}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-header">
                    <h3>레슨 수</h3>
                    <div class="stat-icon">📖</div>
                  </div>
                  <div class="value">\${stats.totalLessons || 0}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-header">
                    <h3>학습 기록</h3>
                    <div class="stat-icon">📊</div>
                  </div>
                  <div class="value">\${stats.totalStudyLogs || 0}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-header">
                    <h3>API 호출</h3>
                    <div class="stat-icon">🤖</div>
                  </div>
                  <div class="value">\${stats.totalApiCalls || 0}</div>
                </div>
              </div>

              <div class="card">
                <div class="card-header">
                  <h2>최근 레슨 (AI 생성)</h2>
                  <a href="https://english.frenv.pe.kr" target="_blank" class="btn btn-secondary">앱 열기</a>
                </div>
                <div class="table-wrapper">
                  <table>
                    <tr><th>날짜</th><th>주제 (영어)</th><th>주제 (한국어)</th><th>표현 수</th></tr>
                    \${lessons.lessons?.map(l => \`
                      <tr>
                        <td>\${l.date}</td>
                        <td>\${l.topic_en || '-'}</td>
                        <td>\${l.topic_ko || '-'}</td>
                        <td>\${Array.isArray(l.expressions) ? l.expressions.length : 0}개</td>
                      </tr>
                    \`).join('') || '<tr><td colspan="4" class="empty">레슨이 없습니다</td></tr>'}
                  </table>
                </div>
              </div>

              <div class="card">
                <div class="card-header"><h2>어휘 카드 (SRS)</h2></div>
                <div class="table-wrapper">
                  <table>
                    <tr><th>단어</th><th>뜻</th><th>복습 주기</th><th>다음 복습</th><th>난이도</th></tr>
                    \${vocab.vocab?.map(v => \`
                      <tr>
                        <td><strong>\${v.word}</strong></td>
                        <td>\${v.definition || '-'}</td>
                        <td>\${v.interval || 0}일</td>
                        <td>\${v.next_review_date ? new Date(v.next_review_date).toLocaleDateString('ko-KR') : '-'}</td>
                        <td>\${(v.easiness_factor || 2.5).toFixed(1)}</td>
                      </tr>
                    \`).join('') || '<tr><td colspan="5" class="empty">어휘가 없습니다</td></tr>'}
                  </table>
                </div>
              </div>

              <div class="card">
                <div class="card-header"><h2>최근 학습 활동</h2></div>
                <div class="table-wrapper">
                  <table>
                    <tr><th>유형</th><th>내용</th><th>시간</th></tr>
                    \${logs.logs?.map(l => \`
                      <tr>
                        <td><span class="badge badge-\${l.activity_type === 'correction' ? 'published' : 'draft'}">\${
                          l.activity_type === 'correction' ? '교정' :
                          l.activity_type === 'review' ? '복습' :
                          l.activity_type === 'voice_practice' ? '음성' : l.activity_type
                        }</span></td>
                        <td>\${l.content?.substring(0, 60) || '-'}\${l.content?.length > 60 ? '...' : ''}</td>
                        <td>\${l.created_at ? new Date(l.created_at).toLocaleString('ko-KR') : '-'}</td>
                      </tr>
                    \`).join('') || '<tr><td colspan="3" class="empty">학습 기록이 없습니다</td></tr>'}
                  </table>
                </div>
              </div>

              <div class="card" style="border-color: rgba(6, 182, 212, 0.3);">
                <div class="card-header"><h2>🚀 개선 아이디어</h2></div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                  <div style="padding: 16px; background: rgba(6, 182, 212, 0.1); border-radius: 12px;">
                    <h4 style="margin-bottom: 8px;">👶 멀티 유저 지원</h4>
                    <p style="color: var(--text-secondary); font-size: 13px;">아이별 프로필 생성, 진도 분리 관리</p>
                  </div>
                  <div style="padding: 16px; background: rgba(168, 85, 247, 0.1); border-radius: 12px;">
                    <h4 style="margin-bottom: 8px;">📈 학습 대시보드</h4>
                    <p style="color: var(--text-secondary); font-size: 13px;">주간/월간 학습 리포트, 취약점 분석</p>
                  </div>
                  <div style="padding: 16px; background: rgba(245, 158, 11, 0.1); border-radius: 12px;">
                    <h4 style="margin-bottom: 8px;">🏆 게이미피케이션</h4>
                    <p style="color: var(--text-secondary); font-size: 13px;">뱃지, 스트릭, 레벨 시스템 추가</p>
                  </div>
                  <div style="padding: 16px; background: rgba(16, 185, 129, 0.1); border-radius: 12px;">
                    <h4 style="margin-bottom: 8px;">🎵 발음 평가</h4>
                    <p style="color: var(--text-secondary); font-size: 13px;">Web Speech API 점수화, 피드백</p>
                  </div>
                  <div style="padding: 16px; background: rgba(244, 63, 94, 0.1); border-radius: 12px;">
                    <h4 style="margin-bottom: 8px;">📚 커리큘럼 관리</h4>
                    <p style="color: var(--text-secondary); font-size: 13px;">난이도별 레슨 구성, 학습 경로</p>
                  </div>
                  <div style="padding: 16px; background: rgba(59, 130, 246, 0.1); border-radius: 12px;">
                    <h4 style="margin-bottom: 8px;">📱 오프라인 모드</h4>
                    <p style="color: var(--text-secondary); font-size: 13px;">레슨 다운로드, 인터넷 없이 학습</p>
                  </div>
                </div>
              </div>
            \`;
          } catch (e) {
            showError('English 데이터를 불러오지 못했습니다.');
          }
        }

        async function saveEnglishConfig() {
          const url = document.getElementById('supabaseUrl').value;
          const key = document.getElementById('supabaseKey').value;

          if (!url || !key) {
            alert('URL과 Service Key를 모두 입력하세요.');
            return;
          }

          const res = await fetch('/api/english/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ supabaseUrl: url, supabaseServiceKey: key })
          });

          if (res.ok) {
            alert('설정이 저장되었습니다!');
            loadEnglish();
          } else {
            const data = await res.json();
            alert(data.error || '저장에 실패했습니다.');
          }
        }

        init();
      </script>
    </body>
    </html>
  `;
}

function getSectionTitle(section: string): string {
  const titles: Record<string, string> = {
    'overview': '대시보드 개요',
    'analytics': 'API 분석',
    'users': '사용자 관리',
    'api-keys': 'API 키 관리',
    'products': '상품 관리',
    'posts': '포스트 관리',
    'translations': '번역 관리',
    'english': 'English 학습 관리'
  };
  return titles[section] || '대시보드';
}
