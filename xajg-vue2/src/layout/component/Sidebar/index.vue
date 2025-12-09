<template>
  <div class="">
    <el-menu
      class="sideBar-menu"
      :default-active="activeMenu"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      unique-opened
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      mode="vertical"
    >
      <sidebar-item
        class="sidebar-item"
        v-for="route in menuRoutes"
        :key="route.path"
        :item="route"
      />
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.module.scss";

export default {
  components: { SidebarItem },
  computed: {
    authMenuList() {
      console.log("authMenuList", this);
      const { menuRoutes } = this;
      const { $route } = this;
      let route = null;
      route = menuRoutes.find(
        (item) => $route.query.permCode.indexOf(item.permCode) > -1
      );
      this.$forceUpdate();
      if (route && Array.isArray(route.children)) {
        return route.children;
      }
      return [];
    },
    ...mapGetters(["sidebar", "menuRoutes"]),
    activeMenu() {
      const route = this.$route;
      const { query } = route;
      // if set path, the sidebar will highlight the path you set
      if (query && query.permCode) {
        return query.permCode;
      }
      return "";
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return false;
    },
    pageMenuRoutes() {
      let menus = this.menuRoutes;

      return menus;
    },
  },
  created() {
    console.log("侧边栏数据", this.menuRoutes);
  },
  watch: {
    $route(to, from) {},
  },
  methods: {
    isCurrentSubTheme(node) {
      try {
        // console.log("menuRoutes", this.menuRoutes);
        if (node.permCode === this.$route.query.permCode) {
          return true;
        } else {
          return node.children
            .filter((x) => x.permType === 0 || x.permType === 4)
            .some((i) => this.isCurrentSubTheme(i));
        }
      } catch (e) {
        return false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.el-menu {
  //background-image: url("~@/assets/img/system/leftNavi.png");
  //background-position: center center;
  //background-size: cover;
  //background-repeat: no-repeat;
  font-size: 18px;
  font-family: MicrosoftYaHei;
  /deep/ {
    .nest-menu {
      .el-menu-item {
        span {
          position: relative;
          &::before {
            content: " ";
            display: block;
            width: 6px;
            height: 6px;
            // background: #868686;
            border-radius: 50%;
            overflow: hidden;
            position: absolute;
            left: -10px;
            top: calc(50% - 3px);
            transition: background-color 0.3s;
          }
        }
        &.is-active,
        &:hover {
          span {
            &::before {
              // background: #1a74f0;
            }
          }
        }
      }
    }
  }
}

.sideBar-menu {
  padding-top: 18px;
}

/deep/ ul,
/deep/ li,
/deep/ a,
/deep/ div {
  background: none !important;
  // color: #4E5969 !important;
}
</style>
