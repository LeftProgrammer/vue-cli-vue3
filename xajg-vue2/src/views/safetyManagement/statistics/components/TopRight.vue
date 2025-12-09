<template>
  <div class="box">
    <TopTitle title="安全隐患数量(按分类)" />
    <div id="chart_type" class="chart"></div>
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
    getData({ type: "3" }).then((res) => {
      this.dataSource = res.data;
      this.init();
    });
  },
  methods: {
    init() {
      let chartDom = document.getElementById("chart_type");
      let myChart = echarts.init(chartDom);
      const options = {
        title: {
          text:
            this.dataSource.sgzyl +
            this.dataSource.jxsbl +
            this.dataSource.sscsl +
            this.dataSource.zyhjl +
            this.dataSource.qtl,
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
              { value: this.dataSource.sgzyl, name: "施工作业类" },
              { value: this.dataSource.jxsbl, name: "机械设备类" },
              { value: this.dataSource.sscsl, name: "设施场所类" },
              { value: this.dataSource.zyhjl, name: "作业环境类" },
              { value: this.dataSource.qtl, name: "其他类" }
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
