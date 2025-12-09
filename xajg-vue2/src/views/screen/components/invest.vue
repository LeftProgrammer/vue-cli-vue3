<template>
  <div class="DesignManage">
    <div class="card-header">
      <img class="header-icon" src="@/assets/screen/h-icon.png" alt="">
      投资概况
    </div>
    <div ref="chart" class="design-content" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'DesignManage',
  data() {
    return {}
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      const chart = echarts.init(this.$refs.chart)
      chart.setOption({
        legend: {
          right: 10,
          top: 2,
          textStyle: {
            color: '#fff'
          },
          itemWidth: 12,
          itemHeight: 10
          // itemGap: 35
        },
        xAxis: {
          data: ['总投资', '施工辅助工程', '设备安装工程', '建筑工程', '其他'],
          splitLine: { show: false },
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            textStyle: {
              color: '#B4B4B4',
              fontSize: '10'
            }
          }
        },
        yAxis: {
          splitLine: {
            show: true,
            lineStyle: {
              color: '#162456'
            }
          },
          axisTick: { show: false },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#162456'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#B4B4B4',
              fontSize: '12'
            }
          }
        },
        grid: {
          top: '10',
          left: '0',
          right: '0',
          bottom: '0',
          containLabel: true
        },
        color: [new echarts.graphic.LinearGradient(
          0, 1, 0, 0,
          [
            { offset: 1, color: '#6DCC08' },
            { offset: 0.5, color: '#6DCC08' },
            { offset: 0, color: 'rgba(11, 18, 39, .3)' }
          ]
        )],
        series: [{
          name: '已完成(亿)',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#fccb05'
              }, {
                offset: 1,
                color: '#f5804d'
              }]),
              barBorderRadius: 4
            }
          },
          data: [8, 1, 1, 1, 1]
        },
        {
          name: '总量(亿)',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#248ff7'
              }, {
                offset: 1,
                color: '#6851f1'
              }]),
              barBorderRadius: 4
            }
          },
          data: [15, 2, 6, 6, 1]
        }]
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .DesignManage{
    // color: #B4B4B4;
    color: #fff;
    font-weight: 500;
    height: 100%;
    .design-content{
      width: 100%;
      height: calc(100% - 45px);
    }
  }
</style>
