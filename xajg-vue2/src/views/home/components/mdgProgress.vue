<template>
  <div class="h-352 position-relative">
    <el-row v-show="current !== 2">
      <el-col :span="12">
        <div id="progressShowYear" class="w-100pre h-200"></div>
        <div class="text-center">
          <div class="mb-10">
            <span style="color: #999999">计划目标：</span>
            <span style="color: #1d2129"
            >{{ leftPlanTarget }}{{ leftUnit }}</span
            >
          </div>
          <div class="mb-10">
            <span style="color: #999999">实际完成：</span
            ><span style="color: #1298fa">{{ leftValue }}{{ leftUnit }}</span>
          </div>
          <div style="color: #1d1e29">{{ leftText }}</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div id="progressShowMonth" class="w-100pre h-200"></div>
        <div class="text-center">
          <div class="mb-10">
            <span style="color: #999999">计划目标：</span>
            <span style="color: #1d2129"
            >{{ rightPlanTarget }}{{ rightUnit }}</span
            >
          </div>
          <div class="mb-10">
            <span style="color: #999999">实际完成：</span
            ><span style="color: #4edc6f">{{ rightValue }}{{ rightUnit }}</span>
          </div>
          <div style="color: #1d1e29">{{ rightText }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 危岩体 -->
    <el-row v-show="current == 2" :gutter="50">
      <div class="flex justify-around px-20 mt-30">
        <div class="" v-for="(item, index) in dangerousRock" :key="index">
          <div
            class="w-120 h-120 flex mb-50"
            :class="index == 1 ? 'water-center-bg' : 'water-bg'"
          >
            <div class="index-9" style="margin: auto">
              <span class="font-36" :style="{ color: item.centerColor }">{{
                  item.value
                }}</span>
            </div>
          </div>
          <div class="text-center font-14" :style="{ color: item.tetxColor }">
            {{ item.name }}
          </div>
        </div>
      </div>
    </el-row>

    <div class="position-absolute bottom-0 left-0 w-100pre">
      <div class="flex align-center justify-between w-100pre">
        <div
          :class="current == index ? 'default-btn-sure' : ''"
          v-for="(item, index) in progressItemList"
          :key="index"
          class="default-btn"
          @click="choose(index, item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      dangerousRock: [],
      progressItemList: [],
      current: 0,
      yearEcharts: {},
      monthEcharts: {}
    };
  },
  created() {
    this.progressItemList = this.$store.state.progressShowList;
    this.dangerousRock = this.$store.state.dangerousRock;
  },
  mounted() {
    this.initChartYear();
    this.initChartMonth();
    this.choose(0, this.progressItemList[0]);
  },
  computed: {
    leftPlanTarget() {
      return this.progressItemList[this.current].left.planTaget;
    },
    leftUnit() {
      return this.progressItemList[this.current].left.unit;
    },
    leftValue() {
      return this.progressItemList[this.current].left.value;
    },
    leftText() {
      return this.progressItemList[this.current].left.text;
    },
    rightPlanTarget() {
      return this.progressItemList[this.current].right.planTaget;
    },
    rightUnit() {
      return this.progressItemList[this.current].right.unit;
    },
    rightValue() {
      return this.progressItemList[this.current].right.value;
    },
    rightText() {
      return this.progressItemList[this.current].right.text;
    }
  },
  methods: {
    choose(index, item) {
      this.current = index;
      if (index == 2) return;

      let percent = 0;
      if (item.left.planTaget > 0) {
        percent = (item.left.value / item.left.planTaget) * 100;
      }
      this.yearEcharts.option.series[0].data[0].value = Math.round(percent);

      percent = 0;
      if (item.right.planTaget > 0) {
        percent = (item.right.value / item.right.planTaget) * 100;
      }
      this.monthEcharts.option.series[0].data[0].value = Math.round(percent);

      this.yearEcharts.myChart.setOption(this.yearEcharts.option);
      this.monthEcharts.myChart.setOption(this.monthEcharts.option);
    },
    initChartYear() {
      var chartDom = document.getElementById("progressShowYear");
      var myChart = echarts.init(chartDom);
      let option;
      // 设置图表配置项
      option = {
        // tooltip: {
        //   //   formatter: "{a}<br/>{b} : {c}%",
        // },
        tooltip: {
          trigger: "none" // 禁用鼠标悬停事件
          // formatter: "{a}<br/>{b} : {c}%",
        },
        series: [
          {
            name: "press",
            type: "gauge",
            // center: ["50%", "50%"],

            radius: "90%",
            detail: {
              // valueAnimation: { duration: 1000, easing: "linear" },
              valueAnimation: true,
              formatter: "{value}%",
              fontSize: 24,
              offsetCenter: [0, "70%"]
            },
            data: [{ value: 10 }],
            // 分割线
            splitLine: {},
            // 仪表盘进度条
            progress: {
              show: true,
              roundCap: true,
              itemStyle: {
                color: "#1299FA"
              }
            },
            // 仪表盘指针
            pointer: {
              width: 4,
              itemStyle: {
                color: "#FF891A"
              }
            }
          }
        ]
      };

      option && myChart.setOption(option);

      window.addEventListener("resize", function () {
        myChart.resize();
      });

      this.yearEcharts = {
        option,
        myChart
      };
      setTimeout(() => {
        myChart.resize();
      });
    },
    initChartMonth() {
      var chartDom = document.getElementById("progressShowMonth");
      var myChart = echarts.init(chartDom);
      var option;
      // 设置图表配置项
      option = {
        // tooltip: {
        //   formatter: "{a}<br/>{b} : {c}%",
        // },
        tooltip: {
          trigger: "none" // 禁用鼠标悬停事件
        },
        series: [
          {
            name: "press",
            type: "gauge",
            radius: "90%",
            detail: {
              // valueAnimation: { duration: 1000, easing: "linear" },
              valueAnimation: true,
              formatter: "{value}%",
              fontSize: 24,
              offsetCenter: [0, "70%"]
            },
            data: [{ value: 5 }],

            axisLine: {
              //   show: false,
            },

            // 分割线
            splitLine: {},
            // 仪表盘进度条
            progress: {
              show: true,
              roundCap: true,
              itemStyle: {
                color: "#4EDC6F",
                borderCap: "round"
              }
            },
            // 仪表盘指针
            pointer: {
              width: 4,
              itemStyle: {
                color: "#FF6A6A"
              }
            }
          }
        ]
      };

      option && myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });

      this.monthEcharts = {
        option,
        myChart
      };
      setTimeout(() => {
        myChart.resize();
      });
    }
  }
};
</script>
<style scoped lang="scss">
.default-btn {
  background-color: #e6f9ff;
  border-radius: 2px;
  padding: 5px auto;
  width: 90px;
  text-align: center;
  height: 32px;
  line-height: 32px;
  color: #1298fa;
  cursor: pointer;
}

.default-btn-sure {
  background-color: #1298fa;
  color: #fff;
}

.default-btn:hover {
  background-color: #1298fa;
  color: #fff;
}

.water-bg {
  background-color: #f5f5f5;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  border-top-right-radius: 50%;
}

.water-center-bg {
  background: #fff;
  // box-shadow: 0px 4 10px 0px rgba(187, 192, 188, 0.14);
  box-shadow: 0px 2px 2px -1px #f5f5f5;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  border-top-right-radius: 50%;
}

.water-center-bg::before {
  content: "";
  background: linear-gradient(153deg, #92eea7 0%, #51cb56 100%);
  // box-shadow: 0px 7 14px 0px rgba(88, 180, 95, 0.3);
  box-shadow: 0px 2px 6px 0px #51cb56;
  width: 105px;
  height: 105px;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  border-top-right-radius: 50%;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
