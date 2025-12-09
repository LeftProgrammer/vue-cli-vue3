<template>
  <aside class="app-sidebar">
    <el-menu
      class="el-menu-vertical"
      :default-active="activeMenu"
      router
      background-color="#014acb"
      text-color="#ffffff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="/homeIndex/index">
        <span>首页</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script>
export default {
  name: "LayoutSidebar",
  computed: {
    activeMenu() {
      return this.$route.path;
    },
  },
};
</script>

<style scoped lang="scss">
.app-sidebar {
  height: 100%;
  background: #014acb;
  color: #ffffff;
}

.el-menu-vertical {
  border-right: none;
  height: 100%;
}
</style>
