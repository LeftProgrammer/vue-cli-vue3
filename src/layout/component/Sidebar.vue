<template>
  <aside class="app-sidebar">
    <el-menu
      class="sideBar-menu"
      :default-active="activeMenu"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      router
    >
      <el-menu-item
        v-for="item in menuItems"
        :key="item.path"
        :index="item.path"
      >
        <span>{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script>
import variables from "@/styles/variables.module.scss";

export default {
  name: "LayoutSidebar",
  data() {
    return {
      menuItems: [{ path: "/homeIndex/index", title: "首页" }],
    };
  },
  computed: {
    activeMenu() {
      return this.$route.path;
    },
    variables() {
      return variables;
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

.sideBar-menu {
  border-right: none;
  height: 100%;
  padding-top: 18px;
}

.el-menu {
  font-size: 16px;
}
</style>
