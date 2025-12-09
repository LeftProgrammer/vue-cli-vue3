<template>
  <el-dialog
    v-draggable
    :title="title"
    :visible.sync="visible"
    :destroy-on-close="true"
    append-to-body
    width="70%"
    :close-on-click-modal="false"
    style="height: 800px"
    @closed="visible = false"
  >
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="类型">
        <el-select
          v-model="queryParams.dataType"
          placeholder="请选择数据类型"
          @change="handleDataTypeChange"
        >
          <el-option label="PM2.5" value="pm25" />
          <el-option label="PM10" value="pm10" />
          <el-option label="温度" value="temperature" />
          <el-option label="湿度" value="humidity" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="queryParams.queryDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @change="handleDateChange"
        />
      </el-form-item>
    </el-form>

    <div v-loading="loading" class="chart-container">
      <div ref="chartRef" style="width: 100%; height: 400px" />
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listDailyRecords } from "./api";
import * as echarts from "echarts";

export default {
  name: "ProcessLine",
  data() {
    // 初始化时设置默认日期为今天
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const today = `${year}-${month}-${day}`;
    return {
      title: "过程线",
      visible: false,
      loading: false,
      pointId: "",
      pointName: "",
      queryParams: {
        dataType: "pm25",
        queryDate: today,
      },
      chartInstance: null,
      chartData: [],
      dataTypeMap: {
        pm25: {
          label: "PM2.5",
          unit: "单位:μg/m³",
          color: "#5470c6",
          min: 0,
          max: 500,
        },
        pm10: {
          label: "PM10",
          unit: "单位:μg/m³",
          color: "#91cc75",
          min: 0,
          max: 500,
        },
        temperature: {
          label: "温度",
          unit: "单位:℃",
          color: "#ee6666",
          min: -10,
          max: 50,
        },
        humidity: {
          label: "湿度",
          unit: "单位:%rh",
          color: "#73c0de",
          min: 0,
          max: 100,
        },
      },
    };
  },
  beforeDestroy() {
    // 组件销毁前移除窗口大小变化的监听
    window.removeEventListener("resize", this.resizeChart);
    // 销毁图表实例
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
  },
  methods: {
    // 格式化日期为yyyy-MM-dd格式
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    loadDialog(row, dataType) {
      // 设置数据类型
      if (dataType && this.dataTypeMap[dataType]) {
        this.queryParams.dataType = dataType;
      }

      this.pointId = row.id;
      this.pointName = row.name;
      this.visible = true;
      this.$nextTick(() => {
        this.initChart();
        this.fetchData();
      });
    },

    initChart() {
      if (this.chartInstance) {
        this.chartInstance.dispose();
      }

      // 生成24小时的X轴数据
      const hours = [];
      for (let i = 0; i < 24; i++) {
        hours.push(`${i.toString().padStart(2, "0")}`);
      }

      this.chartInstance = echarts.init(this.$refs.chartRef);
      this.chartInstance.setOption({
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            const param = params[0];
            return `${param.name}<br/>${
              this.dataTypeMap[this.queryParams.dataType].label
            }: ${param.value} ${
              this.dataTypeMap[this.queryParams.dataType].unit
            }`;
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: hours,
          axisLabel: {
            formatter: "{value}",
          },
          axisLine: {
            onZero: false,
          },
        },
        yAxis: {
          type: "value",
          name: this.dataTypeMap[this.queryParams.dataType].unit,
          nameLocation: "end",
          min: this.dataTypeMap[this.queryParams.dataType].min,
          max: this.dataTypeMap[this.queryParams.dataType].max,
        },
        series: [
          {
            name: this.dataTypeMap[this.queryParams.dataType].label,
            type: "line",
            data: [],
            smooth: true,
            lineStyle: {
              color: this.dataTypeMap[this.queryParams.dataType].color,
              width: 2,
            },
            itemStyle: {
              color: this.dataTypeMap[this.queryParams.dataType].color,
            },
          },
        ],
      });

      // 添加窗口大小变化的监听
      window.addEventListener("resize", this.resizeChart);
    },

    resizeChart() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    },

    fetchData() {
      this.loading = true;

      const params = {
        pointId: this.pointId,
        queryDate: this.queryParams.queryDate,
      };

      listDailyRecords(params)
        .then((res) => {
          if (res.success && res.data) {
            console.log("获取数据成功", res.data);
            this.processChartData(res.data);
          } else {
            this.$message.error(res.message || "获取数据失败");
          }
        })
        .catch((error) => {
          console.error("获取数据失败", error);
          this.$message.error("获取数据失败");
        })
        .finally(() => {
          this.loading = false;
        });
    },

    processChartData(data) {
      // 创建一个24小时的数据映射，初始值为null
      const hourlyData = new Array(24).fill(null);

      // 按时间排序
      data.sort((a, b) => new Date(a.recordTime) - new Date(b.recordTime));

      // 提取时间和对应的数据值，按小时聚合数据
      data.forEach((item) => {
        if (
          item[this.queryParams.dataType] !== undefined &&
          item[this.queryParams.dataType] !== null
        ) {
          const time = new Date(item.recordTime);
          const hour = time.getHours();

          // 如果该小时已有数据，则取平均值或最新值
          if (hourlyData[hour] === null) {
            hourlyData[hour] = item[this.queryParams.dataType];
          } else {
            // 可以选择取平均值或最新值，这里取最新值
            hourlyData[hour] = item[this.queryParams.dataType];
          }
        }
      });

      // 更新图表
      this.updateChart(hourlyData);
    },

    updateChart(values) {
      if (!this.chartInstance) return;

      this.chartInstance.setOption({
        // X轴数据已在initChart中设置为24小时
        yAxis: {
          name: this.dataTypeMap[this.queryParams.dataType].unit,
          min: this.dataTypeMap[this.queryParams.dataType].min,
          max: this.dataTypeMap[this.queryParams.dataType].max,
        },
        series: [
          {
            name: this.dataTypeMap[this.queryParams.dataType].label,
            data: values,
            itemStyle: {
              color: this.dataTypeMap[this.queryParams.dataType].color,
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color:
                      this.dataTypeMap[this.queryParams.dataType].color + "AA",
                  },
                  {
                    offset: 1,
                    color:
                      this.dataTypeMap[this.queryParams.dataType].color + "11",
                  },
                ],
              },
            },
          },
        ],
      });
    },

    handleDataTypeChange() {
      // 更新Y轴范围和单位
      if (this.chartInstance) {
        this.chartInstance.setOption({
          yAxis: {
            name: this.dataTypeMap[this.queryParams.dataType].unit,
            min: this.dataTypeMap[this.queryParams.dataType].min,
            max: this.dataTypeMap[this.queryParams.dataType].max,
          },
          series: [
            {
              name: this.dataTypeMap[this.queryParams.dataType].label,
              itemStyle: {
                color: this.dataTypeMap[this.queryParams.dataType].color,
              },
              areaStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color:
                        this.dataTypeMap[this.queryParams.dataType].color +
                        "AA",
                    },
                    {
                      offset: 1,
                      color:
                        this.dataTypeMap[this.queryParams.dataType].color +
                        "11",
                    },
                  ],
                },
              },
            },
          ],
        });
      }

      // 重新获取数据
      this.fetchData();
    },

    handleDateChange() {
      // 日期变化时重新获取数据
      this.fetchData();
    },

    closeDialog() {
      this.visible = false;
      // 移除窗口大小变化的监听
      window.removeEventListener("resize", this.resizeChart);
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}

::v-deep .el-dialog__body {
  overflow: hidden !important;
  max-height: 53vh !important;
}

.dialog-footer {
  text-align: right;
}
</style>
