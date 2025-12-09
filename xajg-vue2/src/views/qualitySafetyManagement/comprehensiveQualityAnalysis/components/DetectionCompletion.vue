<template>
  <div class="DetectionCompletion">
    <TopTitle title="检测完成量" />
    <div class="flex justify-between">
      <div class="top">
        <el-date-picker
          v-model="year"
          :append-to-body="false"
          type="year"
          :clearable="false"
          @change="dateChange"
        />
        <el-select
          v-model="clmc"
          class="w-100 mr-8"
          :popper-append-to-body="false"
          @visible-change="$visibleChange($event, 'el-popper')"
          @change="clmcChange"
        >
          <el-option value="" label="全部" />
          <el-option
            v-for="item in clmcList"
            :key="item.dictCode"
            :value="item.dictCode"
            :label="item.dictName"
          />
        </el-select>
        <el-select
          v-model="type"
          :popper-append-to-body="false"
          @visible-change="$visibleChange($event, 'el-popper')"
          @change="changeUnit"
        >
          <el-option value="" label="全部" />
          <el-option
            v-for="item in sectionOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="typeList">
        <div class="tip">
          <span>合格</span>
          <span>不合格</span>
        </div>
      </div>
    </div>
    <div id="DetectionCompletion" />
  </div>
</template>
<script>
import TopTitle from "@/components/TopTitle";
import { init } from "../echarts";
import { yearTestCount, sectionList } from "../api";
export default {
  name: "DetectionCompletion",
  components: { TopTitle },
  data() {
    return {
      type: "",
      year: new Date(),
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        color: ["#1299FA", "#FFC069"],
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
            axisLabel: {
              width: 70,
              overflow: "break",
              show: true,
              interval: 0,
              lineHeight: 16,
              color: "#86909C",
              fontFamily: "Alibaba PuHuiTi 2.0, Alibaba PuHuiTi 20",
              formatter: (value) => {
                if (value.length > 8) {
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
            name: "合格",
            type: "bar",
            barWidth: 16,
            stack: "type",
            emphasis: {
              min: 0,
              focus: "series"
            },
            data: []
          },
          {
            name: "不合格",
            barWidth: 16,
            type: "bar",
            stack: "type",
            emphasis: {
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
      sectionOptions: [],
      clmc: "",
      clmcList: []
    };
  },
  created() {},
  mounted() {
    this.getClmcList();
    this.getCurrent();
    this.getData();
  },
  methods: {
    /**
     * @description 获取字典(材料名称)
     */
    getClmcList() {
      this.$store.dispatch("dict/get", "syjc").then((res) => {
        this.clmcList = res.filter((item) => {
          return item.dictPath.split(",").length === 3;
        });
        console.log("材料报检", this.clmcList);
      });
    },
    /**
     * @description 材料切换
     */
    clmcChange(val) {
      console.log("clmcChange", val, this.clmc);
      this.clmc = val;
      debugger;
      this.getData();
    },

    /* 获取标段*/
    async getCurrent() {
      try {
        const { success, data } = await sectionList({});
        if (success && data?.length > 0) {
          let sectionOptions = data;
          let list = [];

          for await (const element of sectionOptions) {
            const params = {
              type: element.id,
              clmc: this.clmc,
              year: this.year.getFullYear()
            };
            const item = await yearTestCount(params);
            if (
              item.success &&
              Array.isArray(item.data) &&
              item.data.length > 0
            ) {
              list.push(element);
            }
          }

          this.sectionOptions = list;
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
    /**
     * @description 时间切换
     * @param {*} date
     */
    dateChange(date) {
      this.year = date;
      this.getData();
    },
    /**
     * @description 单位切换
     */
    changeUnit(val) {
      this.getData();
    },
    getData() {
      const params = {
        type: this.type,
        clmc: this.clmc,
        year: this.year.getFullYear()
      };
      yearTestCount(params).then((res) => {
        const data = res.data || [];
        this.option.xAxis[0].data = data.map((x) => x.yf);
        this.option.series[0].data = data.map((x) => x.hgNum);
        this.option.series[1].data = data.map((x) => x.bhgNum);
        init("DetectionCompletion", this.option);
      });
    }
  }
};
</script>
<style scoped lang="scss">
/deep/ .el-select-dropdown__list > .el-select-dropdown__item {
  max-width: 567px !important;
}
.DetectionCompletion {
  .top {
    margin-top: 12px;
    .el-date-editor {
      margin-right: 16px;
    }
  }
  .typeList {
    margin-top: 19px;
    height: 32px;
    display: flex;
    > div:not(.tip) {
      width: 96px;
      height: 100%;
      background: #e6f9ff;
      border-radius: 4px;
      font-size: 14px;
      font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
      color: #1298fa;
      margin-right: 8px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
    }
    .active {
      background: #1298fa !important;
      color: white !important;
    }
    .tip {
      font-size: 12px;
      font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
      color: #4e5969;
      height: 100%;
      text-align: right;
      flex: 1;
      line-height: 32px;
      span {
        margin-right: 10px;
        &::before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 4px;
        }
        &:first-child::before {
          background-color: #1299fa;
        }
        &:last-child::before {
          background-color: #ffc069;
        }
      }
    }
  }
  #DetectionCompletion {
    height: calc(100% - 12px - 32px - 36px);
  }
}
</style>
