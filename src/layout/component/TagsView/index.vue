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
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </ScrollPane>
    <!-- 左右切换按钮 -->
    <i
      v-if="showControls"
      class="el-icon-arrow-left mx-10"
      @click="scrollNav(-1)"
    />
    <i
      v-if="showControls"
      class="el-icon-arrow-right mr-20"
      @click="scrollNav(1)"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ScrollPane from "./ScrollPane.vue";

export default {
  name: "TagsView",
  components: { ScrollPane },
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
      // 计算标签总宽度，决定是否显示左右切换按钮
      this.$nextTick(() => {
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
      });
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
      this.mustWheel();
    });
  },
  methods: {
    mustWheel() {
      const wraps = document.getElementsByClassName("el-scrollbar__wrap");
      const scrollContainer = wraps && wraps[0];
      if (!scrollContainer) return;
      scrollContainer.addEventListener("wheel", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    },
    scrollNav(direction) {
      const allTags = this.$refs.tag || [];
      const currentIndex = allTags.findIndex(
        (item) => item.to.fullPath === this.$route.fullPath,
      );
      const target = allTags[currentIndex + direction];
      this.$nextTick(() => {
        if (target) {
          this.$router.push(target.to);
          this.moveToCurrentTag();
        }
      });
    },
    isActive(route) {
      if (route.path === "/customTable") {
        return route.fullPath === this.$route.fullPath;
      }
      return route.path === this.$route.path;
    },
    isAffix(tag) {
      return !!tag.ishome; // 或 tag.meta && tag.meta.affix
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
      const tags = this.$refs.tag || [];
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane && this.$refs.scrollPane.moveToTarget(tag);
            if (tag.to.path !== this.$route.path) {
              this.$store.dispatch(
                "tagsView/updateVisitedView",
                this.$route,
              );
            }
            break;
          }
        }
      });
    },
    refreshSelectedTag(view) {
      this.$store.dispatch("tagsView/delCachedView", view).then(() => {
        const { fullPath } = view;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath,
          });
        });
      });
    },
    closeSelectedTag(view) {
      this.$store.dispatch("tagsView/delView", view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view);
        }
      });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      this.$store
        .dispatch("tagsView/delOthersViews", this.selectedTag)
        .then(() => {
          this.moveToCurrentTag();
        });
    },
    closeAllTags(view) {
      this.$store.dispatch("tagsView/delAllViews", view).then(({ visitedViews }) => {
        if (this.affixTags.some((tag) => tag.path === view.path)) {
          return;
        }
        this.toLastView(visitedViews, view);
      });
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else if (view.name === "Dashboard") {
        this.$router.replace({ path: "/redirect" + view.fullPath });
      } else {
        this.$router.push("/");
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left;
      const offsetWidth = this.$el.offsetWidth;
      const maxLeft = offsetWidth - menuMinWidth;
      const left = e.clientX - offsetLeft + 15;

      this.left = left > maxLeft ? maxLeft : left;
      this.top = e.clientY;
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
      display: inline-block;
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
      margin-left: 8px;
      width: 16px;
      height: 16px;
      line-height: 16px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
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
  color: #0096ff;
  text-align: center;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
    color: #fff;
  }
}
</style>
