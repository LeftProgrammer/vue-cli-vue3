<template>
  <div class="h-100pre flex flex-column">
    <div class="mb-10">
      类型:
      <el-select @visible-change="$visibleChange($event, 'el-popper')"
        v-model="value"
        placeholder="请选择"
        @change="changeOption"
        :popper-append-to-body="false"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="flex-1">
      <div
        style="height: calc(100% - 50px)"
        class="flex align-center justify-around w-100pre"
      >
        <div
          class="h-100pre"
          id="progressManger"
          :style="{ zoom: 1 / zoom }"
          style="width: 60%"
        ></div>
        <div
          style="width: 40%"
          class="w-100pre h-100pre flex flex-column justify-between"
        >
          <div class="">
            <div class="font-16 mb-16" style="color: #1d2129">验评完成度</div>
            <div class="flex align-center font-14">
              <div
                class="w-8 h-8 mr-5"
                style="background-color: #4EC1A3; border-radius: 50%"
              ></div>
              <div class="flex align-center">
                <span class="w-80" style="color: #4e5969">已验评</span>
                <span>{{ yanpingProgress.value1 }}</span>
              </div>
            </div>
            <div class="flex align-center my-14 font-14">
              <div
                class="w-8 h-8 mr-5"
                style="background-color: #3872DA; border-radius: 50%"
              ></div>
              <div class="flex align-center">
                <span class="w-80" style="color: #4e5969">验评中</span>
                <span>{{ yanpingProgress.value2 }}</span>
              </div>
            </div>
            <div class="flex align-center font-14">
              <div
                class="w-8 h-8 mr-5"
                style="background-color: #FFC69A; border-radius: 50%"
              ></div>
              <div class="flex align-center">
                <span class="w-80" style="color: #4e5969">未验评</span>
                <span>{{ yanpingProgress.value3 }}</span>
              </div>
            </div>
          </div>
          <div class="">
            <div class="font-16 mb-16" style="color: #1d2129">验评结果</div>

            <div class="flex align-center font-14">
              <div
                class="w-8 h-8 mr-5"
                style="background-color: #014ACB; border-radius: 50%"
              ></div>
              <div class="flex align-center">
                <span class="w-80" style="color: #4e5969">{{
                  value == "101" ? "优良" : "合格"
                }}</span>
                <span>{{
                  value == "101" ? yanpingResult.value1 : yanpingResult.value2
                }}</span>
              </div>
            </div>
            <div class="flex align-center my-14 font-14">
              <div
                class="w-8 h-8 mr-5"
                style="background-color: #EF9F61; border-radius: 50%"
              ></div>
              <div class="flex align-center">
                <span class="w-80" style="color: #4e5969">{{
                  value == "101" ? "合格非优良" : "不合格"
                }}</span>
                <span>{{
                  value == "101" ? yanpingResult.value2 : yanpingResult.value3
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { statistics } from "./api.js";

export default {
  props: {
    zoom: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      yanpingProgress: {},
      yanpingResult: {},
      unitTotal: 0,
      options: [
        {
          value: "101",
          label: "水工"
        },
        {
          value: "201",
          label: "公路"
        },
        {
          value: "301",
          label: "房建"
        }
      ],
      value: "101",
      echartsOption: {}
    };
  },
  mounted() {
    this.initEcharts();
    // this.getStatistics();
  },
  methods: {
    changeOption(e) {
      // 设置的option
      //
      // this.echartsOption.option
      console.log("changeOption", e);
      // this.getStatistics();
    },
    setEcharts() {
      // 合格/不合格
      if (this.value === "101") {
        if (this.yanpingResult.value2 == 0) {
          this.echartsOption.option.series[0].data = [
            {
              value: this.yanpingResult.value1,
              name: "优良",
              itemStyle: { color: "#6366f1" },
              // 添加判断，当合格数量为0时手动设置percent为100%
              tooltip: {
                formatter: "{b} {c} (100%)"
              }
            }
          ];
        } else {
          this.echartsOption.option.series[0].data = [
            {
              value: this.yanpingResult.value1,
              name: "优良",
              itemStyle: { color: "#6366f1" }
            },
            {
              value: this.yanpingResult.value2,
              name: "合格非优良",
              itemStyle: { color: "#FFC069" }
            }
          ];
        }
      } else {
        if (this.yanpingResult.value3 == 0) {
          this.echartsOption.option.series[0].data = [
            {
              value: this.yanpingResult.value2,
              name: "合格",
              itemStyle: { color: "#6366f1" },
              // 添加判断，当合格数量为0时手动设置percent为100%
              tooltip: {
                formatter: "{b} {c} (100%)"
              }
            }
          ];
        } else {
          this.echartsOption.option.series[0].data = [
            {
              value: this.yanpingResult.value2,
              name: "合格",
              itemStyle: { color: "#6366f1" }
            },
            {
              value: this.yanpingResult.value3,
              name: "不合格",
              itemStyle: { color: "#FF7D00" }
            }
          ];
        }
      }
      this.echartsOption.option.series[1].data = [
        {
          value: this.yanpingProgress.value1,
          name: "已验评",
          itemStyle: { color: "#22d2d0" }
        },
        {
          value: this.yanpingProgress.value2,
          name: "验评中",
          itemStyle: { color: "#489cff" }
        },
        {
          value: this.yanpingProgress.value3,
          name: "未验评",
          itemStyle: { color: "#fcc6a1" }
        }
      ];
      this.echartsOption.myChart.setOption(this.echartsOption.option);
      this.echartsOption.myChart.resize();
    },
    getStatistics() {
      let params = {
        type: this.value
      };
      statistics(params)
        .then((result) => {
          const { data, success } = result;
          if (!success) {
            this.$message.error("质量验评数据获取失败");
            return;
          }
          let yanping = {
            value1: 0,
            value2: 0,
            value3: 0
          };
          let yanpingResult = {
            value1: 0,
            value2: 0,
            value3: 0
          };
          if (data && Array.isArray(data)) {
            let unitTotal = data.find((item) => item.type == "1");
            this.unitTotal = unitTotal.num || 0;
            let data1 = data.filter((item) => item.type == "2"); //验评
            let data2 = data.filter((item) => item.type == "3"); //验评

            if (data1) {
              let item1 = data1.find((item) => item.fate == "已验评");
              let item2 = data1.find((item) => item.fate == "验评中");
              let item3 = data1.find((item) => item.fate == "未验评");
              if (item1) {
                yanping.value1 = item1.num;
              }
              if (item2) {
                yanping.value2 = item2.num;
              }
              if (item3) {
                yanping.value3 = item3.num;
              }
              this.yanpingProgress = yanping;
            }
            if (data2) {
              let item1 = data2.find((item) => item.fate == "优良");
              let item2 = data2.find((item) => item.fate == "合格");
              let item3 = data2.find((item) => item.fate == "不合格");
              if (item1) {
                yanpingResult.value1 = item1.num;
              }
              if (item2) {
                yanpingResult.value2 = item2.num;
              }
              if (item3) {
                yanpingResult.value3 = item3.num;
              }
              this.yanpingResult = yanpingResult;
            }
            this.setEcharts();
          } else {
            this.yanpingProgress = yanping;
            this.yanpingResult = yanpingResult;
            this.setEcharts();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    initEcharts() {
      var chartDom = document.getElementById("progressManger");
      var myChart = echarts.init(chartDom);
      var option;
      // 设置图表配置项
      option = {
        title: {
          text: "",
          x: "center",
          y: "center",
          textStyle: {
            color: "#333",
            fontSize: 14,
            fontWeight: "normal"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} {c} ({d}%)"
        },

        series: [
          {
            name: "外环",
            type: "pie",
            radius: ["55%", "65%"],
            center: ["50%", "50%"],
            // avoidLabelOverlap: false,
            // hoverAnimation: false,
            label: {
              show: false,
              position: "center"
            },
            // emphasis: {
            //   label: {
            //     show: true,
            //     fontSize: "16",
            //     fontWeight: "bold",
            //   },
            // },

            labelLine: {
              show: false
            },
            data: [
              {
                value: this.yanpingResult.value2,
                name: "合格",
                itemStyle: { color: "#FFC069" }
              }
            ]
          },
          {
            name: "内环",
            type: "pie",
            radius: ["35%", "45%"],
            // avoidLabelOverlap: false,
            // hoverAnimation: false,
            label: {
              show: true,
              position: "center",
              // formatter: "{b}\n\n{d}%", // 设置显示百分比的格式
              formatter: (value) => {
                let str =
                  "{a|单元工程总数}" + "\n" + "{b|" + this.unitTotal + "}";
                return str;
              },
              rich: {
                a: {
                  color: "#86909C",
                  fontSize: "14px",
                  lineHeight: 22
                },
                b: {
                  color: "#1D2129",
                  fontSize: "18px"
                }
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: this.yanpingProgress.value1,
                name: "已验评",
                itemStyle: { color: "#22d2d0" }
              },
              {
                value: this.yanpingProgress.value2,
                name: "验评中",
                itemStyle: { color: "#489cff" }
              },
              {
                value: this.yanpingProgress.value3,
                name: "未验评",
                itemStyle: { color: "#fcc6a1" }
              }
            ]
          }
        ]
      };

      option && myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
      this.echartsOption = {
        option,
        myChart
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.opacity {
  opacity: 0;
}
</style>
