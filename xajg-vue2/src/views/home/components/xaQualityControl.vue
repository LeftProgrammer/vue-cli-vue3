<template>
  <div class="quality-control-wrapper">
    <div id="qualityAssessChartContainer" class="quality-control-chart" />
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
//   MarkLineComponent,
// } from "echarts/components";
// import { CanvasRenderer } from "echarts/renderers";

// echarts.use([
//   TitleComponent,
//   TooltipComponent,
//   GridComponent,
//   LegendComponent,
//   BarChart,
//   CanvasRenderer,
//   MarkLineComponent,
// ]);

import mdgQualityInspection from "./mdgQualityInspection.vue"; //质量验评
import mdgTestMonitoring from "./mdgTestMonitoring.vue"; //试验监测
import { getQualityAssessInfo } from "../api.js";

export default {
  props: {
    projectCode: {
      type: String,
      default: "",
    },
  },
  components: {
    mdgQualityInspection,
    mdgTestMonitoring,
  },
  data() {
    return {
      qualityAssessChartInstance: null, // 新增：用于存储图表实例
    };
  },
  mounted() {
    this.drawQualityAssessChart();
    window.addEventListener("resize", this.handleResizeChart);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResizeChart);
    if (this.qualityAssessChartInstance) {
      this.qualityAssessChartInstance.dispose();
      this.qualityAssessChartInstance = null;
    }
  },
  methods: {
    async drawQualityAssessChart() {
      let res = await getQualityAssessInfo();
      if (res.success) {
        let chartData = res.data;

        if (!chartData || chartData.length === 0) {
          console.warn("质量验评统计数据为空或格式不正确");
          if (this.qualityAssessChartInstance) {
            this.qualityAssessChartInstance.clear();
          }
          return;
        }
        // chartData = [
        //   { sectionName: "标段一", unFinish: 45, finish: 35 },
        //   { sectionName: "标段二", unFinish: 35, finish: 170 },
        //   { sectionName: "标段三", unFinish: 120, finish: 71 },
        // ];

        const xAxisData = chartData.map((item) => item.sectionName);
        console.log("xAxisData", xAxisData);
        const unFinishSeriesData = [];
        const finishSeriesData = [];

        chartData.forEach((item) => {
          const total = item.unFinish + item.finish;
          const unFinishPercent =
            total === 0 ? 0 : (item.unFinish / total) * 100;
          const finishPercent = total === 0 ? 0 : (item.finish / total) * 100;

          unFinishSeriesData.push({
            value: unFinishPercent,
            originalCount: item.unFinish,
            sectionName: item.sectionName,
          });
          finishSeriesData.push({
            value: finishPercent,
            originalCount: item.finish,
            sectionName: item.sectionName,
          });
        });

        const chartDom = document.getElementById("qualityAssessChartContainer");
        if (!chartDom) {
          console.error("图表容器 'qualityAssessChartContainer' 未找到。");
          return;
        }
        if (this.qualityAssessChartInstance) {
          this.qualityAssessChartInstance.dispose();
        }
        this.qualityAssessChartInstance = echarts.init(chartDom);

        const option = {
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            formatter: function (params) {
              let tooltipText = params[0].axisValueLabel + "<br/>";
              params.forEach((param) => {
                tooltipText +=
                  param.marker +
                  param.seriesName +
                  ": " +
                  param.data.originalCount +
                  " (" +
                  param.value.toFixed(1) +
                  "%)<br/>";
              });
              return tooltipText;
            },
          },
          legend: {
            data: ["未验评", "已验评"],
            bottom: 10,
            itemGap: 20,
          },
          grid: {
            top: "10%",
            left: "5%",
            right: "5%",
            bottom: "15%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: xAxisData,
            axisLabel: {
              show: true, // 确保标签显示
              interval: 0, // 强制显示所有标签，不进行间隔隐藏
            },
          },
          yAxis: {
            type: "value",
            min: 0,
            max: 100,
            axisLabel: { formatter: "{value}%" },
          },
          series: [
            {
              name: "未验评",
              type: "bar",
              barWidth: 50,
              stack: "total",
              label: {
                show: true,
                position: "inside",
                formatter: function (params) {
                  return params.data.originalCount > 0
                    ? params.data.originalCount
                    : "";
                },
                color: "#fff",
              },
              emphasis: { focus: "series" },
              data: unFinishSeriesData,
              itemStyle: { color: "#5470C6" },
            },
            {
              name: "已验评",
              type: "bar",
              barWidth: 50,
              stack: "total",
              label: {
                show: true,
                position: "inside",
                formatter: function (params) {
                  return params.data.originalCount > 0
                    ? params.data.originalCount
                    : "";
                },
                color: "#fff",
              },
              emphasis: { focus: "series" },
              data: finishSeriesData,
              itemStyle: { color: "#91CC75" },
            },
          ],
        };
        this.qualityAssessChartInstance.setOption(option);
      }
    },

    handleResizeChart() {
      console.log("handleResizeChart");
      this.qualityAssessChartInstance.resize({
        animation: {
          duration: 300,
        },
      });
    },

    choose(index, compName) {
      this.current = index;
      this.componentsName = compName;
    },
  },
};
</script>

<style lang="scss" scoped>
.quality-control-wrapper {
  width: 100%;
  height: 100%;

  .quality-control-chart {
    width: 100%;
    height: 100%;

  }
}
</style>
