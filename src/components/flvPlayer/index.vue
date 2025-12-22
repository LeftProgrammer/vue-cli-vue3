<template>
  <div>
    <div style="height: 60vh">
      <DHPlayer
        ref="dhplayerRef"
        videoId="dhplayer"
        :windowType="windowType"
        @createSuccess="createSuccess"
        @realSuccess="realSuccess"
        @realError="realError"
        @talkSuccess="talkSuccess"
        @talkError="talkError"
        @playbackSuccess="playbackSuccess"
        @playbackError="playbackError"
        @playbackFinish="playbackFinish"
      />
    </div>
  </div>
</template>

<script>
import DHPlayer from "@/components/DHPlayer";

export default {
  name: "FlvPlayer",
  components: {
    DHPlayer,
  },
  props: {
    url: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      windowType: 0,
    };
  },
  methods: {
    play() {
      this.$refs.dhplayerRef && this.$refs.dhplayerRef.initVideo && this.$refs.dhplayerRef.initVideo();
    },
    pause() {
      this.$refs.dhplayerRef && this.$refs.dhplayerRef.destroy && this.$refs.dhplayerRef.destroy();
    },
    createSuccess() {
      this.$refs.dhplayerRef && this.$refs.dhplayerRef.setTabControlBtn && this.$refs.dhplayerRef.setTabControlBtn();
      this.realByUrl();
    },
    realByUrl() {
      if (!this.$refs.dhplayerRef || !this.$refs.dhplayerRef.realByUrl) {
        return;
      }
      this.$refs.dhplayerRef.realByUrl(
        {
          channelId: "0",
          path: this.url,
          redirect: false,
          camerType: "2",
        },
        0
      );
    },
    realSuccess(info) {
      console.log("实时预览成功", info);
    },
    realError(info, err) {
      console.log("实时预览失败", info, err);
    },
    talkSuccess(info) {
      console.log("对讲成功", info);
    },
    talkError(info, err) {
      console.log("对讲失败", info, err);
    },
    playbackSuccess(info) {
      console.log("录像播放成功", info);
    },
    playbackError(info, err) {
      console.log("录像播放失败", info, err);
    },
    playbackFinish(info) {
      console.log("当前录像播放完成", info);
    },
  },
};
</script>
