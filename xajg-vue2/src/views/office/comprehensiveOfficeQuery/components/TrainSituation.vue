<template>
  <div class="TrainSituation">
    <div class="left">
      <div>
        <el-progress
          type="dashboard"
          :percentage="planPercentage"
          color="#1299FA"
          :stroke-width="10"
          :width="201"
        />
        <div class="tip">
          <div>
            已培训总次数<span>{{ planNum }}<span>次</span></span>
          </div>
          <div>
            计划培训总次数<span>{{ planTotal }}<span>次</span></span>
          </div>
        </div>
      </div>
      <div>
        <el-progress
          type="dashboard"
          :percentage="yearPercentage"
          :width="201"
          :stroke-width="10"
          color="#FF7D00"
        />
        <div class="tip">
          <div>
            {{ new Date().getFullYear() }}培训总次数<span
              >{{ yearNum }}<span>次</span></span
            >
          </div>
          <div>
            {{ new Date().getFullYear() }}年计划培训总次数<span
              >{{ yearTotal }}<span>次</span></span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top">
        <el-date-picker
          v-model="year"
          :append-to-body="false"
          type="year"
          :clearable="false"
          @change="dateChange"
        />
      </div>
      <div id="TranBar" />
    </div>
  </div>
</template>
<script>
import { getTrain } from "../api";
import { init } from "../echarts";
export default {
  name: "TrainSituation",
  components: {},
  data() {
    return {
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          icon: "circle",
          right: 50
        },
        color: ["#1298FA", "#7ACFFF"],
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [],
            triggerEvent: true,
            axisLabel: {
              width: 70,
              overflow: "break",
              show: true,
              interval: 0,
              lineHeight: 16,
              color: "#86909C",
              fontFamily: "Alibaba PuHuiTi 2.0, Alibaba PuHuiTi 20",
              formatter: (value) => {
                if (value.length > 10) {
                  value = value.substring(0, 9) + "...";
                }
                return value;
              }
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "(次)",
            position: "left",
            min: 0,
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {}
            }
          }
        ],
        series: [
          {
            name: "计划",
            type: "bar",
            barWidth: 16,
            emphasis: {
              focus: "series"
            },
            data: []
          },
          {
            name: "实际",
            type: "bar",
            barWidth: 16,
            emphasis: {
              min: 0,
              focus: "series"
            },
            data: []
          }
        ],
        dataZoom: [
          {
            type: "slider",
            startValue: 0, // 控制从第一个开始
            endValue: 10, // 到第几个（默认一页展示多少个 0-10 11条）
            height: 4,
            width: "100%",
            bottom: 0,
            brushSelect: false,
            xAxisIndex: [0, 1], // 控制y轴滚动对象
            fillerColor: "#1298FA", // 滚动条颜色
            borderColor: "rgba(0, 0, 0, 0.12)",
            backgroundColor: "rgba(0, 0, 0, 0.12)", // 两边未选中的滑动条区域的颜色
            handleSize: 0, // 两边手柄尺寸
            showDataShadow: false, // 是否显示数据阴影 默认auto
            showDetail: false, // 拖拽时是否展示滚动条两侧的文字
            zoomLock: true,
            moveHandleStyle: {
              opacity: 0
            }
          },
          {
            type: "inside",
            startValue: 0,
            endValue: 10,
            minValueSpan: 10,
            xAxisIndex: [0],
            zoomOnMouseWheel: false, // 关闭滚轮缩放
            moveOnMouseWheel: true, // 开启滚轮平移
            moveOnMouseMove: true // 鼠标移动能触发数据窗口平移
          }
        ]
      },
      yearTotal: 0,
      yearNum: 0,
      planTotal: 0,
      planNum: 0,
      year: new Date()
    };
  },
  computed: {
    planPercentage() {
      if (this.yearTotal) {
        return Number(((this.planNum / this.planTotal) * 100).toFixed(2));
      } else {
        return 0;
      }
    },
    yearPercentage() {
      if (this.yearTotal) {
        return Number(((this.yearNum / this.yearTotal) * 100).toFixed(2));
      } else {
        return 0;
      }
    }
  },
  created() {},
  mounted() {
    this.getNumber();
  },
  methods: {
    dateChange(date) {
      this.year = date;
      this.getData();
    },
    getData(list) {
      if (list) this.receiveUnitList = list;
      this.option.xAxis[0].data = this.receiveUnitList.map((x) => x.corpName);
      this.option.series[0].data = [];
      this.option.series[1].data = [];
      getTrain({ year: this.year.getFullYear() }).then((res) => {
        const data = res.data || [];
        this.receiveUnitList.forEach((item) => {
          const obj = data.find((x) => x.corpId === item.corpId);
          this.option.series[0].data.push(obj.planNum);
          this.option.series[1].data.push(obj.actualNum);
        });
        const echarts = init("TranBar", this.option);
        this.extension(echarts);
      });
    },
    /**
     * @description 获取次数
     */
    getNumber() {
      getTrain({}).then((res) => {
        const data = res.data || [];
        data.forEach((x) => {
          if (x.type === "all") {
            this.planNum = x.actualNum;
            this.planTotal = x.planNum;
          } else {
            this.yearNum = x.actualNum;
            this.yearTotal = x.planNum;
          }
        });
      });
    },
    extension(chart) {
      var elementDiv = document.getElementById("extension");
      if (!elementDiv) {
        var div = document.createElement("div");
        div.setAttribute("id", "extension");
        div.style.display = "block";
        document.querySelector("html").appendChild(div);
      }
      chart.on("mouseover", (params) => {
        if (params.componentType === "xAxis") {
          var elementDiv = document.querySelector("#extension");
          // 设置悬浮文本的位置以及样式
          var elementStyle =
            "position: absolute;z-index: 99999;color: #fff;font-size: 12px;padding: 5px;display: inline;border-radius: 4px;background-color: #303133;box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 8px";
          elementDiv.style.cssText = elementStyle;
          elementDiv.innerHTML = params.value;
          document.querySelector("html").onmousemove = (event) => {
            var elementDiv = document.querySelector("#extension");
            var xx = event.pageX + 10;
            var yy = event.pageY - 30;
            elementDiv.style.top = yy + "px";
            elementDiv.style.left = xx + "px";
          };
        }
      });
      chart.on("mouseout", (params) => {
        if (params.componentType === "xAxis") {
          var elementDiv = document.querySelector("#extension");
          elementDiv.style.cssText = "display:none";
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../index.scss";
.TrainSituation {
  display: flex;
  height: calc(100% - 33px);
  .left {
    width: 35%;
    height: 100%;
    position: relative;
    display: flex;
    &::after {
      border-right: 3px dashed #1298fa;
      content: "";
      width: 3px;
      height: calc(100% - 38px - 22px);
      position: absolute;
      right: 0;
      top: 38px;
    }
    > div {
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      justify-content: center;
      .el-progress {
        /deep/ .el-progress__text {
          font-size: 44px;
          font-family: Roboto, Roboto;
          font-weight: 600;
          color: #1d2129;
        }
      }
      .tip {
        > div {
          padding-left: 10px;
          font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
          font-weight: normal;
          display: flex;
          align-items: center;
          font-size: 14px;
          height: 42px;
          width: 250px;
          span {
            font-weight: 500;
            font-family: Roboto, Roboto;
            flex: 1;
            font-size: 24px;
            span {
              font-size: 14px;
              margin-left: 7px;
              color: #86909c !important;
            }
          }
          &:first-child {
            background: rgba(230, 249, 255, 0.5);
            border-radius: 4px;
            color: #1d2129;
            margin-bottom: 20px;
            span {
              color: #1298fa;
            }
          }
          &:last-child {
            color: #86909c;
            span {
              &:first-child {
                color: #4e5969;
              }
            }
          }
        }
      }
      &:first-child {
        .tip {
          div {
            > span {
              text-align: left;
              margin-left: 30px;
            }
          }
        }
      }
      &:last-child {
        .tip {
          div {
            > span {
              text-align: right;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
  .right {
    width: 65%;
    height: 100%;
    .top {
      height: 36px;
      margin: 12px 0;
      padding-left: 65px;
      width: 100%;
    }
    #TranBar {
      width: 100%;
      height: calc(100% - 36px - 24px);
    }
  }
}
</style>
