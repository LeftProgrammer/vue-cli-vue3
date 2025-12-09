<template>
  <div class="video-container">
    <el-radio-group
      v-if="activeTab == 'video'"
      v-model="videoType"
      :disabled="cameraType != 'YSXY'"
      @input="inputChange"
    >
      <el-radio-button label="直播" />
      <el-radio-button label="回放" />
    </el-radio-group>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="视频监控" name="video">
        <el-row :gutter="20">
          <el-col :span="4" class="tree-column">
            <el-tree
              ref="tree"
              node-key="id"
              :data="treeData"
              :default-expanded-keys="['0']"
              :filter-node-method="filterNode"
              :props="defaultProps"
              highlight-current
              @node-click="handleNodeClick"
            />
          </el-col>
          <el-col :span="20">
            <div id="engineering-video" class="video-player">
              <video
                v-show="cameraType == 'M3U8' || cameraType == 'RTSP'"
                ref="videoRef"
                controls
                width="100%"
                poster="https://example.com/poster.jpg"
              />
              <div v-show="cameraType == 'YSXY'" id="ezuikit-player" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="监控设备" name="equipment">
        <equipment-management />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getList } from "../fireproofManagement/equipmentManagement/api";
import EquipmentManagement from "../fireproofManagement/equipmentManagement/index.vue";
import Hls from "hls.js";
import EZUIKit from "ezuikit-js";
import { getLink } from "./api";
export default {
  name: "SafeVideo",
  components: {
    EquipmentManagement,
  },
  data() {
    return {
      activeTab: "video",
      videoPlayer: null,
      tree: null,
      treeData: [],
      filterText: "",
      hls: null,
      streamUrl: "",
      currentNode: null,
      defaultProps: {
        children: "children",
        label: "name",
      },
      player: null,
      cameraType: "",
      videoType: "直播",
      selectNode: null,
    };
  },
  watch: {
    activeTab(newVal, oldVal) {
      // if (
      //   newVal === 'video' &&
      //   this.videoPlayer === null &&
      //   this.currentNode?.discernNumber
      // ) {
      //   // 当切换回视频标签页且有选中的视频时，重新初始化播放器
      //   this.$nextTick(() => {
      //     this.play(this.currentNode.discernNumber)
      //   })
      // } else if (newVal === 'equipment') {
      //   // 切换到设备管理标签页时，销毁视频播放器以释放资源
      //   if (this.videoPlayer) {
      //     this.destroyPlayer()
      //   }
      // }
    },
  },
  mounted() {
    this.getTree();
  },
  methods: {
    handleNodeClick(node) {
      this.destroyPlayer();
      this.selectNode = node;
      this.cameraType = node.videoType;
      this.$nextTick(() => {
        if (
          (this.cameraType == "M3U8" || this.cameraType == "RTSP") &&
          node.discernNumber
        ) {
          this.videoType = "直播";
          this.currentNode = node;
          this.play(node.discernNumber);
        } else {
          this.streamUrl = "";
          this.currentNode = node;
          this.getUrl();
        }
      });
    },
    inputChange(val) {
      this.videoType = val;
      this.handleNodeClick(this.selectNode);
    },

    getTree() {
      getList({}).then((res) => {
        this.treeData = res.data;
      });
    },

    async play(streamUrl) {
      this.streamUrl = streamUrl;
      this.destroyPlayer();
      this.error = null;
      this.initPlayer();
    },
    getUrl() {
      getLink({
        code: this.currentNode.code,
        channelId: this.currentNode.channelId,
      }).then((res) => {
        const data = res.data || {};
        if (!data.accessToken || !data.liveAddress) return;
        this.player = new EZUIKit.EZUIKitPlayer({
          id: "ezuikit-player",
          url: res.data.liveAddress,
          accessToken: res.data.accessToken,
          template: this.videoType == "直播" ? "pcLive" : "pcRec",
          autoplay: true,
          download: true,
          downloadRecord: true,
        });
      });
    },
    initPlayer() {
      const video = this.$refs.videoRef;
      if (Hls.isSupported()) {
        this.hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          enableWorker: true,
          abrEwmaDefaultEstimate: 500000,
          startLevel: -1,
        });

        this.hls.loadSource(this.streamUrl);
        this.hls.attachMedia(video);

        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.qualityLevels = this.hls.levels.map((level, index) => ({
            id: index,
            height: level.height,
            bandwidth: level.bitrate,
          }));

          if (this.autoplay) {
            video.play().catch((e) => {
              this.error = "自动播放被阻止: " + e.message;
            });
          }
        });

        this.hls.on(Hls.Events.ERROR, (event, data) => {
          this.handleHlsError(data);
        });

        video.addEventListener("play", () => {
          this.isPlaying = true;
        });

        video.addEventListener("pause", () => {
          this.isPlaying = false;
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari原生支持
        video.src = this.streamUrl;
        video.addEventListener("loadedmetadata", () => {
          if (this.autoplay) {
            video.play().catch((e) => {
              this.error = "自动播放被阻止: " + e.message;
            });
          }
        });
      } else {
        this.error = "您的浏览器不支持播放此视频格式";
      }
    },
    handleHlsError(data) {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            this.error = "网络错误，正在尝试恢复...";
            this.hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            this.error = "媒体错误，正在尝试恢复...";
            this.hls.recoverMediaError();
            break;
          default:
            this.error = "无法播放视频";
            this.destroyPlayer();
            break;
        }
      }
    },
    destroyPlayer() {
      if (this.hls) {
        this.hls.destroy();
        this.hls = null;
      }
      if (this.player) {
        this.player.destroy();
        this.player = null;
      }
    },
    // togglePlay() {
    //   const video = this.$refs.videoRef
    //   if (this.isPlaying) {
    //     video.pause()
    //   } else {
    //     video.play().catch((e) => {
    //       this.error = '播放失败: ' + e.message
    //     })
    //   }
    // },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
  },
};
</script>

<style scoped lang="scss">
.video-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .el-radio-group {
    position: absolute;
    top: 10px;
    right: 16px;
    z-index: 100;
  }
  .el-tabs {
    height: 100%;

    :deep(.el-tabs__content) {
      height: calc(100% - 40px - 15px);
      overflow: hidden;
    }

    :deep(.el-tab-pane) {
      height: 100%;
    }
  }
}

.el-row {
  height: 100%;
  margin: 0;
  .el-col {
    height: 100%;
    &:first-child {
      .el-input {
        margin-bottom: 16px;
      }
      .el-tree {
        height: 100%;
        overflow: auto;
      }
    }
    #engineering-video {
      width: 100%;
      height: 100%;
      video {
        height: 100%;
      }
      #ezuikit-player {
        height: 100%;
      }
    }
  }

  .tree-column {
    border-right: 1px solid #dcdfe6;
    padding-right: 10px;
  }
}
</style>
