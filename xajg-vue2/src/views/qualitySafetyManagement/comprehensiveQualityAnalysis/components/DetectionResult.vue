<template>
  <div class="DetectionResult">
    <TopTitle title="试验检测结果统计" />
    <div class="top">
      <YearMonth @dateChange="dateChange" />
      <el-select
        v-model="type"
        :popper-append-to-body="false"
        @visible-change="$visibleChange($event, 'el-popper')"
        @change="typeChange"
      >
        <el-option value="" label="全部" />
        <el-option
          v-for="item in clmcList"
          :key="item.dictCode"
          :value="item.dictCode"
          :label="item.dictName"
        />
      </el-select>
    </div>
    <div class="legend">
      <span>合格</span>
      <span>不合格</span>
    </div>
    <div id="DetectionResult" />
  </div>
</template>
<script>
import TopTitle from "@/components/TopTitle";
import { init } from "../echarts";
import YearMonth from "@/components/YearMonth";
import { testResult } from "../api.js";
export default {
  naem: "DetectionResult",
  components: { TopTitle, YearMonth },
  data() {
    return {
      clmcList: [],
      type: "",
      option: {
        tooltip: {
          trigger: "item",
        },
        title: [
          {
            text: "",
            left: "center",
            show: false,
          },
          {
            subtext: "施工单位自检",
            left: "16.67%",
            top: "85%",
            textAlign: "center",
            subtextStyle: {
              fontSize: 16,
              color: "#1d2129",
            },
          },
          {
            subtext: "监理抽检",
            top: "85%",
            left: "50%",
            textAlign: "center",
            subtextStyle: {
              fontSize: 16,
              color: "#1d2129",
            },
          },
          {
            subtext: "试验中心",
            left: "83.33%",
            top: "85%",
            textAlign: "center",
            subtextStyle: {
              fontSize: 16,
              color: "#1d2129",
            },
          },
        ],
        legend: {
          icon: "circle",
          left: "center",
          top: 60,
          show: false,
        },
        color: ["#1AD2CE", "#FCC59F"],
        series: [
          {
            type: "pie",
            radius: ["50%", "60%"],
            center: ["50%", "50%"],
            data: [],
            label: {
              show: true,
              position: "center",
              fontSize: 20,
              fontWeight: "bold",
              formatter: (item) => {
                return `{title|${"检测总数"}}\n\r{total| ${
                  item.data.total || 0
                } }`;
              },
              rich: {
                total: {
                  fontSize: 18,
                  textAlign: "center",
                  color: "#1d2129",
                  lineHeight: 21,
                },
                title: {
                  lineHeight: 16,
                  color: "#86909c",
                  fontSize: 14,
                },
              },
            },
            labelLine: {
              show: false,
            },
            left: 0,
            right: "66.6667%",
            top: 0,
            bottom: 0,
          },
          {
            type: "pie",
            radius: ["50%", "60%"],
            center: ["50%", "50%"],
            data: [],
            label: {
              show: true,
              position: "center",
              fontSize: 20,
              fontWeight: "bold",
              formatter: (item) => {
                return `{title|${"检测总数"}}\n\r{total| ${
                  item.data.total || 0
                } }`;
              },
              rich: {
                total: {
                  fontSize: 18,
                  textAlign: "center",
                  color: "#1d2129",
                  lineHeight: 21,
                },
                title: {
                  lineHeight: 16,
                  color: "#86909c",
                  fontSize: 14,
                },
              },
            },
            labelLine: {
              show: false,
            },
            left: "33.3333%",
            right: "33.3333%",
            top: 0,
            bottom: 0,
          },
          {
            type: "pie",
            radius: ["50%", "60%"],
            center: ["50%", "50%"],
            data: [],
            label: {
              show: true,
              position: "center",
              fontSize: 20,
              fontWeight: "bold",
              formatter: (item) => {
                return `{title|${"检测总数"}}\n\r{total| ${
                  item.data.total || 0
                } }`;
              },
              rich: {
                total: {
                  fontSize: 18,
                  textAlign: "center",
                  color: "#1d2129",
                  lineHeight: 21,
                },
                title: {
                  lineHeight: 16,
                  color: "#86909c",
                  fontSize: 14,
                },
              },
            },
            labelLine: {
              show: false,
            },
            left: "66.6667%",
            right: 0,
            top: 0,
            bottom: 0,
          },
        ],
      },
      date: "",
    };
  },
  created() {},
  mounted() {
    this.date = `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}`;
    this.getClmcList();
    this.getData();
  },
  methods: {
    /**
     * @description 日期切换
     */
    dateChange(date) {
      this.date = date;
      this.getData();
    },
    /**
     * @description 获取字典(材料名称)
     */
    getClmcList() {
      this.$store.dispatch("dict/get", "syjc").then((res) => {
        this.clmcList = res.filter((item) => {
          return item.dictPath.split(",").length === 3;
        });
        console.log(this.clmcList);
      });
    },
    /**
     * @description 类型切换
     */
    typeChange(val) {
      this.type = val;
      this.getData();
    },
    getData() {
      const params = {
        clmc: this.type,
        year: this.date,
      };
      testResult(params).then((res) => {
        const data = res.data || [];
        const reagent = data.find((x) => x.type === "reagent");
        const supervision = data.find((x) => x.type === "supervision");
        const work = data.find((x) => x.type === "work");
        if (work.hgNum + work.bhgNum !== 0) {
          this.option.series[0].data = [
            {
              name: "合格",
              value: work.hgNum,
              total: work.hgNum + work.bhgNum,
            },
            {
              name: "不合格",
              value: work.bhgNum,
              total: work.hgNum + work.bhgNum,
            },
          ];
        } else {
          this.option.series[0].data = [
            {
              name: "合格",
              value: work.hgNum,
              total: work.hgNum + work.bhgNum,
            },
          ];
        }
        if (supervision.hgNum + supervision.bhgNum !== 0) {
          this.option.series[1].data = [
            {
              name: "合格",
              value: supervision.hgNum,
              total: supervision.hgNum + supervision.bhgNum,
            },
            {
              name: "不合格",
              value: supervision.bhgNum,
              total: supervision.hgNum + supervision.bhgNum,
            },
          ];
        } else {
          this.option.series[1].data = [
            {
              name: "合格",
              value: supervision.hgNum,
              total: supervision.hgNum + supervision.bhgNum,
            },
          ];
        }
        if (reagent.hgNum + reagent.bhgNum !== 0) {
          this.option.series[2].data = [
            {
              name: "合格",
              value: reagent.hgNum,
              total: reagent.hgNum + reagent.bhgNum,
            },
            {
              name: "不合格",
              value: reagent.bhgNum,
              total: reagent.hgNum + reagent.bhgNum,
            },
          ];
        } else {
          this.option.series[2].data = [
            {
              name: "合格",
              value: reagent.hgNum,
              total: reagent.hgNum + reagent.bhgNum,
            },
          ];
        }
        init("DetectionResult", this.option);
      });
    },
  },
};
</script>
<style scoped lang="scss">
.DetectionResult {
  .top {
    margin-top: 12px;
    .YearMonth {
      margin-right: 16px;
    }
  }
  .legend {
    height: 40px;
    margin-top: 40px;
    text-align: center;
    font-size: 14px;
    span {
      &::before {
        content: "";
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #1ad2ce;
        margin: 0 5px;
      }
      &:first-child {
        &::before {
          background-color: #1ad2ce;
        }
      }
      &:last-child {
        &::before {
          background-color: #fcc59f;
        }
      }
    }
  }
  #DetectionResult {
    height: calc(100% - 30px - 12px - 36px - 80px);
  }
}
</style>
