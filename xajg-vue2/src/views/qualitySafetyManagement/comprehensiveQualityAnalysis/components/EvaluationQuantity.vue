<template>
  <div class="EvaluationQuantity">
    <TopTitle title="进场报验统计" />
    <div class="top" />
    <div id="EvaluationQuantity" />
  </div>
</template>
<script>
import TopTitle from "@/components/TopTitle";
import { init } from "../echarts";
// import YearMonth from "@/components/YearMonth";
import { statistics } from "../api";
import { getDictItemList } from "@/api/dict";
export default {
  name: "EvaluationQuantity",
  components: { TopTitle },
  data() {
    return {
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          icon: "circle",
        },
        color: ["#3377FF", "#FA8C16"],
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
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
              },
            },
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            position: "left",
            min: 0,
            minInterval: 1,
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {},
            },
          },
        ],
        series: [
          {
            name: "已完成",
            type: "bar",
            barWidth: 24,
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "流转中",
            type: "bar",
            barWidth: 24,
            emphasis: {
              focus: "series",
            },
            data: [],
          },
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
              opacity: 0,
            },
          },
          {
            type: "inside",
            startValue: 0,
            endValue: 10,
            minValueSpan: 10,
            xAxisIndex: [0],
            zoomOnMouseWheel: false, // 关闭滚轮缩放
            moveOnMouseWheel: true, // 开启滚轮平移
            moveOnMouseMove: true, // 鼠标移动能触发数据窗口平移
          },
        ],
      },
      date: "",
      type: "a101",
      unitProjectTypeList: [], // 单元工程类型列表
    };
  },
  created() {
    this.getUnitProjectTypeList();
  },
  mounted() {
    this.date = `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}`;
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
     * @description 类型切换
     */
    typeChange(val) {
      this.type = val;
      this.getData();
    },
    /**
     * @description 查询
     */
    getData() {
      statistics().then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const sortedData = data
          .slice()
          .sort(
            (a, b) =>
              this.getSectionOrder(a.sectionName) -
              this.getSectionOrder(b.sectionName)
          );
        this.option.xAxis[0].data = sortedData.map((item) => item.sectionName);
        this.option.series[0].data = sortedData.map((item) => item.done || 0);
        this.option.series[1].data = sortedData.map(
          (item) => item.processing || 0
        );
        const echarts = init("EvaluationQuantity", this.option);
        this.extension(echarts);
      });
    },
    getSectionOrder(name) {
      if (!name) return Number.MAX_SAFE_INTEGER;
      const match = name.match(/施工(.*)标/);
      if (!match || !match[1]) return Number.MAX_SAFE_INTEGER;
      const order = this.chineseNumeralToNumber(match[1]);
      return order == null ? Number.MAX_SAFE_INTEGER : order;
    },
    chineseNumeralToNumber(text) {
      const map = {
        一: 1,
        二: 2,
        三: 3,
        四: 4,
        五: 5,
        六: 6,
        七: 7,
        八: 8,
        九: 9,
        十: 10,
      };
      if (!text) return null;
      if (text.length === 1) {
        return map[text] || null;
      }
      if (text.length === 2 && text.startsWith("十")) {
        const unit = map[text[1]] || 0;
        return 10 + unit;
      }
      if (text.length === 2 && text.endsWith("十")) {
        const tens = map[text[0]];
        return tens ? tens * 10 : null;
      }
      if (text.length === 3 && text[1] === "十") {
        const tens = map[text[0]];
        const unit = map[text[2]] || 0;
        return tens ? tens * 10 + unit : null;
      }
      return map[text] || null;
    },
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
    },
  },
};
</script>
<style scoped lang="scss">
.EvaluationQuantity {
  height: 442px;
  background-color: #fff;
  border-radius: 4px;
  // margin-bottom: 16px;
  padding: 12px 16px 0 16px;
  .top {
    margin-top: 12px;
    .YearMonth {
      margin-right: 16px;
    }
  }
  #EvaluationQuantity {
    height: calc(100% - 30px - 36px - 12px);
  }
}
</style>
