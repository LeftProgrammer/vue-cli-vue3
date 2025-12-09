<template>
  <!--关联位置-->
  <div>
    <el-input disabled placeholder="请选择" v-model="pointPop">
      <template slot="append" v-if="!readonly">
        <div @click.stop="showDialog">选择</div>
      </template>
    </el-input>
    <el-dialog
      append-to-body
      width="55.55%"
      title="关联位置"
      :fullscreen="isFullscreen"
      :visible.sync="dialogVisible"
      @close="closePoint"
      custom-class="point-dialog"
      ref="pointDialog"
    >
      <div class="position-relative over-h">
        <div class="tips index-99">提示：{{ title }}</div>
        <img
          :src="
            isFullscreen
              ? '/static/monitor/closeFull.png'
              : '/static/monitor/openFull.png'
          "
          class="openFull index-99"
          @click.stop="handlerFulll"
        />
        <div id="mapbox" class="">
          <div
            class="position-relative"
            :class="pageType == 'default' ? 'bg-map' : 'device-map'"
            :style="{ width: `${bgWidth}px` }"
            :title="title"
            @click="getCoordinates"
          >
            <div
              class="iconfont icon-point font-36 position-absolute"
              style="color: greenyellow"
              v-if="markerVisible"
              :style="{
                top: `calc(${markerY}% - 30px)`,
                left: `calc(${markerX}% - 16px)`,
              }"
            ></div>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          
          @click="surePoint"
          v-if="!readonly"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "relate-place-index",
  model: {
    prop: "point",
    event: "change",
  },
  props: {
    /**位置 */
    point: {
      type: String,
      default: "",
    },
    /**是否查看 */
    readonly: {
      type: Boolean,
      default: false,
    },
    /**标题 */
    title: {
      type: String,
      default: "点击左键标记设备安装位置",
    },
  },
  created() {},
  mounted() {},
  components: {},
  computed: {},
  data() {
    return {
      pointPop: this.point,
      dialogVisible: false,
      isFullscreen: false,
      options: [],
      bgWidth: 0,
      markerX: 0,
      markerY: 0,
      markerVisible: false,
      pageType: "default",
    };
  },
  methods: {
    /** 打开弹框 */
    showDialog() {
      if (this.readonly) return;
      this.dialogVisible = true;

      if (this.pointPop) {
        console.log("pointPop:" + this.pointPop);
        this.markerVisible = true;
        this.markerX = this.pointPop.split(",")[0];
        this.markerY = this.pointPop.split(",")[1];
      } else {
        this.markerVisible = false;
      }
      this.$nextTick(() => {
        this.setWidth();
      });
    },
    setWidth() {
      let img = new Image();
      // 防汛一张图的时候使用 queryMap.png map.jpg
      let name = "queryMap.png";
      if (this.$route.path === "/monitor/device") {
        name = "queryMap.png";
        this.pageType = "device";
      } else {
        name = "map.jpg";
        this.pageType = "default";
      }
      img.src = `/static/monitor/${name}`;
      console.log("img.src ", this.$route.path, img.src);
      console.log("width:" + img.width + ",height:" + img.height);
      // 获取的 .point-dialog 下 .el-dialog__body的高度
      img.onload = () => {
        console.log("img.onload");
        let dialogHeight = document.querySelector(
          ".point-dialog .el-dialog__body"
        );
        console.log("dialogHeight:", dialogHeight.clientHeight);
        // 获取 .bg-map的高度
        this.bgWidth =
          (img.width * (dialogHeight.clientHeight - 35)) / img.height;
        console.log("bgWidth:" + this.bgWidth);
      };
    },

    handlerFulll() {
      this.isFullscreen = !this.isFullscreen;
      // 这里 需要设置图片的大小
      this.$nextTick(() => {
        let dialogHeight = document.querySelector(
          ".point-dialog .el-dialog__body"
        );
        // 获取 .map-box  元素 设置高度
        let mapbox = document.getElementById("mapbox");
        if (this.isFullscreen) {
          mapbox.style.height = dialogHeight.clientHeight - 20 + "px";
        } else {
          mapbox.style.height = 600 + "px";
        }
        console.log("mapbox.高度", mapbox.style.height);
        this.setWidth();
      });
    },
    /** 地图标点 */
    getCoordinates(event) {
      const mapRect = event.currentTarget.getBoundingClientRect();
      // 获取点击位置相对于 .map-box  元素的坐标
      const clickX = event.clientX - mapRect.left;
      const clickY = event.clientY - mapRect.top;
      // 打印相对坐标
      console.log(`Relative X: ${clickX}, Relative Y: ${clickY}`);
      this.markerX = Number((clickX / mapRect.width) * 100).toFixed(6);
      this.markerY = Number((clickY / mapRect.height) * 100).toFixed(6);
      this.markerVisible = true;
    },
    /** 确定按钮 */
    surePoint() {
      this.dialogVisible = false;
      this.pointPop = this.markerX + "," + this.markerY;
      console.log(this.pointPop);
      this.$emit("change", this.pointPop);
    },
    /** 取消按钮 */
    closePoint() {},
  },
  watch: {
    point: {
      handler(newVal, oldVal) {
        console.log("point", newVal);
        this.pointPop = newVal;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
#mapbox {
  overflow-x: scroll; /* 横向滚动 */
  overflow-y: hidden; /* 禁止纵向滚动 */
  position: relative; /* 相对定位 */
  height: 600px;
  width: 100%;
}

.device-map{
  // background-image: url("/public/static/monitor/queryMap.png");
  background-size: auto 100%; /* 高度撑满容器 */
  background-repeat: no-repeat;
  height: 100%; /* 让背景高度撑满容器 */
}
.bg-map {
  // background-image: url("/public/static/monitor/map.jpg");
  background-size: auto 100%; /* 高度撑满容器 */
  background-repeat: no-repeat;
  height: 100%; /* 让背景高度撑满容器 */
}
.map {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tips {
  font-size: 18px;
  color: #ffffff;
  position: absolute;
  top: 10px;
  left: 10px;
}

.openFull {
  width: 40px;
  position: absolute;
  top: 10px;
  right: 10px;
}

/deep/ .el-dialog .el-dialog__body {
  height: calc(100% - 125px);
}
</style>
