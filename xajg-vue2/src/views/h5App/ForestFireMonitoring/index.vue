<template>
  <div class="main-page w-100pre h-100pre" v-loading="loading">
    <!-- border-top: 1px solid #f5f5f5; -->
    <div class="bg-fff">
      <div class="rounded-8">
        <div class="flex align-center">
          <el-input placeholder="请输入设备名称" v-model="query.name">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <div class="font-w-550 mx-10" style="color: #1298fa; min-width: 33px" @click="getQueryListData">
            搜索
          </div>
        </div>
      </div>
    </div>

    <div style="
        flex-direction: row;
        display: flex;
        align-items: center;
        margin: 10px;
      ">
      <div style="margin-right: 3px; height: 10px; width: 2px; background: #0096ff"></div>
      <div style="
          width: 200px;
          flex-direction: row;
          font-size: 14px;
          font-weight: 550;
          display: flex;
        ">
        <div style="font-size: 14px; margin-left: 5px">监控列表</div>
        <div class="ml-5" style="font-size: 14px; margin-left: 5px"></div>
        ({{ showVideoList.length || 0 }})
      </div>
    </div>

    <el-row :gutter="10">
      <el-col :span="12" class="mb-10" v-for="(item, index) in showVideoList" :key="index">
        <div class="w-100pre rounded-8 over-h" style="border: 1px solid #f8f8f8">
          <div style="background-color: #f8f8f8" class="flex w-100pre h-120 align-center justify-center">
            <div v-if="!item.isPlay" class="" @click="playVideo(item, index)">
              <el-image v-if="item.deviceStatus == 1" :src="require('../img/play.png')" class="w-60 h-60"
                style="margin: auto"></el-image>

              <el-image v-else :src="require(`../img/offline.png`)" class="w-60 h-60" style="margin: auto"></el-image>
            </div>
            <VideoPlay v-else :ref="item.refKey" :refKey="item.refKey" class="w-100pre h-100pre"
              :url="item.discernNumber" />
          </div>
          <div class="text-ellipsis font-w-600 bg-fff py-5 px-10">
            {{ item.name || "待维护" }}
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { list } from "./api.js";
import * as UrlUtil from "@/utils/url";
export default {
  data() {
    return {
      query: {
        name: ""
      },
      videoList: [],
      showVideoList: [],
      player: "",
      loading: false,
      //定时任务
      videoInterval: null,
      failComputeDict: {}
    };
  },

  created() {
    this.getListData();
  },
  methods: {
    init() { },
    playVideo(item, index) {
      if (item.deviceStatus != 1) {
        this.$message.warning("当前设备已离线");
        return;
      }
      for (let i = 0; i < this.showVideoList.length; i++) {
        const x = this.showVideoList[i];
        if (i === index) {
          x.isPlay = true;
        } else {
          // x.isPlay = false;
        }
      }
      this.$forceUpdate();
      // 播放视频
      this.$nextTick(() => {
        let refs = this.$refs[item.refKey];
        if (refs && refs.length > 0) {
          refs[0].play(item.discernNumber, "M3U8");
        }
      });
    },
    getQueryListData() {
      this.loading = true;
      //  关闭 播放器
      if (this.player) {
        this.player.destroy();
        this.player = null;
      }
      this.showVideoList.forEach((x) => {
        this.$set(x, "isPlay", false);
      });
      let stringWithoutSpaces = this.query.name.replace(/\s/g, "");
      let arr = this.videoList.filter((x) =>
        x.name.includes(stringWithoutSpaces)
      );
      this.showVideoList = arr;

      this.$forceUpdate();
      this.computeVideoUrl();

      this.loading = false;
    },
    async getListData(type) {
      this.loading = true;
      try {
        let params = {
          type: "1"
        };
        let res = await list(params);
        console.log("请求参数", params, "结果", res);
        if (res.success) {
          let list = res.data.map((item) => {
            // item.discernNumber = "rtmp://218.94.137.117:1935/iptv/cctv8hd";
            // item.discernNumber =
            //   "https://abcnews-streams.akamaized.net/hls/live/2023565/abcnews6/master.m3u8";
            return {
              refKey: "VideoPlay_" + item.id,
              muted: true,
              ...item
            };
          });

          this.videoList = list;
          this.showVideoList = list;
          this.$forceUpdate();
          this.computeVideoUrl();
        } else {
          this.videoList = [];
          this.showVideoList = [];
        }

        this.init();
        this.loading = false;
      } catch (error) {
        console.error("An error occurred:", error);
        this.videoList = [];
        this.showVideoList = [];
        return {
          error: "An error occurred"
        };
      }
    },
    /**视频轮询 */
    computeVideoUrl() {
      this.showVideoList.forEach((item) => {
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
              }
            });
          }
        }
      });

      if (!this.videoInterval) {
        this.videoInterval = setInterval(this.computeVideoUrl, 3000);
      }
    }
  },
  beforeDestroy() {
    this.videoInterval && clearInterval(this.videoInterval);
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  background-color: #eef5fa;
  border: 1px solid #eef5fa;
}

/deep/ .iconqingxiLOGO {
  display: none !important;
}

/deep/ .no-padding {
  display: none !important;
}

// player-content 最后一个子div
/deep/.player-content div:last-child>div {
  /* 在这里添加你的样式 */
  display: none !important;
}

/deep/.video-tools {
  span {
    width: 20px !important;
  }

  span[title="录像"] {
    display: none !important;
  }

  span[title="全屏"] {
    margin-right: 20px;
  }
}
</style>
