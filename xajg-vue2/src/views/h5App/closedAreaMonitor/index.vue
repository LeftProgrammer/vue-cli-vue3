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
          <!-- 赛选条件 -->
          <el-image class="w-20" :src="require('../img/shaixuan.png')" @click="showSearch"></el-image>
        </div>
      </div>
    </div>

    <div class="flex align-center m-10">
      <div class="mr-3 h-10 w-2 bg-0096" style="background: #0096ff"></div>
      <div class="w-200 flex font-14 font-w-550">
        <div class="font-14 mr-5">监控列表</div>
        <div class="ml-5 font-14"></div>
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

    <el-drawer size="60%" :visible.sync="showSelect" direction="rtl" :with-header="false">
      <div class="w-100pre py-5 px-10">
        <div style="
            margin-bottom: 10px;
            border-bottom: #d6d6d6 1px solid;
            padding-bottom: 5px;
          ">
          <span class="font-w-550">所属区域</span>
        </div>
        <div class="flex flex-wrap">
          <div class="mb-5" v-for="(Item, Index) in areaList" :key="Index" :width="Item.width" :height="Item.height"
            :order="Index">
            <div class="p-3" :style="{
              backgroundColor: Item.choosed ? '#0096ff' : '',
              color: Item.choosed ? '#ffffff' : '',
              borderRadius: '8px',
              border: '1px solid #D6D6D6',
              cursor: 'pointer',
              textAlign: 'center'
            }" @click="choose(Item)">
              <span :style="{ color: Item.choosed ? '#ffffff' : '' }">{{
                Item.name
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div style="
          position: absolute;
          bottom: 0px;
          left: 0;
          padding: 20px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          width: 250px;
          border-top: 1px solid #d6d6d6;
        ">
        <el-button type="primary" style="width: 80px" :plain="true" @click="reset">重置</el-button>
        <el-button type="primary" style="width: 80px" @click="search">查询</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { list, firstFrame } from "./api.js";
import * as UrlUtil from "@/utils/url";
import { getRtspUrl } from '@/views/safetyManagement/fireproofManagement/closedAreaMonitor/api';
export default {
  components: {},
  data() {
    return {
      query: {
        name: ""
      },
      videoList: [],
      showVideoList: [
      ],

      player: "",
      loading: false,
      areaList: [],
      showSelect: false,
      chooseNames: [],
      // 用于获取封面
      poster_url: "",
      playIndex: 0,
      //定时任务
      videoInterval: null,
      failComputeDict: {}
    };
  },

  created() {
    this.getListData();
  },
  methods: {
    async playVideo(item, index) {
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
    choose(item) {
      item.choosed = !item.choosed;
      if (item.choosed) {
        this.chooseNames.push(item.name);
      } else {
        this.chooseNames = this.chooseNames.filter((x) => x != item.name);
      }
      this.$forceUpdate();
    },
    showSearch() {
      this.showSelect = true;
      console.log("搜索");
    },

    reset() {
      this.areaList.forEach((x) => (x.choosed = false));
      this.showVideoList = this.videoList;
      this.close();
      this.$forceUpdate();
      this.computeVideoUrl();
    },
    search() {
      let arr = [];
      console.log("查询条件");
      let stringWithoutSpaces = this.query.name.replace(/\s/g, "");
      if (stringWithoutSpaces) {
        arr = this.videoList.filter(
          (x) =>
            this.chooseNames.includes(x.regionType) &&
            x.regionType.includes(stringWithoutSpaces)
        );
      } else {
        arr = this.videoList.filter((x) =>
          this.chooseNames.includes(x.regionType)
        );
      }
      this.$set(this, "showVideoList", arr);
      this.close();
      this.$forceUpdate();
    },
    close() {
      this.showSelect = false;
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
      try {
        let params = {
          type: "2"
        };
        let res = await list(params);
        const { success, data } = res;
        if (!success) {
          this.videoList = [];
          this.showVideoList = [];
          return;
        }
        let index = 0;
        if (data && Array.isArray(data)) {
          // 用于存储结果的数组
          const resultArray = [];
          const areaList = [];
          // 遍历data数组
          for (const area of data) {
            area.width = index * 10;
            area.height = index * 10;
            areaList.push(area);
            // areaList.push(...area.list);
            index++;
            // 遍历每个区域的列表
            if (area?.list && Array.isArray(area.list)) {
              for (const item of area.list) {
                // 提取name和discernNumber组成对象
                const entry = {
                  id: item.id,
                  refKey: "VideoPlay_" + item.id,
                  name: item.name,
                  discernNumber: item.discernNumber,
                  regionType: item.regionType,
                  muted: true
                };

                // 将对象添加到结果数组中
                resultArray.push(entry);
              }
            }
          }
          this.videoList = resultArray;
          this.showVideoList = resultArray;
          this.areaList = areaList;

          this.computeVideoUrl();
        } else {
          this.videoList = [];
          this.showVideoList = [];
          this.areaList = [];
        }
      } catch (error) {
        console.error("An error occurred:", error);
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
              success: function () {
                item.deviceStatus = 1;
                this.$forceUpdate();
              }.bind(this),
              fail: function () {
                if (!this.failComputeDict[item.discernNumber]) {
                  this.failComputeDict[item.discernNumber] = 1;
                } else {
                  this.failComputeDict[item.discernNumber] += 1;
                }
              }.bind(this)
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

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill,
      minmax(70px, 2fr));
  /* 每列最小宽度100px，自动填充 */
  grid-gap: 5px;
  /* 项目之间的间隔 */
}

.grid-item {
  border-radius: 5px;
  overflow: hidden;
}

.grid-item>div {
  border: 1px solid #d6d6d6;
  cursor: pointer;
  text-align: center;
  padding: 0 10px;
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
