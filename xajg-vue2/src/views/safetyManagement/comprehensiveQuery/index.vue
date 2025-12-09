<template>
  <div class="w-100pre h-100pre main-page">
    <div class="box w_75 h_55">
      <div class="flex align-center">
        <div class="title-line mr-5"></div>
        <div class="item-title">水雨情监测</div>
      </div>
      <div class="divider-line mt-10"></div>

      <div class="flex justify-between align-flex-start h-100pre mt-10">
        <div class="w_40 h-100pre1">
          <div class="flex align-center h-30pre">
            <img class="syq-img" :src="require('@/assets/img/safe/sqjc.png')" />
            <div class="">
              <p class="syq-title mb-20"><span class="mr-20">水情监测</span></p>
              <p class="mb-10">
                <span class="mr-20">上游水位：</span>
                {{
                  info1_1.upWaterLevel
                    ? getNumber(info1_1.upWaterLevel)
                    : "0.00"
                }}m
              </p>
              <p class="syq-time">
                <span class="mr-20">数据更新时间</span> {{ info1_1.tm }}
              </p>
            </div>
          </div>
          <div class="divider-line1"></div>
          <div class="flex align-center h-30pre">
            <img class="syq-img" :src="require('@/assets/img/safe/yqjc.png')" />
            <div class="">
              <p class="syq-title mb-20"><span class="mr-20">雨情监测</span></p>
              <p class="mb-10">
                <span class="mr-20">监测点：</span>
                <el-select @visible-change="$visibleChange($event, 'el-popper')"
                  v-model="paramsPlanChange.flag"
                  @change="getQuer1"
                  v-if="paramsPlanChange.type == 1"
                >
                  <el-option
                    v-for="(item, index) in siteList"
                    :key="index"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </p>
              <p class="syq-time">
                <span class="mr-20">数据更新时间</span> {{ info1.tm }}
              </p>
            </div>
          </div>

          <div
            class="mt-20 flex justify-between big-box h-30pre"
            v-if="paramsPlanChange.type == 1"
          >
            <div class="info-box">
              <p class="num">{{ info1.drp ? getNumber(info1.drp) : "0.00" }}</p>
              <p class="item">当前降水量(mm)</p>
            </div>
            <div class="info-box">
              <p class="num">{{ info1.dtp ? getNumber(info1.dtp) : "0.00" }}</p>
              <p class="item">日累计降雨量(mm)</p>
            </div>
            <div class="info-box">
              <p class="num">{{ info1.mtp ? getNumber(info1.mtp) : "0.00" }}</p>
              <p class="item">月累计降雨量(mm)</p>
            </div>
            <div class="info-box">
              <p class="num">{{ info1.pt ? getNumber(info1.pt) : "0.00" }}</p>
              <p class="item">年累计雨量(mm)</p>
            </div>
          </div>
          <!--          <div-->
          <!--            class="mt-20 flex justify-between big-box"-->
          <!--            v-if="paramsPlanChange.type == 2"-->
          <!--          >-->
          <!--            <div class="info-box">-->
          <!--              <p class="num">-->
          <!--                {{-->
          <!--                  info1.upWaterLevel ? getNumber(info1.upWaterLevel) : "0.00"-->
          <!--                }}-->
          <!--              </p>-->
          <!--              <p>上游水位(m)</p>-->
          <!--            </div>-->
          <!--            <div class="info-box">-->
          <!--              <p class="num">-->
          <!--                {{-->
          <!--                  info1.downWaterLevel-->
          <!--                    ? getNumber(info1.downWaterLevel)-->
          <!--                    : "0.00"-->
          <!--                }}-->
          <!--              </p>-->
          <!--              <p>下游水位(m)</p>-->
          <!--            </div>-->
          <!--            <div class="info-box">-->
          <!--              <p class="num">-->
          <!--                {{ info1.inboundFlow ? getNumber(info1.inboundFlow) : "0.00" }}-->
          <!--              </p>-->
          <!--              <p>入库流量(m³/s)</p>-->
          <!--            </div>-->
          <!--            <div class="info-box">-->
          <!--              <p class="num">-->
          <!--                {{-->
          <!--                  info1.outboundFlow ? getNumber(info1.outboundFlow) : "0.00"-->
          <!--                }}-->
          <!--              </p>-->
          <!--              <p>出库流量(m³/s)</p>-->
          <!--            </div>-->
          <!--            <div class="info-box1">-->
          <!--              <p class="num">-->
          <!--                {{-->
          <!--                  info1.floodDischarge-->
          <!--                    ? getNumber(info1.floodDischarge)-->
          <!--                    : "0.00"-->
          <!--                }}-->
          <!--              </p>-->
          <!--              <p>泄洪流量(m³/s)</p>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
        <div class="line"></div>
        <div class="w_60 right">
          <div class="text-center flex justify-between" style="padding: 0 32px">
            <span style="font-weight: 550">{{ paramsPlanChange.flag }}</span>
            <span>{{
              paramsPlanChange.type == 1
                ? this.paramsSupply.year + `年月累计降水量`
                : "12小时水情监测数据"
            }}</span>
          </div>
          <div
            class="w-100pre h-100pre"
            style=""
            id="DesignAchievements1"
            v-if="paramsPlanChange.type == 1"
          ></div>
          <div
            class="w-100pre h-100pre"
            style=""
            id="DesignAchievements2"
            v-if="paramsPlanChange.type == 2"
          ></div>
        </div>
      </div>
    </div>
    <div class="box w_25 h_55" style="border-bottom: none">
      <div class="flex align-center">
        <div class="title-line mr-5"></div>
        <div class="item-title">监测设备数量统计</div>
      </div>
      <div class="divider-line mt-10"></div>

      <div class="weida">
        <div class="flex justify-center mb-40">
          <div class="flex align-center jcsb-box" style="background: #dff7ff">
            <div style="width: 40%">
              <img
                class="jcsb-img"
                :src="require('@/assets/img/safe/slfh.png')"
              />
              <p class="title">森林防火</p>
            </div>
            <div class="">
              <p class="num">{{ jcsbCount?.slfhNum || 0 }}</p>
            </div>
          </div>
        </div>
        <div class="flex justify-center mb-40">
          <div class="flex align-center jcsb-box" style="background: #f0efff">
            <div style="width: 40%">
              <img
                class="jcsb-img"
                :src="require('@/assets/img/safe/fbqjk.png')"
              />
              <p class="title">封闭区监控</p>
            </div>
            <div class="">
              <p class="num">{{ jcsbCount?.fbqjkNum || 0 }}</p>
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <div class="flex align-center jcsb-box" style="background: #e9fff7">
            <div style="width: 40%">
              <img
                class="jcsb-img"
                :src="require('@/assets/img/safe/fxsb.png')"
              />
              <p class="title">防汛设备</p>
            </div>
            <div class="">
              <p class="num">{{ jcsbCount?.fxsbNum || 0 }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box w_30 h_45">
      <div class="flex align-center">
        <div class="title-line mr-5"></div>
        <div class="item-title">风险隐患</div>
      </div>
      <div class="divider-line mt-10"></div>

      <div class="flex align-center justify-between">
        <div class="hazard-statistics flex align-center justify-between">
          <div class="fxyh-dot"></div>
          <span class="fxyh-title">总数</span
          ><span class="fxyh-num">{{ info3?.total || 0 }}</span>
        </div>
        <div class="hazard-statistics flex align-center justify-between">
          <div class="fxyh-dot"></div>
          <span class="fxyh-title">本月</span
          ><span class="fxyh-num">{{ info3?.mnum || 0 }}</span>
        </div>
        <div class="hazard-statistics flex align-center justify-between">
          <div class="fxyh-dot"></div>
          <span class="fxyh-title">本季度</span
          ><span class="fxyh-num">{{ info3?.qnum || 0 }}</span>
        </div>
        <div class="hazard-statistics flex align-center justify-between">
          <div class="fxyh-dot"></div>
          <span class="fxyh-title">本年</span
          ><span class="fxyh-num">{{ info3?.ynum || 0 }}</span>
        </div>
      </div>
      <div class="w-100pre h-100pre" style="" id="planChange"></div>
    </div>
    <div class="box w_45 h_45">
      <div class="flex align-center">
        <div class="title-line mr-5"></div>
        <div class="item-title">特种设备统计</div>
      </div>
      <div class="divider-line mt-10"></div>
      <div class="w-100pre h-100pre" style="" id="DesignAchievements"></div>
    </div>
    <div class="box w_25 h_45">
      <div class="flex align-center">
        <div class="title-line mr-5"></div>
        <div class="item-title">危大工程与危险作业</div>
      </div>
      <div class="divider-line mt-10"></div>
      <div class="weida">
        <div class="flex justify-center mb-40">
          <div class="flex align-center wdgc-box">
            <img
              class="wdgc-img"
              :src="require('@/assets/img/safe/wdgc.png')"
            />
            <div class="">
              <p class="num1">{{ info5?.wdNum || 0 }}</p>
              <p class="title1">危大工程</p>
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <div class="flex align-center wxzy-box">
            <img
              class="wxzy-img"
              :src="require('@/assets/img/safe/wxzy.png')"
            />
            <div class="">
              <p class="num1">{{ info5?.wxNum || 0 }}</p>
              <p class="title1">危险作业</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { quer1, quer2, list, quer4, quer5, jcsbCount } from "./api";

export default {
  data() {
    return {
      value: "",
      designChange: [
        {
          label: "雨情监测",
          value: 1
        },
        {
          label: "水情监测",
          value: 2
        }
      ],
      paramsAchievements: {
        year: ""
      },
      achievementsconfig: {
        option: "",
        myChart: ""
      },
      achievementsconfig1: {
        option: "",
        myChart: ""
      },
      achievementsconfig2: {
        option: "",
        myChart: ""
      },
      paramsSupply: {
        type: 1,
        year: ""
      },
      discloseTimeconfig: {
        option: "",
        myChart: ""
      },
      planChangeConfig: {
        option: "",
        myChart: ""
      },
      planChange1Config: {
        option: "",
        myChart: ""
      },
      paramsPlanChange: {
        type: "1",
        flag: ""
      },
      info1: {},
      info1_1: {},
      info2: {},
      info3: {},
      info4: {},
      info5: {},
      jcsbCount: {},
      once: false,
      siteList: []
    };
  },
  created() {
    this.getYear();
    this.getList();
    // this.getQuer2();
    // this.getQuer3();
    // this.getQuer4();
    // this.getQuer5();
    this.getJcsbCount();
  },
  mounted() {
    this.DesignAchievementsEcharts();
    this.planChangeEcharts();
    this.planChangeEcharts1();
  },
  methods: {
    //风险隐患
    getQuer3() {
      quer3().then((res) => {
        if (res.success) {
          this.info3 = res.data;
          let data = [];
          this.info3.list &&
            this.info3.list.forEach((item) => {
              data.push({
                name: item.typeName,
                value: item.num
              });
            });
          this.planChangeConfig.option.series[0].data = data;
          this.planChangeConfig.myChart.setOption(this.planChangeConfig.option);
          this.planChangeConfig.myChart.hideLoading();
        }
      });
    },
    //特种设备统计
    getQuer4() {
      quer4().then((res) => {
        if (res.success) {
          let arr = [];
          let brr = [];
          res.data &&
            res.data.forEach((item) => {
              arr.push(item.num);
              brr.push(item.deviceName);
            });
          this.achievementsconfig.option.series[0].data = arr;
          this.achievementsconfig.option.xAxis.data = brr;
          this.achievementsconfig.myChart.setOption(
            this.achievementsconfig.option
          );
          this.achievementsconfig.myChart.hideLoading();
        }
      });
    },
    // 危大工程与危险作业
    getQuer5() {
      quer5().then((res) => {
        if (res.success) {
          this.info5 = res.data;
        }
      });
    },
    // 监测设备数量统计
    getJcsbCount() {
      jcsbCount().then((res) => {
        if (res.success) {
          this.jcsbCount = res.data;
        }
      });
    },
    getNumber(e) {
      if (e) {
        return (e - 0).toFixed(2);
      }
    },
    // 水雨情筛选列表
    getList() {
      list().then((res) => {
        this.siteList = res.data;
        this.paramsPlanChange.flag = res.data[0];
        this.getQuer1();
      });
    },
    //水雨情分析
    getQuer1() {
      quer1(this.paramsPlanChange).then((res) => {
        if (res.success) {
          this.$nextTick(() => {
            this.info1 = res.data;
            console.log(this.info1);
            if (this.paramsPlanChange.type == 1) {
              if (this.once) {
                this.achievementsconfig2.myChart.dispose();
              }
              this.DesignAchievementsEcharts1();
              let xarr = [];
              let yarr = [];
              this.info1.list &&
                this.info1.list.forEach((item) => {
                  xarr.push(item.mt + "月");
                  yarr.push(item.pt);
                });
              console.log(xarr);
              this.achievementsconfig1.option.xAxis.data = xarr;
              this.achievementsconfig1.option.series[0].data = yarr;
              this.achievementsconfig1.myChart.setOption(
                this.achievementsconfig1.option
              );
              this.achievementsconfig1.myChart.hideLoading();
            } else {
              this.once = true;
              this.achievementsconfig1.myChart.dispose();
              this.DesignAchievementsEcharts2();
              const xarr1 = [];
              const xarr2 = [];
              const xarr3 = [];
              const xarr4 = [];
              const yarr1 = [];
              this.info1.list &&
                this.info1.list.forEach((item) => {
                  yarr1.push(item.tm + "时");
                  xarr1.push(item.upWaterLevel);
                  xarr2.push(item.downWaterLevel);
                  xarr3.push(item.inboundFlow);
                  xarr4.push(item.outboundFlow);
                });
              this.achievementsconfig2.option.xAxis[0].data = yarr1;
              this.achievementsconfig2.option.series[0].data = xarr1;
              this.achievementsconfig2.option.series[1].data = xarr2;
              this.achievementsconfig2.option.series[2].data = xarr3;
              this.achievementsconfig2.option.series[3].data = xarr4;
              this.achievementsconfig2.myChart.setOption(
                this.achievementsconfig2.option
              );
              this.achievementsconfig2.myChart.hideLoading();
            }
          });
        }
      });

      quer1({ type: "2", flag: "" }).then((res) => {
        if (res.success) {
          this.info1_1 = res.data;
          console.log("this.info1_1", this.info1_1);
        }
      });
    },
    //森林防火
    getQuer2() {
      quer2().then((res) => {
        if (res.success) {
          this.info2 = res.data;
          this.planChange1Config.option.series[0].data = [
            {
              name: "在线",
              value: this.info2.online
            },
            {
              name: "离线",
              value: this.info2.offline
            }
          ];
          this.planChange1Config.myChart.setOption(
            this.planChange1Config.option
          );
          this.planChange1Config.myChart.hideLoading();
        }
      });
    },
    designClick(e) {
      console.log(e);
      this.paramsPlanChange.type = e.value;
      this.getQuer1();
    },
    getYear() {
      this.paramsSupply.year = this.$dateFormat(new Date().getTime(), "yyyy");
      this.paramsAchievements.year = this.$dateFormat(
        new Date().getTime(),
        "yyyy"
      );
    },
    DesignAchievementsEcharts() {
      const chartDom = document.getElementById("DesignAchievements");
      this.achievementsconfig.myChart = echarts.init(chartDom);
      this.achievementsconfig.option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter: (params) => {
            var tar = params[0];
            return tar.name + "<br/>" + tar.value + "个";
          }
        },
        xAxis: {
          type: "category",
          axisTick: {
            alignWithLabel: true
          },
          data: [
            // "塔式起重机",
            // "门式起重机",
            // "设备名称一",
            // "设备名称二",
            // "设备名称三",
          ]
        },
        yAxis: {
          type: "value",
          name: "单位/个",
          nameLocation: "end",
          nameTextStyle: {
            align: "right"
          }
        },
        series: [
          {
            data: [],
            barWidth: 40,
            emphasis: {
              focus: "series"
            },
            type: "bar"
          }
        ]
      };
      this.achievementsconfig.myChart.showLoading();
      // this.achievementsconfig.option &&
      //   this.achievementsconfig.myChart.setOption(
      //     this.achievementsconfig.option
      //   );
      window.addEventListener("resize", () => {
        this.achievementsconfig.myChart.resize();
      });
    },
    DesignAchievementsEcharts1() {
      const chartDom = document.getElementById("DesignAchievements1");
      this.achievementsconfig1.myChart = echarts.init(chartDom);
      this.achievementsconfig1.option = {
        // title: {
        //     text: this.paramsSupply.year + `年月累计降水量`,
        //     left: 'center',
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter: (params) => {
            var tar = params[0];
            return (
              tar.name + "<br/>" + tar.seriesName + " : " + tar.value + "mm"
            );
          }
        },
        xAxis: {
          type: "category",
          axisLabel: {
            //x轴文字的配置
            show: true,
            interval: 0 //使x轴文字显示全
          },
          axisTick: {
            alignWithLabel: true
          },
          data: [
            // "Jan",
            // "Feb",
            // "Mar",
            // "Apr",
            // "May",
            // "Jun",
            // "Jul",
            // "Aug",
            // "Sep",
            // "Oct",
            // "Nov",
            // "Dec",
          ]
        },
        yAxis: {
          type: "value",
          name: "降雨量/mm",
          nameLocation: "end",
          nameTextStyle: {
            // align: "right",
          }
        },
        series: [
          {
            name: "降雨量",
            data: [],
            barWidth: 30,
            type: "bar"
          }
        ]
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
    DesignAchievementsEcharts2() {
      const chartDom = document.getElementById("DesignAchievements2");
      this.achievementsconfig2.myChart = echarts.init(chartDom);
      this.achievementsconfig2.option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        legend: {
          data: ["上游水位", "下游水位", "入库流量", "出库流量"]
        },
        xAxis: [
          {
            type: "category",
            data: [
              // "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
            ],
            axisPointer: {
              type: "shadow"
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "水位/m",
            position: "left",
            axisLabel: {
              formatter: "{value} m"
            }
          },
          {
            type: "value",
            name: "流量/m³/s",
            position: "right",
            axisLabel: {
              formatter: "{value} m³/s"
            }
          }
        ],
        series: [
          {
            name: "上游水位",
            type: "line",
            smooth: true,
            yAxisIndex: 0,
            tooltip: {
              valueFormatter: (value) => {
                return value;
              }
            },
            data: []
          },
          {
            name: "下游水位",
            type: "line",
            yAxisIndex: 0,
            smooth: true,
            tooltip: {
              valueFormatter: (value) => {
                return value;
              }
            },
            data: []
          },
          {
            name: "入库流量",
            type: "line",
            yAxisIndex: 1,
            smooth: true,
            tooltip: {
              valueFormatter: (value) => {
                return value;
              }
            },
            lineStyle: {
              type: "dashed"
            },
            data: []
          },
          {
            name: "出库流量",
            type: "line",
            yAxisIndex: 1,
            smooth: true,
            tooltip: {
              valueFormatter: (value) => {
                return value;
              }
            },
            lineStyle: {
              type: "dashed"
            },
            data: []
          }
        ]
      };
      // this.achievementsconfig2.option &&
      //   this.achievementsconfig2.myChart.setOption(
      //     this.achievementsconfig2.option
      //   );
      this.achievementsconfig2.myChart.showLoading();
      window.addEventListener("resize", () => {
        this.achievementsconfig2.myChart.resize();
      });
    },
    planChangeEcharts() {
      const chartDom = document.getElementById("planChange");
      this.planChangeConfig.myChart = echarts.init(chartDom);
      this.planChangeConfig.option = {
        tooltip: {
          trigger: "item"
        },
        legend: {
          top: "30%",
          left: "55%",
          orient: "vertical",
          formatter: (name) => {
            // 添加
            let target;
            for (
              let i = 0;
              i < this.planChangeConfig.option.series[0].data.length;
              i++
            ) {
              if (
                this.planChangeConfig.option.series[0].data[i].name === name
              ) {
                target = this.planChangeConfig.option.series[0].data[i].value;
              }
            }
            var arr = ["{a|" + name + "}", "{b|" + target + "}"];
            return arr.join("  ");
          },
          textStyle: {
            // 添加
            padding: [8, 0, 0, 0],
            rich: {
              a: {
                fontSize: 15,
                width: 110
              },
              b: {
                fontSize: 15,
                width: 70
              }
            }
          }
        },
        grid: {
          show: false,
          left: "0%",
          right: "0%",
          containLabel: true
        },
        series: [
          {
            name: "风险隐患",
            type: "pie",
            itemStyle: {
              borderRadius: 5
            },
            radius: ["50%"],
            center: ["30%", "40%"],
            avoidLabelOverlap: false,
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            data: [
              // { value: 0, name: "一般隐患I级" },
              // { value: 0, name: "一般隐患II级" },
              // { value: 0, name: "重大隐患I级" },
              // { value: 0, name: "重大隐患II级" },
            ]
          }
        ]
      };
      // this.planChangeConfig.option &&
      //   this.planChangeConfig.myChart.setOption(this.planChangeConfig.option);
      this.planChangeConfig.myChart.showLoading();
      window.addEventListener("resize", () => {
        this.planChangeConfig.myChart.resize();
      });
    },
    planChangeEcharts1() {
      const chartDom = document.getElementById("planChange1");
      this.planChange1Config.myChart = echarts.init(chartDom);
      this.planChange1Config.option = {
        tooltip: {
          trigger: "item"
        },
        legend: {
          top: "center",
          left: "70%",
          orient: "vertical",
          selectedMode: false,
          formatter: (name) => {
            // 添加
            let target = "";
            for (
              let i = 0;
              i < this.planChange1Config.option.series[0].data.length;
              i++
            ) {
              if (
                this.planChange1Config.option.series[0].data[i].name === name
              ) {
                target = this.planChange1Config.option.series[0].data[i].value;
              }
            }
            var arr = ["{a|" + name + "}", "{b|" + target + "个}"];
            return arr.join("  ");
          },
          textStyle: {
            // 添加
            padding: [8, 0, 0, 0],
            rich: {
              a: {
                fontSize: 15,
                width: 50
              },
              b: {
                fontSize: 15,
                width: 70
              }
            }
          }
        },
        grid: {
          show: false,
          left: "0%",
          right: "0%",
          containLabel: true
        },
        series: [
          {
            name: "森林防火监测设备",
            type: "pie",
            radius: ["45%", "85%"],
            center: ["35%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: "center",
              fontSize: 20,
              formatter: (item) => {
                return `{total| ${
                  this.info2.total || 0
                } }\n\r{active|设备总数}`;
              },
              rich: {
                total: {
                  fontSize: 26,
                  fontFamily: "微软雅黑",
                  color: "#454c5c"
                },
                active: {
                  fontFamily: "微软雅黑",
                  fontSize: 16,
                  color: "#6c7a89",
                  lineHeight: 30
                }
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 120, name: "在线" },
              { value: 30, name: "离线" }
            ]
          }
        ]
      };
      this.planChange1Config.myChart.showLoading();
      // this.planChange1Config.option &&
      //   this.planChange1Config.myChart.setOption(this.planChange1Config.option);
      window.addEventListener("resize", () => {
        this.planChange1Config.myChart.resize();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-wrapper .app-content .app-main > .content > div {
  padding: 15px 5px 15px 15px;
}
.main-page {
  background-color: #f7f8fa;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  // border: 1px solid #0096ff !important;
  .w_25 {
    width: calc(25% - 10px);
  }

  .w_30 {
    width: calc(30% - 10px);
  }

  .w_40 {
    width: calc(40% - 10px);
  }

  .w_45 {
    width: calc(45% - 10px);
  }

  .w_60 {
    width: calc(60% - 10px);
  }

  .w_75 {
    width: calc(75% - 10px);
  }

  .h_45 {
    height: 45%;
  }

  .h_55 {
    height: calc(55% - 10px);
  }

  .h_60 {
    height: 60%;
  }

  .h-100pre1 {
    height: 90%;
  }

  .box {
    background-color: #ffffff;
    margin: 0 10px 10px 0;
    padding: 20px 10px;
    box-sizing: border-box;
    .weida {
      height: 90%;
      display: flex;
      flex-direction: column;
      align-content: center;
      justify-content: center;
    }
    .hazard-statistics {
      margin-top: 10px;
      padding: 10px 15px;
      text-align: center;
      background: #f3fcff;
      border-radius: 4px 4px 4px 4px;

      .fxyh-dot {
        background: #ff7d00;
        width: 5px;
        height: 5px;
        border-radius: 50%;
      }
      .fxyh-title {
        margin: 0 5px;
        color: #4e5969;
        font-size: 14px;
      }
      .fxyh-num {
        color: #1298fa;
        font-size: 22px;
      }
    }

    .info {
      padding-top: 20px;

      .icon {
        font-size: 44px;
        background-color: rgb(92, 187, 215);
        color: #fff;
        border-radius: 50%;
      }
    }

    .br-1 {
      padding-right: 10px;
      border-right: 1px solid #ccc;
    }

    .text-center {
      text-align: center;
    }

    .right {
      padding-left: 20px;
    }

    .big-box {
      flex-wrap: wrap;
      align-content: space-around;
      width: 65%;
      height: 35%;
      margin-left: 12%;
      margin-top: 8%;

      .info-box {
        width: 48%;
        padding: 10px 0;
        text-align: center;
        background: rgb(243, 252, 255);
        border-radius: 4px 4px 4px 4px;

        .num {
          color: #1298fa;
          margin-bottom: 10px;
        }
        .item {
          color: #86909c;
        }
      }

      .info-box1 {
        width: 100%;
        border: 1px solid #ccc;
        padding: 10px 0;
        text-align: center;

        .num {
          color: #0096ff;
          margin-bottom: 10px;
        }
      }
    }

    .point1 {
      width: 16px;
      height: 16px;
      margin-right: 20px;
      background: #0096ff;
      border-radius: 50%;
    }

    .point2 {
      width: 16px;
      height: 16px;
      margin-right: 20px;
      background: #ccc;
      border-radius: 50%;
    }

    .BIM2 {
      margin-top: 10px;
      height: 70%;
      background: #0096ff;
    }

    .el_icon {
      color: #0096ff;
      font-size: 64px;
      margin-right: 20px;
    }

    .num1 {
      text-align: center;
      font-size: 48px;
      font-weight: bold;
      color: #ffffff;
    }

    .title1 {
      color: #ffffff;
    }
  }

  .box1 {
    box-sizing: border-box;
    height: 45%;
    display: flex;

    .box {
      width: 50%;
      height: 100%;
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

.line {
  width: 3px;
  height: 80%;
  margin: auto;
  background: linear-gradient(
    to bottom,
    #1298fa 0%,
    #1298fa 50%,
    transparent 50%
  );
  background-size: 3px 20px;
  background-repeat: repeat-y;
}

.title-line {
  width: 3px;
  height: 10px;
  background: linear-gradient(322deg, #1298fa 0%, #6fcbff 100%);
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
}

.item-title {
  font-size: 18px;
  color: #1d2129;
  font-weight: 700;
}
.divider-line {
  background: #e5e6eb;
  height: 1px;
}

.divider-line1 {
  background: #f7f8fa;
  height: 4px;
  width: 90%;
  margin: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}

.syq-img {
  width: 56px;
  margin: 20px;
}

.syq-title {
  color: #4e5969;
  font-size: 18px;
}
.syq-time {
  color: #86909c;
  font-size: 16px;
}
.wdgc-box {
  background: #ff9c64;
  padding: 15px;
  width: 60%;
  border-radius: 4px;
  .wdgc-img {
    width: 64px;
    margin: 20px;
  }
}
.wxzy-box {
  background: #fe6464;
  padding: 15px;
  width: 60%;
  border-radius: 4px;
  .wxzy-img {
    width: 64px;
    margin: 20px;
  }
}

.jcsb-box {
  padding: 15px;
  width: 60%;
  border-radius: 4px;
  text-align: center;
  .jcsb-img {
    width: 50px;
  }
  .title {
    color: #1d2129;
    font-size: 14px;
  }
  .num {
    color: #1d2129;
    font-size: 48px;
  }
}

@media screen and (min-height: 1081px) and (max-height: 1250px) {
  .main-page .box .big-box {
    margin-top: 4%;
    .info-box {
      padding: 5px 0;
    }
  }
  .wxzy-box,
  .wdgc-box,
  .jcsb-box {
    padding: 8px;
  }
}

// 1080p自适应样式
@media screen and (min-height: 901px) and (max-height: 1080px) {
  .h-30pre {
    height: 30%;
  }
  .divider-line1 {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .syq-img {
    margin: 5px 10px;
  }
  .syq-title {
    margin-bottom: 10px !important;
  }
  .main-page .box .big-box {
    margin-top: 1%;
    .info-box {
      padding: 3px 0;
    }
  }
  .wxzy-box,
  .wdgc-box,
  .jcsb-box {
    padding: 3px;
  }
}

@media screen and (max-height: 900px) {
  .h-30pre {
    height: 30%;
  }
  .divider-line1 {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .syq-img {
    margin: 2px 5px;
  }
  .syq-title {
    margin-bottom: 5px !important;
  }
  .main-page .box .big-box {
    margin-top: 0;
    .info-box {
      padding: 2px 0;
    }
  }
  .wxzy-box,
  .wdgc-box,
  .jcsb-box {
    padding: 0;
  }
}
</style>
