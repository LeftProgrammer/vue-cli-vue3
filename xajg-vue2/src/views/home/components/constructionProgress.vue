<template>
  <div class="carousel">
    <el-carousel
      :interval="5000"
      :arrow="chartsData.length > 1 ? 'always' : 'never'"
      indicator-position="outside"
      ref="chartCarousel"
      :autoplay="false"
    >
      <el-carousel-item v-for="chartItem in chartsData" :key="chartItem.id">
        <div class="container">
          <div class="name">{{ chartItem.name }}</div>
          <img
            :src="require('@/assets/img/Pointer.png')"
            :style="{
              transform: `translateX(-50%) rotateZ(${
                (((chartItem.weight || 0) * 100 - 50) / 50) * 90
              }deg)`
            }"
          />
          <div class="weight">
            实际完成： {{ ((chartItem.weight || 0) * 100).toFixed(2) }}%
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getSectionByUser, zjdSchedule } from './api.js'
export default {
  name: 'constructionProgress',
  props: {
    chartsDataProp: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chartsData: [],
      dataSource: {}
    }
  },
  watch: {
    chartsDataProp: {
      handler(newVal) {
        this.chartsData = JSON.parse(JSON.stringify(newVal))
      },
      deep: true
    }
  },
  async mounted() {
    this.chartsData = []
    let res = await getSectionByUser()
    res.data.forEach(async (x) => {
      const resp = await zjdSchedule({ sectionId: x.id })
      this.chartsData.push({
        weight: resp.data ? resp.data.weight : 0,
        name: x.name
      })
    })
    // this.init()
  },
  methods: {
    calculateTrendLine() {
      const data = this.dataSource
      const n = data.length

      // x为索引，y为实际进度
      let sumX = 0,
        sumY = 0,
        sumXY = 0,
        sumX2 = 0

      for (let i = 0; i < n; i++) {
        sumX += i
        sumY += data[i].totalActualNum
        sumXY += i * data[i].totalActualNum
        sumX2 += i * i
      }

      // 计算斜率和截距
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
      const intercept = (sumY - slope * sumX) / n

      // 生成趋势线数据
      const trendData = []
      for (let i = 0; i < n; i++) {
        trendData.push(Math.round(intercept + slope * i))
      }

      return trendData
    },
    async init() {
      console.log('init========================')
      let res = await getSectionByUser()
      console.log('res', res)

      this.chartsData = [
        { id: 'chart_section_1', title: '施工一标', instance: null, dom: null },
        { id: 'chart_section_2', title: '施工二标', instance: null, dom: null },
        { id: 'chart_section_3', title: '施工三标', instance: null, dom: null }
      ]
      this.chartsData = this.chartsData.filter(
        (item) => res.data.findIndex((x) => x.name === item.title) !== -1
      )
      console.log('this.chartsData', JSON.stringify(this.chartsData))

      this.dataSource = [
        { name: '2025年1月', totalPlanNum: 10, totalActualNum: 10 },
        { name: '2025年2月', totalPlanNum: 15, totalActualNum: 20 },
        { name: '2025年3月', totalPlanNum: 20, totalActualNum: 28 },
        { name: '2025年4月', totalPlanNum: 28, totalActualNum: 35 },
        { name: '2025年5月', totalPlanNum: 40, totalActualNum: 40 },
        { name: '2025年6月', totalPlanNum: 50, totalActualNum: 43 },
        { name: '2025年7月', totalPlanNum: 60, totalActualNum: 48 },
        { name: '2025年8月', totalPlanNum: 66, totalActualNum: 59 },
        { name: '2025年9月', totalPlanNum: 75, totalActualNum: 66 },
        { name: '2025年10月', totalPlanNum: 80, totalActualNum: 66 },
        { name: '2025年11月', totalPlanNum: 90, totalActualNum: 66 },
        { name: '2025年12月', totalPlanNum: 100, totalActualNum: 66 }
      ]
      const trendData = this.calculateTrendLine()
      const commonChartOptions = {
        title: {
          left: 'center',
          text: 'title'
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          top: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>计划进度: {c0}%<br/>实际进度: {c1}%'
        },
        legend: {
          data: ['计划进度', '实际进度', '线性 (实际进度)'],
          selectedMode: true,
          left: 'center', // 居中对齐
          bottom: 10,
          orient: 'horizontal',
          align: 'left',
          itemWidth: 25,
          itemHeight: 14,
          itemGap: 20
        },

        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dataSource.map((x) => x.name),
          axisLabel: {
            show: true,
            rotate: 45,
            fontSize: 9,
            interval: 0,
            margin: 14,
            align: 'right',
            hideOverlap: true
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          },
          min: 0,
          max: 100,
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '计划进度',
            data: this.dataSource.map((item) => item.totalPlanNum),
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#3DA9DE'
            },
            lineStyle: {
              width: 2
            }
          },
          {
            name: '实际进度',
            data: this.dataSource.map((item) => item.totalActualNum),
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#4EB564'
            },
            lineStyle: {
              width: 2
            }
          },
          {
            name: '线性 (实际进度)',
            data: trendData,
            type: 'line',
            symbol: 'none',
            lineStyle: {
              width: 2,
              type: 'dotted',
              color: '#4EB564'
            }
          }
        ]
      }
      this.$nextTick(() => {
        // 给DOM额外的时间渲染
        setTimeout(() => {
          if (this.chartsData.length >= 1) {
            this.chartsData.forEach((chartConfig) => {
              chartConfig.dom = document.getElementById(chartConfig.id)
              if (chartConfig.dom) {
                chartConfig.instance = echarts.init(chartConfig.dom)
                commonChartOptions.title.text = chartConfig.title
                chartConfig.instance.setOption(commonChartOptions)
              } else {
                console.log('多图模式：DOM不存在', chartConfig.id)
              }
            })
          } else {
            console.log('无图表数据')
          }
        }, 100) // 短暂延迟确保DOM已渲染
      })
    }
  }
}
</script>

<style scoped lang="scss">
.carousel {
  height: 100%;

  :deep(.el-carousel.el-carousel--horizontal) {
    .el-carousel__indicators.el-carousel__indicators--horizontal.el-carousel__indicators--outside {
      display: none !important;
    }
  }

  :deep(.el-carousel) {
    height: 100%;

    .el-carousel__container {
      height: 100%;

      .chart_section {
        height: 100%;
      }
    }
  }
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/img/Dial.png');
  background-size: 395px 205px;
  background-position: center center;
  background-repeat: no-repeat;
  position: relative;
  img {
    position: absolute;
    width: 60px;
    height: 80px;
    bottom: 15%;
    left: 50%;
    transform-origin: 50% 80%;
  }
  .name {
    text-align: center;
  }
  .weight {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 5%;
  }
}
</style>
