<template>
  <div class="bg-fff w-100pre h-100pre main-page">
    <div class="box" style="border-bottom: none; border-right: none">
      <div class="flex justify-between align-center">
        <div>收发文对象分析</div>
        <div class="flex align-center">
          <div class="mr-20 flex">
            <div
              :class="
                params1.year == item.value ? 'typeActive' : 'nottypeActive'
              "
              class="py-5 px-10 pointer"
              @click="changeDesignType(1, item)"
              v-for="(item, index) in designType"
              :key="index"
            >
              {{ item.label }}
            </div>
          </div>
          <div>
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              v-model="params1.flag"
              placeholder="请选择"
              @change="getQuery1"
            >
              <el-option
                :label="item.title"
                :value="item.value"
                v-for="item in flagList"
                :key="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="w-100pre h-100pre1" style="" id="planChange"></div>
      <div class="flex justify-center">
        <el-radio-group v-model="params1.type" @input="getQuery1">
          <el-radio label="1">收文</el-radio>
          <el-radio label="2">发文</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="box" style="border-bottom: none">
      <div class="flex justify-between">
        <div>平均处理效率</div>
        <div>
          <div class="mr-20 flex">
            <div
              :class="
                params2.year == item.value ? 'typeActive' : 'nottypeActive'
              "
              class="py-5 px-10 pointer"
              @click="changeDesignType(2, item)"
              v-for="(item, index) in designType"
              :key="index"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
      <div class="w-100pre h-100pre" style="" id="discloseTime"></div>
    </div>
    <div class="box" style="border-right: none">
      <div class="flex justify-between">
        <div>培训情况统计图</div>
        <div>
          <el-date-picker
            @change="getQuery3"
            value-format="yyyy"
            v-model="params3.year"
            type="year"
            placeholder="选择年"
            :clearable="false"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="w-100pre h-100pre" style="" id="DesignAchievements"></div>
    </div>
    <div class="box">
      <div class="flex justify-between align-center mb-20">
        <div>培训排行榜</div>
        <div class="flex align-center">
          <div class="mr-20 flex">
            <div
              :class="
                params4.type == index + 1 ? 'typeActive' : 'nottypeActive'
              "
              class="py-5 px-10 pointer"
              @click="changeDesignType(4, item)"
              v-for="(item, index) in rankingType"
              :key="index"
            >
              {{ item.type }}
            </div>
          </div>
          <div>
            <el-date-picker
              @change="getQuery4"
              value-format="yyyy"
              v-model="params4.year"
              type="year"
              placeholder="选择年"
              :clearable="false"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="info">
        <div
          v-for="(item, index) in completeinfo"
          :key="index + 1"
          :class="[index + 1 < 4 ? 'infoActive' : 'info-item']"
        >
          <el-row class="flex item-end">
            <el-col :span="2">
              <span class="num">{{ index + 1 }}</span>
            </el-col>
            <el-col :span="14">
              <div class="w-240 text-ellipsis">
                <div>{{ item.deptName }}</div>
              </div>
            </el-col>
            <el-col :span="8" style="text-align: end">
              <div>
                <span> {{ item.realNum }} </span>
                <span v-if="params4.type == 1"> 次</span>
                <span v-else> 人</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="flex justify-center" v-if="completeinfo.length == 0">
          <el-empty :image-size="180" description="暂无数据"></el-empty>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { query1, query2, query3, query4, unitList } from "./api";

export default {
  data() {
    return {
      completeinfo: [
        {
          name: "单位名称",
          pre: "tzwcl",
          up: "tzlast",
          id: 1,
        },
        {
          name: "单位名称",
          pre: "tzwcl",
          up: "tzlast",
          id: 1,
        },
        {
          name: "单位名称",
          pre: "tzwcl",
          up: "tzlast",
          id: 1,
        },
        {
          name: "单位名称",
          pre: "tzwcl",
          up: "tzlast",
          id: 1,
        },
        {
          name: "单位名称",
          pre: "tzwcl",
          up: "tzlast",
          id: 1,
        },
        {
          name: "单位名称",
          pre: "tzwcl",
          up: "tzlast",
          id: 1,
        },
        {
          name: "单位名称",
          pre: "tzwcl",
          up: "tzlast",
          id: 1,
        },
        {
          name: "单位名称",
          pre: "tzwcl",
          up: "tzlast",
          id: 1,
        },
        {
          name: "单位名称",
          pre: "tzwcl",
          up: "tzlast",
          id: 1,
        },
      ],
      flagList: [
        {
          title: "全部",
          value: "",
        },
        {
          title: "监理单位",
          value: 1,
        },
        {
          title: "设计单位",
          value: 2,
        },
        {
          title: "施工单位",
          value: 3,
        },
      ],
      options: [],
      value: "",
      designType: [
        {
          label: "本年",
          value: "y",
        },
        {
          label: "本月",
          value: "m",
        },
        {
          label: "本周",
          value: "w",
        },
      ],
      rankingType: [
        {
          type: "按次数",
          value: 1,
        },
        {
          type: "按人数",
          value: 2,
        },
      ],
      designChangeCurrent: 0,
      params3: {
        year: "",
      },
      params1: {
        type: "2",
        year: "y",
        flag: "",
      },
      params2: {
        year: "y",
      },
      planconfig: {
        option: "",
        myChart: "",
      },
      info1: {},
      achievementsconfig: {
        option: "",
        myChart: "",
      },
      params4: {
        type: 1,
        year: "",
      },
      discloseTimeconfig: {
        option: "",
        myChart: "",
      },
      paramsPlanChange: {
        type: "",
      },
      receiveUnitList: [],
    };
  },
  created() {
    this.getUnitList();
    this.getYear();
    this.getQuery1();
    this.getQuery2();
    this.getQuery3();
    this.getQuery4();
  },
  mounted() {
    this.discloseTimeEchart();
    this.DesignAchievementsEcharts();
    this.planChangeEcharts();
  },
  methods: {
    // 根据单位id 获取名称
    getUnitNameById(unitId) {
      let name = "";
      if (!unitId) return name;
      let item = this.receiveUnitList.find((x) => x.corpId == unitId);
      if (item) {
        name =
          item.corpName.length > 8
            ? item.corpName.slice(0, 8) + "..."
            : item.corpName;
      }
    },
    // 根据单位id 获取名称
    getUnitName(unitIds) {
      if (!unitIds) return;
      let arr = unitIds.split(",");
      let names = [];
      this.receiveUnitList.forEach((x) => {
        if (arr.includes(x.corpId)) {
          names.push(x.corpName);
        }
      });
      return names.join(",") || unitIds;
    },

    // 收文单位
    async getUnitList() {
      const { data, success } = await unitList();
      console.log("单位列表", success, data);

      if (success) {
        this.receiveUnitList = data.filter((item) => {
          return item.corpLeaf !== 0;
        });
      }
    },
    getYear() {
      this.params3.year = this.$dateFormat(new Date().getTime(), "yyyy");
      this.params4.year = this.$dateFormat(new Date().getTime(), "yyyy");
    },
    // 培训情况统计查询
    getQuery3() {
      if (!this.params3?.year) {
        this.$message.warning("请选择年份");
        return;
      }
      query3(this.params3).then((res) => {
        console.log("设计交底", res);
        if (res.success) {
          let arr1 = [];
          let arr2 = [];
          let name = [];
          if (res.data.length > 0) {
            res.data.forEach((item) => {
              arr1.push(item.planNum);
              arr2.push(item.realNum);
              name.push(item.deptName);
            });
          }
          this.achievementsconfig.option.series[0].data = arr1;
          this.achievementsconfig.option.series[1].data = arr2;
          this.achievementsconfig.option.xAxis.data = name;
          this.achievementsconfig.myChart.setOption(
            this.achievementsconfig.option
          );
          this.achievementsconfig.myChart.hideLoading();
        }
      });
    },
    changeDesignType(flag, item) {
      console.log(flag, item);
      if (flag === 1) {
        this.params1.year = item.value;
        this.getQuery1();
      } else if (flag === 2) {
        this.params2.year = item.value;
        this.getQuery2();
      } else {
        this.params4.type = item.value;
        this.getQuery4();
      }
    },
    // 收发文对象统计分析
    getQuery1() {
      query1(this.params1).then((res) => {
        if (res.success) {
          console.log("收发文对象分析", res.data);
          // this.planData = res.data;
          let arr1 = [];
          this.info1 = res.data;
          if (res.data.list && res.data.list.length > 0) {
            res.data.list.forEach((item) => {
              arr1.push({
                value: item.total,
                fate: item.fate,
                name: this.getUnitName(item.deptName),
              });
            });
          }
          this.planconfig.option.series[0].data = arr1;
          // this.planconfig.option.series[0].label.formatter(total)
          this.planconfig.myChart.setOption(this.planconfig.option);
          this.planconfig.myChart.hideLoading();
        }
      });
    },
    // 培训排行榜统计查询
    getQuery4() {
      if (!this.params4.year) {
        this.$message.warning("请选择年份");
        return;
      }
      query4(this.params4).then((res) => {
        if (res.success) {
          this.completeinfo = res.data;
          console.log("收发文对象分析", res.data);
          // this.planData = res.data;
        }
      });
    },
    // 平均处理效率统计分析
    getQuery2() {
      query2(this.params2).then((res) => {
        if (res.success) {
          let arr = [];
          let name = [];
          res.data.forEach((item) => {
            name.push(this.getUnitName(item.deptName));
            arr.push(item.total);
          });
          this.discloseTimeconfig.option.series[0].data = arr;
          this.discloseTimeconfig.option.xAxis.data = name;
          this.discloseTimeconfig.myChart.setOption(
            this.discloseTimeconfig.option
          );
          this.discloseTimeconfig.myChart.hideLoading();
        }
      });
    },
    discloseTimeEchart() {
      const chartDom = document.getElementById("discloseTime");
      this.discloseTimeconfig.myChart = echarts.init(chartDom);
      this.discloseTimeconfig.option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "category",
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0,
            formatter: (params) => {
              var newParamsName = "";
              const paramsNameNumber = params.length; // 总长度
              const provideNumber = 4; // 单行显示文字个数
              const rowNumber = 2;
              if (paramsNameNumber > provideNumber) {
                for (let p = 0; p < rowNumber; p++) {
                  var tempStr = "";
                  var start = p * provideNumber;
                  var end = start + provideNumber;
                  if (p === rowNumber - 1) {
                    if (paramsNameNumber > provideNumber * rowNumber) {
                      tempStr = params.substring(start, end) + "\n" + "...";
                    } else {
                      tempStr = params.substring(start, end);
                    }
                  } else {
                    tempStr = params.substring(start, end) + "\n";
                  }
                  newParamsName += tempStr;
                }
              } else {
                newParamsName = params;
              }
              return newParamsName;
            },
          },
          data: [],
        },
        yAxis: {
          type: "value",
          name: "处理用时(天)",
          nameLocation: "end",
          nameTextStyle: {
            align: "right",
          },
        },
        series: [
          {
            data: [],
            barWidth: 40,
            type: "bar",
          },
        ],
      };
      this.discloseTimeconfig.myChart.showLoading();
      window.addEventListener("resize", () => {
        this.discloseTimeconfig.myChart.resize();
      });
    },
    DesignAchievementsEcharts() {
      const chartDom = document.getElementById("DesignAchievements");
      this.achievementsconfig.myChart = echarts.init(chartDom);
      this.achievementsconfig.option = {
        legend: {
          data: ["计划", "实际"],
        },
        xAxis: {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0,
            formatter: (params) => {
              var newParamsName = "";
              const paramsNameNumber = params.length; // 总长度
              const provideNumber = 4; // 单行显示文字个数
              const rowNumber = 2;
              if (paramsNameNumber > provideNumber) {
                for (let p = 0; p < rowNumber; p++) {
                  var tempStr = "";
                  var start = p * provideNumber;
                  var end = start + provideNumber;
                  if (p === rowNumber - 1) {
                    if (paramsNameNumber > provideNumber * rowNumber) {
                      tempStr = params.substring(start, end) + "\n" + "...";
                    } else {
                      tempStr = params.substring(start, end);
                    }
                  } else {
                    tempStr = params.substring(start, end) + "\n";
                  }
                  newParamsName += tempStr;
                }
              } else {
                newParamsName = params;
              }
              return newParamsName;
            },
          },
        },
        yAxis: {
          type: "value",
          name: "单位：次",
          nameLocation: "end",
          nameTextStyle: {
            align: "right",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        series: [
          {
            name: "计划",
            data: [],
            barWidth: 40,
            type: "bar",
          },
          {
            name: "实际",
            data: [],
            barWidth: 40,
            type: "bar",
          },
        ],
      };
      // this.achievementsconfig.option &&
      //   this.achievementsconfig.myChart.setOption(
      //     this.achievementsconfig.option
      //   );
      this.achievementsconfig.myChart.showLoading();
      window.addEventListener("resize", () => {
        this.achievementsconfig.myChart.resize();
      });
    },

    // 根据单位id 获取名称
    getUnitName(unitIds) {
      if (!unitIds) return;
      let arr = unitIds.split(",");
      let names = [];
      this.receiveUnitList.find((x) => {
        if (arr.includes(x.corpId)) {
          names.push(x.corpName);
        }
      });
      return names.join(",") || unitIds;
    },
    planChangeEcharts() {
      const chartDom = document.getElementById("planChange");
      this.planconfig.myChart = echarts.init(chartDom);
      this.planconfig.option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "center",
          left: "55%",
          orient: "vertical",
          icon: "circle",
          selectedMode: false,
          formatter: (name) => {
            // 添加
            let target, fate;
            for (
              let i = 0;
              i < this.planconfig.option.series[0].data.length;
              i++
            ) {
              if (this.planconfig.option.series[0].data[i].name === name) {
                target = this.planconfig.option.series[0].data[i].value;
                fate = this.planconfig.option.series[0].data[i].fate;
              }
            }
            let unitName = this.getUnitNameById(name);
            if (unitName) {
              name = unitName;
            } else {
              name = name.length > 8 ? name.slice(0, 8) + "..." : name;
            }
            var arr = [
              "{a|" + name + "}",
              "{b|" + target + "次}",
              "{c|" + fate + "}",
            ];
            return arr.join("  ");
          },
          textStyle: {
            // 添加
            padding: [8, 0, 0, 0],
            rich: {
              a: {
                fontSize: 15,
                width: 160,
              },
              b: {
                fontSize: 15,
                width: 70,
              },
              c: {
                width: 70,
                fontSize: 15,
              },
            },
          },
        },

        grid: {
          show: false,
          left: "0%",
          right: "0%",
          containLabel: true,
        },
        series: [
          {
            name: "收发文对象分析",
            type: "pie",
            radius: ["80%", "95%"],
            center: ["30%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: "center",
              fontSize: 20,
              fontWeight: "bold",
              formatter: (item) => {
                return `{total| ${this.info1.total || 0} }\n\r{active|${
                  this.params1.type == 1 ? "收文总数" : "发文总数"
                }}`;
              },
              rich: {
                total: {
                  fontSize: 35,
                  fontFamily: "微软雅黑",
                  color: "#454c5c",
                },
                active: {
                  fontFamily: "微软雅黑",
                  fontSize: 16,
                  color: "#6c7a89",
                  lineHeight: 30,
                },
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 120, name: "一般隐患1级", fate: 0.25 },
              { value: 30, name: "一般隐患2级", fate: 0.25 },
              { value: 35, name: "重大隐患1级", fate: 0.25 },
            ],
          },
        ],
      };
      // this.planconfig.option &&
      //   this.planconfig.myChart.setOption(this.planconfig.option);
      this.planconfig.myChart.showLoading();
      window.addEventListener("resize", () => {
        this.planconfig.myChart.resize();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.main-page {
  display: flex;
  flex-wrap: wrap;
  height: 100%;

  .box {
    padding: 20px 10px;
    border: 1px solid #0096ff;
    width: 50%;
    height: 50%;
    box-sizing: border-box;

    .h-100pre1 {
      // height: calc(100%-20px);
      height: 80%;
    }

    .info {
      height: calc(100% - 52px);
      overflow-y: auto;

      .info-item {
        background-color: rgb(249, 249, 249);
        margin-bottom: 10px;
        align-items: baseline;
        padding: 10px 15px;

        .num {
          background-color: rgb(204, 204, 204);
          padding: 6px 8px;
          color: #fff;
          border-radius: 50%;
        }
      }

      .infoActive {
        background: rgb(202, 249, 130);
        margin-bottom: 10px;
        align-items: baseline;
        padding: 10px 15px;

        .num {
          background-color: rgb(246, 184, 54);
          padding: 6px 8px;
          color: #fff;
          border-radius: 50%;
        }
      }
    }
  }
}

//
.nottypeActive {
  border: 1px solid #000;
}

.typeActive {
  border: 1px solid #0096ff;
  color: #0096ff;
}
</style>
