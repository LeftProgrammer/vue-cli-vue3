<template>
  <div class="DocDisposeTime bg-fff h-100pre">
    <TopTitle title="公文处理时长" />
    <div class="top">
      <YearMonth @dateChange="dateChange" />
    </div>
    <div id="DocDisposeTime" />
  </div>
</template>
<script>
import TopTitle from '@/components/TopTitle'
import YearMonth from '@/components/YearMonth'
import { init } from '../echarts'
import { corporates, getDuration } from '../api'
export default {
  name: 'DocDisposeTime',
  components: { TopTitle, YearMonth },
  data() {
    return {
      date: '',
      receiveUnitList: [],
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          icon: 'circle'
        },
        color: ['#1299FA', '#7BC8FF', '#FF9190'],
        grid: {
          left: '3%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            triggerEvent: true,
            axisLabel: {
              width: 70,
              overflow: 'break',
              show: true,
              interval: 0,
              lineHeight: 16,
              color: '#86909C',
              fontFamily: 'Alibaba PuHuiTi 2.0, Alibaba PuHuiTi 20',
              triggerEvent: true,
              formatter: (value) => {
                if (value.length > 10) {
                  value = value.substring(0, 9) + '...'
                }
                return value
              }
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '处理次数(次)',
            position: 'left',
            min: 0,
            alignTicks: {
              show: true
            },
            axisLine: {
              show: true,
              lineStyle: {}
            }
          },
          {
            type: 'value',
            name: '平均处理时长(天)',
            position: 'right',
            alignTicks: {
              show: true
            },
            axisLine: {
              show: true,
              lineStyle: {}
            }
          }
        ],
        series: [
          {
            name: '发文',
            type: 'bar',
            barWidth: 16,
            stack: 'type',
            emphasis: {
              min: 0,
              focus: 'series'
            },
            data: []
          },
          {
            name: '收文',
            type: 'bar',
            barWidth: 16,
            stack: 'type',
            emphasis: {
              focus: 'series'
            },
            data: []
          },
          {
            name: '平均处理时长',
            type: 'bar',
            barWidth: 16,
            yAxisIndex: 1,
            emphasis: {
              focus: 'series'
            },
            data: []
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            startValue: 0, // 控制从第一个开始
            endValue: 10, // 到第几个（默认一页展示多少个 0-10 11条）
            height: 4,
            width: '100%',
            bottom: 0,
            brushSelect: false,
            xAxisIndex: [0, 1], // 控制y轴滚动对象
            fillerColor: '#1298FA', // 滚动条颜色
            borderColor: 'rgba(0, 0, 0, 0.12)',
            backgroundColor: 'rgba(0, 0, 0, 0.12)', // 两边未选中的滑动条区域的颜色
            handleSize: 0, // 两边手柄尺寸
            showDataShadow: false, // 是否显示数据阴影 默认auto
            showDetail: false, // 拖拽时是否展示滚动条两侧的文字
            zoomLock: true,
            moveHandleStyle: {
              opacity: 0
            }
          },
          {
            type: 'inside',
            startValue: 0,
            endValue: 10,
            minValueSpan: 10,
            xAxisIndex: [0],
            zoomOnMouseWheel: false, // 关闭滚轮缩放
            moveOnMouseWheel: true, // 开启滚轮平移
            moveOnMouseMove: true // 鼠标移动能触发数据窗口平移
          }
        ]
      }
    }
  },
  created() {
    this.date = `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, '0')}`
  },
  mounted() {},
  methods: {
    /**
     * @description 日期切换
     * @param {*} date
     */
    dateChange(date) {
      this.date = date
      this.getData()
    },
    /**
     * @description 获取图标数据
     */
    getData() {
      const param = {
        year: this.date
      }
      getDuration(param).then((res) => {
        const data = res.data.sort((a,b)=>{
          return parseFloat(b.averageDay) - parseFloat(a.averageDay);
        }) || []
        this.option.series[0].data = data.map((x) => x.dispatchNum)
        this.option.series[1].data = data.map((x) => x.receiveNum)
        this.option.series[2].data = data.map((x) => x.averageDay)
        this.option.xAxis[0].data = data.map((x) => x.corpName)
        const echarts = init('DocDisposeTime', this.option)
        this.extension(echarts)
      })
    },
    // 收文单位
    getUnit() {
      corporates().then((res) => {
        this.receiveUnitList = res.data
          .filter((item) => {
            return item.corpLeaf !== 0
          })
          .sort((a, b) => {
            return a.corpSort - b.corpSort
          })
        this.getData()
      })
    },
    extension(chart) {
      // 注意这里，是以X轴显示内容过长为例，如果是y轴的话，需要把params.componentType == 'xAxis'改为yAxis
      // 判断是否创建过div框,如果创建过就不再创建了
      // 该div用来盛放文本显示内容的，方便对其悬浮位置进行处理
      var elementDiv = document.getElementById('extension')
      if (!elementDiv) {
        var div = document.createElement('div')
        div.setAttribute('id', 'extension')
        div.style.display = 'block'
        document.querySelector('html').appendChild(div)
      }
      chart.on('mouseover', function (params) {
        if (params.componentType === 'xAxis') {
          var elementDiv = document.querySelector('#extension')
          // 设置悬浮文本的位置以及样式
          var elementStyle =
            'position: absolute;z-index: 99999;color: #fff;font-size: 12px;padding: 5px;display: inline;border-radius: 4px;background-color: #303133;box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 8px'
          elementDiv.style.cssText = elementStyle
          elementDiv.innerHTML = params.value
          document.querySelector('html').onmousemove = (event) => {
            var elementDiv = document.querySelector('#extension')
            var xx = event.pageX + 10
            var yy = event.pageY - 30
            elementDiv.style.top = yy + 'px'
            elementDiv.style.left = xx + 'px'
          }
        }
      })
      chart.on('mouseout', function (params) {
        // 注意这里，我是以X轴显示内容过长为例，如果是y轴的话，需要改为yAxis
        if (params.componentType === 'xAxis') {
          var elementDiv = document.querySelector('#extension')
          elementDiv.style.cssText = 'display:none'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../index.scss';
.DocDisposeTime {
  @extend .box-padding, .box-radius;
  width: calc(calc(100% - 16px) * 0.65);
  .top {
    margin-top: 12px;
  }
  #DocDisposeTime {
    height: calc(100% - 78px);
  }
}
</style>
