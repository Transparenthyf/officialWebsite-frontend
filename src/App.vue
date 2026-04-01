<template>
  <div class="app">
    <header class="header">
      <div class="container header-inner">
        <div class="brand">
          <div class="brand-title">企业官网</div>
          <div class="brand-sub">产品展示 · 视频 · 图文</div>
        </div>
        <nav class="nav">
          <RouterLink class="nav-link" to="/company">公司介绍</RouterLink>
          <RouterLink class="nav-link" to="/products">产品展示</RouterLink>
          <RouterLink class="nav-link" to="/contact">联系我们</RouterLink>
          <RouterLink class="nav-link admin" to="/admin">管理</RouterLink>
        </nav>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <RouterView />
      </div>
    </main>

    <footer class="footer">
      <div class="container footer-inner">
        <div>© {{ new Date().getFullYear() }} 企业官网</div>
        <div class="muted">内容与媒体由管理后台维护</div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  gap: 16px;
}
.brand-title {
  font-weight: 800;
  letter-spacing: 0.2px;
}
.brand-sub {
  font-size: 12px;
  color: #64748b;
}
.nav {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.nav-link {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid transparent;
  color: #0f172a;
}
.nav-link.router-link-active {
  background: #f1f5f9;
  border-color: #e2e8f0;
}
.nav-link.admin {
  border-color: #bae6fd;
  background: #ecfeff;
}
.main {
  padding: 22px 0 40px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 60%);
  min-height: calc(100vh - 120px);
}
.footer {
  border-top: 1px solid #e2e8f0;
  padding: 18px 0;
  color: #334155;
}
.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.muted {
  color: #64748b;
  font-size: 12px;
}
</style>
