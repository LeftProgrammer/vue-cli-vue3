<template>
  <div class="page-list">
    <content-layout :showPage="false" :defaultPercent="20" :minPercent="20" :useSplitpane="false">
      <template slot="tree">
        <div class="tree-content">
          <div style="
              padding: 10px;
              line-height: 20px;
              border-bottom: 3px solid #c0c4cc;
            ">
            摄像头列表
          </div>
          <el-tree :data="treeData" :props="defaultProps" :expand-on-click-node="false" ref="tree" node-key="corpId"
            default-expand-all highlight-current @node-click="handleNodeClick">
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <img v-if="data.id && data.deviceStatus === 1" :src="require(data.deviceStatus === 1
                ? '@/assets/img/monitor/online.png'
                : '@/assets/img/monitor/offline.png')
                " />
              <el-tooltip class="item" effect="dark" :content="node.label" placement="top-start">
                <span class="el-tree-node__label">{{ node.label }}</span>
              </el-tooltip>
            </div>
          </el-tree>
        </div>
      </template>
      <template slot="table">
        <div class="position-relative w-100pre h-100pre">
          <div id="mapbox" style="width: 100%; height: 100%; object-fit: fill">
            <div class="bg-map" :style="{ width: `${bgWidth}px` }">
              <img v-for="item in pointData" :key="item.id" :src="item.isHighlight
                  ? '/static/img/safe/jiankong3.png'
                  : item.deviceStatus === 1
                    ? '/static/img/safe/jiankong2.png'
                    : '/static/img/safe/jiankong1.png'
                " class="point" :class="item.isHighlight ? 'highlight' : ''" v-show="item.show" :style="{
                  top: 'calc(' + item.pointPositionTop + '% - 90px)',
                  left: 'calc(' + item.pointPositionLeft + '% - 17px)',
                  zIndex: item.deviceStatus,
                }" @click="pointClick(item)" />
            </div>
          </div>
          <div class="tuli">
            <div class="tuli-title">
              <div class="tuli-title-icon"></div>
              <div class="tuli-title-text">图例</div>
            </div>
            <div class="tuli-tu">
              <div>
                <div>离线</div>
                <img :src="'/static/img/safe/jiankong1.png'" />
              </div>
              <div>
                <div>在线</div>
                <img :src="'/static/img/safe/jiankong2.png'" />
              </div>
              <div>
                <div>选中</div>
                <img :src="'/static/img/safe/jiankong3.png'" />
              </div>
            </div>
          </div>
          <div class="control" v-show="show_video && videoType == 'RTSP'">
            <div class="flex justify-between text-fff mb-20">
              <div class="scale flex">
                <div class="iconfont icon-big font-24 mr-20" @click="controlOperateCamera(1, 1)"></div>
                <div class="iconfont icon-scale font-24" @click="controlOperateCamera(1, 2)"></div>
              </div>
              <div class="blur flex">
                <div>
                  <el-input-number style="width: 100px" size="small" v-model="step" :step="1" step-strictly :min="1"
                    :max="8" @change="changeStep"></el-input-number>
                </div>
              </div>
            </div>

            <div class="flex justify-between text-fff mb-20">
              <div class="scale flex">
                <div class="iconfont icon-blur-add font-24 mr-20" @click="controlOperateCamera(2, 1)"></div>
                <div class="iconfont icon-blur-scalc font-24" @click="controlOperateCamera(2, 2)"></div>
              </div>
              <div class="light flex">
                <div class="iconfont icon-light-add font-24 mr-20" @click="controlOperateCamera(3, 1)"></div>
                <div class="iconfont icon-light-scalc font-24" @click="controlOperateCamera(3, 2)"></div>
              </div>
            </div>
            <div class="control-circle">
              <div class="button up" @click="controlOperateDirect(1, 1)">
                <div class="content iconfont icon-up2"></div>
              </div>
              <div class="button right" @click="controlOperateDirect(4, 1)">
                <div class="content iconfont icon-right"></div>
              </div>
              <div class="button down" @click="controlOperateDirect(3, 1)">
                <div class="content iconfont icon-down2"></div>
              </div>
              <div class="button left" @click="controlOperateDirect(2, 1)">
                <div class="content iconfont icon-left"></div>
              </div>
              <div class="circal" @click="controlOperateDirect(0, 0)">
                <div class="content iconfont icon-stop font-48"></div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </content-layout>
    <!-- 视频播放 -->
    <el-dialog :before-close="videoClose" :show-close="true" :visible.sync="show_video" append-to-body
      :title="videoName" v-draggable destroy-on-close :close-on-click-modal="false">
      <div class="flex justify-center w-100pre h-600">
        <VideoPlay ref="closedAreaMonitor" :refKey="curItem.refKey" class="w-100pre h-100pre" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, getRtspUrl, rtspOnline } from "./api";
import { bimconfig } from "@/config/bimconfig";
import { dateFormat } from "@/utils";
import * as UrlUtil from "@/utils/url";
import { BaseMixin } from "@/mixins/BaseMixin";
import ContentLayout from "@/components/ContentLayout/TreeTable";
import Index from "../../../home/index.vue";
import {
  operateCamera,
  operateDirect,
} from "../forestFirePreventionMonitor/api";
// import BimEngine from "@/components/BimEngine/index";
export default {
  name: "project-pbs",
  mixins: [BaseMixin],
  components: {
    Index,
    ContentLayout,
    //   BimEngine
  },
  data() {
    return {
      /**树结构默认属性 */
      defaultProps: {
        children: "children",
        label: "name",
        // isLeaf: "leaf",
      },
      treeData: [],
      pointData: [],
      /**请求参数 */
      queryParams: { type: "2" },
      /**bim相关参数 */
      bimconfig: bimconfig.find((x) => x.use) || {},
      show_video: false,
      treeDataInited: false,
      videoName: "",
      curItem: {},
      //定时任务
      videoInterval: null,
      failComputeDict: {},
      bgWidth: 0,
      step: 1,
      direct: 0,
      command: 0,
      channelId: "",
      videoType: "M3U8",
      allRtspInfo: [],
      flattenTreeData: [],
    };
  },
  computed: {},
  created() {
    this.initTree();
  },
  mounted() {
    this.setWidth();
  },
  methods: {
    controlOperateCamera(operateType, direct) {
      this.direct = direct;
      let param = {
        channelId: this.channelId, //视频通道编码，第一个$后数字代表通道类型，必须是1，且摄像头类型需是球机(cameraType字段必须是1)
        operateType: operateType, //操作类型：1=变倍，2=变焦，3=光圈
        direct: direct, //方向：1=增加，2=减小
        step: this.step, //步长（1-8的整数） ，代表转动幅度大小
        command: 1, //命令：0=停止, 1=开启
        extend: "0", //扩展数据
      };
      operateCamera(param).then((res) => {
        console.log("控制", res);
      });
    },
    // 控制监控摄像头
    controlOperateDirect(direct, command) {
      this.direct = direct;
      this.command = command;
      let param = {
        channelId: this.channelId, //视频通道编码，第一个$后数字代表通道类型，必须是1，且摄像头类型需是球机(cameraType字段必须是1)
        direct: direct, //方向：1=上，2=下，3=左，4=右，5=左上，6=左下，7=右上，8=右下
        stepX: this.step, //步长（1-8的整数） ，代表转动幅度大小
        command: command, //命令：0=停止, 1=开启
        extend: "0", //扩展数据
        stepY: "0", //垂直方向步长（1-8的整数），代表转动幅度大小
      };
      operateDirect(param).then((res) => {
        console.log("控制", res);
      });
    },
    changeStep() {
      this.controlOperateDirect(this.direct, this.command);
    },
    setWidth() {
      let img = new Image();
      // img.src = "/static/monitor/map.jpg";
      // 获取的 .point-dialog 下 .el-dialog__body的高度
      img.onload = () => {
        console.log("width:" + img.width + ",height:" + img.height);
        console.log("img.onload");
        let dialogHeight = document.getElementById("mapbox");
        console.log("dialogHeight:", dialogHeight.clientHeight);
        // 获取 .bg-map的高度
        this.bgWidth =
          (img.width * (dialogHeight.clientHeight - 15)) / img.height;
        console.log("bgWidth:" + this.bgWidth);
      };
    },
    videoClose(done) {
      let ref = this.$refs.closedAreaMonitor;
      if (ref) {
        this.changeStep();
        ref.destroyPlayer();
      }
      this.$nextTick(() => {
        done();
      });
    },
    handleNodeClick(node) {
      this.treeData.forEach((items) => {
        items.children.forEach((item) => {
          let isHighlight = false;
          // 点击节点
          if (node.id) {
            isHighlight = item.id === node.id;
          }
          // 点击分类
          if (node.children) {
            isHighlight =
              node.children.findIndex((child) => child.id === item.id) > -1;
          }
          this.$set(item, "isHighlight", isHighlight);
          if (node.id === item.id) {
            this.pointClick(item);
          }
        });
      });
    },
    /** 播放视频 */
    async pointClick(item) {
      if (item.deviceStatus !== 1) {
        this.$message.warning("当前设备已离线");
        return;
      }
      console.log("视频流播放 pointClick", item);
      this.curItem = item;
      this.url = item.discernNumber;
      this.videoName = item.name;
      this.videoType = item.videoType || "M3U8";
      this.show_video = true;
      // 如果是rtsp 需要换取token
      console.log("videoType", item.videoType);
      if (this.videoType == "RTSP") {
        this.channelId = item.channelId;
        let res = await getRtspUrl(item.channelId);
        const { success, data, message } = res;
        console.log("需要换取token", res);
        if (!success) {
          this.$message.warning(message || "获取当前设备rtsp地址失败");
          return;
        }
        item.discernNumber = `${data.url}?token=${data.token}`;
      }
      this.$nextTick(() => {
        const refs = this.$refs.closedAreaMonitor;
        if (refs) {
          if (Array.isArray(refs)) {
            if (refs.length > 0)
              refs[0].play(item.discernNumber, this.videoType);
          } else {
            refs.play(item.discernNumber, this.videoType);
          }
        }
      });
    },

    /**初始化 */
    initTree() {
      this.treeData = [];
      this.loadNode();
    },
    /**获取列表数据 */
    loadNode(node, resolve) {
      list(this.queryParams).then((res) => {
        if (res.success) {
          this.treeData = res.data.map((item) => {
            const list = item.list.map((x) => {
              x.refKey = "VideoPlay_" + x.id;
              return x;
            });
            return {
              name: item.name,
              children: list,
            };
          });
          this.flattenTreeData = this.flattenData(this.treeData);
          this.computeVideoUrl();

          this.treeData.forEach((child) => {
            child.children.forEach((item) => {
              if (item.point && item.point.split(",").length === 2) {
                this.$set(item, "show", true);
                this.$set(item, "pointPositionLeft", item.point.split(",")[0]);
                this.$set(item, "pointPositionTop", item.point.split(",")[1]);
              } else {
                this.$set(item, "show", false);
                this.$set(item, "pointPositionLeft", 0);
                this.$set(item, "pointPositionTop", 0);
              }
              this.$set(item, "isHighlight", false);

              this.pointData.push(item);
            });
          });
          this.treeDataInited = true;
        }
      });
    },
    flattenData(treeData) {
      let flatArray = [];
      function recurse(nodes) {
        nodes.forEach((node) => {
          if (node.children && node.children.length > 0) {
            recurse(node.children);
          } else {
            flatArray.push(node);
          }
        });
      }
      recurse(treeData);
      return flatArray;
    },
    async getrtspOnline(codes) {
      let { success, data } = await rtspOnline(codes);
      if (!success) {
        this.allRtspInfo = [];
        this.$message("获取rtsp在线状态失败");
        return;
      }
      this.allRtspInfo = data?.records || [];
    },
    /**视频轮询 */
    async computeVideoUrl() {
      // 找出所有 的rtsp 设备
      let rtspDevice = this.flattenTreeData.filter(
        (x) => x.videoType == "RTSP"
      );
      if (rtspDevice.length > 0) {
        let channelCodes = rtspDevice.map((x) => x.channelId).join(",");
        await this.getrtspOnline(channelCodes);
      } else {
        this.allRtspInfo = [];
      }
      this.flattenTreeData.forEach((item) => {
        if (item.videoType == "RTSP") {
          let rtsp = this.allRtspInfo.find(
            (x) => x.channelCode == item.channelId
          );
          if (rtsp) {
            if (rtsp.isOnline == 1) {
              item.deviceStatus = 1;
            } else {
              item.deviceStatus = 0;
            }
          } else {
            item.deviceStatus = 0;
          }
          this.$forceUpdate();
        } else {
          if (!item.deviceStatus && item.discernNumber) {
            if (
              !this.failComputeDict[item.discernNumber] ||
              this.failComputeDict[item.discernNumber] <= 3
            ) {
              UrlUtil.getURLOk(item.discernNumber, {
                success: () => {
                  item.deviceStatus = 1;
                  this.$forceUpdate();
                },
                fail: () => {
                  if (!this.failComputeDict[item.discernNumber]) {
                    this.failComputeDict[item.discernNumber] = 1;
                  } else {
                    this.failComputeDict[item.discernNumber] =
                      this.failComputeDict[item.discernNumber] + 1;
                  }
                },
              });
            }
          }
        }
      });
      if (!this.videoInterval) {
        this.videoInterval = setInterval(this.computeVideoUrl, 3000);
      }
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
  },
  beforeDestroy() {
    this.videoInterval && clearInterval(this.videoInterval);
  },
};
</script>
<!--监控 控制器-->
<style lang="scss" scoped>
.icon-big:hover {
  transform: scale(1.2);
}

.icon-scale:hover {
  transform: scale(1.2);
}

.icon-blur-add:hover {
  transform: scale(1.2);
}

.icon-blur-scalc:hover {
  transform: scale(1.2);
}

.control {
  position: absolute;
  z-index: 3000;
  bottom: 12%;
  right: 8%;
}

.control-circle {
  width: 200px;
  height: 200px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  border-radius: 50%;
  transform-origin: center center;
  transform: rotate(45deg);
  background: #e0e0e0;

  //box-shadow: 20px 20px 60px #bebebe,
  //-20px -20px 60px #ccc;
  .circal {
    position: absolute;
    z-index: 9999;
    height: 50%;
    border-radius: 50%;
    outline: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 50%;
    background: #e0e0e0;
    box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
    top: calc(50% - 50px);
    left: calc(50% - 50px);
    transform-origin: center center;
    transform: rotate(-45deg);
  }

  .circal:active {
    transition: box-shadow 0.1s ease;
    background: #000;
    box-shadow: inset -5px 5px 10px #191919, inset 5px -5px 10px #292929;
  }

  .circal:hover {
    background: #ccc;
  }

  .button {
    width: 50%;
    height: 50%;
    outline: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button:active {
    transition: box-shadow 0.1s ease;
    background: #000;
    box-shadow: inset -5px 5px 10px #191919, inset 5px -5px 10px #292929;
  }

  .button:hover {
    background: #ccc;
  }

  .up .content {
    transform-origin: center center;
    transform: rotate(-45deg);
  }

  .right .content {
    transform-origin: center center;
    transform: rotate(-45deg);
  }

  .down .content {
    transform-origin: center center;
    transform: rotate(45deg);
  }

  .left .content {
    transform-origin: center center;
    transform: rotate(-135deg);
  }
}
</style>
<style scoped lang="scss">
::v-deep .custom-tree-node {
  width: calc(100% - 20px) !important;
  justify-content: unset !important;

  img {
    width: 19px;
    height: 19px;
  }
}

.map {
  width: 100%;
  /* 确保图片填满容器 */
  height: 100%;
  /* 确保图片填满容器 */
}

.point {
  position: absolute;
  width: 60px;
}

.highlight {
  transform: translateY(-10px);
  scale: 1.3;
  filter: brightness(1.3);
  z-index: 1;
}

.page-list {
  width: 100%;
  height: 100%;
  padding: 15px;

  .tree-title {
    margin: 5px;
    cursor: pointer;
  }

  .tree-content {
    height: 100%;
    border: 1px solid #eee;

    .tree-dom {
      margin: 10px;
      margin-left: 0px;
      height: calc(100% - 40px);
    }

    .el-tree {
      height: calc(100% - 43px) !important;
    }
  }

  .custom-tree-node {
    width: 100%;
    display: flex;
    justify-content: space-between;

    &:hover {
      .command-content {
        display: block;
      }
    }

    .node-label {
      width: calc(100% - 40px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .command-content {
      position: absolute;
      right: 0px;
      z-index: 1;
      display: none;
    }

    .el-icon-more {
      transform: rotate(90deg);
    }
  }

  #mapbox {
    overflow-x: scroll;
    /* 横向滚动 */
    overflow-y: hidden;
    /* 禁止纵向滚动 */
    position: relative;
    /* 相对定位 */
    height: 100%;
    width: 100%;
  }

  .bg-map {
    // background-image: url("/public/static/monitor/map.jpg");
    background-size: auto 100%;
    /* 高度撑满容器 */
    background-repeat: no-repeat;
    height: 100%;
    /* 让背景高度撑满容器 */
    position: relative;
  }

  .tuli {
    position: absolute;
    bottom: 16px;
    left: 16px;
    background: rgba(0, 0, 0, 0.31);
    border-radius: 4px 4px 4px 4px;
    width: 230px;
    height: 120px;
    index: 99;

    .tuli-title {
      display: flex;
      align-items: center;
      margin: 10px 0 0 10px;

      .tuli-title-icon {
        width: 2px;
        height: 8px;
        background: #ffffff;
        margin-right: 10px;
      }

      .tuli-title-text {
        color: #ffffff;
      }
    }

    .tuli-tu {
      display: flex;
      font: menu;
      color: #ffffff;
      justify-content: space-around;
      padding-top: 16px;

      img {
        width: 26px;
        height: 39px;
      }
    }
  }
}

.el-col .el-input {
  width: 60%;
}

.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}
</style>
