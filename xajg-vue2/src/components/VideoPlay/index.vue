<template>
  <div class="w-100pre h-100pre">
    <!-- 播放器 rtsp/m3u8 -->
    <components ref="componentsref" :is="component"></components>
  </div>
</template>
<script>
import m3u8Player from "./m3u8Player";
import flvPlayer from "./flvPlayer";

import DHplay from "./DHplay";

export default {
  props: {
    refKey: {
      type: String,
      default: "",
      // required: true,
    },
  },
  components: {
    m3u8Player,
    flvPlayer,
    DHplay,
  },
  data() {
    return {
      component: "",
    };
  },
  mounted() {},
  methods: {
    play(videoUrl, type) {
      console.log("播放器播放地址/视频流地址格式", videoUrl, type);
      if (!videoUrl) this.$message.error("视频流地址不能为空");
      if (type == "M3U8") {
        this.component = "m3u8Player";
      } else if (type == "RTSP") {
        this.component = "DHplay";
      } else {
        this.$message.error("视频流地址格式不正确");
      }
      this.$nextTick(() => {
        let refs = this.$refs.componentsref;
        console.log("refs", refs);
        if (refs) {
          refs.play(videoUrl);
        }
      });
    },
    destroyPlayer() {
      let refs = this.$refs.componentsref;
      console.log("destroyPlayer", refs);
      if (refs) {
        refs.destroyPlayer();
      } else {
        console.log("没有找到播放器");
      }
    },
  },
};
</script>
