<template>
  <div class="box">
    <TopTitle title="安全隐患数量(按级别)" />
    <div id="chart_level" class="chart" />
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
      dataSource: {}
    };
  },
  created() {},
  mounted() {
    getData({ type: "2" }).then((res) => {
      this.dataSource = res.data;
      this.init();
    });
  },
  methods: {
    init() {
      let chartDom = document.getElementById("chart_level");
      let myChart = echarts.init(chartDom);
      const options = {
        title: {
          text: this.dataSource.ybsgyh + this.dataSource.zdsgyh,
          left: "center",
          top: "30%",
          subtext: "隐患总数",
          subtextStyle: {
            left: "center",
            top: "middle"
          }
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          icon: "circle",
          bottom: "10%",
          left: "center",
          textStyle: {
            fontSize: 16
          }
        },
        color: ["#1790FE", "#FE6C6D"],
        series: [
          {
            type: "pie",
            radius: ["50%", "60%"],
            center: ["50%", "35%"],
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: [
              { value: this.dataSource.ybsgyh, name: "一般事故隐患" },
              { value: this.dataSource.zdsgyh, name: "重大事故隐患" }
            ]
          }
        ]
      };
      myChart.setOption(options);
    }
  }
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
