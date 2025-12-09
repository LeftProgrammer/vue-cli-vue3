<template>
  <div class="h-100pre bg-fff ReceiveSend">
    <TopTitle title="收发文分析" />
    <div class="top">
      <YearMonth @dateChange="dateChange" />
      <el-select @visible-change="$visibleChange($event, 'el-popper')"
        v-model="corpType"
        placeholder="全部/按照单位类型统计"
        :popper-append-to-body="false"
        @change="corpTypeChange"
      >
        <el-option label="全部" value="" />
        <el-option
          v-for="item in corpTypeList"
          :key="item.dictCode"
          :label="item.dictName"
          :value="item.dictCode"
        />
      </el-select>
    </div>
    <div v-show="showEmpty" class="noData">
      <img :src="require('@/assets/img/office/noData.png')" />
      <span>暂无数据</span>
    </div>
    <div v-show="!showEmpty" id="ReceiveSendPie" />
    <div class="bottom">
      <div :class="{ active: documentType == 2 }" @click="changeType(2)">
        发文
      </div>
      <div :class="{ active: documentType == 1 }" @click="changeType(1)">
        收文
      </div>
    </div>
  </div>
</template>
<script>
import TopTitle from '@/components/TopTitle'
import YearMonth from '@/components/YearMonth'
import { init } from '../echarts'
import { getReceiveSend } from '../api'
export default {
  name: 'ReceiveSend',
  components: { TopTitle, YearMonth },
  props: {},
  data() {
    return {
      date: '',
      documentType: 2,
      corpType: '',
      showEmpty: false,
      dataSource: [],
      corpTypeList: [],
      receiveUnitList: [],
      option: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          icon: 'circle',
          right: 0,
          top: 0,
          bottom: 0,
          pageTextStyle: {
            fontSize: 14
          },
          pageIcons: {
            vertical: [
              'path://M330.666667 512a35.84 35.84 0 0 0 11.52 26.453333l235.52 220.586667a35.84 35.84 0 1 0 49.066666-52.48L419.413333 512l207.36-194.56a35.84 35.84 0 1 0-49.066666-52.48L341.333333 484.266667a35.84 35.84 0 0 0-10.666666 27.733333zM512 0a512 512 0 1 0 512 512A512 512 0 0 0 512 0z m0 72.106667a439.466667 439.466667 0 0 1 170.666667 844.373333A439.466667 439.466667 0 0 1 200.533333 200.533333a438.613333 438.613333 0 0 1 311.04-128z',
              'path://M614.4 507.733333l29.866667 29.866667-29.866667 29.866667-115.2 115.2-29.866667-34.133334 115.2-115.2L469.333333 422.4l29.866667-29.866667 115.2 115.2zM533.333333 896C332.8 896 170.666667 733.866667 170.666667 533.333333S332.8 170.666667 533.333333 170.666667 896 332.8 896 533.333333 733.866667 896 533.333333 896z m0-42.666667c174.933333 0 320-145.066667 320-320S708.266667 213.333333 533.333333 213.333333 213.333333 358.4 213.333333 533.333333 358.4 853.333333 533.333333 853.333333z'
            ]
          },
          pageIconColor: '#1298FA', // 可以点击的翻页按钮颜色
          pageIconInactiveColor: '#E9E9E9', // 禁用的按钮颜色
          pageIconSize: 14, // 这当然就是按钮的大小

          tooltip: {
            show: true
          },
          formatter: (name) => {
            const { value, percent } = this.dataSource.find(
              (x) => x.name === name
            )
            const arr = [
              '{name|' +
                (name.length > 11 ? name.substring(0, 10) + '...' : name) +
                '}{value|' +
                value +
                '次}{percentage|' +
                percent +
                '}'
            ]
            return arr.join('\n')
          },
          textStyle: {
            rich: {
              name: {
                fontSize: 14,
                align: 'left',
                width: 100,
                overflow: 'truncate',
                ellipsis: '...'
              },
              value: {
                fontSize: 16,
                width: 100,
                align: 'right'
              },
              percentage: {
                width: 100,
                fontSize: 16,
                align: 'right'
              }
            }
          }
        },
        series: [
          {
            show: true,
            radius: ['50%', '70%'],
            type: 'pie',
            center: ['20%', '50%'],
            data: [],
            label: {
              show: true,
              position: 'center',
              // fontSize: 20,
              fontWeight: 'bold',
              formatter: (item) => {
                return `{total| ${item.data.total || 0} }\n\r{active|${
                  this.documentType === 1 ? '收文总数' : '发文总数'
                }}`
              },
              rich: {
                total: {
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#1D2129',
                  lineHeight: 28,
                  textAlign: 'center'
                },
                active: {
                  fontSize: 16,
                  fontWeight: 'normal',
                  color: '#86909c',
                  lineHeight: 19
                }
              }
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 3
            }
          }
        ]
      }
    }
  },
  computed: {},
  created() {
    this.date = `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, '0')}`
    this.$store.dispatch('dict/get', 'UNIT_TYPE').then((res) => {
      this.corpTypeList = res
    })
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

    getData(list) {
      if (list) this.receiveUnitList = list
      const param = {
        corpType: this.corpType,
        year: this.date,
        documentType: this.documentType
      }
      getReceiveSend(param).then((res) => {
        const data = res.data || []
        this.showEmpty = data.length === 0
        if (!this.showEmpty) {
          this.dataSource = data.map((x) => {
            return {
              name: x.corpName,
              value: x.count,
              total: x.total,
              percent: x.percent
            }
          })
          this.option.series[0].data = this.dataSource
          init('ReceiveSendPie', this.option)
        }
      })
    },
    /**
     * @description 切换type
     * @param {*} type
     */
    changeType(type) {
      this.documentType = type
      this.getData()
    },
    /**
     * @description 单位类型 筛选
     */
    corpTypeChange(type) {
      this.corpType = type
      this.getData()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../index.scss';
.ReceiveSend {
  @extend .box-padding, .box-radius;
  width: calc(calc(100% - 16px) * 0.35);
  margin-right: 16px;
  .top {
    height: 36px;
    margin: 12px 0;
    > .el-select {
      margin-left: 16px;
      width: 200px;
    }
  }
  #ReceiveSendPie,
  .noData {
    color: '#86909c';
    height: calc(100% - 122px);
  }
  .noData {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .bottom {
    height: 32px;
    display: flex;
    justify-content: center;
    div {
      background: #e6f9ff;
      border-radius: 2px;
      line-height: 32px;
      font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
      font-weight: normal;
      color: #1298fa;
      padding: 0 40px;
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
</style>
