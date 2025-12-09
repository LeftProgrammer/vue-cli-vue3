<template>
  <div class="container">
    <el-row :gutter="20" class="mb-30">
      <el-col :span="24">
        <div class="w-100pre h-80 bg-dico rounded-2 position-relative flex align-center  px-24">
          <img src="../assets//cggy_icon.png" class="mr-24 w-40 h-40" />
          <div class="pl-24 flex-column flex">
            <span>成果供应</span>
            <span> {{ sdFinished }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :span="14" class="flex h-184">
        <div class="w-100pre h-100pre" style="margin: auto" id="progress" :style="{ zoom: 1 / zoom }"></div>
      </el-col>
      <el-col :span="10" class="flex">
        <div class="w-166 h-184 flex flex-column justify-between" style="margin: auto">
          <div>
            <div class="mb-5" style="color: #4e5969">成果供应总数</div>
            <div class="flex align-center">
              <div class="w-6 h-6 mr-10" :style="{ backgroundColor: '#1d2129', borderRadius: '50%' }"></div>
              <div class="font-w-500 font-24" style="color: #1d2129">
                {{ sdTotal + ydTotal }}
              </div>
            </div>
          </div>
          <div>
            <div class="mb-5" style="color: #4e5969">成果供应完成数</div>
            <div class="flex align-center">
              <div class="w-6 h-6 mr-10" :style="{ backgroundColor: '#1298FA', borderRadius: '50%' }"></div>
              <div class="font-w-500 font-24" style="color: #1298fa">
                {{ sdFinished + ydFinished }}
              </div>
            </div>
          </div>
          <div>
            <div class="mb-5" style="color: #4e5969">成果供应未完成数</div>
            <div class="flex align-center">
              <div class="w-6 h-6 mr-10" :style="{ backgroundColor: '#4CD263', borderRadius: '50%' }"></div>
              <div class="font-w-500 font-24" style="color: #4cd263">
                {{ sdTotal + ydTotal - (sdFinished + ydFinished) }}
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { statisticsPageType, DesignDicu, Target, DesignChange } from "./api";

export default {
  props: {
    zoom: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      nowDate: Date.parse(new Date()), //当前时间
      EchartsObject: {},
      dateData: {},
      designDicu: {
        // 完成数量
        completeNum: 0,
        // 目标数量
        targetNum: 0,
        // 上月完成数量
        lastMonthCompleteNum: 0
      },
      designChange: {
        // 完成数量
        completeNum: 0,
        // 目标数量
        targetNum: 0,
        // 上月完成数量
        lastMonthCompleteNum: 0
      },
      // 完成情况
      completeData: {
        // 目标数
        targetNum: 0,
        // 完成数
        completeNum: 0,
        // 上月完成数
        lastMonthCompleteNum: 0
      },

      //水电、已完成
      sdFinished: 0,
      //营地、已完成
      ydFinished: 0,
      //水电总数
      sdTotal: 0,
      // 营地
      ydTotal: 0
      //
    };
  },
  created() {
    // this.getNowData();
    // this.getDesignDicu();
    // this.getDesignChange();
    // this.getTarget();
    this.getStatisticsPageType();
  },
  mounted() { },
  methods: {
    getStatisticsPageType() {
      statisticsPageType().then((res) => {
        console.log("statisticsPageType", res);
        if (res.success) {
          this.sdFinished = res.data["1_2"];
          this.ydFinished = res.data["2_2"];
          this.sdTotal = res.data["1"];
          this.ydTotal = res.data["2"];
        }

        this.initChart();
      });
    },
    // 获取当月设计交底完成 的数量
    getDesignDicu() {
      let params = {
        flowStatus: 2,
        startDate: this.dateData.firstDayOfMonth,
        endDate: this.dateData.lastDayOfMonth
      };
      // console.log("设计交底", params);
      DesignDicu(params).then((res) => {
        console.log("获取当月设计交底完成", res);
        const { data, success } = res;
        if (!success) {
          this.$message.error("获取当月设计交底数据失败！");
        }
        if (data && Array.isArray(data)) {
          this.designDicu.completeNum = data.length;
        } else {
          this.designDicu.completeNum = 0;
        }
      });
    },
    // 获取当月设计变更完成 的数量
    getDesignChange() {
      let params = {
        flowStatus: 2,
        startDate: this.dateData.firstDayOfMonth,
        endDate: this.dateData.lastDayOfMonth
      };
      // console.log("设计交底", params);
      DesignChange(params).then((res) => {
        console.log("获取当月设计变更完成", res);
        const { data, success } = res;
        if (!success) {
          this.$message.error("获取当月设计交底数据失败！");
        }
        if (data && Array.isArray(data)) {
          this.designChange.completeNum = data.length;
        } else {
          this.designChange.completeNum = 0;
        }
      });
    },
    // 获取 台账数据
    async getTarget() {
      try {
        const { data, success } = await Target();
        console.log("获取当月目标总数", data);
        if (!success || !Array.isArray(data)) {
          this.handleDataError();
          return;
        }

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

        const yearData = data.find((x) => x.name == year) || { children: [] };
        console.log("当前年的数据", yearData);

        const monthData = yearData.children.find((x) => x.name == month + "月") || {
          designPlanDetailList: []
        };
        console.log("当前月", month);

        this.completeData.targetNum =
          monthData.designPlanDetailList.filter((x) => x.changeType !== 3).length || 0;

        const completeData =
          monthData.designPlanDetailList.filter(
            (row) =>
              row.changeType !== 3 &&
              (this.getStatus(row) == 1 || this.getStatus(row) == 2)
          ) || [];

        this.completeData.completeNum = completeData.length;

        const lastMonth = currentDate.getMonth();
        const lastMonthData = yearData.children.find(
          (x) => x.name == lastMonth + "月"
        ) || { designPlanDetailList: [] };

        this.completeData.lastMonthCompleteNum = lastMonthData.designPlanDetailList.filter(
          (row) =>
            row.changeType !== 3 && (this.getStatus(row) == 1 || this.getStatus(row) == 2)
        ).length;

        this.initChart();
      } catch (error) {
        this.handleDataError();
      }
    },

    handleDataError() {
      this.completeData.targetNum = 0;
      this.completeData.completeNum = 0;
      this.completeData.lastMonthCompleteNum = 0;
    },

    // 计算完成状态
    getStatus(row) {
      // 按时完成1 逾期完成2  进行中3 已逾期4
      let status = 0;
      if (row.actualDate != null) {
        if (row.planTime >= row.actualDate) {
          status = 1;
        } else {
          status = 2;
        }
      } else {
        if (row.planTime > this.nowDate) {
          status = 3;
        } else {
          status = 4;
        }
      }
      return status;
    },
    // 获取当前年月
    getNowData() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // 月份从0开始，所以要加1

      const currentYearMonth = `${year}年${month}月`;

      const firstDayOfMonth = `${year}-${month}-01`;

      const lastDay = new Date(year, month, 0).getDate();
      const lastDayOfMonth = `${year}-${month}-${lastDay}`;
      this.dateData = {
        currentYearMonth,
        firstDayOfMonth,
        lastDayOfMonth
      };
    },

    initChart() {
      var chartDom = document.getElementById("progress");
      var myChart = echarts.init(chartDom);
      var option;
      // 设置图表配置项
      option = {
        title: {
          text: "",
          x: "center",
          y: "center",
          textStyle: {
            color: "#333",
            fontSize: 14,
            fontWeight: "normal"
          }
        },

        series: [
          {
            name: "外环",
            type: "pie",
            radius: ["80%", "95%"],
            center: ["50%", "50%"], // 在 x 和 y 轴方向都居中
            // avoidLabelOverlap: false,
            hoverAnimation: false,
            z: 2, // 外环的 z 值设置为 2，使其在上层
            label: {
              show: true,
              position: "center",
              // formatter: "{b}\n\n{d}%", // 设置显示百分比的格式
              formatter: (value) => {
                let profession = 0;
                if (this.sdTotal + this.ydTotal > 0) {
                  profession = Math.round(
                    ((this.sdFinished + this.ydFinished) /
                      (this.sdTotal + this.ydTotal)) *
                    100
                  );
                }
                let str = "{a|完成度}" + "\n" + "\n" + "{b|" + profession + "%}";
                return str;
              },
              rich: {
                a: {
                  color: "#86909C",
                  fontSize: "16px"
                },
                b: {
                  color: "#1D2129",
                  fontSize: "32px"
                }
              }

              // fontSize: 14,
              // color: "#333",
            },
            labelLine: {
              show: false
            },
            // emphasis: {
            //     label: {
            //         show: false, // 禁用鼠标悬停时的高亮效果
            //     },
            // },
            data:
              this.sdTotal + this.ydTotal > 0
                ? [
                  {
                    value: this.ydFinished + this.sdFinished,
                    name: "完成度",
                    itemStyle: { color: "#014ACB" }
                  },
                  {
                    value:
                      this.sdTotal + this.ydTotal - (this.sdFinished + this.ydFinished),
                    itemStyle: { color: "transparent" }
                  }
                ]
                : [
                  {
                    value: this.sdTotal + this.ydTotal,
                    itemStyle: { color: "transparent" }
                  }
                ]
          },
          {
            name: "内环",
            type: "pie",
            radius: ["80%", "88%"],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            z: 1, // 外环的 z 值设置为 2，使其在上层
            emphasis: {
              label: {
                show: false // 禁用鼠标悬停时的高亮效果
              }
            },
            label: {
              show: false,
              position: "center"
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              color: "#ccc"
            },
            data: [{ value: 100, name: "进度环" }]
          }
        ]
      };

      option && myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
      this.EchartsObject = {
        option,
        myChart
      };
    }
  }
};
</script>
<style scoped lang="scss">
.container {
  height: 100%;
  width: 100%;
}

.bg-dico {
  // background: url("../assets/designDico1.png");
  // background-size: 100% 100%;
  background: #f0f3ff;

  >div {
    border-left: 1px solid #C4D7FF;
  }
}

.bg-chenge {
  box-shadow: 0px 4px 10px 0px rgba(254, 168, 94, 0.34);
  background: url("../assets/designChange1.png");
  background-size: 100% 100%;
}
</style>
