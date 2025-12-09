<template>
  <div :class="getClass(item)" :data-title="item?.businessIds">
    <template v-if="itemVisible">
      <app-link :to="resolvePath(item)">
        <el-menu-item
          :index="item.permCode"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :isRoot="item.permPid === '1'"
            :title="item.title"
            :icon="item.permIcon"
            :todoCount="item.todoCount"
          />
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu v-else ref="subMenu" :index="item.permCode" popper-append-to-body>
      <template slot="title">
        <item
          :isRoot="item.permPid === '1'"
          :title="item.title"
          :icon="item.permIcon"
          :todoCount="item.todoCount"
        />
      </template>
      <div class="second-parent">
        <div class="second-child">
          <sidebar-item
            v-for="child in item.children.filter(
              (x) => x.permType === 0 || x.permType === 4
            )"
            :key="child.path"
            :is-nest="true"
            :item="child"
            :menu-level="menuLevel + 1"
            class="nest-menu"
          />
        </div>
      </div>
    </el-submenu>
  </div>
</template>

<script>
import Item from "./Item";
import AppLink from "./Link";
import { mapGetters } from "vuex";
import * as UrlUtil from "@/utils/url";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    // 定义菜单的级别属性
    // 该属性用于控制菜单的显示级别，默认为1级菜单
    menuLevel: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      onlyOneChild: null
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    /**是否是最下级菜单 */
    itemVisible() {
      let item = this.item;
      return (
        !item.children ||
        item.children.find((x) => x.permType === 0 || x.permType === 4) == null
      );
    }
  },
  methods: {
    getClass(item) {
      let classStr = "sidebar-item menu-level_" + this.menuLevel;
      if (!item.children || item.children.length === 0) {
        classStr += " leaf-item";
      }
      return classStr;
    },
    hasOneShowingChild(children = [], parent) {
      if (!children) {
        children = [];
      }
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.$set(this, "onlyOneChild", item);
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.$set(this, "onlyOneChild", parent);
        // this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true;
      }

      return false;
    },
    resolvePath(route) {
      // 平台约定 0 为自定义页面 4为视图页面
      if (route.permType === 0) {
        let url = `${route.dataViewConfId}?permCode=${route.permCode}&name=${route.name}`;
        if (route.dataViewConfId) {
          if (
            (route.dataViewConfId.indexOf("http://") === 0 ||
              route.dataViewConfId.indexOf("https://") === 0) &&
            route.dataViewConfId.indexOf("?") >= 0
          ) {
            url = `${route.dataViewConfId}&permCode=${route.permCode}&name=${route.name}`;
            url = UrlUtil.computeUrl(url);
          }
        }

        return url;
      } else if (route.permType === 4) {
        return `/customTable?viewId=${route.dataViewConfId}&permCode=${route.permCode}&name=${route.name}`;
      }
    },
    handelClick(rote) {
      console.log(rote);
    }
  }
};
</script>

<style lang="scss" scoped>
// .el-menu {
//   .sidebar-item {
//     // padding-left: 6px;

//     &.menu-level_2 {
//       .el-menu-item {
//         padding-left: 31px !important;
//       }
//     }
//   }
// }
</style>
