<template>
  <div class="box">
    <TopTitle title="安全隐患数量(按状态)" />
    <div class="total">
      <div>
        <img :src="require('@/assets/img/yuqi.png')">
        已逾期 <span>{{ dataSource.yuqi }}</span>
      </div>
      <div>
        <img :src="require('@/assets/img/weiyuqi.png')">
        未逾期 <span>{{ dataSource.weiyuqi }}</span>
      </div>
    </div>
    <div id="chart_state" class="chart" />
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
      dataSource: {
        sections: [],
        yuqi: 0,
        weiyuqi: 0,
      },
    };
  },
  created() {},
  mounted() {
    getData({ type: "1" }).then((res) => {
      const responseData = (res && res.data) || {};
      const sections = Array.isArray(responseData.sections)
        ? responseData.sections
        : [];
      const totals = sections.reduce(
        (acc, cur) => {
          const yuqi = Number(cur && cur.yuqi != null ? cur.yuqi : 0);
          const weiyuqi = Number(cur && cur.weiyuqi != null ? cur.weiyuqi : 0);
          acc.yuqi += Number.isNaN(yuqi) ? 0 : yuqi;
          acc.weiyuqi += Number.isNaN(weiyuqi) ? 0 : weiyuqi;
          return acc;
        },
        { yuqi: 0, weiyuqi: 0 }
      );
      this.dataSource = {
        sections,
        yuqi: responseData.yuqi != null ? responseData.yuqi : totals.yuqi,
        weiyuqi:
          responseData.weiyuqi != null ? responseData.weiyuqi : totals.weiyuqi,
      };
      this.init();
    });
  },
  methods: {
    init() {
      let chartDom = document.getElementById("chart_state");
      let myChart = echarts.init(chartDom);
      const sections = this.dataSource.sections || [];
      const xAxisData = sections.map((item) => item.sectionName);
      const notOverdueData = sections.map((item) =>
        Number(item && item.weiyuqi != null ? item.weiyuqi : 0)
      );
      const overdueData = sections.map((item) =>
        Number(item && item.yuqi != null ? item.yuqi : 0)
      );
      const options = {
        color: ["#3377FF", "#FF4D4F"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["未逾期", "逾期"],
          top: 0,
          textStyle: {
            color: "#4E5969",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "6%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: xAxisData,
          axisLabel: {
            color: "#4E5969",
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: "#E5E6EB",
            },
          },
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          axisLabel: {
            color: "#4E5969",
          },
          splitLine: {
            lineStyle: {
              color: "#E5E6EB",
            },
          },
        },
        series: [
          {
            name: "未逾期",
            type: "bar",
            barWidth: 20,
            data: notOverdueData,
            label: {
              show: true,
              position: "top",
              fontSize: 16,
              color: "#3377FF",
            },
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
            },
          },
          {
            name: "逾期",
            type: "bar",
            barWidth: 20,
            data: overdueData,
            label: {
              show: true,
              position: "top",
              fontSize: 16,
              color: "#FF4D4F",
            },
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
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
  .total {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    > div {
      display: flex;
      align-items: center;
      img {
        margin-right: 16px;
      }
      &:first-child {
        color: rgb(255, 77, 79);
      }
      &:last-child {
        color: rgb(51, 119, 255);
      }
      span {
        font-size: 18px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        line-height: 21px;
        margin: 0 20px;
      }
    }
  }
  .chart {
    flex: 1;
  }
}
</style>
