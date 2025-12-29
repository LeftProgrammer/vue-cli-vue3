<template>
  <div class="w-100pre h-100pre">
    <div id="ws-real-player" class="w-100pre h-100pre"></div>
  </div>
</template>

<script>
import PlayerManager from "./icc/PlayerManager.js";
export default {
  data() {
    return {
      realWsUrl: "ws://10.64.5.5:9100/",
      realChannelId: "",
      streamType: "1",
      recordWsUrl: "",
      recordRtsp: "",
      recordChannelId: "",
      recordRecords: "[]",
      realPlayer: null,
      recordPlayer: null,
    };
  },
  mounted() {
    this.initPlayers();
  },
  methods: {
    initPlayers() {
      this.realPlayer = new PlayerManager({
        el: "ws-real-player",
        type: "real",
        maxNum: 25,
        num: 1,
        showControl: true,
        prefixUrl: "lib",
        receiveMessageFromWSPlayer: this.receiveMessageFromWSPlayer,
      });

      this.recordPlayer = new PlayerManager({
        el: "ws-record-player",
        type: "record",
        maxNum: 4,
        num: 1,
        showControl: true,
        prefixUrl: "lib",
        receiveMessageFromWSPlayer: this.receiveMessageFromWSPlayer,
      });
    },
    receiveMessageFromWSPlayer(methods, data, err) {
      switch (methods) {
        case "initializationCompleted":
          console.log("初始化完成");
          break;
        case "changeStreamType":
          // console.log(methods, data, err)
          // this.play()
          break;
        case "realSuccess":
          console.log("实时预览成功");
          break;
        case "realError":
          console.log("实时预览失败", err);
          break;
        case "talkError":
          console.log("对讲失败");
          break;
        case "selectWindowChanged":
          console.log(data, "返回窗口信息");
          break;
        case "windowNumChanged":
          console.log(data, "返回显示的窗口数量");
          break;
        case "closeVideo":
          if (!data.changeVideoFlag) {
            console.log(`窗口${data.selectIndex}的视频已关闭`);
          }
          break;
        case "statusChanged":
          break;
        case "errorInfo":
          console.log(data, "可打印查看错误消息");
      }
    },
    play(rtspURL) {
      console.log("restpb播放地址", rtspURL);
      if (this.$store.state.videoConfig) {
        let { originalHost, host } = this.$store.state.videoConfig;
        if (host) {
          this.realWsUrl = `ws://${host}/`;
          if (window.location.protocol === "https:") {
            this.realWsUrl = `wss://${host}/`;
          }
        }
      }
      console.log(
        "realWsUrl  store/realWsUrl",
        this.$store.state.videoConfig,
        this.realWsUrl
      );
      this.realPlayer.realByUrl({
        rtspURL: rtspURL,
        // rtspURL: this.realRtsp,
        wsURL: this.realWsUrl,
        selectIndex: 0,
        // channelId: this.realChannelId,
        streamType: parseInt(this.streamType),
        playerAdapter: "stretching",
      });
      // this.realPlayer.setPlayerNum(4);
    },
    playRecord() {
      let records;
      try {
        records = JSON.parse(this.recordRecords);
      } catch (e) {
        records = [];
      }
      this.recordPlayer.recordByUrl({
        wsURL: this.recordWsUrl,
        rtspURL: this.recordRtsp,
        records: records,
        selectIndex: 0,
      });
    },
    closeReal() {
      this.realPlayer && this.realPlayer.close(0);
    },
    closeRecord() {
      this.recordPlayer && this.recordPlayer.close(0);
    },
    destroyPlayer() {
      console.log("rtsp销毁组件");
    },
  },
};
</script>

<style scoped lang="scss">
:deep(.stream) {
  display: none;
}

:deep(.one-screen-icon) {
  display: none;
}

:deep(.two-screen-icon) {
  display: none;
}

:deep(.four-screen-icon) {
  display: none;
}

:deep(.nine-screen-icon) {
  display: none;
}

:deep(.twenty-five-screen-icon) {
  display: none;
}

:deep(.sixteen-screen-icon) {
  display: none;
}

:deep(.three-screen-icon) {
  display: none;
}

:deep(.six-screen-icon) {
  display: none;
}

:deep(.eight-screen-icon) {
  display: none;
}

:deep(.custom-screen-icon) {
  display: none;
}

:deep(.ws-ctrl-btn-spread-2) {
  display: none;
}

:deep(.close-all-video) {
  display: none;
}
:deep(.close-icon) {
  display: none;
}
.container {
  display: flex;
  width: 100%;
  height: 100%;
}

.container>div {
  margin-left: 50px;
}

input,
textarea {
  display: block;
  margin-bottom: 2px;
  width: 100%;
  height: 20px;
}
</style>
