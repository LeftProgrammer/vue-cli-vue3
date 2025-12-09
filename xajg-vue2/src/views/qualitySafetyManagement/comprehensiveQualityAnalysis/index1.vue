<template>
  <div class="bg-fff w-100pre h-100pre main-page" style="overflow-y: auto">
    <div class="box w_40 h_45" style="border-bottom: none; border-right: none">
      <div class="flex justify-between align-center mb-10">
        <div>质量验评优良统计</div>
        <div>
          类型
          <el-select @visible-change="$visibleChange($event, 'el-popper')"
            v-model="parmas1.type"
            placeholder="请选择"
            @change="getQuer1()"
          >
            <el-option
              :label="item.title"
              :value="item.value"
              v-for="item in typeList"
              :key="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="w-100pre h-100pre" style="" id="planChange"></div>
    </div>
    <div class="box w_60 h_45" style="border-bottom: none">
      <div class="flex justify-between align-center mb-10">
        <div>质量验评完成量统计</div>
      </div>
      <div class="flex justify-between h-100pre">
        <div class="info-box flex w_40">
          <div class="info flex align-center" v-for="item in info2.list">
            <div class="title">
              {{ item.type ? getType(item.type) : "" }}
              <el-divider direction="vertical"></el-divider>
            </div>
            <div>
              <div class="num">{{ item.num }}</div>
              <div>已验评</div>
            </div>
            <div>
              <div class="num">
                {{ item.fate ? getNumber(item.fate) : "0" }}%
              </div>
              <div>完成率</div>
            </div>
          </div>
        </div>
        <div class="w_60 h-100pre" style="" id="planChange1"></div>
      </div>
    </div>
    <div class="box w_40 h_55" style="border-right: none">
      <div class="flex justify-between">
        <div>验评数量统计</div>
      </div>
      <div class="w-100pre h-100pre" style="" id="DesignAchievements"></div>
    </div>
    <div class="box w_60 h_55">
      <div class="flex justify-between mb-20">
        <div>月度验评数量统计</div>
        <div class="flex">
          <!-- <div class="mr-20">
                        单位类型
                        <el-select @visible-change="$visibleChange($event, 'el-popper')" v-model="parmas4.year" placeholder="请选择" @change="getQuer4()">
                            <el-option :label="item.title" :value="item.value" v-for="item in yearList"
                                :key="item.value"></el-option>
                        </el-select>
                    </div> -->
          <div>
            类型
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              v-model="parmas4.type"
              placeholder="请选择"
              @change="getQuer4()"
            >
              <el-option
                :label="item.title"
                :value="item.value"
                v-for="item in typeList"
                :key="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="w-100pre h-100pre" style="" id="DesignAchievements1"></div>
    </div>
    <div class="box w_40 h_55" style="border-right: none; border-top: none">
      <div class="flex justify-between">
        <div>试验检测结果统计</div>
        <div>
          材料名称
          <el-select @visible-change="$visibleChange($event, 'el-popper')"
            v-model="parmas5.clmc"
            placeholder="请选择"
            @change="getTestResult()"
          >
            <el-option
              :label="item.dictNameDesc"
              :value="item.dictName"
              v-for="item in clmcList"
              :key="item.dictName"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="w-100pre h-100pre" id="syjcjg" style="height: 95%"></div>
    </div>
    <div class="box w_60 h_55" style="border-top: none">
      <div class="flex justify-between mb-20">
        <div>近一年检测完成量</div>
        <div>
          <el-radio-group v-model="parmas6.type" @input="getYearTestCount">
            <el-radio-button label="0">全部</el-radio-button>
            <el-radio-button label="1">试验中心</el-radio-button>
            <el-radio-button label="2">监理单位</el-radio-button>
            <el-radio-button label="3">施工单位</el-radio-button>
          </el-radio-group>
        </div>
        <div>
          材料名称
          <el-select @visible-change="$visibleChange($event, 'el-popper')"
            v-model="parmas6.clmc"
            placeholder="请选择"
            @change="getYearTestCount()"
          >
            <el-option
              :label="item.dictNameDesc"
              :value="item.dictName"
              v-for="item in clmcList"
              :key="item.dictName"
            ></el-option>
          </el-select>
        </div>
        <div class="flex">
          <!-- <div class="mr-20">
                        单位类型
                        <el-select @visible-change="$visibleChange($event, 'el-popper')" v-model="parmas4.year" placeholder="请选择" @change="getQuer4()">
                            <el-option :label="item.title" :value="item.value" v-for="item in yearList"
                                :key="item.value"></el-option>
                        </el-select>
                    </div> -->
        </div>
      </div>
      <div class="w-100pre h-100pre" id="syjcsl" style="height: 95%"></div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { quer1, quer2, quer3, quer4, testResult, yearTestCount } from "./api";

export default {
  data() {
    return {
      value: "",
      typeList: [
        {
          title: "全部",
          value: "1",
        },
        {
          title: "水工",
          value: "a101",
        },
        {
          title: "公路",
          value: "a201",
        },
        {
          title: "房建",
          value: "a301",
        },
      ],
      yearList: [
        {
          title: "施工单位",
          value: "sgdw",
        },
        {
          title: "监理单位",
          value: "jldw",
        },
      ],
      dataSource: "",
      paramsAchievements: {
        year: "",
      },
      achievementsconfig: {
        option: "",
        myChart: "",
      },
      achievementsconfig1: {
        option: "",
        myChart: "",
      },
      planconfig: {
        option: "",
        myChart: "",
      },
      plan1config: {
        option: "",
        myChart: "",
      },
      info5config: {
        option: "",
        myChart: "",
      },
      info6config: {
        option: "",
        myChart: "",
      },
      info1: {},
      info2: {},
      info3: [],
      info4: [],
      info5: [],
      info6: [],
      parmas1: {
        type: "1",
      },
      parmas4: {
        type: "1",
        // year: 'sgdw'
      },
      parmas5: {
        clmc: "",
        // year: 'sgdw'
      },
      parmas6: {
        clmc: "",
        type: "0",
      },
      clmcList: [
        {
          dictNameDesc: "全部",
          dictName: "",
        },
      ],
    };
  },
  created() {
    this.getClmcList();
    this.getQuer1();
    this.getQuer2();
    this.getQuer3();
    this.getQuer4();
    this.getTestResult();
    this.getYearTestCount();
  },
  mounted() {
    this.DesignAchievementsEcharts();
    this.DesignAchievementsEcharts1();
    this.planChangeEcharts();
    this.planChangeEcharts1();
    this.syjcjg();
    this.syjcsl();
  },
  methods: {
    /**获取字典(材料名称) */
    getClmcList() {
      this.$store.dispatch("dict/get", "clmc").then((data) => {
        data.forEach((item) => {
          this.clmcList.push({
            dictNameDesc: item.dictName,
            dictName: item.dictName,
          });
        });
        console.log(this.clmcList);
      });
    },
    getType(e) {
      if (e) {
        let a = "";
        this.typeList.forEach((item) => {
          if (e == item.value) {
            a = item.title;
          }
        });
        return a;
      }
    },
    getNumber(e) {
      if (e) {
        let a = e * 100;
        return a.toFixed(2);
      }
    },
    //质量验评优良率统计
    getQuer1() {
      quer1(this.parmas1).then((res) => {
        if (res.success) {
          this.info1 = res.data;
          let arr = [];
          this.info1.list &&
            this.info1.list.forEach((item) => {
              if (item.type == "0") {
                arr.push({
                  value: item.num,
                  fate: item.fate,
                  name: "不合格",
                });
              } else if (item.type == "1") {
                arr.push({
                  value: item.num,
                  fate: item.fate,
                  name: "合格",
                });
              } else if (item.type == "2") {
                arr.push({
                  value: item.num,
                  fate: item.fate,
                  name: "优良",
                });
              }
            });
          this.planconfig.option.series[0].data = arr;
          this.planconfig.myChart.setOption(this.planconfig.option);
          this.planconfig.myChart.hideLoading();
        }
      });
    },
    //质量验评完成量统计
    getQuer2() {
      quer2().then((res) => {
        if (res.success) {
          this.info2 = res.data;
          let arr = [];
          this.info2.list &&
            this.info2.list.forEach((item) => {
              if (item.type == "a101") {
                arr.push({
                  value: item.num,
                  name: "水工",
                });
              } else if (item.type == "a201") {
                arr.push({
                  value: item.num,
                  name: "公路",
                });
              } else if (item.type == "a301") {
                arr.push({
                  value: item.num,
                  name: "房建",
                });
              }
            });
          this.plan1config.option.series[0].data = arr;
          this.plan1config.myChart.setOption(this.plan1config.option);
          this.plan1config.myChart.hideLoading();
        }
      });
    },
    //验评数量统计
    getQuer3() {
      quer3().then((res) => {
        if (res.success) {
          this.info3 = res.data;
          let yarr1 = [];
          let yarr2 = [];
          let yarr3 = [];
          let xarr = [];
          this.info3 &&
            this.info3.forEach((item) => {
              xarr.push(item.name);
              yarr1.push(item.wnum);
              yarr2.push(item.ynum);
              yarr3.push(item.znum);
            });
          this.achievementsconfig.option.series[0].data = yarr1;
          this.achievementsconfig.option.series[1].data = yarr2;
          this.achievementsconfig.option.series[2].data = yarr3;
          this.achievementsconfig.option.xAxis.data = xarr;
          this.achievementsconfig.myChart.setOption(
            this.achievementsconfig.option
          );
          this.achievementsconfig.myChart.hideLoading();
        }
      });
    },
    //月度验评数量统计
    getQuer4() {
      quer4(this.parmas4).then((res) => {
        if (res.success) {
          this.info4 = res.data;
          let yarr1 = [];
          let yarr2 = [];
          let xarr = [];
          this.info4 &&
            this.info4.forEach((item) => {
              yarr1.push(item.num);
              yarr2.push(item.fate * 100).toFixed(2);
              xarr.push(item.type);
            });
          this.achievementsconfig1.option.series[0].data = yarr1;
          this.achievementsconfig1.option.series[1].data = yarr2;
          this.achievementsconfig1.option.xAxis[0].data = xarr;
          this.achievementsconfig1.myChart.setOption(
            this.achievementsconfig1.option
          );
          this.achievementsconfig1.myChart.hideLoading();
        }
      });
    },
    // 试验检测结果统计
    getTestResult() {
      testResult(this.parmas5).then((res) => {
        if (res.success) {
          this.info5 = res.data;
          let yarr = [];
          this.info5 &&
            this.info5.forEach((item) => {
              let yarrData = [];
              yarrData.push({
                name: "合格",
                value: item.hgNum,
              });
              if (item.hgNum !== 0 || item.bhgNum !== 0) {
                yarrData.push({
                  name: "不合格",
                  value: item.bhgNum,
                });
              }
              yarr.push(yarrData);
            });
          this.info5config.option.series[0].data = yarr[0];
          this.info5config.option.series[1].data = yarr[1];
          this.info5config.option.series[2].data = yarr[2];
          this.info5config.myChart.setOption(this.info5config.option);
          this.info5config.myChart.hideLoading();
        }
      });
    },
    // 近一年检测完成量
    getYearTestCount() {
      console.log(this.parmas6);
      yearTestCount(this.parmas6).then((res) => {
        console.log(res);
        if (res.success) {
          this.info6 = res.data;
          let yarr1 = [];
          let yarr2 = [];
          let xarr = [];
          this.info6 &&
            this.info6.forEach((item) => {
              yarr1.push(item.hgNum);
              yarr2.push(item.bhgNum);
              xarr.push(item.yf);
            });
          this.info6config.option.series[0].data = yarr1;
          this.info6config.option.series[1].data = yarr2;
          this.info6config.option.xAxis.data = xarr;
          this.info6config.myChart.setOption(this.info6config.option);
          this.info6config.myChart.hideLoading();
        }
      });
    },
    DesignAchievementsEcharts() {
      const chartDom = document.getElementById("DesignAchievements");
      this.achievementsconfig.myChart = echarts.init(chartDom);
      this.achievementsconfig.option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {},
        xAxis: {
          type: "category",
          data: ["单位1", "单位2", "单位3", "单位4", "单位5", "单位6", "单位7"],
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
          name: "单位/个",
          nameLocation: "end",
          nameTextStyle: {
            align: "right",
          },
        },
        series: [
          {
            name: "未验评",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            barWidth: 40,
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "已验评",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            barWidth: 40,
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: "验证中",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            barWidth: 40,
            data: [150, 232, 201, 154, 190, 330, 410],
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
    DesignAchievementsEcharts1() {
      const chartDom = document.getElementById("DesignAchievements1");
      this.achievementsconfig1.myChart = echarts.init(chartDom);
      this.achievementsconfig1.option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          data: ["已评验数", "优良率"],
        },
        xAxis: [
          {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            axisTick: {
              alignWithLabel: true,
            },
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "数量",
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: "{value}",
            },
          },
          {
            type: "value",
            name: "优良率",
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: "{value} %",
            },
          },
        ],
        series: [
          {
            name: "已评验数",
            type: "bar",
            barWidth: 40,
            tooltip: {
              valueFormatter: (value) => {
                return value;
              },
            },
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4,
              3.3,
            ],
          },
          {
            name: "优良率",
            type: "line",
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: (value) => {
                return parseFloat(value).toFixed(2) + "%";
              },
            },
            data: [
              2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2,
            ],
          },
        ],
      };
      // this.achievementsconfig1.option &&
      //   this.achievementsconfig1.myChart.setOption(
      //     this.achievementsconfig1.option
      //   );
      this.achievementsconfig1.myChart.showLoading();
      window.addEventListener("resize", () => {
        this.achievementsconfig1.myChart.resize();
      });
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
            var arr = [
              "{a|" + name + "}",
              "{b|" + target + "个}",
              "{c|" + fate * 100 + "%}",
            ];
            return arr.join("  ");
          },
          textStyle: {
            // 添加
            padding: [8, 0, 0, 0],
            rich: {
              a: {
                fontSize: 15,
                width: 80,
              },
              b: {
                fontSize: 15,
                width: 50,
              },
              c: {
                fontSize: 15,
              },
            },
          },
        },
        series: [
          {
            name: "质量验评优良统计",
            type: "pie",
            radius: ["55%", "70%"],
            center: ["30%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: "center",
              fontSize: 20,
              fontWeight: "bold",
              formatter: (item) => {
                return `{active|验评总数}\n\r{total| ${
                  this.info1.total || 0
                } }`;
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
              { value: 15, name: "重大隐患2级", fate: 0.25 },
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
    planChangeEcharts1() {
      const chartDom = document.getElementById("planChange1");
      this.plan1config.myChart = echarts.init(chartDom);
      this.plan1config.option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "0",
          left: "center",
          selectedMode: false,
        },
        grid: {
          show: false,
          left: "0%",
          right: "0%",
          containLabel: true,
        },
        series: [
          {
            name: "质量验评完成量统计",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: "center",
              formatter: (item) => {
                return `{total|${this.info2.total || 0}}\n\r{active| 完成总数}`;
              },
              rich: {
                total: {
                  fontSize: 14,
                  fontFamily: "微软雅黑",
                  color: "#454c5c",
                },
                active: {
                  fontFamily: "微软雅黑",
                  fontSize: 12,
                  color: "#454c5c",
                  lineHeight: 30,
                },
              },
            },
            data: [
              { value: 120, name: "一般隐患1级" },
              { value: 30, name: "一般隐患2级" },
              { value: 35, name: "重大隐患1级" },
              { value: 15, name: "重大隐患2级" },
            ],
          },
        ],
      };
      // this.plan1config.option &&
      //   this.plan1config.myChart.setOption(this.plan1config.option);
      this.plan1config.myChart.showLoading();
      window.addEventListener("resize", () => {
        this.plan1config.myChart.resize();
      });
    },
    // 试验检测结果统计
    syjcjg() {
      let thiss = this;
      const chartDom = document.getElementById("syjcjg");
      this.info5config.myChart = echarts.init(chartDom);

      let data = [
        {
          name: "试验中心",
        },
        {
          name: "监理单位抽检",
        },
        {
          name: "施工单位自检",
        },
      ];

      let titleArr = [],
        seriesArr = [];
      data.forEach(function (item, index) {
        titleArr.push({
          text: item.name,
          left: index * 30 + 20 + "%",
          top: "70%",
          textAlign: "center",
          textStyle: {
            fontWeight: "normal",
            fontSize: "16",
            textAlign: "center",
          },
        });
        seriesArr.push({
          name: item.name,
          type: "pie",
          clockWise: false,
          radius: ["20%", "35%"],
          center: [index * 30 + 20 + "%", "50%"],
          top: "-10%",
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "center",
            formatter: (item) => {
              let data = thiss.info5config.option.series[index].data;
              return (
                `完成总数\n` +
                (data.length === 2
                  ? data[0].value + data[1].value
                  : data[0].value)
              );
            },
            rich: {
              total: {
                fontSize: 14,
                fontFamily: "微软雅黑",
                color: "#454c5c",
              },
              active: {
                fontFamily: "微软雅黑",
                fontSize: 12,
                color: "#454c5c",
                lineHeight: 30,
              },
            },
          },
          data: [
            { value: 120, name: "一般隐患1级" },
            { value: 30, name: "一般隐患2级" },
          ],
        });
      });

      this.info5config.option = {
        backgroundColor: "#fff",
        color: ["#91CC75", "#EE6666"],
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        grid: {
          show: false,
          left: "0%",
          right: "0%",
          containLabel: true,
        },
        legend: {
          top: "0%",
          left: "0%",
          icon: "circle",
          formatter: (name) => {
            return name;
          },
          textStyle: {
            // 添加
            padding: [8, 0, 0, 0],
            rich: {
              a: {
                fontSize: 15,
                width: 80,
              },
              b: {
                fontSize: 15,
                width: 50,
              },
              c: {
                fontSize: 15,
              },
            },
          },
        },
        title: titleArr,
        series: seriesArr,
      };
      // this.info5config.option &&
      // this.info5config.myChart.setOption(this.info5config.option);
      this.info5config.myChart.showLoading();
      window.addEventListener("resize", () => {
        this.info5config.myChart.resize();
      });
    },
    // 近一年检测完成量
    syjcsl() {
      const thiss = this;
      const chartDom = document.getElementById("syjcsl");
      this.info6config.myChart = echarts.init(chartDom);
      this.info6config.option = {
        color: ["#91CC75", "#EE6666"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {},
        dataZoom: {
          type: "slider",
        },
        xAxis: {
          type: "category",
          data: ["单位1", "单位2", "单位3", "单位4", "单位5", "单位6", "单位7"],
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 0,
            formatter: (params) => {
              var newParamsName = "";
              const paramsNameNumber = params.length; // 总长度
              const provideNumber = 7; // 单行显示文字个数
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
          name: "单位/次",
          nameLocation: "end",
          nameTextStyle: {
            align: "right",
          },
        },
        series: [
          {
            name: "合格",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            label: {
              show: false,
              position: "top",
            },
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "不合格",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            label: {
              show: true,
              position: "top",
              formatter: function (params) {
                return (
                  params.value +
                  thiss.info6config.option.series[0].data[params.dataIndex]
                );
              },
            },
            data: [220, 182, 191, 234, 290, 330, 310],
          },
        ],
      };
      // this.info6config.option &&
      // this.info6config.myChart.setOption(
      //   this.info6config.option
      // );
      this.info6config.myChart.showLoading();
      window.addEventListener("resize", () => {
        this.info6config.myChart.resize();
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

  .w_40 {
    width: 40%;
  }

  .w_60 {
    width: 60%;
  }

  .h_45 {
    height: 45%;
  }

  .h_55 {
    height: 55%;
  }

  .h_60 {
    height: 60%;
  }

  .box {
    padding: 20px 10px;
    border: 1px solid #0096ff;
    box-sizing: border-box;

    .info-box {
      height: 90%;
      padding-right: 20px;
      border-right: 1px solid #ccc;
      flex-direction: column;
      justify-content: space-around;

      div {
        text-align: center;
      }

      .info {
        padding: 5px 20px;
        border: 1px solid #111;
        border-radius: 4px;
        justify-content: space-between;
      }

      .num {
        font-weight: bold;
        margin-bottom: 10px;
      }
    }
  }
}

//
.nottypeActive {
  padding-bottom: 3px;
}

.typeActive {
  color: #0096ff;
  border-bottom: 3px solid #0096ff;
  padding-bottom: 3px;
}
</style>
