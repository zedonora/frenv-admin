// Admin Dashboard 페이지

export function getLoginPage(): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin Login - Frenv</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
        }
        .container {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(244, 63, 94, 0.3);
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
        }
        .logo {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo h1 {
          background: linear-gradient(135deg, #f43f5e, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 28px;
        }
        .logo p { color: #94a3b8; font-size: 14px; margin-top: 8px; }
        .admin-badge {
          display: inline-block;
          background: rgba(244, 63, 94, 0.2);
          color: #f43f5e;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          margin-top: 12px;
        }
        .info {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #94a3b8;
        }
        button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #f43f5e, #6366f1);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <h1>Frenv Admin</h1>
          <p>Centralized Management Dashboard</p>
          <span class="admin-badge">ADMIN ONLY</span>
        </div>
        <div class="info">
          Admin 계정으로 auth.frenv.pe.kr에서 로그인한 후 접근하세요.
        </div>
        <button onclick="window.location.href='https://auth.frenv.pe.kr/login?redirect=https://admin.frenv.pe.kr&service=admin'">
          Login with Auth Service
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
      <title>Admin Dashboard - Frenv</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #0f172a;
          min-height: 100vh;
          color: white;
        }
        .layout { display: flex; min-height: 100vh; }

        /* 사이드바 */
        .sidebar {
          width: 240px;
          background: rgba(30, 41, 59, 0.8);
          border-right: 1px solid rgba(99, 102, 241, 0.2);
          padding: 20px;
          position: fixed;
          height: 100vh;
          overflow-y: auto;
        }
        .sidebar-logo {
          background: linear-gradient(135deg, #f43f5e, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .sidebar-badge {
          display: inline-block;
          background: rgba(244, 63, 94, 0.2);
          color: #f43f5e;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          margin-bottom: 30px;
        }
        .nav-section { margin-bottom: 24px; }
        .nav-section-title { color: #64748b; font-size: 11px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 1px; }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 4px;
          transition: all 0.2s;
        }
        .nav-item:hover { background: rgba(99, 102, 241, 0.1); color: white; }
        .nav-item.active { background: rgba(99, 102, 241, 0.2); color: #6366f1; }
        .nav-icon { font-size: 18px; }

        /* 메인 컨텐츠 */
        .main { flex: 1; margin-left: 240px; padding: 30px; }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .header h1 { font-size: 24px; }
        .btn-logout {
          background: rgba(244, 63, 94, 0.2);
          color: #f43f5e;
          border: 1px solid rgba(244, 63, 94, 0.3);
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
        }

        /* 카드 그리드 */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 12px;
          padding: 20px;
        }
        .stat-card h3 { color: #94a3b8; font-size: 13px; margin-bottom: 8px; }
        .stat-card .value { font-size: 32px; font-weight: bold; color: #6366f1; }
        .stat-card .change { font-size: 12px; color: #22c55e; margin-top: 4px; }

        /* 테이블 */
        .card {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .card-header h2 { font-size: 18px; }
        .table-wrapper { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase; padding: 12px; border-bottom: 1px solid rgba(99, 102, 241, 0.2); }
        td { padding: 12px; border-bottom: 1px solid rgba(30, 41, 59, 0.8); font-size: 14px; }
        tr:hover { background: rgba(99, 102, 241, 0.05); }

        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
        .badge-admin { background: rgba(244, 63, 94, 0.2); color: #f43f5e; }
        .badge-user { background: rgba(99, 102, 241, 0.2); color: #6366f1; }
        .badge-free { background: rgba(148, 163, 184, 0.2); color: #94a3b8; }
        .badge-pro { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .badge-enterprise { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
        .badge-published { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .badge-draft { background: rgba(234, 179, 8, 0.2); color: #eab308; }

        .btn {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          border: none;
        }
        .btn-primary { background: #6366f1; color: white; }
        .btn-danger { background: transparent; color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.3); }

        .loading { text-align: center; padding: 40px; color: #94a3b8; }
        .empty { text-align: center; padding: 40px; color: #64748b; }

        /* 검색/필터 */
        .filters {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        .filters input, .filters select {
          padding: 10px 14px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 8px;
          color: white;
          font-size: 14px;
        }
        .filters input:focus, .filters select:focus { outline: none; border-color: #6366f1; }
      </style>
    </head>
    <body>
      <div class="layout">
        <nav class="sidebar">
          <div class="sidebar-logo">Frenv Admin</div>
          <span class="sidebar-badge">ADMIN</span>

          <div class="nav-section">
            <div class="nav-section-title">Dashboard</div>
            <a href="/" class="nav-item ${section === 'overview' ? 'active' : ''}">
              <span class="nav-icon">📊</span> Overview
            </a>
            <a href="/analytics" class="nav-item ${section === 'analytics' ? 'active' : ''}">
              <span class="nav-icon">📈</span> Analytics
            </a>
          </div>

          <div class="nav-section">
            <div class="nav-section-title">Auth Service</div>
            <a href="/users" class="nav-item ${section === 'users' ? 'active' : ''}">
              <span class="nav-icon">👤</span> Users
            </a>
            <a href="/api-keys" class="nav-item ${section === 'api-keys' ? 'active' : ''}">
              <span class="nav-icon">🔑</span> API Keys
            </a>
          </div>

          <div class="nav-section">
            <div class="nav-section-title">Pulse Service</div>
            <a href="/products" class="nav-item ${section === 'products' ? 'active' : ''}">
              <span class="nav-icon">📦</span> Products
            </a>
            <a href="/posts" class="nav-item ${section === 'posts' ? 'active' : ''}">
              <span class="nav-icon">📝</span> Posts
            </a>
          </div>

          <div class="nav-section">
            <div class="nav-section-title">Config Service</div>
            <a href="/translations" class="nav-item ${section === 'translations' ? 'active' : ''}">
              <span class="nav-icon">🌐</span> Translations
            </a>
          </div>
        </nav>

        <main class="main">
          <div class="header">
            <h1 id="pageTitle">${getSectionTitle(section)}</h1>
            <button class="btn-logout" onclick="logout()">Logout</button>
          </div>

          <div id="content">
            <div class="loading">Loading...</div>
          </div>
        </main>
      </div>

      <script>
        const section = '${section}';

        async function init() {
          switch(section) {
            case 'overview': await loadOverview(); break;
            case 'analytics': await loadAnalytics(); break;
            case 'users': await loadUsers(); break;
            case 'api-keys': await loadApiKeys(); break;
            case 'products': await loadProducts(); break;
            case 'posts': await loadPosts(); break;
            case 'translations': await loadTranslations(); break;
          }
        }

        async function loadOverview() {
          const res = await fetch('/api/analytics/dashboard', { credentials: 'include' });
          if (!res.ok) { showError(); return; }
          const data = await res.json();

          document.getElementById('content').innerHTML = \`
            <div class="stats-grid">
              <div class="stat-card">
                <h3>Total Users</h3>
                <div class="value">\${data.users?.total_users || 0}</div>
                <div class="change">+\${data.users?.new_users_week || 0} this week</div>
              </div>
              <div class="stat-card">
                <h3>API Keys</h3>
                <div class="value">\${data.users?.total_api_keys || 0}</div>
              </div>
              <div class="stat-card">
                <h3>API Requests Today</h3>
                <div class="value">\${data.users?.api_requests_today || 0}</div>
              </div>
              <div class="stat-card">
                <h3>Products</h3>
                <div class="value">\${data.products?.total_products || 0}</div>
                <div class="change">\${data.products?.rising_products || 0} rising</div>
              </div>
              <div class="stat-card">
                <h3>Blog Posts</h3>
                <div class="value">\${data.posts?.total_posts || 0}</div>
                <div class="change">\${data.posts?.published_posts || 0} published</div>
              </div>
              <div class="stat-card">
                <h3>Translations</h3>
                <div class="value">\${data.i18n?.total_translations || 0}</div>
              </div>
            </div>
          \`;
        }

        async function loadAnalytics() {
          const res = await fetch('/api/analytics/api-usage?days=7', { credentials: 'include' });
          if (!res.ok) { showError(); return; }
          const data = await res.json();

          document.getElementById('content').innerHTML = \`
            <div class="card">
              <div class="card-header"><h2>API Usage (Last 7 Days)</h2></div>
              <div class="table-wrapper">
                <table>
                  <tr><th>Date</th><th>Requests</th></tr>
                  \${data.daily?.map(d => \`<tr><td>\${d.date}</td><td>\${d.count}</td></tr>\`).join('') || '<tr><td colspan="2" class="empty">No data</td></tr>'}
                </table>
              </div>
            </div>
            <div class="card">
              <div class="card-header"><h2>Top Endpoints</h2></div>
              <div class="table-wrapper">
                <table>
                  <tr><th>Endpoint</th><th>Requests</th></tr>
                  \${data.byEndpoint?.map(e => \`<tr><td>\${e.endpoint}</td><td>\${e.count}</td></tr>\`).join('') || '<tr><td colspan="2" class="empty">No data</td></tr>'}
                </table>
              </div>
            </div>
          \`;
        }

        async function loadUsers() {
          const res = await fetch('/api/users', { credentials: 'include' });
          if (!res.ok) { showError(); return; }
          const data = await res.json();

          document.getElementById('content').innerHTML = \`
            <div class="card">
              <div class="card-header">
                <h2>Users (\${data.total})</h2>
              </div>
              <div class="filters">
                <input type="text" placeholder="Search by email..." id="searchInput" onkeyup="searchUsers()">
              </div>
              <div class="table-wrapper">
                <table>
                  <tr><th>Email</th><th>Name</th><th>Role</th><th>Plan</th><th>Registered From</th><th>Created</th><th>Actions</th></tr>
                  \${data.users?.map(u => \`
                    <tr>
                      <td>\${u.email}</td>
                      <td>\${u.name || '-'}</td>
                      <td><span class="badge badge-\${u.role}">\${u.role}</span></td>
                      <td><span class="badge badge-\${u.plan}">\${u.plan}</span></td>
                      <td>\${u.registered_from || 'auth'}</td>
                      <td>\${new Date(u.created_at).toLocaleDateString()}</td>
                      <td><button class="btn btn-primary" onclick="editUser('\${u.id}')">Edit</button></td>
                    </tr>
                  \`).join('') || '<tr><td colspan="7" class="empty">No users</td></tr>'}
                </table>
              </div>
            </div>
          \`;
        }

        async function loadApiKeys() {
          const res = await fetch('/api/api-keys', { credentials: 'include' });
          if (!res.ok) { showError(); return; }
          const data = await res.json();

          document.getElementById('content').innerHTML = \`
            <div class="card">
              <div class="card-header"><h2>API Keys (\${data.total})</h2></div>
              <div class="table-wrapper">
                <table>
                  <tr><th>Key</th><th>Name</th><th>User</th><th>Plan</th><th>Last Used</th><th>Created</th><th>Actions</th></tr>
                  \${data.keys?.map(k => \`
                    <tr>
                      <td><code>\${k.key_prefix}...</code></td>
                      <td>\${k.name || '-'}</td>
                      <td>\${k.user_email}</td>
                      <td><span class="badge badge-\${k.user_plan}">\${k.user_plan}</span></td>
                      <td>\${k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : 'Never'}</td>
                      <td>\${new Date(k.created_at).toLocaleDateString()}</td>
                      <td>
                        <button class="btn btn-primary" onclick="viewUsage('\${k.id}')">Usage</button>
                        <button class="btn btn-danger" onclick="deleteKey('\${k.id}')">Delete</button>
                      </td>
                    </tr>
                  \`).join('') || '<tr><td colspan="7" class="empty">No API keys</td></tr>'}
                </table>
              </div>
            </div>
          \`;
        }

        async function loadProducts() {
          const res = await fetch('/api/products', { credentials: 'include' });
          if (!res.ok) { showError(); return; }
          const data = await res.json();

          document.getElementById('content').innerHTML = \`
            <div class="card">
              <div class="card-header"><h2>Products (\${data.total})</h2></div>
              <div class="filters">
                <input type="text" placeholder="Search..." id="searchInput">
                <select id="categoryFilter" onchange="filterProducts()">
                  <option value="">All Categories</option>
                  <option value="beauty">Beauty</option>
                  <option value="tech">Tech</option>
                  <option value="fun">Fun</option>
                </select>
              </div>
              <div class="table-wrapper">
                <table>
                  <tr><th>Rank</th><th>Name</th><th>Price</th><th>Category</th><th>Rising</th><th>Actions</th></tr>
                  \${data.products?.map(p => \`
                    <tr>
                      <td>#\${p.rank || '-'}</td>
                      <td>\${p.name}</td>
                      <td>\${p.price?.toLocaleString() || '-'} \${p.currency || ''}</td>
                      <td>\${p.category || '-'}</td>
                      <td>\${p.is_rising ? '🔥 ' + (p.rising_score || '') : '-'}</td>
                      <td>
                        <button class="btn btn-primary" onclick="editProduct('\${p.id}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteProduct('\${p.id}')">Delete</button>
                      </td>
                    </tr>
                  \`).join('') || '<tr><td colspan="6" class="empty">No products</td></tr>'}
                </table>
              </div>
            </div>
          \`;
        }

        async function loadPosts() {
          const res = await fetch('/api/posts', { credentials: 'include' });
          if (!res.ok) { showError(); return; }
          const data = await res.json();

          document.getElementById('content').innerHTML = \`
            <div class="card">
              <div class="card-header">
                <h2>Posts (\${data.total})</h2>
                <button class="btn btn-primary" onclick="createPost()">+ New Post</button>
              </div>
              <div class="table-wrapper">
                <table>
                  <tr><th>Title</th><th>Slug</th><th>Category</th><th>Status</th><th>Created</th><th>Actions</th></tr>
                  \${data.posts?.map(p => \`
                    <tr>
                      <td>\${p.title}</td>
                      <td><code>\${p.slug}</code></td>
                      <td>\${p.category || '-'}</td>
                      <td><span class="badge badge-\${p.status}">\${p.status}</span></td>
                      <td>\${new Date(p.created_at).toLocaleDateString()}</td>
                      <td>
                        <button class="btn btn-primary" onclick="editPost('\${p.id}')">Edit</button>
                        <button class="btn btn-danger" onclick="deletePost('\${p.id}')">Delete</button>
                      </td>
                    </tr>
                  \`).join('') || '<tr><td colspan="6" class="empty">No posts</td></tr>'}
                </table>
              </div>
            </div>
          \`;
        }

        async function loadTranslations() {
          const res = await fetch('/api/translations?lang=ko', { credentials: 'include' });
          if (!res.ok) { showError(); return; }
          const data = await res.json();

          document.getElementById('content').innerHTML = \`
            <div class="card">
              <div class="card-header">
                <h2>Translations</h2>
                <button class="btn btn-primary" onclick="clearCache()">Clear Cache</button>
              </div>
              <div class="filters">
                <select id="langFilter" onchange="filterTranslations()">
                  <option value="ko">Korean (ko)</option>
                  <option value="en">English (en)</option>
                  <option value="ja">Japanese (ja)</option>
                  <option value="zh">Chinese (zh)</option>
                </select>
                <select id="nsFilter" onchange="filterTranslations()">
                  <option value="">All Namespaces</option>
                  \${data.namespaces?.map(ns => \`<option value="\${ns}">\${ns}</option>\`).join('')}
                </select>
              </div>
              <div class="table-wrapper">
                <table>
                  <tr><th>Namespace</th><th>Key</th><th>Value</th><th>Source</th><th>Actions</th></tr>
                  \${data.translations?.slice(0, 50).map(t => \`
                    <tr>
                      <td>\${t.namespace}</td>
                      <td><code>\${t.key}</code></td>
                      <td>\${t.value?.substring(0, 50)}\${t.value?.length > 50 ? '...' : ''}</td>
                      <td>\${t.source}</td>
                      <td><button class="btn btn-primary" onclick="editTranslation('\${t.id}')">Edit</button></td>
                    </tr>
                  \`).join('') || '<tr><td colspan="5" class="empty">No translations</td></tr>'}
                </table>
              </div>
            </div>
          \`;
        }

        function showError() {
          document.getElementById('content').innerHTML = '<div class="empty">Failed to load data</div>';
        }

        async function logout() {
          await fetch('https://auth.frenv.pe.kr/auth/logout', { method: 'POST', credentials: 'include' });
          window.location.href = '/login';
        }

        // Placeholder functions for actions
        function editUser(id) { alert('Edit user: ' + id); }
        function viewUsage(id) { alert('View usage: ' + id); }
        function deleteKey(id) { if(confirm('Delete?')) fetch('/api/api-keys/'+id, {method:'DELETE',credentials:'include'}).then(() => loadApiKeys()); }
        function editProduct(id) { alert('Edit product: ' + id); }
        function deleteProduct(id) { if(confirm('Delete?')) fetch('/api/products/'+id, {method:'DELETE',credentials:'include'}).then(() => loadProducts()); }
        function createPost() { alert('Create post form'); }
        function editPost(id) { alert('Edit post: ' + id); }
        function deletePost(id) { if(confirm('Delete?')) fetch('/api/posts/'+id, {method:'DELETE',credentials:'include'}).then(() => loadPosts()); }
        function editTranslation(id) { alert('Edit translation: ' + id); }
        function clearCache() { fetch('/api/translations/cache/clear', {method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:'{}'}).then(() => alert('Cache cleared')); }
        function searchUsers() { /* implement */ }
        function filterProducts() { /* implement */ }
        function filterTranslations() { /* implement */ }

        init();
      </script>
    </body>
    </html>
  `;
}

function getSectionTitle(section: string): string {
  const titles: Record<string, string> = {
    'overview': 'Dashboard Overview',
    'analytics': 'Analytics',
    'users': 'User Management',
    'api-keys': 'API Key Management',
    'products': 'Product Management',
    'posts': 'Blog Post Management',
    'translations': 'Translation Management'
  };
  return titles[section] || 'Dashboard';
}
