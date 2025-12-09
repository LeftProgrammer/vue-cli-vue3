<template>
  <div class="">
    <div class="flex align-center mb-12">
      <div class="icon-rightTwo iconfont" style="color: #f6a122"></div>
      <div class="font-16" style="color: #1d2129">试验检测数量</div>
    </div>
    <!-- 进度条 -->
    <div class="">
      <div
        v-for="(item, index) in progressList"
        :key="index"
        class="mb-10 font-14"
      >
        <div class="flex align-center justify-between mb-5">
          <div class="flex align-center">
            <div class="greeIcon mr-5"></div>
            <div style="color: #86909c">{{ item.type }}</div>
          </div>
          <div class="">
            <span style="color: #1298fa">{{ item.num }}</span
            ><span class="mx-3" style="color: #86909c">/</span
            ><span style="color: #86909c">{{ item.fate }}</span>
          </div>
        </div>
        <el-progress
          :show-text="false"
          :stroke-width="10"
          :percentage="calculatePercentage(item.num, item.fate)"
          :color="'#1298FA'"
          :define-back-color="'#D6EEFF'"
        ></el-progress>
      </div>
    </div>
    <div class="line mt-16 mb-16"></div>
    <div class="flex align-center justify-between">
      <div class="flex align-center mb-12">
        <div class="icon-rightTwo iconfont" style="color: #f6a122"></div>
        <div class="font-16" style="color: #1d2129">试验检测合格率</div>
      </div>
      <div class="flex align-center">
        <div class="mr-30 flex align-center">
          <div class="hegeIcon mr-5"></div>
          <div class="font-14">合格</div>
        </div>
        <div class="flex align-center">
          <div class="buhegeIcon mr-5"></div>
          <div class="font-14">不合格</div>
        </div>
      </div>
    </div>
    <!-- 图表 -->
    <div>
      <el-row :gutter="20" class="text-center font-14" style="color: #1d2129">
        <el-col :span="8" class="h-80">
          <div
            id="shiyancenter"
            class="h-100pre w-100pre"
            :style="{ zoom: 1 / zoom }"
          ></div>
          <div class="mt-5">试验中心抽检</div>
        </el-col>
        <el-col :span="8" class="h-80">
          <div
            id="jianlichoujian"
            class="h-100pre w-100pre"
            :style="{ zoom: 1 / zoom }"
          ></div>
          <div class="mt-5">监理中心抽检</div>
        </el-col>
        <el-col :span="8" class="h-80">
          <div
            id="shigongdanwei"
            class="h-100pre w-100pre"
            :style="{ zoom: 1 / zoom }"
          ></div>
          <div class="mt-5">施工单位自检</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { material, TestPassRate } from "./api";
export default {
  props: {
    zoom: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      progressList: [
        {
          type: "施工单位自检",
          num: 0,
          fate: 0,
        },
        {
          type: "监理中心抽检",
          num: 0,
          fate: 0,
        },
        {
          type: "试验中心抽检",
          num: 0,
          fate: 0,
        },
      ],
      domIds: ["shiyancenter", "jianlichoujian", "shigongdanwei"],
      echartsData: {},
      total: 0,
    };
  },
  mounted() {
    this.getMaterial();
    let option = {
      title: {
        text: "",
        x: "center",
        y: "center",
        textStyle: {
          color: "#333",
          fontSize: 14,
          fontWeight: "normal",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{b} {c} ({d}%)",
      },

      series: [
        {
          name: "外环",
          type: "pie",
          radius: ["70%", "90%"],
          avoidLabelOverlap: false,
          // emphasis: {
          //   scale: true, // 取消鼠标悬停时的强调效果
          //   label: {},
          // },
          label: {
            show: true,
            position: "center",
            formatter: (value) => {
              let str = "{a|检测总数}" + "\n" + "{b|" + this.total + "}";
              return str;
            },
            rich: {
              a: {
                color: "#86909C",
                fontSize: "11px",
                lineHeight: 25,
              },
              b: {
                color: "#1D2129",
                fontSize: "18px",
              },
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 0, name: "合格", itemStyle: { color: "#1AD2CE" } },
            { value: 0, name: "不合格", itemStyle: { color: "#FCC59F" } },
          ],
        },
      ],
    };
    this.option = option;
    this.getTestResult();
  },
  methods: {
    calculatePercentage(num, fate) {
      // 防止除以零的情况
      if (Number(fate) === 0) {
        return 0;
      }
      // 计算百分比并四舍五入
      return Math.round((Number(num) / Number(fate)) * 100);
    },
    initEcharts() {
      this.domIds.forEach((x, index) => {
        if (this.echartsData[x].bhgNum == 0) {
          this.option.series[0].data = [
            {
              value: this.echartsData[x].hgNum,
              name: "合格",
              itemStyle: { color: "#1AD2CE" },
              tooltip: {
                formatter: "{b} {c} 100%",
              },
            },
          ];
        } else {
          this.option.series[0].data = [
            {
              value: this.echartsData[x].hgNum,
              name: "合格",
              itemStyle: { color: "#1AD2CE" },
            },
            {
              value: this.echartsData[x].bhgNum,
              name: "不合格",
              itemStyle: { color: "#FCC59F" },
            },
          ];
        }
        this.total = this.echartsData[x].bhgNum + this.echartsData[x].hgNum;
        this.setEcharts(this.domIds[index]);
      });
    },
    // 试验检测结果统计
    getTestResult() {
      TestPassRate({ clmc: "" }).then((res) => {
        const { data, success } = res;
        if (!success) {
          this.$message.error("获取试检检测合格率错误！");
          return;
        }
        let obj = {
          shiyancenter: {
            bhgNum: 0,
            hgNum: 0,
          },
          jianlichoujian: {
            bhgNum: 0,
            hgNum: 0,
          },
          shigongdanwei: {
            bhgNum: 0,
            hgNum: 0,
          },
        };
        if (data && Array.isArray(data)) {
          let reagent = data.find((x) => x.type == "reagent");
          let supervision = data.find((x) => x.type == "supervision");
          let work = data.find((x) => x.type == "work");
          if (reagent) {
            obj.shiyancenter.bhgNum = reagent.bhgNum || 0;
            obj.shiyancenter.hgNum = reagent.hgNum || 0;
          }
          if (supervision) {
            obj.jianlichoujian.bhgNum = supervision.bhgNum || 0;
            obj.jianlichoujian.hgNum = supervision.hgNum || 0;
          }
          if (work) {
            obj.shigongdanwei.bhgNum = work.bhgNum || 0;
            obj.shigongdanwei.hgNum = work.hgNum || 0;
          }
        }
        this.echartsData = obj;
        console.log("试验检测结果统计", obj);
        this.initEcharts();
      });
    },
    //
    getMaterial() {
      material().then((res) => {
        const { data, success } = res;
        if (!success) {
          this.$message.error("获取试检监测数量错误！");
          return;
        }
        if (data && Array.isArray(data)) {
          this.progressList = data;
        }
      });
    },
    setEcharts(domId) {
      let chartDom = document.getElementById(domId);
      let myChart = echarts.init(chartDom);
      // 设置图表配置项
      this.option && myChart.setOption(this.option);
    },
  },
};
</script>

<style lang="scss" scoped>
.greeIcon {
  width: 2px;
  height: 8px;
  background-color: #1298fa;
}
.line {
  border: 1px dashed #91d1ff;
}
.hegeIcon {
  width: 8px;
  height: 8px;
  background-color: #1ad2ce;
}
.buhegeIcon {
  width: 8px;
  height: 8px;
  background-color: #fcc59f;
}
</style>
