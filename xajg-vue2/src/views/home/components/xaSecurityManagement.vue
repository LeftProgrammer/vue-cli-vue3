<template>
  <div class="security-management-wrapper">
    <div id="securityHiddenDangerChartContainer" class="security-hidden-danger-chart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
// import { BarChart } from "echarts/charts";
// import {
//   TitleComponent,
//   TooltipComponent,
//   GridComponent,
//   LegendComponent,
// } from "echarts/components";
// import { CanvasRenderer } from "echarts/renderers";
import { statisticsSafetyHome } from "./api.js"; // 确保路径正确

// echarts.use([
//   TitleComponent,
//   TooltipComponent,
//   GridComponent,
//   LegendComponent,
//   BarChart,
//   CanvasRenderer,
// ]);

export default {
  name: "MdgSecurityManagement",
  props: {
    zoom: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      securityChartInstance: null,
      tableHeaders: [],
      tableRowsData: [],
    };
  },
  mounted() {
    this.drawSecurityHiddenDangerChart();
    window.addEventListener("resize", this.handleResizeChart);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResizeChart);
    if (this.securityChartInstance) {
      this.securityChartInstance.dispose();
      this.securityChartInstance = null;
    }
  },
  methods: {
    async drawSecurityHiddenDangerChart() {
      try {
        const res = await statisticsSafetyHome({}); // 调用API
        if (res.success && res.data) {
          let chartData = res.data;

          if (!chartData || chartData.length === 0) {
            console.warn("安全隐患统计数据为空或格式不正确");
            this.tableHeaders = [];
            this.tableRowsData = [];
            if (this.securityChartInstance) {
              this.securityChartInstance.clear();
            }
            return;
          }

          const yAxisData = chartData.map((item) => item.sectionName);
          const unrectifiedCounts = chartData.map((item) => item.unrectified);
          const rectifiedCounts = chartData.map((item) => item.rectified);

          // Prepare data for the summary table
          this.tableHeaders = [...yAxisData].reverse();
          const rectifiedRow = {
            name: "已整改",
            color: "#67C23A",
            values: {},
          };
          const unrectifiedRow = {
            name: "待整改",
            color: "#409EFF",
            values: {},
          };
          chartData.forEach((item) => {
            rectifiedRow.values[item.sectionName] = item.rectified;
            unrectifiedRow.values[item.sectionName] = item.unrectified;
          });
          this.tableRowsData = [rectifiedRow, unrectifiedRow];

          const chartDom = document.getElementById(
            "securityHiddenDangerChartContainer"
          );
          if (!chartDom) {
            console.error(
              "图表容器 'securityHiddenDangerChartContainer' 未找到。"
            );
            return;
          }

          if (this.securityChartInstance) {
            this.securityChartInstance.dispose();
          }
          this.securityChartInstance = echarts.init(chartDom);

          const option = {
            tooltip: {
              trigger: "axis",
              axisPointer: { type: "shadow" },
              formatter: function (params) {
                let tooltipText = params[0].name + "<br/>";
                params.forEach((param) => {
                  tooltipText +=
                    param.marker +
                    param.seriesName +
                    ": " +
                    param.value +
                    "<br/>";
                });
                return tooltipText;
              },
            },
            legend: {
              data: ["已整改", "待整改"], // Order to match image
              bottom: 10,
              itemGap: 20,
            },
            grid: {
              top: "10%",
              left: "5%",
              right: "5%",
              bottom: "15%", // Adjusted for table and legend
              containLabel: true,
            },
            xAxis: {
              type: "value",
              axisLabel: {
                formatter: "{value}",
              },
            },
            yAxis: {
              type: "category",
              data: yAxisData,
            },
            series: [
              {
                name: "已整改", // Swapped order to match legend
                type: "bar",
                barWidth: 25,
                label: {
                  show: true,
                  position: "right",
                  formatter: function (params) {
                    return params.value > 0 ? params.value : "";
                  },
                  color: "#333",
                },
                emphasis: { focus: "series" },
                data: rectifiedCounts,
                itemStyle: { color: "#67C23A" }, // Green
              },
              {
                name: "待整改", // Renamed from 未整改
                type: "bar",
                barWidth: 25,
                label: {
                  show: true,
                  position: "right",
                  formatter: function (params) {
                    return params.value > 0 ? params.value : "";
                  },
                  color: "#333",
                },
                emphasis: { focus: "series" },
                data: unrectifiedCounts,
                itemStyle: { color: "#409EFF" }, // Blue
              },
            ],
          };
          this.securityChartInstance.setOption(option);
        } else {
          console.error("获取安全隐患统计数据失败或数据为空", res);
          this.tableHeaders = [];
          this.tableRowsData = [];
        }
      } catch (error) {
        console.error("执行 drawSecurityHiddenDangerChart 时发生错误:", error);
        this.tableHeaders = [];
        this.tableRowsData = [];
      }
    },

    handleResizeChart() {
      console.log("handleResizeChart");
      this.securityChartInstance.resize({
        animation: {
          duration: 300,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.security-management-wrapper {
  width: 100%;
  height: 100%;

  .security-hidden-danger-chart {
    width: 100%;
    height: 100%;
  }
}
</style>