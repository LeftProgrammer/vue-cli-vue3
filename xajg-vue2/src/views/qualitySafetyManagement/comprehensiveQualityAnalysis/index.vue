<template>
  <div
    id="QualitySafetyManagementHome"
    class="w-100pre h-100pre"
    :style="{ zoom: scaleFactor }"
  >
    <div class="QualityEvaluation">
      <EvaluationSituation />
      <EvluationComplete />
    </div>
    <EvaluationQuantity />
    <!-- <div class="Detection">
      <DetectionResult />
      <DetectionCompletion />
    </div> -->
  </div>
</template>

<script>
import EvaluationSituation from "./components/EvaluationSituation";
import EvluationComplete from "./components/EvluationComplete";
// import DetectionResult from "./components/DetectionResult";
// import DetectionCompletion from "./components/DetectionCompletion";
import EvaluationQuantity from "./components/EvaluationQuantity";
export default {
  name: "ComprehensiveQualityAnalysis",
  components: {
    EvluationComplete,
    EvaluationSituation,
    // DetectionResult,
    // DetectionCompletion,
    EvaluationQuantity,
  },
  data() {
    return {
      scaleFactor: 1, // 默认缩放比例为 1
    };
  },
  created() {},
  mounted() {
    // 监听屏幕变化
    window.addEventListener("resize", this.initScalc);
    this.$nextTick(() => {
      this.initScalc();
    });
  },
  methods: {
    initScalc() {
      // 以1920x1080的设计分辨率为例
      var designWidth = 1920;
      var designHeight = 1080;

      // 调用函数获取缩放比例
      var scaleFactors = this.setScalc(designWidth, designHeight);
      this.scaleFactor = scaleFactors.scaleX;
      // console.log('缩放比例', scaleFactors.scaleX, scaleFactors.scaleY)
    },
    setScalc(designWidth, designHeight) {
      // 获取当前屏幕宽度和高度
      var screenWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      var screenHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;

      // 计算缩放比例
      var scaleX = screenWidth / designWidth;
      var scaleY = screenHeight / designHeight;

      // 返回一个包含缩放比例的对象
      return {
        scaleX: scaleX,
        scaleY: scaleY,
      };
    },
  },
};
</script>

<style scoped lang="scss">
#QualitySafetyManagementHome {
  background-color: #f0f4f8;
  overflow: hidden;
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  .QualityEvaluation {
    flex: 1;
    display: flex;
    width: 100%;
    gap: 16px;
    > div {
      height: 100%;
      background-color: #fff;
      border-radius: 4px;
      padding: 12px 16px 16px 16px;
      &:first-child {
        width: calc(33% - 8px);
      }
      &:last-child {
        width: calc(67% - 8px);
      }
    }
  }
  .Detection {
    flex: 1;
    display: flex;
    width: 100%;
    gap: 16px;
    > div {
      height: 100%;
      background-color: #fff;
      border-radius: 4px;
      padding: 12px 16px 16px 16px;
      width: calc(50% - 8px);
    }
  }
}
</style>
