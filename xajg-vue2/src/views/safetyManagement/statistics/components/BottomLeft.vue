<template>
  <div class="box">
    <TopTitle title="安全隐患数量(按上报时间)" />
    <div class="year-switch">
      <span
        v-for="year in yearOptions"
        :key="year"
        :class="['year-item', { active: year === selectedYear }]"
        @click="handleYearChange(year)"
      >
        {{ year }}年
      </span>
    </div>
    <el-radio-group v-model="type">
      <el-radio-button label="month">每月新增</el-radio-button>
      <el-radio-button label="total">累计新增</el-radio-button>
    </el-radio-group>
    <div id="chart_date" class="chart" />
  </div>
</template>

<script>
import TopTitle from "@/components/TopTitle";
import * as echarts from "echarts";
import { statisticsMonth } from "../api";
export default {
  components: { TopTitle },
  data() {
    const currentYear = new Date().getFullYear();
    const defaultYears = [2025, 2026];
    if (!defaultYears.includes(currentYear)) {
      defaultYears.push(currentYear);
      defaultYears.sort((a, b) => a - b);
    }
    return {
      dataSource: {
        month: [],
        total: [],
      },
      xAxisData: [],
      type: "month",
      yearOptions: defaultYears,
      selectedYear: currentYear,
    };
  },
  watch: {
    type() {
      this.init();
    },
  },
  created() {},
  mounted() {
    this.fetchChartData(this.selectedYear);
  },

  methods: {
    handleYearChange(year) {
      if (year === this.selectedYear) return;
      this.selectedYear = year;
      this.fetchChartData(year);
    },
    fetchChartData(year) {
      statisticsMonth({ year }).then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        const normalized = this.normalizeMonthlyData(list);
        this.xAxisData = normalized.map((item) => item.label);
        const monthlyValues = normalized.map((item) => item.value);
        const cumulativeValues = monthlyValues.reduce((acc, cur) => {
          const lastValue = acc.length ? acc[acc.length - 1] : 0;
          acc.push(lastValue + cur);
          return acc;
        }, []);
        this.dataSource = {
          month: monthlyValues,
          total: cumulativeValues,
        };
        this.init();
      });
    },
    normalizeMonthlyData(list) {
      const monthValueMap = list.reduce((acc, item) => {
        const month = Number(item && item.month);
        const value = Number(item && item.value);
        if (month >= 1 && month <= 12) {
          acc[month] = Number.isNaN(value) ? 0 : value;
        }
        return acc;
      }, {});
      return Array.from({ length: 12 }, (_, index) => {
        const monthNumber = index + 1;
        return {
          label: `${monthNumber}月`,
          value: monthValueMap[monthNumber] || 0,
        };
      });
    },
    init() {
      let chartDom = document.getElementById("chart_date");
      let myChart = echarts.init(chartDom);
      if (!this.xAxisData.length) {
        myChart.clear();
        return;
      }
      const seriesData = this.dataSource[this.type] || [];
      const options = {
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: this.xAxisData,
        },
        yAxis: {
          type: "value",
          minInterval: 1,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "6%",
          containLabel: true,
        },

        series: [
          {
            color: "#3377FF",
            barWidth: 20,
            data: seriesData,
            type: "bar",
            label: {
              show: true,
              position: "top",
              color: "#1D2129",
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
  .year-switch {
    margin: 12px 0;
    display: flex;
    justify-content: center;
    // gap: 16px;
    .year-item {
      padding: 4px 12px;
      border: 1px solid #e5e6eb;
      cursor: pointer;
      color: #4e5969;
      &.active {
        border-color: #3377ff;
        color: #3377ff;
        background-color: rgba(51, 119, 255, 0.08);
      }
    }
  }
  .el-radio-group {
    text-align: right;
    margin-bottom: 16px;
  }
  .chart {
    flex: 1;
  }
}
</style>
