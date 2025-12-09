<template>
  <div id="tags-view-container" class="tags-view-container flex">
    <scroll-pane
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
        @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        <span class="tag-title">{{ tag.title }}</span>
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>
    <!-- 在快捷导航条添加左切换按钮 -->
    <i class="el-icon-arrow-left mx-10" @click="scrollNav(-1)" v-if="showControls"></i>
    <!-- 在快捷导航条添加右切换按钮 -->
    <i class="el-icon-arrow-right mr-20" @click="scrollNav(1)" v-if="showControls"></i>
    <!-- <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        Close
      </li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li>
    </ul> -->
  </div>
</template>

<script>
import ScrollPane from "./ScrollPane";
// import path from "path";
import { mapGetters } from "vuex";
// import _ from "lodash"; // 引入 lodash 或其他深拷贝库
// import jsPDF from "jspdf";

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      showControls: false
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
    visitedViews() {
      // 这里需要做一件事情就是 根据标签的数量 计算总长度的   与父级  长度作比较 来控制是不是显示 切换按钮
      this.$nextTick(() => {
        // 1.获取父元素的长度
        const parentWidth = document.getElementById("tags-view-container").offsetWidth;
        // 2.获取子元素的长度
        const childs = document.getElementsByClassName("tags-view-item");
        // 循环子元素计算出子元素的总长度
        let childWidth = 0;
        for (let index = 0; index < childs.length; index++) {
          const element = childs[index];
          // 子元素的宽度 加上x轴方向外边距的值
          childWidth += element.offsetWidth + 16;
        }
        // 第一个最后一个有15的外边距 所以+30
        childWidth += 30;
        if (parentWidth > childWidth) {
          this.showControls = false;
        } else {
          this.showControls = true;
        }
      });
      let views = this.$store.state.tagsView.visitedViews;
      let hasHome = views.some((x) => x.ishome);
      if (!hasHome) {
        const { menuRoutes } = this;
        // console.log("visitedViews", views, menuRoutes);
      }
      return views;
    },
    routes() {
      return this.$store.state.permission.routes;
    }
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
    }
  },
  mounted() {
    console.log("-----", this.$store.state.tagsView.visitedViews);
    this.fixdHome();
    this.addTags();
    this.initTags();
    // 禁用鼠标的滚轴事件
    this.$nextTick(() => {
      this.mustWheel();
    });
  },
  methods: {
    mustWheel() {
      // 获取需要禁用横向滚动的元素
      const scrollContainer = document.getElementsByClassName("el-scrollbar__wrap")[0];
      // 添加横向滚动事件监听器
      scrollContainer.addEventListener("wheel", function (e) {
        e.preventDefault();
        e.stopPropagation(); // 阻止事件冒泡
      });
    },
    scrollNav(direction) {
      // -1 向做移动 1向右移动
      // 1. 获取到所有的快捷导航
      let allscrollPane = this.$refs.tag;
      //  2. 获取到当前标签的索引  当前标签的索引+方向 就是需要移动到的索引
      let currentIndex = allscrollPane.findIndex(
        (item) => item.to.fullPath === this.$route.fullPath
      );
      // 3.需要切换到的路由
      let scrollPane = allscrollPane[currentIndex + direction];
      // 4.可能就在最左或则最右 就不做处理  也就是不会找到路由
      this.$nextTick(() => {
        if (scrollPane) {
          this.$router.push(scrollPane.to);
          this.moveToCurrentTag();
        }
      });
    },

    isActive(route) {
      if (route.path === "/customTable") {
        // 针对customTable页面不同的传参将被标识为不同的页面, 采用fullpath做判断
        return route.fullPath === this.$route.fullPath;
      }
      return route.path === this.$route.path;
    },
    isAffix(tag) {
      return tag.ishome; //tag.meta && tag.meta.affix;
    },
    filterAffixTags(routes, basePath = "/") {
      let tags = [];
      routes?.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path);
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          });
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
      return tags;
    },
    initTags() {
      // console.log("initTags", this.affixTags, this.routes);
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch("tagsView/addVisitedView", tag);
        }
      }
    },
    fixdHome() {
      const home = {
        fullPath: "/homeIndex/index",
        name: "home",
        path: "/homeIndex/index",
        hash: "",
        meta: {
          affix: true,
          auth: "home",
          ishome: true,
          title: "工作中心"
        },
        query: {
          name: "工作中心",
          permCode: "home"
        }
      };
      this.$store.dispatch("tagsView/addView", home);
    },
    addTags(route) {
      const { name } = route || this.$route;
      if (name) {
        this.$store.dispatch("tagsView/addView", this.$route);
      }
      return false;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);
            // when query is different then update
            if (tag.to.path !== this.$route.path) {
              this.$store.dispatch("tagsView/updateVisitedView", this.$route);
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
            path: "/redirect" + fullPath
          });
        });
      });
    },
    closeSelectedTag(view, index) {
      this.$store.dispatch("tagsView/delView", view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view);
        }
      });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      this.$store.dispatch("tagsView/delOthersViews", this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags(view) {
      this.$store.dispatch("tagsView/delAllViews").then(({ visitedViews }) => {
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
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === "Dashboard") {
          // to reload home page
          this.$router.replace({ path: "/redirect" + view.fullPath });
        } else {
          this.$router.push("/");
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 15; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }

      this.top = e.clientY;
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    },
    handleScroll() {
      this.closeMenu();
    }
  }
};
</script>

<style lang="scss" scoped>
.activeAfter::after {
  content: "|";
  right: -3px;
  color: #ffffff66;
  position: absolute;
}
.tags-view-container {
  // height: 34px;
  width: 100%;
  // margin-bottom: 10px;
  background: #fff;
  // border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    /deep/.el-scrollbar__view {
      border-left: 1px solid #e5e6eb;
      padding: 0 8px;
    }
    // 禁止鼠标横向滚动
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      line-height: 48px;
      // border: 1px solid #d8dce5;
      height: 48px;
      color: #4e5969;
      background: transparent;
      margin: 0 8px;
      font-size: 16px;
      // margin-left: 5px;
      // margin-top: 4px;
      // border-radius: 5px;
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;
      // margin-right: 15px;

      &:first-of-type {
        // margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px !important;
      }
      &.active {
        color: #014acb;
        font-weight: 600;
        border-bottom: 2px solid #014acb;
        // border-color: #42b983;
        &::before {
          // content: "";
          // background: #1298fa;
          // display: inline-block;
          // width: 8px;
          // height: 8px;
          // border-radius: 50%;
          // position: relative;
          // margin-right: 2px;
        }
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

<style lang="scss" scoped>
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      margin-left: 8px;
      // border: 1px solid #0096ff;
      width: 16px;
      height: 16px;
      line-height: 16px;
      // vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:hover {
        // background-color: #b4bccc;
        // color: #fff;
      }
    }
  }
}

/deep/ .el-scrollbar__wrap {
  // pointer-events: none;
  // padding-bottom: 10px;
  margin-bottom: 0 !important;
}
/deep/.el-scrollbar__wrap::-webkit-scrollbar {
  width: 0; /* 滚动条宽度，调整为0以隐藏 */
  height: 0 !important;
}

/deep/.el-scrollbar__thumb {
  height: auto !important;
}
/deep/ .el-scrollbar__bar {
  display: none;
}
/deep/ .el-icon-arrow-left,
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
