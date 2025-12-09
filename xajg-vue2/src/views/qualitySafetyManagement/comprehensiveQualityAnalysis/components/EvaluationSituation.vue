<template>
  <div class="EvaluationSituation">
    <TopTitle title="质量验收情况统计" />
    <div class="top">
      <YearMonth @dateChange="dateChange" />
      <el-select
        v-model="type"
        :popper-append-to-body="false"
        placeholder="请选择"
        @visible-change="$visibleChange($event, 'el-popper')"
        @change="typeChange"
      >
        <el-option
          v-for="item in unitProjectTypeList"
          :key="item.dictCode"
          :label="item.dictName"
          :value="item.dictCode"
        />
      </el-select>
    </div>
    <div class="echart">
      <div id="EvaluationSituation" />
      <div class="legend">
        <div v-for="item in legendData" :key="item.name">
          <span> {{ item.name }}</span>
          <span> {{ item.value }}个</span>
          <span> {{ item.percentage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopTitle from "@/components/TopTitle";
import { init } from "../echarts";
import YearMonth from "@/components/YearMonth";
import { quer1 } from "../api";
import { getDictItemList } from "@/api/dict";

export default {
  name: "EvaluationSituation",
  components: { TopTitle, YearMonth },
  data() {
    return {
      type: "a101",
      year: "",
      dataSource: [],
      legendData: [],
      unitProjectTypeList: [], // 单元工程类型列表
      option: {
        tooltip: {
          trigger: "item",
        },
        color: ["#14B8A6", "#F59E0B"],
        legend: {
          orient: "vertical",
          icon: "circle",
          left: "45%",
          top: "center",
          show: false,
          bottom: 0,
          formatter: (name) => {
            const { value, percentage } =
              this.dataSource.find((x) => x.name === name) || {};
            const arr = [
              `{name|${name}}{value|${value}个}{percentage|${percentage}}`,
            ];
            return arr.join("\n");
          },
          textStyle: {
            rich: {
              name: {
                fontSize: 14,
                width: 80,
                align: "left",
                color: "#4e5969",
              },
              value: {
                width: 100,
                fontSize: 16,
                align: "center",
                color: "#1d2129",
              },
              percentage: {
                // width: 40,
                fontSize: 16,
                align: "right",
                color: "#1d2129",
              },
            },
          },
        },
        series: [
          {
            radius: ["50%", "60%"],
            type: "pie",
            center: ["40%", "50%"],
            data: [],
            label: {
              show: true,
              position: "center",
              fontSize: 20,
              fontWeight: "bold",
              formatter: (item) => {
                return `{title|${"验收总数"}}\n\r{total| ${
                  item.data.total || 0
                } }`;
              },
              rich: {
                total: {
                  fontSize: 22,
                  color: "#1d2129",
                  lineHeight: 26,
                  textAlign: "center",
                },
                title: {
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#86909c",
                  lineHeight: 40,
                },
              },
            },
            labelLine: {
              show: false,
            },
          },
        ],
      },
    };
  },
  created() {
    this.getUnitProjectTypeList();
  },
  mounted() {
    this.year = `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}`;
    this.getData();
  },
  methods: {
    getUnitProjectTypeList() {
      getDictItemList("UNIT_PROJECT_TYPE").then((res) => {
        this.unitProjectTypeList = res.data;
        // 设置默认选中第一项
        if (this.unitProjectTypeList && this.unitProjectTypeList.length > 0) {
          this.type = this.unitProjectTypeList[0].dictCode;
          this.getData();
        }
      });
    },
    /**
     * @description 日期切换
     */
    dateChange(date) {
      this.year = date;
      this.getData();
    },
    /**
     * @description 类型切换
     */
    typeChange(val) {
      this.type = val;
      this.getData();
    },
    getData() {
      if (this.type === "a101") this.option.series[0].data = this.legend1;
      else this.option.series[0].data = this.legend2;
      quer1({ type: this.type, year: this.year }).then((res) => {
        const { total, list } = res.data || { total: 0, list: [] };
        this.legendData = list.map((x) => {
          return {
            name: x.type,
            value: x.num,
            percentage: (x.fate * 100).toFixed(2) + "%",
            total: total,
          };
        });
        if (total === 0) {
          this.dataSource = [
            {
              name: list[0].type,
              value: list[0].num,
              percentage: (list[0].fate * 100).toFixed(2) + "%",
              total: total,
            },
          ];
        } else {
          this.dataSource = this.legendData;
        }
        this.option.series[0].data = this.dataSource;
        init("EvaluationSituation", this.option);
      });
    },
  },
};
</script>

<style scoped lang="scss">
.EvaluationSituation {
  .top {
    height: 36px;
    margin-top: 12px;
    .YearMonth {
      margin-right: 16px;
    }
  }
  .echart {
    height: calc(100% - 12px - 36px - 30px);
    display: flex;
    #EvaluationSituation {
      height: 100%;
      flex: 1;
    }
    .legend {
      height: 25%;
      margin-top: 25%;
      width: 250px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      > div {
        margin: 10px 0;
        span {
          display: inline-block;
          text-align: center;
          &:first-child {
            width: 30%;
            font-size: 14px;
            color: "#4e5969";
          }
          &:nth-child(2) {
            color: "#1d2129";
            font-size: 16px;
            width: 40%;
          }
          &:last-child {
            font-size: 16px;
            width: 30%;
            color: "#1d2129";
          }
        }
      }
    }
  }
}
</style>
