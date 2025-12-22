<template>
  <div :style="{ height: height ? height + 'px' : '100%' }">
    <div :id="videoId" class="dh-bg" style="height: 100%">
      <div v-if="showBg" class="dh-desc">
        <span>{{ dhErrorMsg }}</span>&nbsp;&nbsp;&nbsp;
        <a
          v-if="dhErrorMsg === '插件未安装!'"
          style="font-size: 24px"
          href="https://open-icc.dahuatech.com/download/plugins/dhplayer/DHPlayer_x32.zip"
        >
          x32位
        </a>
        &nbsp;&nbsp;&nbsp;
        <a
          v-if="dhErrorMsg === '插件未安装!'"
          style="font-size: 24px"
          href="https://open-icc.dahuatech.com/download/plugins/dhplayer/DHPlayer_x64.zip"
        >
          x64位
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import "./static/videoPlayer";
import PanTilt from "./static/panTilt/panTilt";
import "./static/panTilt/panTilt.css";

export default {
  name: "DHPlayer",
  props: {
    showBg: {
      type: Boolean,
      default: true,
    },
    videoId: {
      type: String,
      default: "dhplayer",
    },
    request: {
      type: Object,
      default: () => ({}),
    },
    height: {
      type: Number,
      default: 0,
    },
    windowType: {
      type: Number,
      default: 0,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    division: {
      type: [String, Number],
      default: "1",
    },
    showBar: {
      type: Boolean,
      default: true,
    },
    shieldClass: {
      type: Array,
      default() {
        return [];
      },
    },
    coverShieldClass: {
      type: Array,
      default: () => [],
    },
    parentIframeShieldClass: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  emits: [
    "createSuccess",
    "createError",
    "dhPlayerMessage",
    "picCap",
    "realSuccess",
    "realError",
    "talkSuccess",
    "talkError",
    "playbackSuccess",
    "playbackError",
    "playbackFinish",
    "notifyTalk",
    "switchStartTime",
    "replay",
    "videoDownloadSuccess",
    "closeWindowSuccess",
    "clickWindow",
    "dbClickWindow",
    "changeDivision",
    "downloadProgress",
    "downloadRecordSuccess",
  ],
  data() {
    return {
      dhErrorMsg: "插件加载中...",
      videoPlayer: null,
      param: {},
      realPanControl: null,
      isUsePanTilt: false,
    };
  },
  watch: {
    windowType: {
      handler(v) {
        this.__update(v, "windowType");
      },
      deep: true,
      immediate: true,
    },
    visible: {
      handler(v) {
        if (!v) {
          this.dhErrorMsg = "插件已隐藏";
        }
        this.__update(v, "visible");
      },
      deep: true,
      immediate: true,
    },
    draggable: {
      handler(v) {
        this.__update(v, "draggable");
      },
      deep: true,
      immediate: true,
    },
    division: {
      handler(v) {
        this.__update(v, "division");
      },
      deep: true,
      immediate: true,
    },
    request: {
      handler(v) {
        this.__update(v, "request");
      },
      deep: true,
      immediate: true,
    },
    showBar: {
      handler(v) {
        this.__update(v, "showBar");
      },
      deep: true,
      immediate: true,
    },
    shieldClass: {
      handler(v) {
        this.__update(v, "shieldClass");
      },
      deep: true,
      immediate: true,
    },
    coverShieldClass: {
      handler(v) {
        this.__update(v, "coverShieldClass");
      },
      deep: true,
      immediate: true,
    },
    parentIframeShieldClass: {
      handler(v) {
        this.__update(v, "parentIframeShieldClass");
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initVideo();
    });
  },
  beforeUnmount() {
    this.destroy();
  },
  methods: {
    __update(v, type) {
      this.param[type] = v;
      this.videoPlayer && this.videoPlayer._update && this.videoPlayer._update({ ...this.param });
    },
    initPanTilt(el) {
      this.$nextTick(() => {
        this.realPanControl = new PanTilt({
          el,
          setPtzDirection: this.request && this.request.setPtzDirection,
          setPtzCamera: this.request && this.request.setPtzCamera,
        });
        this.isUsePanTilt = true;
      });
    },
    usePanTilt(info) {
      this.isUsePanTilt &&
        info &&
        info.channelId &&
        this.realPanControl &&
        this.realPanControl.setChannel({
          id: info.channelId,
          cameraType: info.cameraType,
          capability: info.capability,
        });
    },
    initVideo() {
      const {
        windowType,
        visible,
        draggable,
        division,
        showBar,
        shieldClass,
        coverShieldClass,
        parentIframeShieldClass,
      } = this.param;

      const Ctor = window.VideoPlayer;
      if (!Ctor) {
        this.dhErrorMsg = "播放器脚本加载失败";
        this.$emit("createError", new Error("VideoPlayer not found"));
        return;
      }

      this.videoPlayer = new Ctor({
        videoId: this.videoId,
        windowType: windowType || 0,
        shieldClass: shieldClass || [],
        coverShieldClass: coverShieldClass || [],
        parentIframeShieldClass: parentIframeShieldClass || [],
        showBar,
        division,
        visible,
        draggable,
        request: this.request || {
          real: null,
          talk: null,
          stopTalk: null,
          playbackByTime: null,
          playbackByFile: null,
          queryRecord: null,
        },
        createSuccess: (versionInfo) => {
          this.$message && this.$message.warning && this.$message.warning(versionInfo.message);
          this.$emit("createSuccess", versionInfo);
        },
        createError: (err) => {
          sessionStorage.setItem("dhplayer-info", err.message);
          this.dhErrorMsg = err.message;
          this.$emit("createError", err);
        },
        dhPlayerMessage: (info, err) => {
          this.$emit("dhPlayerMessage", info, err);
        },
        snapshotSuccess: ({ base64Url, path }, info) => {
          this.$emit("picCap", { base64Url, path }, info);
        },
        realSuccess: (info) => {
          this.$emit("realSuccess", info);
        },
        realError: (info, err) => {
          this.$emit("realError", info, err);
        },
        talkSuccess: (info) => {
          this.$emit("talkSuccess", info);
        },
        talkError: (info, err) => {
          this.$emit("talkError", info, err);
        },
        playbackSuccess: (info) => {
          this.$emit("playbackSuccess", info);
        },
        playbackError: (info, err) => {
          this.$emit("playbackError", info, err);
        },
        playbackFinish: (info) => {
          this.$emit("playbackFinish", info);
        },
        notifyTalk: ({ channelId, snum }) => {
          this.$emit("notifyTalk", { channelId, snum });
        },
        switchStartTime: ({ startTime, snum }) => {
          this.$emit("switchStartTime", { startTime, snum });
        },
        replay: (snum) => {
          this.$emit("replay", snum);
        },
        videoDownloadSuccess: (path, info) => {
          this.$emit("videoDownloadSuccess", path, info);
        },
        closeWindowSuccess: ({ isAll, snum, channelList }) => {
          this.$emit("closeWindowSuccess", { isAll, snum, channelList });
        },
        clickWindow: (snum, info) => {
          this.$emit("clickWindow", snum, info);
          if (this.windowType === 0) {
            this.usePanTilt(info);
          }
        },
        dbClickWindow: (snum, info) => {
          this.$emit("dbClickWindow", snum, info);
        },
        changeDivision: (divisionNow) => {
          this.param.division = divisionNow;
          this.$emit("changeDivision", divisionNow);
        },
        downloadProgress: (info) => {
          this.$emit("downloadProgress", info);
        },
        downloadRecordSuccess: (info) => {
          this.$emit("downloadRecordSuccess", info);
        },
      });
    },
    destroy() {
      try {
        this.closeVideo();
        if (this.videoPlayer && this.videoPlayer.destroy) {
          this.videoPlayer.destroy().then(() => {
            this.dhErrorMsg = "插件已销毁";
          });
        }
      } catch (e) {
        void e;
      }
    },
    setTabControlBtn(btnList) {
      this.videoPlayer && this.videoPlayer.setTabControlBtn && this.videoPlayer.setTabControlBtn(btnList);
    },
    startReal(list) {
      this.videoPlayer && this.videoPlayer.startReal && this.videoPlayer.startReal(list);
      setTimeout(() => {
        list && list.length && this.usePanTilt(list[0]);
      }, 300);
    },
    realByUrl(o, snum) {
      if (!this.videoPlayer || !this.videoPlayer.realByUrl) return;
      this.videoPlayer.realByUrl(
        {
          ...o,
          snum,
          channelId: o.channelId,
          path: o.path || o.url,
          redirect: !!o.redirect,
        },
        {},
        true
      );
    },
    startTalk(snum) {
      this.videoPlayer && this.videoPlayer.startTalk && this.videoPlayer.startTalk(snum);
    },
    talkByUrl(o, snum = 0) {
      this.videoPlayer && this.videoPlayer.talkByUrl && this.videoPlayer.talkByUrl(
        {
          snum,
          path: o.path,
          channelId: o.channelId,
          redirect: false,
          audioType: o.audioType,
          audioBit: o.audioBit,
          sampleRate: o.sampleRate,
          talkType: o.talkType || 1,
        },
        snum
      );
    },
    closeTalk() {
      this.videoPlayer && this.videoPlayer.closeTalk && this.videoPlayer.closeTalk();
    },
    startPlayback(param, type = "playback") {
      if (!this.videoPlayer) return;
      switch (type) {
        case "playback":
          this.videoPlayer.startPlayback && this.videoPlayer.startPlayback(param);
          break;
        case "download":
          this.videoPlayer.startDownloadRecord && this.videoPlayer.startDownloadRecord(param);
          break;
        default:
          break;
      }
    },
    playbackByUrl(o, snum = 0) {
      if (!this.videoPlayer || !this.videoPlayer.playbackByUrl) return;
      this.videoPlayer.playbackByUrl(
        {
          ...o,
          snum,
          channelId: o.channelId,
          records: o.records || [],
          path: o.url || o.path,
          startTime: o.startTime,
          endTime: o.endTime,
          redirect: !!o.redirect,
        },
        {},
        true
      );
    },
    playVideo(snum) {
      this.videoPlayer && this.videoPlayer.controlPlayback && this.videoPlayer.controlPlayback({ snum, state: 1 });
    },
    pauseVideo(snum) {
      this.videoPlayer && this.videoPlayer.controlPlayback && this.videoPlayer.controlPlayback({ snum, state: 0 });
    },
    changeDivision(division) {
      this.videoPlayer && this.videoPlayer.changeDivision && this.videoPlayer.changeDivision(division);
    },
    setShowBar(enable = true) {
      this.param.showBar = enable;
      this.videoPlayer && this.videoPlayer.showControlBar && this.videoPlayer.showControlBar(enable);
    },
    setFullScreen() {
      this.videoPlayer && this.videoPlayer.setFullScreen && this.videoPlayer.setFullScreen();
    },
    localRecordDownload(snum) {
      this.videoPlayer && this.videoPlayer.localRecordDownload && this.videoPlayer.localRecordDownload(snum);
    },
    hideWindow() {
      this.dhErrorMsg = "插件已隐藏";
      this.videoPlayer && this.videoPlayer.hide && this.videoPlayer.hide();
    },
    showWindow() {
      this.videoPlayer && this.videoPlayer.show && this.videoPlayer.show();
    },
    chooseWindow(snum) {
      if (!this.videoPlayer || !this.videoPlayer.chooseWindow) return;
      this.videoPlayer.chooseWindow(snum, (info) => {
        info && this.usePanTilt(info);
      });
    },
    snapshot(snum) {
      this.videoPlayer && this.videoPlayer.snapshot && this.videoPlayer.snapshot(snum);
    },
    openAudio(snum, isEnable = true) {
      this.videoPlayer && this.videoPlayer.openAudio && this.videoPlayer.openAudio({ snum, isEnable });
    },
    closeVideo(snum) {
      this.videoPlayer && this.videoPlayer.closeVideo && this.videoPlayer.closeVideo(snum);
    },
    isEnableIvs(snum, isEnableIVS = true, ivsType = 1) {
      this.videoPlayer && this.videoPlayer.isEnableIvs && this.videoPlayer.isEnableIvs({ snum, isEnableIVS, ivsType });
    },
    waterMark(options) {
      this.videoPlayer && this.videoPlayer.waterMark && this.videoPlayer.waterMark(options);
    },
    downloadRecord(o, snum = 0) {
      if (!this.videoPlayer || !this.videoPlayer.downloadRecord) return;
      this.videoPlayer.downloadRecord(
        {
          ...o,
          snum,
          records: o.records || [],
          url: o.url || o.path,
          startTime: o.startTime,
          endTime: o.endTime,
          redirect: !!o.redirect,
        },
        {},
        true
      );
    },
  },
};
</script>

<style>
.dh-bg {
  background-color: #000;
  border: 2px solid #2db7f4;
}
.dh-desc {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  font-weight: bold;
  color: white;
  letter-spacing: 3px;
}
</style>
