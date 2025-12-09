<template>
  <div class="EvluationComplete">
    <TopTitle title="质量验收完成量统计" />
    <!-- <div class="top">
      <YearMonth @dateChange="dateChange" />
    </div> -->
    <div class="content">
      <div class="left">
        <div v-for="item in legend" :key="item.name">
          <div class="title">{{ item.name }}</div>
          <div class="value">
            <span>{{ item.value }}</span>
            <span>已验收</span>
          </div>
          <div class="per">
            <span>{{ item.percentage }}</span>
            <span>完成率</span>
          </div>
        </div>
      </div>
      <div class="right">
        <div id="EvluationComplete" />
      </div>
    </div>
  </div>
</template>
<script>
import TopTitle from "@/components/TopTitle";
import { init } from "../echarts";
import { quer2 } from "../api";
export default {
  name: "EvluationComplete",
  components: { TopTitle },
  data() {
    return {
      year: "",
      legend: [
        { name: "水工", value: "0", percentage: "0.00%", type: "a101" },
        { name: "公路", value: "0", percentage: "0.00%", type: "a201" },
        { name: "房建", value: "0", percentage: "0.00%", type: "a301" },
      ],
      option: {
        tooltip: {
          trigger: "item",
        },
        title: {
          text: "完成总数",
          subtext: "666",
          textStyle: {
            fontSize: 14,
            color: "#86909c",
            lineHeight: 16,
            textAlign: "center",
          },
          subtextStyle: {
            fontSize: 22,
            fontWeight: 600,
            color: "#1d2129",
            lineHeight: 26,
          },
          top: "40%",
          left: "center",
        },
        color: ["#4B8CFB", "#FCC59F", "#1AD2CE"],
        legend: {
          left: "center",
          bottom: "0",
        },
        series: [
          {
            radius: ["50%", "60%"],
            type: "pie",
            center: "center",
            data: [],
            label: {
              show: true,
              formatter: ({ data }) => {
                return data.name + " : " + data.percentage;
              },
            },
            labelLine: {},
          },
        ],
      },
    };
  },
  created() {},
  mounted() {
    this.year = `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}`;
    this.getData();
  },
  methods: {
    /**
     * @description 日期切换
     */
    dateChange(date) {
      this.year = date;
    },
    /**
     * @description 获取数据
     */
    getData() {
      quer2({ year: this.year }).then((res) => {
        const { total, list } = res.data || { total: 0, list: [] };
        this.legend.forEach((item) => {
          const data = list.find((x) => x.type === item.type);
          item.value = data.num;
          item.percentage = (data.fate * 100).toFixed(2) + "%";
          item.total = total;
        });
        this.option.title.subtext = total;
        this.option.series[0].data = this.legend;
        init("EvluationComplete", this.option);
      });
    },
  },
};
</script>
<style scoped lang="scss">
.EvluationComplete {
  .top {
    height: 36px;
    margin-top: 12px;
  }
  .content {
    height: calc(100% - 12px - 30px);
    padding: 40px 0 20px 0;
    display: flex;
    .left {
      text-align: center;
      width: 549px;
      border-right: 2px solid #e5e6eb;
      > div {
        width: 403px;
        margin: auto;
        height: 84px;
        background: rgba(230, 249, 255, 0.5);
        border-radius: 4px;
        display: flex;
        align-items: center;
        padding-left: 26px;
        &:not(:last-child) {
          margin-bottom: 12px;
        }
        .title {
          font-size: 16px;
          font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
          color: #000000;
          padding-right: 21px;
          border-right: 2px solid #1298fa;
          margin-right: 80px;
        }
        .value {
          margin-right: 72px;
        }
        .value,
        .per {
          display: flex;
          flex-direction: column;
          span:first-child {
            font-size: 16px;
            font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
            color: #1d2129;
            margin-bottom: 5px;
          }
          span:last-child {
            font-size: 12px;
            font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
            color: #4e5969;
          }
        }
      }
    }
    .right {
      height: 100%;
      width: calc(100% - 549px);
      #EvluationComplete {
        height: 100%;
        width: 100%;
      }
    }
  }
}
</style>
