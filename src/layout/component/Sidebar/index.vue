<template>
  <aside class="app-sidebar">
    <el-menu
      class="sideBar-menu"
      :default-active="activeMenu"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      unique-opened
      mode="vertical"
    >
      <SidebarItem
        v-for="route in menuRoutes"
        :key="route.permCode || route.id || route.value || route.name"
        :item="route"
      />
    </el-menu>
  </aside>
</template>

<script>
import { mapGetters } from "vuex";
import variables from "@/styles/variables.module.scss";
import SidebarItem from "./SidebarItem.vue";

export default {
  name: "LayoutSidebar",
  components: { SidebarItem },
  computed: {
    ...mapGetters(["menuRoutes"]),
    activeMenu() {
      const route = this.$route || {};
      const query = route.query || {};
      // 如果带有 permCode，则用它作为高亮 key，保持与原项目一致
      if (query.permCode) {
        return query.permCode;
      }
      return "";
    },
    variables() {
      return variables;
    },
  },
  created() {
    // 调试：查看侧边栏菜单树结构
    const summary = (this.menuRoutes || []).map((item) => ({
      code: item.permCode,
      title: item.permName || item.title || item.name,
      childrenCount: item.children ? item.children.length : 0,
    }));
    console.log("[sidebar] menuRoutes", this.menuRoutes);
    console.log("[sidebar] menuRoutes summary", summary);
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
