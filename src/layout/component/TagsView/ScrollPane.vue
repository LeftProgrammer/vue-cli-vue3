<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script>
const tagAndTagSpacing = 4; // tag 与 tag 之间的间距

export default {
  name: "ScrollPane",
  data() {
    return {
      left: 0,
    };
  },
  computed: {
    scrollWrapper() {
      const container = this.$refs.scrollContainer;
      if (!container) return null;
      // Element Plus 内部 wrap 引用名称可能为 wrapRef，兼容老版本 $refs.wrap
      return (
        container.wrapRef ||
        (container.$refs && container.$refs.wrap) ||
        (container.$el &&
          container.$el.querySelector &&
          container.$el.querySelector(".el-scrollbar__wrap")) ||
        null
      );
    },
  },
  mounted() {
    const wrapper = this.scrollWrapper;
    if (wrapper && wrapper.addEventListener) {
      wrapper.addEventListener("scroll", this.emitScroll, true);
    }
  },
  beforeUnmount() {
    const wrapper = this.scrollWrapper;
    if (wrapper && wrapper.removeEventListener) {
      wrapper.removeEventListener("scroll", this.emitScroll, true);
    }
  },
  methods: {
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 40;
      const $scrollWrapper = this.scrollWrapper;
      if (!$scrollWrapper) return;
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4;
    },
    emitScroll() {
      this.$emit("scroll");
    },
    moveToTarget(currentTag) {
      const $container = this.$refs.scrollContainer.$el;
      const $containerWidth = $container.offsetWidth;
      const $scrollWrapper = this.scrollWrapper;
      if (!$scrollWrapper) return;
      const tagList = this.$parent.$refs.tag;

      let firstTag = null;
      let lastTag = null;

      // find first tag and last tag
      if (tagList.length > 0) {
        firstTag = tagList[0];
        lastTag = tagList[tagList.length - 1];
      }

      if (firstTag === currentTag) {
        $scrollWrapper.scrollLeft = 0;
      } else if (lastTag === currentTag) {
        $scrollWrapper.scrollLeft =
          $scrollWrapper.scrollWidth - $containerWidth;
      } else {
        // find preTag and nextTag
        const currentIndex = tagList.findIndex((item) => item === currentTag);
        const prevTag = tagList[currentIndex - 1];
        const nextTag = tagList[currentIndex + 1];

        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft =
          nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing;

        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft =
          prevTag.$el.offsetLeft - tagAndTagSpacing;

        if (
          afterNextTagOffsetLeft >
          $scrollWrapper.scrollLeft + $containerWidth
        ) {
          $scrollWrapper.scrollLeft =
            afterNextTagOffsetLeft - $containerWidth;
        } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
          $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;

  :deep {
    .el-scrollbar__bar {
      bottom: 0;
    }
  }
}
</style>
