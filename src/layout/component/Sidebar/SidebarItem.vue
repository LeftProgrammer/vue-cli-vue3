<template>
  <div :class="getClass(item)" :data-title="item && item.businessIds">
    <template v-if="itemVisible">
      <el-menu-item
        :index="item.permCode"
        :class="{ 'submenu-title-noDropdown': !isNest }"
        @click="handleMenuClick(item)"
      >
        <Item
          :isRoot="item.permPid === '1' || item.permPid === 1"
          :title="item.title"
          :icon="item.permIcon"
          :todoCount="item.todoCount"
        />
      </el-menu-item>
    </template>
    <el-sub-menu v-else :index="item.permCode" popper-append-to-body>
      <template #title>
        <Item
          :isRoot="item.permPid === '1' || item.permPid === 1"
          :title="item.title"
          :icon="item.permIcon"
          :todoCount="item.todoCount"
        />
      </template>
      <div class="second-parent">
        <div class="second-child">
          <SidebarItem
            v-for="child in childrenForDisplay"
            :key="child.permCode || child.id || child.value || child.name"
            :is-nest="true"
            :item="child"
            :menu-level="menuLevel + 1"
            class="nest-menu"
          />
        </div>
      </div>
    </el-sub-menu>
  </div>
</template>

<script>
import Item from "./Item.vue";
import * as UrlUtil from "@/utils/url";

export default {
  name: "SidebarItem",
  components: { Item },
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    // 菜单级别，默认为一级菜单
    menuLevel: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    children() {
      return (this.item && this.item.children) || [];
    },
    // 只展示 permType 为 0 或 4 的子节点（平台约定：0 自定义页面，4 视图页面）
    childrenForDisplay() {
      if (!this.children || !this.children.length) return [];
      return this.children.filter((x) => x.permType === 0 || x.permType === 4);
    },
    /** 是否是最下级菜单（没有可展示的子节点） */
    itemVisible() {
      const item = this.item || {};
      return (
        !item.children ||
        item.children.find((x) => x.permType === 0 || x.permType === 4) == null
      );
    },
  },
  mounted() {},
  methods: {
    handleMenuClick(route) {
      const url = this.resolvePath(route);
      if (!url) return;
      if (url.startsWith("http://") || url.startsWith("https://")) {
        window.open(url, "_blank");
        return;
      }
      this.$router.push(url);
    },
    getClass(item) {
      let classStr = "sidebar-item menu-level_" + this.menuLevel;
      if (!item || !item.children || item.children.length === 0) {
        classStr += " leaf-item";
      }
      return classStr;
    },
    // 生成跳转 URL：内部路由或外部链接
    resolvePath(route) {
      if (!route) return "";
      // 平台约定 0 为自定义页面 4 为视图页面
      if (route.permType === 0) {
        let url = `${route.dataViewConfId}?permCode=${route.permCode}&name=${route.name}`;
        if (route.dataViewConfId) {
          const id = route.dataViewConfId;
          if (
            (id.indexOf("http://") === 0 || id.indexOf("https://") === 0) &&
            id.indexOf("?") >= 0
          ) {
            url = `${id}&permCode=${route.permCode}&name=${route.name}`;
            url = UrlUtil.computeUrl(url);
          }
        }
        return url;
      }
      if (route.permType === 4) {
        return `/customTable?viewId=${route.dataViewConfId}&permCode=${route.permCode}&name=${route.name}`;
      }
      // 兜底：如果没有 permType 0/4，则尝试使用已有 path 或 permCode
      if (route.path) return route.path;
      if (route.permCode) return route.permCode;
      return "";
    },
  },
};
</script>

<style scoped lang="scss">
.sidebar-item {
  &.leaf-item {
    /* 预留样式，后续可按旧项目细化 */
  }
}

// .second-parent {
//   width: 100%;
// }

// .second-child {
//   width: 100%;
// }
</style>
