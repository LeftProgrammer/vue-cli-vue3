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
    >
      <div
        class="position-relative"
        style="background-image: url(/static/monitor/map.png)"
        :title="title"
        @click="mark($event)"
      >
        <!-- <img
          id="map"
          src="/static/monitor/map.png"
          :title="title"
          class="map"
          @click="mark($event)"
        /> -->
        <div class="tips">提示：{{ title }}</div>
        <img
          :src="
            isFullscreen
              ? '/static/monitor/closeFull.png'
              : '/static/monitor/openFull.png'
          "
          class="openFull"
          @click="isFullscreen = !isFullscreen"
        />
        <div
          class="point"
          v-show="pointPosition.show"
          style="background-image: url(/static/monitor/point.png)"
          :style="{
            top: 'calc(' + pointPosition.top * 100 + '% - 37px)',
            left: 'calc(' + pointPosition.left * 100 + '% - 20px)',
          }"
        ></div>
        <!-- <img
          src="/static/monitor/point.png"
          class="point"
          v-show="pointPosition.show"
          :style="{
            top: 'calc(' + pointPosition.top * 100 + '% - 37px)',
            left: 'calc(' + pointPosition.left * 100 + '% - 20px)',
          }"
        /> -->
      </div>
      <div slot="footer" class="dialog-footer">
        <!--        <el-button @click="dialogVisible = false">取 消</el-button>-->
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
      pointPosition: { show: false, left: 0, top: 0 },
      options: [],
    };
  },
  methods: {
    /** 打开弹框 */
    showDialog() {
      if (this.readonly) return;
      this.$nextTick(() => {
        this.dialogVisible = true;
      });
      if (this.pointPop) {
        this.pointPosition = {
          show: true,
          left: this.pointPop.split(",")[0],
          top: this.pointPop.split(",")[1],
        };
      } else {
        this.pointPosition = { show: false, left: 0, top: 0 };
      }
    },
    /** 地图标点 */
    mark(event) {
      // let map = document.getElementById("map");
      let map = event.target;
      if (map.classList.contains("position-relative")) {
        let mapPosition = map.getBoundingClientRect();
        let mapWidth = map.offsetWidth;
        let mapHeight = map.offsetHeight;
        this.pointPosition.left = Number(event.offsetX / mapWidth).toFixed(6);
        this.pointPosition.top = Number(event.offsetY / mapHeight).toFixed(6);
        this.pointPosition.show = true;
      }
    },
    /** 确定按钮 */
    surePoint() {
      this.dialogVisible = false;
      this.pointPop = this.pointPosition.left + "," + this.pointPosition.top;
      console.log(this.pointPop);
      this.$emit("change", this.pointPop);
    },
    /** 取消按钮 */
    closePoint() {},
    // sure() {
    //   this.surePoint();
    //   this.$nextTick(() => {
    //     this.dialogVisible = false;
    //   });
    // },
  },
  watch: {
    point: {
      handler(newVal, oldVal) {
        this.pointPop = newVal;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.map {
  width: 100%; /* 确保图片填满容器 */
  height: 100%; /* 确保图片填满容器 */
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
  // background: #eee;
}

.position-relative {
  // width: 1122px;
  // height: 631px;
  height: 100%;
  min-height: 600px;
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.point {
  position: absolute;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

/deep/ .el-dialog .el-dialog__body {
  height: calc(100% - 125px);
}
</style>
