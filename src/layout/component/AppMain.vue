<template>
  <section class="app-main">
    <div class="tagsBg">
      <TagsView v-if="intoSyster" class="tagsView" />
    </div>
    <div class="content">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      </transition>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import TagsView from "./TagsView/index.vue";

export default {
  name: "LayoutAppMain",
  components: {
    TagsView,
  },
  computed: {
    ...mapGetters(["cachedViews"]),
    key() {
      return this.$route.fullPath;
    },
    // 目前始终进入系统，保留接口便于后续根据权限控制
    intoSyster() {
      return true;
    },
  },
};
</script>

<style scoped lang="scss">
.app-main {
  /* 与旧项目保持一致：占满剩余高度，背景为浅蓝 */
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #cae6ff !important;

  .tagsBg {
    // 标签栏背景占位，可按需增加装饰样式
    position: relative;
  }

  .content {
    background: #f0f4f8;
    padding: 16px;
    height: calc(100% - 48px);

    > div {
      background-color: #fff;
    }
  }
}
</style>
