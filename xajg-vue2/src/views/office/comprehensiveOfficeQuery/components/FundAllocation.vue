<template>
  <div class="FundAllocation">
    <div class="left">
      <el-date-picker
        v-model="month"
        :append-to-body="false"
        :clearable="false"
        format="yyyy-MM"
        type="month"
        @change="monthChange"
      />
      <div class="box">
        <div class="total">
          <div class="num">{{ moneyData.total.toLocaleString() }}</div>
          <img :src="require('@/assets/img/office/total-money.png')" alt="" />
          <div class="title">资金调拨总金额（万元）</div>
        </div>
        <div class="other-total">
          <div class="year">
            <img :src="require('@/assets/img/office/year-money.png')" alt="" />
            <div>
              <span class="num">{{ moneyData.yearNum.toLocaleString() }}</span>
              <span class="title">{{ month.getFullYear() }}年总金额(万元)</span>
            </div>
          </div>
          <div class="month">
            <img :src="require('@/assets/img/office/month-money.png')" alt="" />
            <div>
              <span class="num">{{ moneyData.monthNum.toLocaleString() }}</span>
              <span class="title"
                >{{ month.getMonth() + 1 }}月总金额(万元)</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top">
        <div>
          <YearMonth v-if="type === 2" @dateChange="dateChange" />
          <el-select @visible-change="$visibleChange($event, 'el-popper')"
            v-if="type === 1"
            v-model="dateType"
            :popper-append-to-body="false"
            @change="dateTypeChange"
          >
            <el-option value="月" label="月" />
            <el-option value="年" label="年" />
          </el-select>
          <el-select @visible-change="$visibleChange($event, 'el-popper')"
            v-if="type === 1"
            v-model="htxxType"
            :popper-append-to-body="false"
            @change="htxxChange"
          >
            <el-option value="" label="全部" />
            <el-option
              v-for="item in htxxList"
              :key="item.dictId"
              :value="item.dictId"
              :label="item.dictName"
            />
          </el-select>
        </div>
        <div class="btn">
          <div :class="{ active: type == 1 }" @click="changeType(1)">
            合同分析
          </div>
          <div :class="{ active: type == 2 }" @click="changeType(2)">
            总体分析
          </div>
        </div>
      </div>
      <div id="moneyBar" />
    </div>
  </div>
</template>
<script>
import { init } from '../echarts'
import YearMonth from '@/components/YearMonth'
import { getMoneyTotal, getMoneyAnalyze } from '../api'
export default {
  name: 'FundAllocation',
  components: { YearMonth },
  data() {
    return {
      month: new Date(),
      moneyData: {
        total: 0,
        yearNum: 0,
        monthNum: 0
      },
      date: '',
      type: 1,
      dateType: '月',
      htxxType: '',
      htxxList: [],
      receiveUnitList: [],
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '金额:{c}(万元)'
        },
        legend: {
          show: false
        },
        color: ['#FFC069'],
        grid: {
          left: '3%',
          right: '4%',
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
            name: '金额:(万元)',
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
            name: '实际',
            type: 'bar',
            barWidth: '16',
            emphasis: {
              min: 0,
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
    this.gethtxxList()
  },
  mounted() {
    this.getMoneyData()
  },
  methods: {
    /**
     * @description 获取字典(材料名称)
     */
    gethtxxList() {
      this.$store.dispatch('dict/get', 'htxx').then((res) => {
        this.htxxList = res
      })
    },
    /**
     * @description 日期切换
     * @param {*} date
     */
    dateChange(date) {
      this.date = date
      this.getData()
    },
    /**
     * @description 日期类型切换
     * @param {*} val
     */
    dateTypeChange(val) {
      this.dateType = val
      this.getData()
    },
    /**
     * @description 左侧时间切换
     */
    monthChange(date) {
      this.month = date
      this.getMoneyData()
    },
    /**
     * @description 合同切换
     * @param {*} val
     */
    htxxChange(val) {
      this.htxxType = val
      this.getData()
    },
    /**
     * @description 获取表格数据
     */
    getData(list) {
      if (list) this.receiveUnitList = list
      const param = {
        type: this.type === 1 ? '按合同分析' : '总体分析'
      }
      this.option.xAxis[0].data = []
      this.option.series[0].data = []
      if (this.type === 1) {
        param.contractId = this.htxxType
        param.mode = this.dateType
      } else {
        param.year = this.date
        this.option.xAxis[0].data = this.receiveUnitList.map((x) => x.corpName)
      }
      getMoneyAnalyze(param).then((res) => {
        const data = res.data || []
        if (this.type === 1) {
          data.forEach((x) => {
            for (const key in x) {
              this.option.xAxis[0].data.push(key)
              this.option.series[0].data.push(
                (Number(x[key]) / 10000).toFixed(2)
              )
            }
          })
        } else {
          this.receiveUnitList.forEach((x) => {
            const obj = data.find((item) => item.corpId === x.corpId)
            this.option.series[0].data.push(obj.num || 0)
          })
        }
        const echarts = init('moneyBar', this.option)
        this.extension(echarts)
      })
    },
    /**
     * @description 获取资金
     */
    getMoneyData() {
      const param = {
        year: `${this.month.getFullYear()}-${String(
          this.month.getMonth() + 1
        ).padStart(2, '0')}`
      }
      getMoneyTotal(param).then((res) => {
        const data = res.data || { total: 0, yearNum: 0, monthNum: 0 }
        for (const key in data) {
          this.moneyData[key] = (Number(data[key]) / 10000).toFixed(2)
        }
      })
    },
    /**
     * @description 切换type
     * @param {*} type
     */
    changeType(type) {
      this.type = type
      this.getData()
    },
    extension(chart) {
      var elementDiv = document.getElementById('extension')
      if (!elementDiv) {
        var div = document.createElement('div')
        div.setAttribute('id', 'extension')
        div.style.display = 'block'
        document.querySelector('html').appendChild(div)
      }
      chart.on('mouseover', (params) => {
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
      chart.on('mouseout', (params) => {
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
.FundAllocation {
  display: flex;
  height: calc(100% - 30px);
  .left {
    width: 35%;
    height: 100%;
    position: relative;
    &::after {
      border-right: 3px dashed #1298fa;
      content: '';
      width: 3px;
      height: calc(100% - 38px - 22px);
      position: absolute;
      right: 0;
      top: 38px;
    }
    .el-date-editor {
      margin: 12px 0 18px 0;
    }
    .box {
      display: flex;
      height: calc(100% - 66px);
      .total {
        width: 292px;
        height: 100%;
        background: rgba(18, 152, 250, 0.06);
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .num {
          width: 188px;
          height: 48px;
          background: linear-gradient(201deg, #5cb9fe 0%, #1298fa 100%);
          box-shadow: 0px 2px 8px 0px rgba(18, 152, 250, 0.19),
            inset 0px -4px 4px 0px rgba(25, 96, 202, 0.25),
            inset 0px 4px 4px 0px rgba(77, 180, 255, 0.34);
          border-radius: 4px;
          font-size: 32px;
          font-family: Roboto, Roboto;
          font-weight: 500;
          color: #ffffff;
          line-height: 48px;
          letter-spacing: 1px;
          text-align: center;
        }
        img {
          width: 180px;
          height: 180px;
        }
        .title {
          font-size: 16px;
          font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
          font-weight: normal;
          color: #59b7ff;
          line-height: 19px;
        }
      }
      .other-total {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        .year,
        .month {
          width: 229px;
          height: 80px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          img {
            width: 46px;
            height: 46px;
            margin: 0 6px;
          }
          > div {
            display: flex;
            flex-direction: column;
            color: #ffffff;
            margin: 14px 0;
            span:first-child {
              font-size: 24px;
              font-family: Roboto, Roboto;
              font-weight: 500;
            }
            span:last-child {
              font-size: 16px;
              font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
              font-weight: normal;
            }
          }
        }
        .year {
          background: linear-gradient(322deg, #1298fa 0%, #6fcbff 100%);
          box-shadow: 0px 4px 8px 0px rgba(49, 167, 252, 0.26);
        }
        .month {
          background: linear-gradient(180deg, #6c84f8 0%, #b1c2ff 100%);
          box-shadow: 0px 4px 8px 0px rgba(127, 150, 250, 0.25);
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
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding-left: 65px;
      .YearMonth,
      .el-select {
        margin-right: 16px;
      }
      .btn {
        display: flex;
        div {
          background: #e6f9ff;
          border-radius: 4px;
          line-height: 32px;
          font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
          font-weight: normal;
          color: #1298fa;
          padding: 0 20px;
          font-size: 14px;
          cursor: pointer;
          &:first-child {
            margin-right: 8px;
          }
        }
        .active {
          background: #1298fa;
          color: #ffffff;
        }
      }
    }
    #moneyBar {
      width: 100%;
      height: calc(100% - 36px - 24px);
    }
  }
}
</style>
