<template>
  <div class="w-100pre h-100pre" style="overflow-y: hidden">
    <easy-player
      class="w-100pre h-100pre"
      live="false"
      show-custom-button="false"
      isH265="true"
      ref="easyPlayer"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      videoPlayer: null,
    };
  },
  mounted() {
    this.videoPlayer = this.$refs.easyPlayer;
  },
  beforeUnmount() {
    this.videoPlayer = null;
  },
  methods: {
    // 调用播放
    play(videoUrl) {
      if (!this.videoPlayer) {
        this.videoPlayer = this.$refs.easyPlayer;
      }
      this.$nextTick(() => {
        this.videoPlayer &&
          this.videoPlayer.setAttribute("video-url", videoUrl);
        this.$forceUpdate();
      });
    },
    //销毁
    destroyPlayer() {
      this.videoPlayer && this.videoPlayer.setAttribute("video-url", "");
    },
  },
};
</script>

<style scoped lang="scss">
:deep(.iconfont.iconqingxiLOGO) {
  display: none !important;
}

:deep(.easy-player-loading) {
  display: none !important;
}
</style>
