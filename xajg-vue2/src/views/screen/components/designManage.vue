<template>
  <div class="DesignManage">
    <div class="card-header">
      <img class="header-icon" src="@/assets/screen/h-icon.png" alt="">
      设计管理
    </div>
    <div class="design-content">
      <div ref="chart" class="left" />
      <div class="right">
        <div class="cell">
          <div class="icon" />
          <div class="label">本年度计划完成</div>
          <div class="num">100</div>
        </div>
        <div class="cell">
          <div class="icon" style="background: #3CFBE0" />
          <div class="label">本年度实际完成</div>
          <div class="num">75</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-liquidfill/src/liquidFill.js'
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
        title: {
          text: '',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 25,
            color: 'rgb(97, 142, 205)'
          }
        },
        series: [
          {
            type: 'liquidFill',
            radius: '80%',
            center: ['50%', '50%'],
            data: [0.5, 0.5, 0.75], // data个数代表波浪数
            backgroundStyle: {
              borderWidth: 1,
              color: 'rgb(255,0,255,0.1)'
            },
            // 修改波浪颜色
            // color:['yellow'], 所有波浪一个颜色
            // color:['yellow','red','pink'], 每个波浪不同颜色，颜色数组长度为对应的波浪个数
            label: {
              normal: {
                formatter: (0.75 * 100).toFixed(0) + '%',
                textStyle: {
                  fontSize: 20
                }
              }
            },
            outline: {
              show: false
            }
          },
          {
            type: 'pie',
            radius: ['90%', '83%'],
            hoverAnimation: false,
            clockWise: false,
            itemStyle: {
              normal: {
                shadowBlur: 0,
                shadowColor: 'rgba(0, 118, 239,0.5)',
                color: '#0076ef'
              }
            },
            label: {
              show: false
            },
            data: [50]
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
    .design-content{
      width: 100%;
      display: flex;
      align-items: center;
      .left{
        width: 200px;
        height: 110px;
      }
      .right{
        height: 110px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .cell{
          display: flex;
          align-items: center;
        }
        .icon{
          width: 10px;
          height: 10px;
          background: #72787C;
          border: 1px solid #979797;
          margin-right: 10px;
        }
        .label{
          font-size: 14px;
          font-family: SourceHanSansCN-Medium, SourceHanSansCN;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 21px;
          margin-right: 20px;
        }
        .num{
          font-size: 24px;
          font-family: SourceHanSansCN-Bold, SourceHanSansCN;
          font-weight: bold;
          color: #3CFBE0;
          line-height: 36px;
        }
      }
    }
  }
</style>
