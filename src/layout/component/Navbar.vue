<template>
  <header class="app-navbar">
    <div class="logo">雄安调蓄库工程智慧管理平台</div>
    <div class="navbar-right">
      <span class="navbar-user">欢迎使用</span>
    </div>
  </header>
</template>

<script>
export default {
  name: "LayoutNavbar",
};
</script>

<style scoped lang="scss">
.app-navbar {
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.logo {
  font-size: 18px;
  font-weight: 600;
  color: #014acb;
}

.navbar-right {
  font-size: 14px;
  color: #606266;
}
</style>
