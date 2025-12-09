<template>
  <!--  <div class="page-list">-->
  <!--    <el-row style="height: 100%">-->
  <!--      <el-col :span="4">-->
  <!--        <el-tree-->
  <!--          :data="typeOptions"-->
  <!--          :props="defaultProps"-->
  <!--          :expand-on-click-node="false"-->
  <!--          ref="tree"-->
  <!--          node-key="corpId"-->
  <!--          default-expand-all-->
  <!--          highlight-current-->
  <!--          @node-click="handleNodeClick"-->
  <!--        />-->
  <!--      </el-col>-->
  <!--      <el-col :span="10" style="height: 100%">-->
  <!--        <div>待办数量统计</div>-->
  <!--        <div id="todoBar" class="h-100pre w-100pre"></div>-->
  <!--      </el-col>-->
  <!--      <el-col :span="10" style="height: 100%">-->
  <!--        <div>任务停留时长</div>-->
  <!--        <div id="hourBar"  class="h-100pre w-100pre"></div>-->
  <!--      </el-col>-->
  <!--    </el-row>-->

  <!--  </div>-->
  <div
    id="office-home"
    class="w-100pre h-100pre box"
    :style="{ zoom: scaleFactor }"
  >
    <div class="h-100pre bg-fff" style="width: 20%;margin-right: 16px;padding: 8px;border-radius: 5px">
      <el-tree
        :data="typeOptions"
        :props="defaultProps"
        :expand-on-click-node="false"
        ref="tree"
        node-key="corpId"
        default-expand-all
        highlight-current
        @node-click="handleNodeClick"
      />
    </div>

    <!-- 待办数量统计 -->
    <div class="h-100pre bg-fff ReceiveSend" style="width: 40%;padding: 8px;border-radius: 5px">
      <TopTitle title="待办数量统计"/>
      <!--      <div v-show="todoShowEmpty" class="noData h-100pre w-100pre">-->
      <!--        <img :src="require('@/assets/img/office/noData.png')" />-->
      <!--        <span>暂无数据</span>-->
      <!--      </div>-->
      <div id="todoBar" class="h-100pre w-100pre"/>
    </div>
    <!-- 任务停留时长 -->
    <div class="h-100pre bg-fff ReceiveSend" style="width: 40%;padding: 8px;border-radius: 5px">
      <TopTitle title="任务停留时长"/>
      <!--        <div v-show="showEmpty" class="noData">-->
      <!--          <img :src="require('@/assets/img/office/noData.png')" />-->
      <!--          <span>暂无数据</span>-->
      <!--        </div>-->
      <div id="hourBar" class="h-100pre w-100pre"/>
    </div>
  </div>


</template>

<script>

import { getDictItemList, getCorporatesTree } from '@/api/dict';
import * as echarts from 'echarts';

import TopTitle from '@/components/TopTitle/index.vue';
import { todoStat, hourStat } from '@/views/office/todoStat/api';

export default {
  name: 'monitoring-point',
  mixins: [],
  components: {
    TopTitle
  },
  data() {
    return {
      scaleFactor: 1, // 默认缩放比例为 1
      belongUnit: [], //登陆人的归宿单位
      treeNode: {}, //点击树节点传递给子组件使用
      type: '',
      defaultProps: {
        children: 'children',
        label: 'corpName'
      },
      /**组织机构选择 */
      deptShow: false,
      typeDictMap: [],
      typeOptions: [],
      excludeOptionNames: [],
      userId: '',
      corpIds: '',
      todoOption: {},
      todoData: [],
      todoShowEmpty: true,
      hourOption: {},
      hourData: [],
      hourShowEmpty: true
    };
  },
  computed: {},
  created() {

  },
  async mounted() {
    // 监听屏幕变化
    window.addEventListener('resize', this.initScalc)
    this.$nextTick(() => {
      this.initScalc()
    })

    await this.getTypeDictMap();
    this.corpIds = this.typeOptions[0].children.map(item => item.corpId).join(',');
    this.getTodoData();
    this.getHourData();

  },
  methods: {
    getTodoData() {
      this.todoData = []
      this.todoOption = {}
      this.todoShowEmpty = true

      todoStat({ corpIds: this.corpIds }).then((res) => {
        if (res.success && res.data) {
          this.todoData = [...res.data].reverse();
          this.todoShowEmpty = false;
          let yAxisData = [];
          let seriesData = [];
          res.data.forEach(item => {
            yAxisData.unshift(item.REAL_NAME.length>4?(item.REAL_NAME.substr(0,4)+'...'):item.REAL_NAME);
            seriesData.unshift(item.TODO_COUNT);
          })
          let thiss = this;
          this.todoOption = {
            tooltip: {
              trigger: 'axis',
                axisPointer: {
                type: 'shadow'
              },
              formatter: function(params) {
                let data = thiss.todoData[params[0].dataIndex]
                return `<div class="custom-tooltip-style">
                          <span>${data.REAL_NAME}</span></br>
                          <div class="span">
                            <span>待办数量：</span>
                            <span>${data.TODO_COUNT}</span>
                          </div>
                        </div>`;
              }
            },
            dataZoom: [{
              type: 'inside',
              yAxisIndex: 0,
              start: 90,
              end: 100
            }, {
              show: true,
              yAxisIndex: 0,
              filterMode: 'empty',
              width: 10,
              height: '80%',
              showDataShadow: false,
              left: '93%'
            }],
              xAxis: {
            type: 'value'
          },
            yAxis: {
              type: 'category',
                data: [],
                splitLine: {
                show: false
              },
              axisTick: {
                show: false
              }
            },
            series: [{
              type: 'bar',
              name: '待办数量',
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: 'insideRight', //在上方显示
                    textStyle: { //数值样式
                      color: '#FFFFFF',
                      fontSize: 14,
                      fontWeight: 600
                    }
                  }
                }
              },
              data: []
            }]
          }
          this.todoOption.yAxis.data = yAxisData
          this.todoOption.series[0].data = seriesData

          let todoBar = document.getElementById('todoBar');
          let todoChart = echarts.init(todoBar);
          todoChart.setOption(this.todoOption);
          todoChart.on('click', function(params) {
            console.log('点击了柱状图:', thiss.todoData[params.dataIndex]);
            thiss.userId = thiss.todoData[params.dataIndex].USER_ID;
            thiss.getHourData();
          });
        }
      })
    },

    getHourData() {
      this.hourData = []
      this.hourOption = {}
      this.hourShowEmpty = true

      hourStat({ corpIds: this.corpIds, userId: this.userId }).then((res) => {
        if (res.success && res.data) {

          this.hourShowEmpty = false;
          let yAxisData = [];
          let seriesData = [];
          res.data.forEach(item => {
            yAxisData.unshift(item.REAL_NAME.length>4?(item.REAL_NAME.substr(0,4)+'...'):item.REAL_NAME);
            // yAxisData.unshift(item.REAL_NAME);
            let hours = this.getHoursBetweenDates(item.CREATE_TIME, new Date().getTime());
            seriesData.unshift(hours);
            item.HOUR_STR = Math.floor(hours / 24) + '天' + hours % 24 + '小时';
          })
          this.hourData = [...res.data].reverse();

          let thiss = this;
          this.hourOption = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              formatter: function(params) {
                let data = thiss.hourData[params[0].dataIndex]
                return `<div class="custom-tooltip-style">
                          <span>${data.TODO_TITLE}</span></br>
                          <div class="span">
                            <span>停留时长：</span>
                            <span>${data.HOUR_STR}</span>
                          </div>
                        </div>`;
              }
            },
            xAxis: {
              type: 'value',
              name: '小时',
            },
            yAxis: {
              type: 'category',
              data: [],
              splitLine: {
                show: false
              },
              axisTick: {
                show: false
              }
            },
            series: [{
              type: 'bar',
              name: '',
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    formatter: function(params) {
                      if (params.data > 1200) {
                        let data = thiss.hourData[params.dataIndex]
                        return data.HOUR_STR;
                      } else {
                        return '';
                      }
                    },
                    position: 'insideRight', //在上方显示
                    textStyle: { //数值样式
                      color: '#FFFFFF',
                      fontSize: 14,
                      fontWeight: 600
                    }
                  }
                }
              },
              data: []
            }]
          }

          this.hourOption.yAxis.data = yAxisData
          this.hourOption.series[0].data = seriesData

          let hourBar = document.getElementById('hourBar');
          let hourChart = echarts.init(hourBar);

          hourChart.setOption(this.hourOption);
        }
      })
    },
    getHoursBetweenDates(date1Millis, date2Millis) {
      const oneDay = 24; // 每天小时数
      const millisecondsPerHour = 3600000; // 1小时的毫秒数

      // 计算两个日期之间的毫秒差值
      const difference = Math.abs(date2Millis - date1Millis);

      // 将差值转换为小时
      const hoursBetween = difference / millisecondsPerHour;

      // 返回结果，可能需要取整
      return Math.floor(hoursBetween);
    },
    /* 获取字典 */
    async getTypeDictMap() {
      const { data } = await getCorporatesTree();
      let sortData = data;
      if (data && Array.isArray(data) && data.length > 0) {
        data[0].children?.sort((a, b) => {
          return a.corpSort - b.corpSort;
        }) || [];
      }
      // this.typeDictMap = sortData;
      //获取字典
      this.excludeOptionNames = [];
      const gldwmc = await getDictItemList('gldwmc');
      for (let i = 0; i < gldwmc.data.length; i++) {
        this.excludeOptionNames.push(gldwmc.data[i].dictName);
      }
      sortData[0].children = sortData[0].children.filter(item => !this.excludeOptionNames.includes(item.corpName));
      this.typeOptions = sortData;
    },

    handleNodeClick(data) {
      if (data.children.length === 0) {
        this.corpIds = data.corpId;
      } else {
        this.corpIds = this.typeOptions[0].children.map(item => item.corpId).join(',');
      }
      this.getTodoData();
      this.userId = '';
      this.getHourData();
    },

    getTypeDictName(id) {
      for (let item of this.typeDictMap) {
        if (item.dictId === id) {
          return item.dictName;
        }
      }
    },

    /**获取字典 */
    async getJCXM() {
      const { data } = await getDictItemList('pxzllx');
      this.DitSpeciality = data;
      this.typeDictMap = data;
    },
    initScalc() {
      // 以1920x1080的设计分辨率为例
      var designWidth = 1920
      var designHeight = 1080

      // 调用函数获取缩放比例
      var scaleFactors = this.setScalc(designWidth, designHeight)
      this.scaleFactor = scaleFactors.scaleX
      // console.log('缩放比例', scaleFactors.scaleX, scaleFactors.scaleY)
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
    }
  }
};
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;
  height: 100%;
  padding: 15px;
}

.el-col .el-input {
  width: 60%;
}

/deep/ .el-range-editor--small .el-range-input {
  font-size: 12px;
}

.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}
</style>
<style scoped lang="scss">
// el-tree 选中项背景颜色
::v-deep
.el-tree--highlight-current
.el-tree-node.is-current
> .el-tree-node__content {
  // 设置颜色
  background-color: #e6f9ff; // 背景色
  font-weight: bold; // 字体加粗

  .el-tree-node__label {
    color: #1298fa; // 节点的字体颜色
  }
}

// el-tree 悬浮样式
::v-deep .el-tree-node__content:hover {
  .el-tree-node__label {
    color: #5bacf8;
  }

  background-color: #e8f9ff;
}

// el-tree 鼠标聚焦样式
::v-deep .el-tree-node:focus > .el-tree-node__content {
  background-color: #ffffff;
}

/deep/ .el-range-editor--medium .el-range-input {
  font-size: 12px;
}

#office-home {
  background-color: #F7F8FA;
  height: 100%;
  display: flex;

  .ReceiveSend {

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
      height: calc(100% - 140px);
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
}
</style>
