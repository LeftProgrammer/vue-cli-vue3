<template>
  <div class="DesignManage">
    <div class="card-header">
      <img class="header-icon" src="@/assets/screen/h-icon.png" alt="">
      质量管理
    </div>
    <div class="content">
      <div class="item-box">
        <div class="item">
          <img src="@/assets/screen/screen_23.png" alt="">
          <div class="status">一次验收合格率</div>
          <div class="num">100%</div>
        </div>
        <div class="item">
          <img src="@/assets/screen/screen_24.png" alt="">
          <div class="status">验收合格率</div>
          <div class="num">100%</div>
        </div>
        <div class="item">
          <img src="@/assets/screen/screen_25.png" alt="">
          <div class="status">验收优良率</div>
          <div class="num">100%</div>
        </div>
        <div class="item">
          <img src="@/assets/screen/screen_26.png" alt="">
          <div class="status">质量隐患数</div>
          <div class="num">10</div>
        </div>
        <div class="item">
          <img src="@/assets/screen/screen_22.png" alt="">
          <div class="status">已整改数</div>
          <div class="num">20</div>
        </div>
      </div>
      <div class="chart-box">
        <div ref="left" class="chart-item">1</div>
        <div ref="right" class="chart-item">1</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'DesignManage',
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const left = echarts.init(this.$refs.left)
      const right = echarts.init(this.$refs.right)
      // #FA6400
      this.draw(left, [145, 230, 40], '吊装优良率')
      this.draw(right, [250, 100, 0], '风机基础优良率')
    },
    draw(chart, [r, g, b], name) {
      var value = 88
      var data = {
        value: value,
        percent: (value / 100).toFixed(2)
      }

      // 指定图表的配置项和数据
      chart.setOption({
        series: [
          // 外侧灰色轴线
          {
            type: 'gauge',
            radius: '98%', // 位置
            center: ['50%', '70%'],
            min: 0,
            max: 100,
            startAngle: 180,
            endAngle: 0,
            axisLine: {
              show: true,
              lineStyle: {
                // 轴线样式
                width: 1, // 宽度
                color: [
                  [1, `rgb(${r}, ${g}, ${b})`]
                ] // 颜色
              }
            },
            axisTick: {
              // 刻度
              show: false
            },
            splitLine: {
              // 分割线
              show: false
            },
            axisLabel: {
              // 刻度标签
              show: false
            },
            pointer: {
              // 仪表盘指针
              show: false
            },
            detail: {
              // 仪表盘详情
              show: false
            }
          },
          // 内侧刻度
          {
            type: 'gauge',
            radius: '90%', // 位置
            center: ['50%', '70%'],
            min: 0,
            max: 100,
            startAngle: 180,
            endAngle: 0,
            axisLine: {
              show: true,
              lineStyle: {
                // 轴线样式
                width: 10, // 宽度
                color: [
                  [
                    data.percent,
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: `rgb(${r}, ${g}, ${b})`
                    },
                    {
                      offset: 1,
                      color: `rgb(${r}, ${g}, ${b})`
                    }
                    ])
                  ]
                ] // 颜色
              }
            },
            axisTick: {
              // 刻度
              show: false,
              splitNumber: 2,
              length: 10
            },
            splitLine: {
              // 分割线
              show: false
            },
            axisLabel: {
              // 刻度标签
              show: false
            },
            pointer: {
              // 仪表盘指针
              show: false
            }
          },
          {
            type: 'gauge',
            radius: '90%', // 位置
            center: ['50%', '70%'],
            min: 0,
            max: 100,
            startAngle: 180,
            endAngle: 0,
            axisLine: {
              show: true,
              lineStyle: {
                // 轴线样式
                width: 100, // 宽度
                color: [
                  [
                    100,
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: `rgba(${r}, ${g}, ${b}, 0.5)`
                    },
                    {
                      offset: 1,
                      color: `rgba(${r}, ${g}, ${b}, 0)`
                    }
                    ])
                  ]
                ] // 颜色
              }
            },
            axisTick: {
              // 刻度
              show: false,
              splitNumber: 2,
              length: 10
            },
            splitLine: {
              // 分割线
              show: false
            },
            axisLabel: {
              // 刻度标签
              show: false
            },
            pointer: {
              // 仪表盘指针
              show: false
            },
            detail: {
              // 仪表盘详情
              show: true,
              formatter: function(value) {
                return value + '%'
              },
              offsetCenter: ['0%', '-30%'],
              fontWeight: 500,
              fontSize: '22px',
              color: `rgba(${r}, ${g}, ${b}, 1)`
            },
            title: {
              show: true,
              fontSize: '12px',
              fontWeight: 600,
              offsetCenter: ['0%', '40%'],
              color: `rgba(${r}, ${g}, ${b}, 1)`
            },
            data: [{
              value: data.value,
              name: name
              // '吊装优良率'
              // 风机基础优良率
            }]
          }
        ]
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
    .desc{
      font-size: 14px;
      line-height: 18px;
      padding-left: 10px;
    }
    img{
      width: 427px;
      height: 176px;
    }
    .content{
      width: 100%;
      padding: 0 20px;
      .item-box{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10px;
        border-bottom: 1px solid #235879;
      }
      .item{
        display: flex;
        flex-direction: column;
        align-items: center;
        img{
          width: 52px;
          height: 52px;
        }
        .status{
          margin-top: 10px;
          font-size: 14px;
          // color: #B4B4B4;
          color: #fff;
          line-height: 21px;
        }
        .num{
          font-size: 18px;
          font-weight: 800;
          color: #00FCEF;
          line-height: 27px;
        }
      }
      .chart-box{
        height: 160px;
        width: 100%;
        display: flex;
        .chart-item{
          height: 100%;
          width: 50%;
        }
      }
    }
  }
</style>
