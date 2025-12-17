<template>
  <div id="tags-view-container" class="tags-view-container">
    <ScrollPane
      ref="scrollPane"
      class="tags-view-wrapper"
      id="must-tags-view-wrapper"
      @scroll="handleScroll"
    >
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.fullPath"
        :class="isActive(tag) ? 'active' : 'activeAfter'"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <span class="tag-title">{{ tag.title }}</span>
        <el-icon
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <Close />
        </el-icon>
      </router-link>
    </ScrollPane>
    <!-- 左右切换按钮 -->
    <el-icon v-if="showControls" class="el-icon-arrow-left mx-10" @click="scrollNav(-1)">
      <ArrowLeft />
    </el-icon>
    <el-icon v-if="showControls" class="el-icon-arrow-right mr-20" @click="scrollNav(1)">
      <ArrowRight />
    </el-icon>

    <ul
      v-show="visible"
      class="contextmenu"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其它</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ScrollPane from "./ScrollPane.vue";
import { ArrowLeft, ArrowRight, Close } from "@element-plus/icons-vue";

export default {
  name: "TagsView",
  components: { ScrollPane, ArrowLeft, ArrowRight, Close },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      showControls: false,
    };
  },
  computed: {
    ...mapGetters(["menuRoutes"]),
    visitedViews() {
      const views = this.$store.state.tagsView.visitedViews || [];
      return views;
    },
    routes() {
      return this.$store.state.permission.routes || [];
    },
  },
  watch: {
    $route() {
      this.addTags();
      this.moveToCurrentTag();
    },
    visitedViews: {
      handler() {
        this.$nextTick(() => {
          this.updateControls();
        });
      },
      deep: true,
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
  },
  mounted() {
    this.fixdHome();
    this.addTags();
    this.initTags();
    this.$nextTick(() => {
      this.updateControls();
    });
    window.addEventListener("resize", this.updateControls);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateControls);
  },
  methods: {
    updateControls() {
      const parent = document.getElementById("tags-view-container");
      if (!parent) return;
      const parentWidth = parent.offsetWidth;
      const childs = document.getElementsByClassName("tags-view-item");
      let childWidth = 0;
      for (let index = 0; index < childs.length; index += 1) {
        const element = childs[index];
        childWidth += element.offsetWidth + 16;
      }
      childWidth += 30;
      this.showControls = parentWidth <= childWidth;
    },
    scrollNav(direction) {
      const views = this.visitedViews || [];
      const currentIndex = views.findIndex((v) => {
        if (v.path === "/customTable") return v.fullPath === this.$route.fullPath;
        return v.path === this.$route.path;
      });
      const target = views[currentIndex + direction];
      if (target) {
        this.$router.push(target.fullPath);
      }
    },
    isActive(route) {
      if (route.path === "/customTable") {
        return route.fullPath === this.$route.fullPath;
      }
      return route.path === this.$route.path;
    },
    isAffix(tag) {
      return !!(tag?.meta?.affix || tag?.meta?.ishome || tag?.ishome);
    },
    filterAffixTags(routes, basePath = "/") {
      let tags = [];
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = basePath + route.path;
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta },
          });
        }
        if (route.children && route.children.length) {
          const tempTags = this.filterAffixTags(route.children, route.path);
          if (tempTags.length) {
            tags = tags.concat(tempTags);
          }
        }
      });
      return tags;
    },
    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
      affixTags.forEach((tag) => {
        if (tag.name) {
          this.$store.dispatch("tagsView/addVisitedView", tag);
        }
      });
    },
    fixdHome() {
      const home = {
        fullPath: "/homeIndex/index",
        name: "homeIndex",
        path: "/homeIndex/index",
        hash: "",
        meta: {
          affix: true,
          auth: "home",
          ishome: true,
          title: "工作中心",
        },
        query: {
          name: "工作中心",
          permCode: "home",
        },
      };
      this.$store.dispatch("tagsView/addView", home);
    },
    addTags(route) {
      const r = route || this.$route;
      if (r && r.name) {
        this.$store.dispatch("tagsView/addView", r);
      }
      return false;
    },
    moveToCurrentTag() {
      const views = this.visitedViews || [];
      const tags = this.$refs.tag || [];
      this.$nextTick(() => {
        const currentView = views.find((v) => {
          if (v.path === "/customTable") return v.fullPath === this.$route.fullPath;
          return v.path === this.$route.path;
        });
        const currentTag = tags.find((t) => t && t.to && this.isActive(t.to));
        if (currentTag) {
          this.$refs.scrollPane && this.$refs.scrollPane.moveToTarget(currentTag);
        }
        if (currentView && currentView.fullPath !== this.$route.fullPath) {
          this.$store.dispatch("tagsView/updateVisitedView", this.$route);
        }
      });
    },
    refreshSelectedTag(view) {
      this.$store.dispatch("tagsView/delCachedView", view).then(() => {
        const query = { ...(this.$route.query || {}), _t: Date.now() };
        this.$nextTick(() => {
          this.$router.replace({
            path: this.$route.path,
            query,
          });
        });
      });
      this.closeMenu();
    },
    closeSelectedTag(view) {
      if (this.isAffix(view)) return;
      this.$store.dispatch("tagsView/delView", view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view);
        }
      });
      this.closeMenu();
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      this.$store
        .dispatch("tagsView/delOthersViews", this.selectedTag)
        .then(() => {
          this.moveToCurrentTag();
        });
      this.closeMenu();
    },
    closeAllTags(view) {
      this.$store.dispatch("tagsView/delAllViews", view).then(({ visitedViews }) => {
        if (this.isAffix(view)) {
          return;
        }
        this.toLastView(visitedViews, view);
      });
      this.closeMenu();
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        this.$router.push("/");
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105;
      const containerRect = this.$el.getBoundingClientRect();
      const targetRect = e.currentTarget
        ? e.currentTarget.getBoundingClientRect()
        : null;

      const offsetWidth = this.$el.offsetWidth;
      const maxLeft = offsetWidth - menuMinWidth;

      // 默认跟随鼠标；如果能拿到当前标签的 rect，则对齐到标签下方（水平居中）
      const rawLeft = targetRect
        ? targetRect.left - containerRect.left + targetRect.width / 2 - menuMinWidth / 2
        : e.clientX - containerRect.left;
      const rawTop = targetRect ? targetRect.bottom - containerRect.top : e.clientY - containerRect.top;

      const left = rawLeft < 0 ? 0 : rawLeft;
      this.left = left > maxLeft ? maxLeft : left;
      this.top = rawTop + 6;
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    },
    handleScroll() {
      this.closeMenu();
    },
  },
};
</script>

<style scoped lang="scss">
.activeAfter::after {
  content: "|";
  right: -3px;
  color: #ffffff66;
  position: absolute;
}

.tags-view-container {
  position: relative;
  width: 100%;
  background: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
    ::v-deep .el-scrollbar__view {
      border-left: 1px solid #e5e6eb;
      padding: 0 8px;
      text-align: left; // 确保所有标签从左开始排布
    }

    .tags-view-item {
      display: inline-flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      text-decoration: none; // 去掉 router-link 默认下划线
      text-align: left; // 文本靠左对齐
      line-height: 48px;
      height: 48px;
      color: #4e5969;
      background: transparent;
      margin: 0 8px;
      font-size: 16px;
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;

      .tag-title {
        display: inline-flex;
        align-items: center;
      }

      &:last-of-type {
        margin-right: 15px !important;
      }

      &.active {
        color: var(--el-color-primary);
        font-weight: 600;
        border-bottom: 2px solid var(--el-color-primary);
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style scoped lang="scss">
/* reset element css of el-icon-close */
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      margin-left: 6px;
      margin-top: 3px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      line-height: 16px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      ::v-deep svg {
        width: 14px;
        height: 14px;
      }
    }
  }
}

::v-deep .el-scrollbar__wrap {
  margin-bottom: 0 !important;
}

::v-deep .el-scrollbar__wrap::-webkit-scrollbar {
  width: 0;
  height: 0 !important;
}

::v-deep .el-scrollbar__thumb {
  height: auto !important;
}

::v-deep .el-scrollbar__bar {
  display: none;
}

::v-deep .el-icon-arrow-left,
.el-icon-arrow-right {
  background-color: #fff;
  margin-top: auto;
  margin-bottom: auto;
  padding: 12px 0;
  border-radius: 3px;
  width: 30px;
  color: var(--el-color-primary);
  text-align: center;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
    color: #fff;
  }
}
</style>
