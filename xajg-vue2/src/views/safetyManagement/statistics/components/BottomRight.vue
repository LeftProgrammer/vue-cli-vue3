<template>
  <div class="box">
    <TopTitle title="安全隐患数量(按工程部位)" />
    <div id="chart_pbs" class="chart" />
  </div>
</template>

<script>
import TopTitle from "@/components/TopTitle";
import * as echarts from "echarts";
import { getData } from "../api";
export default {
  components: { TopTitle },
  data() {
    return {
      dataSource: {},
    };
  },
  created() {},
  mounted() {
    getData({ type: "6" }).then((res) => {
      this.dataSource = res.data;
      this.init();
    });
  },
  methods: {
    init() {
      let chartDom = document.getElementById("chart_pbs");
      let myChart = echarts.init(chartDom);
      const sectionNames = Object.keys(this.dataSource || {});
      const totalValues = sectionNames.map((name) => {
        return this.dataSource[name]
      });
      const options = {
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: false,
            },
            saveAsImage: {
              pixelRatio: 2,
            },
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: 48,
          containLabel: true,
        },
        dataZoom: [
          {
            type: "inside",
          },
          {
            type: "slider",
          },
        ],
        xAxis: {
          data: sectionNames,
          silent: false,
          splitLine: {
            show: false,
          },
          splitArea: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: sectionNames.length > 6 ? 30 : 0,
          },
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          axisLabel: {
            formatter: (value) => Math.round(value),
          },
          splitArea: {
            show: false,
          },
        },
        series: [
          {
            type: "bar",
            data: totalValues,
            large: true,
            barWidth: 20,
            itemStyle: {
              color: "#FADB14",
            },
            label: {
              show: true,
              position: "top",
              color: "#4E5969",
            },
          },
        ],
      };
      myChart.setOption(options);
    },
  },
};
</script>

<style scoped lang="scss">
.box {
  display: flex;
  flex-direction: column;
  .chart {
    flex: 1;
  }
}
</style>
