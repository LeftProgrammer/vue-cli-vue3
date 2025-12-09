<template>
  <div class="w-100pre h-100pre border page-content" id="mdg-homeIndex" :style="{ zoom: scaleFactor }">
    <!-- 定位大法 横向布局 分左右  左侧布局用宫格 8等分 右侧布局上下分布 -->
    <div class="flex">
      <!-- 左边 -->
      <div style="width: calc(100% - 1100px)" class="h-100pre border">
        <el-row class="border">
          <!-- 供应计划完成情况 -->
          <el-col :span="24">
            <div class="bg-fff h-442 rounded-8 px-16 pt-12">
              <div class="flex align-center">
                <div class="title-line mr-5"></div>
                <div class="item-title">供应计划完成情况</div>
              </div>
              <div class="divider-line mt-10"></div>
              <div class="supplyPlan-content">
                <div class="overflow-y-scroll">
                  <div v-if="completeinfo.length !== 0">
                    <div v-for="(item, index) in completeinfo" :key="index"
                      class="flex py-13 pl-12 pr-18 h-64 rounded-4 align-center analyse-item">
                      <img class="w-38 h-38 mr-13" :src="require(`@/views/design/ComprehensiveQuery/assets/${item.path}.png`)
                        " alt="" />
                      <div class="title text-ellipsis-clamp">
                        {{ item.name }}
                      </div>
                      <el-divider direction="vertical"></el-divider>
                      <div class="progress mx-12">
                        <div>完成率：<span>{{ item.percentage }}%</span></div>
                        <el-progress :show-text="false" color="#1298FA" :stroke-width="8"
                          :percentage="item.percentage"></el-progress>
                      </div>
                      <el-divider direction="vertical"></el-divider>
                      <div class="compare ml-16">
                        <div>
                          <img v-if="item.up > 0" class="w-15 h-21" :src="require('@/assets/img/designManager/up.png')"
                            alt="" />
                          <img v-if="item.up < 0" class="w-15 h-21"
                            :src="require('@/assets/img/designManager/down.png')" alt="" />
                          <span v-if="item.up != 0">{{ item.up }}% </span>
                          <span v-if="item.up == 0">-</span>
                        </div>
                        <div>较上月</div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="flex justify-center align-center text-center h-100pre">
                    <el-empty class="todo-empty" :image-size="265" :description="'暂无待办事项'">
                    </el-empty>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="mb-8"></div>
          </el-col>
          <!-- 设计变更发起次数 -->
          <el-col :span="24">
            <div class="bg-fff h-442 rounded-8 px-16 pt-12">
              <div class="flex align-center">
                <div class="title-line mr-5"></div>
                <div class="item-title">设计变更发起次数</div>
              </div>
              <div class="divider-line mt-10"></div>
              <div class="h-100pre num-content pt-12">
                <div class="flex justify-between">
                  <div>
                    <el-radio-group v-model="radioValue" @input="getChangeDataCounts">
                      <el-radio label="1">全部</el-radio>
                      <el-radio label="2">
                        <el-date-picker @change="getChangeDataCounts" value-format="yyyy-MM"
                          v-model="paramsChangeCount.condition" type="month" placeholder="请选择" :clearable="false"
                          format="yyyy年MM月" :disabled="radioValue !== '2'">
                        </el-date-picker>
                      </el-radio>
                    </el-radio-group>
                  </div>
                </div>
                <div id="chartContainer1" class="h-100pre w-100pre" :style="{ zoom: 1 / scaleFactor }"></div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 右侧 -->
      <div class="w-1080 h-100pre ml-8">
        <!-- 设计成果供应情况 -->
        <el-row>
          <el-col :span="24">
            <div class="bg-fff h-442 rounded-8 px-16 pt-12">
              <div class="flex align-center">
                <div class="title-line mr-5"></div>
                <div class="item-title">设计成果供应情况</div>
              </div>
              <div class="component-divider-line mt-10"></div>
              <div class="h-100pre designResult-content">
                <div>
                  <el-row :gutter="16">
                    <el-col :span="6">
                      <el-date-picker @change="getQuerySupply" value-format="yyyy" v-model="paramsSupply.year"
                        type="year" placeholder="选择年" :clearable="false">
                      </el-date-picker>
                    </el-col>
                    <el-col :span="6">
                      <el-select @visible-change="$visibleChange($event, 'el-popper')" v-model="paramsSupply.type" placeholder="请选择" @change="getQuerySupply" clearable
                        :popper-append-to-body="false">
                        <el-option v-for="item in designType" :key="item.value" :label="item.type" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                </div>
                <div id="chartContainer2" class="w-100pre" :style="{ zoom: 1 / scaleFactor }"></div>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="h-8"></div>
          </el-col>
          <el-col :span="24">
            <div class="bg-fff h-442 rounded-8 px-16 pt-12 box">
              <div class="flex align-center">
                <div class="title-line mr-5"></div>
                <div class="item-title">变更金额统计</div>
              </div>
              <div class="component-divider-line mt-10"></div>
              <div class="py-12 w-100pre container">
                <el-date-picker @change="getChangeCostData" value-format="yyyy" v-model="paramsChangeCosts.condition"
                  type="year" placeholder="选择年" :clearable="false">
                </el-date-picker>
              </div>
              <div class="position-relative py-10 h-100pre container content-box">
                <div>
                  <el-row class="mt-60 mb-46">
                    <el-col class="ml-40">
                      <div class="position-relative w-255 h-80 rounded-2 change-item-1">
                        <img src="./assets/changeCost.png" alt="" style="width: 46px; height: 46px"
                          class="position-absolute bottom-17 left-6" />
                        <div class="position-absolute bottom-38 left-58 text-fff font-24">
                          {{ total }}
                        </div>
                        <div class="position-absolute bottom-15 left-58 text-fff font-16">
                          变更总金额(万元)
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col class="ml-40">
                      <div class="position-relative w-255 h-80 rounded-2 change-item-2">
                        <img src="./assets/changeYearCost.png" alt="" style="width: 46px; height: 46px"
                          class="position-absolute bottom-17 left-6" />
                        <div class="position-absolute bottom-38 left-58 text-fff font-24">
                          {{ yearTotal }}
                        </div>
                        <div class="position-absolute bottom-15 left-58 text-fff font-16">
                          {{ message }}
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div class="content-line"></div>
                <div id="chartContainer3" class="h-100pre w-100pre" :style="{ zoom: 1 / scaleFactor }"></div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getDictItemList } from '@/api/dict'
import * as echarts from 'echarts'
import { getChangeCosts, getChangeCounts, queryPlan, querySupply } from './api'
import item from '../../../layout/component/Sidebar/Item.vue';
import { dateFormat } from '../../../utils';

export default {
  computed: {
    item() {
      return item
    }
  },
  components: {},
  data() {
    return {
      socketInstance: '',
      scaleFactor: 1, // 默认缩放比例为 1
      componentList: [],
      categoryList: [],
      designType: [],
      // [
      //   {
      //     type: '设计图纸',
      //     value: 1
      //   },
      //   {
      //     type: '设计报告',
      //     value: 2
      //   },
      //   {
      //     type: '科研报告',
      //     value: 3
      //   }
      // ],
      completeinfo: [
        {
          name: '设计图纸',
          pre: 'sgtwcl',
          up: 'sgtlast',
          id: 1,
          path: 'sgt',
          percentage: 0
        },
        {
          name: '设计报告',
          pre: 'sjbgwcl',
          up: 'sjbglast',
          id: 2,
          path: 'sjbg',
          percentage: 0
        },
        {
          name: '科研报告',
          pre: 'kybgwcl',
          up: 'kybglast',
          id: 3,
          path: 'kybg',
          percentage: 0
        },
        {
          name: '施工技术要求',
          pre: 'sgjsyqwcl',
          up: 'sgjsyqlast',
          id: 4,
          path: 'sgjsyq',
          percentage: 0
        },
        {
          name: '现场需解决事项',
          pre: 'xcxjjsxwcl',
          up: 'xcxjjsxlast',
          id: 5,
          path: 'xzxqjjsx',
          percentage: 0
        }
      ],
      paramsSupply: {
        type: null,
        year: new Date()
      },
      paramsChangeCount: {
        condition: new Date()
      },
      paramsChangeCosts: {
        condition: new Date()
      },
      yearTotal: 0,
      total: 0,
      radioValue: '1',
      message: ""
    }
  },
  created() {
    this.getDesignType();
    this.getQuerySupply()
    this.getChangeCostData()
    this.getChangeDataCounts()
    this.getQueryPlan()
    this.message = dateFormat(new Date(), "YYYY") + "年变更总金额(万元)";
  },
  mounted() {
    // 监听屏幕变化
    window.addEventListener('resize', this.initScalc)
    this.$nextTick(() => {
      this.initScalc()
    })
  },
  beforeDestroy() { },
  methods: {
    //获取成果类型字典
    /**获取分类字典 */
    async getDesignType() {
      console.log("getDesignType")
      const res = await getDictItemList('cglx-ydbd')
      let data = [];
      if (res.success) {
        data = res.data.filter(x => x.dictPath != x.dictCode).map(x => {
          return {
            type: x.dictName,
            value: x.dictCode
          }
        })
      }

      const res2 = await getDictItemList('design_sjcglx');
      let data2 = [];
      if (res2.success) {
        data2 = res2.data.filter(x => x.dictPath != x.dictCode).map(x => {
          return {
            type: x.dictName,
            value: x.dictCode
          }
        })
      }
      this.designType = [...data, ...data2]
    },

    disableUserScaling() {
      const metaTag = document.querySelector('meta[name="viewport"]')
      if (metaTag) {
        metaTag.content =
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      }
    },

    initScalc() {
      // 以1920x1080的设计分辨率为例
      var designWidth = 1920
      var designHeight = 1080

      // 调用函数获取缩放比例
      var scaleFactors = this.setScalc(designWidth, designHeight)
      this.scaleFactor = scaleFactors.scaleX
      console.log('缩放比例', scaleFactors.scaleX, scaleFactors.scaleY)
    },
    setScalc(designWidth, designHeight) {
      // 获取当前屏幕宽度和高度
      var screenWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      var screenHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight

      // 计算缩放比例
      var scaleX = screenWidth / designWidth
      var scaleY = screenHeight / designHeight

      // 返回一个包含缩放比例的对象
      return {
        scaleX: scaleX,
        scaleY: scaleY
      }
    },
    // 快捷跳转
    toPath(item) {
      console.log('item', item)
      // 路由跳转
      this.$router.push({
        path: item.dataViewConfId
      })
    },
    // 递归tree  找出所有的 leaf为true 的数据
    recursionTree(data, list = [], permIcon = '', permissions) {
      data.forEach((item) => {
        if (permIcon) {
          item.permIcon = permIcon
        }
        if (item.leaf) {
          if (permissions.includes(item.permCode) && item.permCode !== 'home') {
            list.push(item)
          }
        }
        if (item.children) {
          this.recursionTree(item.children, list, item.permIcon, permissions)
        }
      })
      return list
    },
    /**获取分类字典 */
    async getDESIGNCLASSIFY() {
      const { data } = await getDictItemList('DESIGN_CLASSIFY')
      console.log(data)
      data.map((item) => {
        item.imgsrc = './assets/sgt.png'
        return item
      })
      this.categoryList = data
    },
    /**
     * 环状图
     */
    getChangeDataCount(arr, total) {
      console.log(arr, 'arr')
      let chartDom = document.getElementById('chartContainer1')
      let myChart = echarts.init(chartDom)
      // 定义图表的配置项和数据
      const option = {
        tooltip: {
          trigger: "item",
        },
        title: {
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1D2129',
            textAlign: 'center'
          },
          subtextStyle: {
            fontSize: 14,
            color: '#86909c'
            // lineHeight: 19
          },
          top: 'center',
          left: '27%'
        },
        legend: {
          top: 'center',
          icon: 'circle',
          right: '10',
          orient: 'vertical',
          formatter: (name) => {
            const value = arr.filter((x) => x.name === name)[0].value
            const title = [
              '{name|' +
              (name.length > 11 ? name.substring(0, 10) + '...' : name) +
              '}{value|' +
              value +
              '次}'
            ]
            return title.join('\n')
          },
          textStyle: {
            rich: {
              name: {
                fontSize: 14,
                align: 'left',
                width: 100,
                color: '#4E5969',
                overflow: 'truncate',
                ellipsis: '...'
              },
              value: {
                color: '#1D2129',
                fontSize: 16,
                width: 100,
                align: 'right'
              }
            }
          },
          tooltip: {
            show: true, // 显示悬浮提示
          }
        },
        grid: {
          show: false,
          left: '0%',
          right: '0%',
          containLabel: true
        },
        series: [
          {
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['30%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: "center",
              fontSize: 20,
              fontWeight: "bold",
              formatter: (item) => {
                return `{total| ${total || 0} }\n\r{active|次}`;
              },
              rich: {
                total: {
                  fontSize: 18,
                  fontFamily: "微软雅黑",
                  color: "#1D2129",
                },
                active: {
                  fontFamily: "微软雅黑",
                  fontSize: 14,
                  color: "#86909C",
                  lineHeight: 30,
                  fontWeight: 'normal',
                  textAlign: 'center'
                },
              },
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 3
            },
            data: arr
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表
      myChart.setOption(option)
    },
    getSupplyResult(arr) {
      // 折线图示例
      let chartDom2 = document.getElementById('chartContainer2')
      let myChart2 = echarts.init(chartDom2)

      var option2 = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            var value = params[0].value;
            var name = params[0].name;
            return '<div style=" padding: 10px;">' +
              name + '月' + '<br>' +
              '成果:  <span style="color: #1299FA; font-weight: bold;">' + value + '</span>（次）<br>' +
              '</div>';
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        },
        yAxis: {
          name: '单位：（次）',
          nameLocation: 'end',
          minInterval: 1,
          nameGap: 20,
          axisLabel: {
            margin: 40 // 调整为适当的负数值，使名称与刻度对齐
          }
        },
        series: [
          {
            name: '',
            type: 'line',
            stack: '总量',
            areaStyle: { color: 'transparent' },
            smooth: true,
            itemStyle: {
              color: '#FF7B00'
            },
            emphasis: {
              focus: 'series'
            },
            data: arr
          }
        ]
      }
      myChart2.setOption(option2)
    },
    getChangeCost(arr, min, max) {
      let chartDom = document.getElementById('chartContainer3')
      let myChart = echarts.init(chartDom)
      myChart.resize()
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            var value = params[0].value;
            var name = params[0].name;
            return '<div style=" padding: 10px;">' +
              name + '月' + '<br>' +
              '变更金额:  <span style="color: #1299FA; font-weight: bold;">' + value + '</span> （万元）<br>' +
              '</div>';
          }
        },
        legend: {
          data: ['']
        },
        label: {
          show: false,
          position: 'top',
          color: '#1298FA'
        },
        xAxis: {
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: [{
          name: '单位：（万元）',
          min: min, // 设置 y 轴最小值
          max: max,
          nameLocation: 'end',
          nameGap: 20,
          axisLabel: {
            margin: 40 // 调整为适当的负数值，使名称与刻度对齐
          },
          splitArea: {
            interval: 1 // 设置 splitArea 的 interval 为 1
          }
        }],
        series: [
          {
            type: 'bar',
            barGap: '20%',
            itemStyle: {
              color: '#1299FA' // 柱子的颜色
            },
            barWidth: 16,
            data: arr
          }
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
      }
      myChart.setOption(option)
    },
    getQuerySupply() {
      console.log("getQuerySupply", this.paramsSupply)
      if (!this.paramsSupply?.year) {
        this.$message.warning('请选择年份')
        return
      }
      let year = "";
      if (typeof this.paramsSupply.year === "object") {
        year = this.paramsSupply.year.getFullYear();
      } else {
        year = this.paramsSupply?.year
      }
      let params = {
        year: year,
        type: this.paramsSupply.type || ""
      }
      querySupply(params).then((res) => {
        if (res.success) {
          let arr = []
          res.data.forEach((item) => {
            arr.push(item.total)
          })
          this.getSupplyResult(arr)
        }
      })
    },
    // 设计变更发起次数
    getChangeDataCounts() {
      if (this.radioValue == '1') {
        this.paramsChangeCount = {}
      }
      if (this.radioValue == '2' && !this.paramsChangeCount.condition) {
        this.paramsChangeCount = {
          condition: dateFormat(new Date(), "yyyy-MM")
        }
      }
      getChangeCounts(this.paramsChangeCount).then((res) => {
        if (res.success) {
          let arr = []
          let sum = 0
          res.data.forEach((item) => {
            let obj = {}
            obj.name = item.contractName ? item.contractName : "其他";
            obj.value = item.count
            arr.push(obj)
            sum = sum + Number(item.count)
          })
          console.log(arr)
          this.getChangeDataCount(arr, sum)
        }
      })
    },
    getChangeCostData() {
      if (!this.paramsChangeCosts?.condition) {
        this.$message.warning('请选择年份')
        return
      }
      getChangeCosts(this.paramsChangeCosts).then((res) => {
        if (res.success) {
          let arr = []
          let flag = false
          res.data.resultList.forEach((item) => {
            if (item.total < 0) {
              flag = true
            }
            arr.push(item.total)
          })
          //如果没有负值则不计算正负轴对称
          let absValues = arr.map(item => Math.abs(item)) // 计算数组中每个元素的绝对值
          let maxAbsValue = Math.max(...absValues) // 获取计算后的数组的最大值
          if (flag) {
            this.getChangeCost(arr, -maxAbsValue, maxAbsValue)
          } else {
            this.getChangeCost(arr, 0, maxAbsValue)
          }
          this.yearTotal = res.data.yearTotal
          this.total = res.data.total
          this.$forceUpdate()
        }
      })
    },
    getQueryPlan() {
      queryPlan().then((res) => {
        if (res.success) {
          this.completeinfo.forEach((item) => {
            item.percentage =
              Number(res.data[item.pre]).toString().indexOf('.') > -1
                ? (Number(res.data[item.pre]).toFixed(2))
                : (Number(res.data[item.pre]) ? Number(res.data[item.pre]) : 0)
            item.up =
              Number(res.data[item.up]).toString().indexOf('.') > -1
                ? (Number(res.data[item.up]).toFixed(2))
                : (Number(res.data[item.up]) ? Number(res.data[item.up]) : 0)
          })
          console.log('供应计划完成情况', this.completeinfo)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page-content {
  background-color: rgba(108, 108, 108, 0.1);
  padding: 16px;
  overflow: auto;
  height: 100%;
}

.title-line {
  width: 3px;
  height: 10px;
  background: linear-gradient(322deg, #1298fa 0%, #6fcbff 100%);
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
}

.item-title {
  font-size: 18px;
  color: #1d2129;
  font-weight: 700;
}

.divider-line {
  background: #e5e6eb;
  height: 1px;
}

.component-divider-line {
  border: 1px solid #e5e6eb;
  height: 0;
  width: 100%;
}

.h-442 {
  height: 442px;
}

.rounded-8 {
  border-radius: 8px;
}

.pointer:hover {
  transform: scale(1.1);
  z-index: 1;
  position: relative;
}

.todo-empty {
  /deep/ img {
    width: 100%;
    height: 100%;
  }

  /deep/ .el-empty__description {
    margin-top: 20px;
    color: #98a9ba;
    font-size: 12px;
  }
}

.container {
  display: flex;
  /* 将容器设置为 Flexbox 布局 */
  justify-content: space-between;
  /* 设置子元素的水平对齐方式为两端对齐 */
}

.content-line {
  margin: 0 60px;
  /* 设置左右间距为 60px */
  flex-grow: 1;
  border-right: 3px dashed #1298fa;
  width: 3px;
  height: calc(100% - 36px - 10px);
}

.change-item-1 {
  background: linear-gradient(322deg, #1298fa 0%, #6fcbff 100%);
  box-shadow: 0px 4px 8px 0px rgba(49, 167, 252, 0.26);
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
}

.change-item-2 {
  background: linear-gradient(180deg, #6c84f8 0%, #b1c2ff 100%);
  box-shadow: 0px 4px 8px 0px rgba(127, 150, 250, 0.25);
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
}

.box {
  display: flex;
  flex-direction: column;

  .content-box {
    flex: 1;
  }
}

.supplyPlan-content {
  height: calc(100% - 31px);
  padding: 24px 0 16px 0;
}

.designResult-content {
  height: calc(100% - 31px);
  padding: 12px 0 0 0;

  #chartContainer2 {
    height: calc(100% - 36px - 12px);
  }
}

.num-content {
  height: calc(100% - 31px);

  #chartContainer1 {
    height: calc(100% - 36px - 12px);
  }
}

.analyse-item {
  margin-right: 20px;
  background-color: #f9f9f9;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.08);

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  .title {
    font-size: 14px;
    font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
    color: #4e5969;
    padding-right: 12px;
    width: 103px;
  }

  .progress {
    flex: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;

    >div:first-child {
      font-size: 12px;
      font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
      color: #c9cdd4;

      span {
        font-size: 20px;
        font-family: Roboto, Roboto;
        font-weight: 500;
        color: #1d2129;
      }
    }
  }

  .compare {
    span {
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 500;
      color: #000000;
    }

    div {
      font-size: 12px;
      font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
      color: #c9cdd4;
    }
  }
}
</style>
