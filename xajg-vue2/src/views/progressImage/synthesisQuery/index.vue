<template>
  <div class="w-100pre h-100pre main-page">
    <div class="pbsBox flex pb-16">
      <div
        v-for="item in belongProjects"
        :key="item.id"
        class="h-36 rounded-4 mr-16 line-36 px-15 cursor-pointer"
        :class="{ activePbs: item.id === curBelongProject.id }"
        @click="belongProjectClick(item)"
      >
        {{ item.belongProject }}
      </div>
    </div>
    <div class="searchBox pt-16">
      <el-form :inline="true">
        <el-form-item label="施工类型">
          <el-select placeholder="施工类型" v-model="chartForm.constructionType" style="width: 250px">
            <el-option v-for="item in constructionTypeOptions" :key="item.COLUMN_NAME" :label="item.COLUMN_COMMENT"
                       :value="item.COLUMN_NAME"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="筛选部位">
          <el-cascader :props="{
                            label:'name',
                            value:'id',
                            leaf:'leaf',
                            emitPath:false,
                            multiple: true,
                          }"
                       style="width: 330px"
                       placeholder="筛选部位"
                       :show-all-levels="false"
                       filterable
                       clearable
                       collapse-tags
                       v-model="chartForm.pbsIdList"
                       :options="pbsOptions"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="月份">
          <el-date-picker
            style="width: 250px"
            type="month"
            placeholder="选择月"
            :clearable="false"
            v-model="chartForm.month"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handelSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="chartBox h-344 flex">
      <div id="bar"/>
      <div id="line"/>
      <div id="pie"/>
    </div>
    <div class="tableBox">
      <div class="pt-16">
        <el-form :inline="true">
          <!--          <el-form-item label="类型">-->
          <!--            <el-select placeholder="施工类型" v-model="tableForm.SGLX">-->
          <!--              <el-option label="区域一" value="shanghai"></el-option>-->
          <!--              <el-option label="区域二" value="beijing"></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="月份">-->
          <!--            <el-date-picker-->
          <!--              type="month"-->
          <!--              placeholder="选择月"-->
          <!--              v-model="tableForm.month"-->
          <!--            >-->
          <!--            </el-date-picker>-->
          <!--          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="exportMonthStatList">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <table-layout>
        <template slot="table">
          <el-table ref="multipleTable" :data="tableData" border>
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
            />
            <el-table-column
              label="工程部位"
              prop="PBS_NAME"
              align="center"
              width="150"
            />
            <el-table-column v-for="item in constructionTypeOptions" :label="item.COLUMN_COMMENT" align="center"
                             width="250"
            >
              <el-table-column
                label="计划总工程量"
                :prop="item.COLUMN_NAME+'_DESIGN'"
                align="center"
                width="150"
              >
                <template slot-scope="{ row }">
                  {{ row[item.COLUMN_NAME + '_DESIGN'] ? row[item.COLUMN_NAME + '_DESIGN'] : '-' }}
                </template>
              </el-table-column>
              <el-table-column
                label="当前完成工作量"
                :prop="item.COLUMN_NAME+'_ACTUAL'"
                align="center"
                width="150"
              >
                <template slot-scope="{ row }">
                  {{ row[item.COLUMN_NAME + '_ACTUAL'] ? row[item.COLUMN_NAME + '_ACTUAL'] : '-' }}
                </template>
              </el-table-column>
            </el-table-column>


            <el-table-column label="操作" align="center" fixed="right">
              <template #default="{ row }">
                <el-link type="primary" plain @click="view(row)">
                  查看
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </table-layout>
    </div>

    <el-dialog
      :title="dialogTitle"
      custom-class="wbench-el-dialog"
      :visible.sync="dialogShow"
      :destroy-on-close="true"
      v-draggable
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      width="50%"
      @closed="closedHandle"
    >
      <el-table ref="multipleDayTable" :data="dayTableData" border>
        <el-table-column
          label="施工日期"
          prop="DAY_OF_MONTH"
          align="center"
          min-width="150"
        />
        <el-table-column
          :label="item.COLUMN_COMMENT"
          v-for="item in constructionTypeOptions"
          :prop="item.COLUMN_NAME"
          align="center"
          width="190"
        >
          <template slot-scope="{ row }">
            {{ row[item.COLUMN_NAME] ? row[item.COLUMN_NAME] : '-' }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import ListButton from '@/components/ListButton'
import TableLayout from '@/components/ContentLayout/Table'
import moment from 'moment'
import {
  constructionType,
  dayCompare,
  getConfigureList,
  monthDayStatList,
  monthStatList,
  quantitiesCompare
} from '@/views/progressImage/synthesisQuery/api';
import { getPbsTree } from '@/views/progressImage/actualQuantities/api';

export default {
  components: { TableLayout, ListButton },
  data() {
    return {
      dialogTitle: '工程量月报表',
      dialogShow: false,
      curBelongProject: {},
      belongProjects: [],
      constructionTypeList: [],
      constructionTypeOptions: [],
      pbsOptions: [],
      BarChart: null,
      LineChart: null,
      PieChart: null,
      chartForm: {
        designConfigureId: '',
        constructionType: '',
        pbsIdList: [],
        month: ''
      },
      tableForm: {},
      tableData: [],
      dayTableData: []
    }
  },
  async created() {
    this.chartForm.month = new Date();
    await this.getConstructionType();
    await this.getBelongProject();
    await this.getChartData();
    await this.getTableData();
  },
  mounted() {

  },
  computed: {
    typeTitle() {
      let option = this.constructionTypeOptions.find(x => x.COLUMN_NAME === this.chartForm.constructionType)
      let index = -1;
      index = option.COLUMN_COMMENT.indexOf('(') > -1 ? option.COLUMN_COMMENT.indexOf('(') : index;
      index = option.COLUMN_COMMENT.indexOf('（') > -1 ? option.COLUMN_COMMENT.indexOf('（') : index;
      return option ? (index > -1 ? option.COLUMN_COMMENT.substring(0, index) : option.COLUMN_COMMENT) : '';
    },
    typeUnit() {
      let option = this.constructionTypeOptions.find(x => x.COLUMN_NAME === this.chartForm.constructionType)
      let index, endIndex = -1;
      index = option.COLUMN_COMMENT.indexOf('(') > -1 ? option.COLUMN_COMMENT.indexOf('(') : index;
      endIndex = option.COLUMN_COMMENT.indexOf(')') > -1 ? option.COLUMN_COMMENT.indexOf(')') : endIndex;
      index = option.COLUMN_COMMENT.indexOf('（') > -1 ? option.COLUMN_COMMENT.indexOf('（') : index;
      endIndex = option.COLUMN_COMMENT.indexOf('）') > -1 ? option.COLUMN_COMMENT.indexOf('）') : endIndex;
      return option && index > -1 && endIndex > -1 ? option.COLUMN_COMMENT.substring(index + 1, endIndex) : '';
    }
  },
  methods: {
    exportMonthStatList() {
      if (this.tableData.length === 0) {
        this.$message.warning('暂无数据！');
        return
      }
      console.log('exportMonthStatList')
      let excelColumns = []
      this.constructionTypeOptions.forEach(x => {
        excelColumns.push({
          label: x.COLUMN_COMMENT,
          prop: x.COLUMN_NAME
        })
      })
      const params = Object.assign({}, this.chartForm)
      if (params.month) params.month = moment(params.month).format('YYYY-MM')
      params.columns = excelColumns
      let exportParams = {
        url: '/api/imageStat/export',
        params: params,
        filename: '工程量月报表'
      };
      console.log('handleExport', exportParams);
      this.$handleExport(
        exportParams.url,
        exportParams.params,
        exportParams.filename
      );
    },
    closedHandle() {
      this.dialogShow = false;
    },
    handelSearch() {
      this.getChartData();
      this.getTableData();
    },
    /** 获取施工类型 */
    async getConstructionType() {
      const { data } = await constructionType();
      if (data) {
        this.constructionTypeList = data;
      }
      console.log('constructionTypeList', this.constructionTypeList);
    },
    /** 所属工程列表 */
    async getBelongProject() {
      const { data } = await getConfigureList();
      if (data) {
        this.belongProjects = data;
        this.curBelongProject = data[0];
        await this.initSearch();
      }
      console.log('belongProjects', this.belongProjects);
    },
    /**
     * @description 切换所属工程
     */
    async belongProjectClick(item) {
      this.curBelongProject = item;
      await this.initSearch();
      await this.handelSearch();
    },
    /** 查询项变化 */
    async initSearch() {
      this.chartForm.designConfigureId = this.curBelongProject.id;
      this.constructionTypeOptions = this.constructionTypeList.filter(x => this.curBelongProject.quantityTarget.split(',').includes(x.COLUMN_NAME));
      this.chartForm.constructionType = this.constructionTypeOptions[0].COLUMN_NAME;
      const { data } = await getPbsTree({ id: this.curBelongProject.pbsId });
      this.setIsChild(data)
      this.pbsOptions = data
    },
    setIsChild(data) {
      data.forEach(item => {
        if (item.children && item.children.length === 0) {
          item.children = ''
        } else {
          this.setIsChild(item.children)
        }
      });
    },
    /**
     * @description 获取图表数据
     */
    getChartData() {
      const params = Object.assign({}, this.chartForm)
      if (params.month) params.month = moment(params.month).format('YYYY-MM')
      this.initChart(params)
    },
    /**
     * @description 初始化
     */
    async initChart(params) {
      let quantitiesCompareRes = await quantitiesCompare(params);
      let quantitiesCompareData = quantitiesCompareRes.success && quantitiesCompareRes.data ? quantitiesCompareRes.data : [];
      let dayCompareRes = await dayCompare(params);
      let dayCompareData = dayCompareRes.success && dayCompareRes.data ? dayCompareRes.data : [];
      console.log(quantitiesCompareData, dayCompareData)
      let chartBarData = {
        yAxis: [],
        series1: [],
        series2: []
      };
      let chartPieData = [
        { value: 0, name: '累计完成量' },
        { value: 0, name: '剩余完成量' }
      ];
      if (quantitiesCompareData) {
        quantitiesCompareData.forEach(x => {
          chartBarData.yAxis.push(x.PBS_NAME);
          chartBarData.series1.push(x.ACTUAL_TOTAL);
          chartBarData.series2.push(x.PENDING_TOTAL < 0 ? 0 : x.PENDING_TOTAL);
          chartPieData[0].value += Number(x.ACTUAL_TOTAL);
          chartPieData[1].value += Number(x.PENDING_TOTAL < 0 ? 0 : x.PENDING_TOTAL);
        })
      }
      console.log(chartPieData, 'chartPieData')
      let chartLineData = {
        xAxis: [],
        series1: [],
        series2: []
      };
      if (dayCompareData) {
        dayCompareData.forEach(x => {
          chartLineData.xAxis.push(x.DAY_OF_MONTH);
          chartLineData.series1.push(x.ACTUAL_TOTAL);
          chartLineData.series2.push(x.SUM_TOTAL);
        })
      }
      const thiss = this;
      const chartBarDom = document.getElementById('bar')
      const chartLineDom = document.getElementById('line')
      const chartPieDom = document.getElementById('pie')
      this.BarChart = echarts.init(chartBarDom)
      this.LineChart = echarts.init(chartLineDom)
      this.PieChart = echarts.init(chartPieDom)
      const BarOption = {
        title: {
          text: this.typeTitle + '施工进度',
          left: 'center',
          bottom: '5%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        color: ['#FDBA5C', '#3A82FF'],
        legend: {
          left: 'center',
          bottom: '15%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '25%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
          // boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: chartBarData.yAxis
        },
        series: [
          {
            name: '本月实际完成量',
            type: 'bar',
            stack: 'total',
            barWidth: 14,
            data: chartBarData.series1
          },
          {
            name: '待完成量',
            barWidth: 14,
            type: 'bar',
            stack: 'total',
            data: chartBarData.series2
          }
        ]
        // dataZoom: [
        //   {
        //     type: 'slider',
        //     startValue: 0, // 控制从第一个开始
        //     endValue: 10, // 到第几个（默认一页展示多少个 0-10 11条）
        //     // height: '100%',
        //     width: 4,
        //     left: 0,
        //     top: '10%',
        //     bottom: '25%',
        //     brushSelect: false,
        //     yAxisIndex: [0, 1], // 控制y轴滚动对象
        //     fillerColor: '#1298FA', // 滚动条颜色
        //     borderColor: 'rgba(0, 0, 0, 0.12)',
        //     backgroundColor: 'rgba(0, 0, 0, 0.12)', // 两边未选中的滑动条区域的颜色
        //     handleSize: 0, // 两边手柄尺寸
        //     showDataShadow: false, // 是否显示数据阴影 默认auto
        //     showDetail: false, // 拖拽时是否展示滚动条两侧的文字
        //     zoomLock: true,
        //     moveHandleStyle: {
        //       opacity: 0
        //     }
        //   },
        //   {
        //     type: 'inside',
        //     startValue: 0,
        //     endValue: 10,
        //     minValueSpan: 10,
        //     xAxisIndex: [0],
        //     zoomOnMouseWheel: false, // 关闭滚轮缩放
        //     moveOnMouseWheel: false, // 开启滚轮平移
        //     moveOnMouseMove: true // 鼠标移动能触发数据窗口平移
        //   }
        // ]
      }

      const LineOption = {
        title: {
          text: '每日' + this.typeTitle + '施工工程量',
          left: 'center',
          bottom: '5%'
        },
        color: ['#FDBA5C', '#3A82FF'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['当日实际完成量', '实际累计完成量'],
          left: 'center',
          bottom: '15%'
        },
        grid: {
          left: '10%',
          right: '4%',
          bottom: '30%',
          top: '10%'
        },
        xAxis: [
          {
            type: 'category',
            data: chartLineData.xAxis,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '(' + this.typeUnit + ')',
            min: 0

          }
        ],
        series: [
          {
            name: '当日实际完成量',
            type: 'bar',
            tooltip: {
              valueFormatter: function(value) {
                return value + thiss.typeUnit
              }
            },
            data: chartLineData.series1
          },
          {
            name: '实际累计完成量',
            type: 'line',
            tooltip: {
              valueFormatter: function(value) {
                return value + thiss.typeUnit
              }
            },
            data: chartLineData.series2
          }
        ]
      }
      const PieOption = {
        title: {
          text: this.typeTitle + '施工总工程量',
          left: 'center',
          bottom: '5%'
        },
        tooltip: {
          trigger: 'item'
        },
        color: ['#FCC59F', '#1AD2CE'],
        legend: {
          orient: 'horizontal',
          left: 'center',
          bottom: '15%'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '50%'],
            center: ['50%', '40%'],
            data: chartPieData,
            label: {
              formatter: `{name|{c}` + this.typeUnit + `} \n {value|{d}%}`,
              rich: {
                name: {
                  fontSize: 20,
                  color: '#111',
                  lineHeight: 22
                },
                value: {
                  fontSize: 20,
                  color: '#111',
                  lineHeight: 22
                }
              }
            }
          }
        ]
      }
      this.BarChart.setOption(BarOption)
      this.LineChart.setOption(LineOption)
      this.PieChart.setOption(PieOption)
      window.addEventListener('resize', () => {
        this.BarChart.resize()
        this.LineChart.resize()
        this.PieChart.resize()
      })
    },
    /**
     * @description 获取表格数据
     */
    async getTableData() {
      const params = Object.assign({}, this.chartForm)
      if (params.month) params.month = moment(params.month).format('YYYY-MM')
      console.log(params, '参数')
      let res = await monthStatList(params);
      if (res.success) {
        this.tableData = res.data;
      }
    },
    /**
     * @description 查看
     */
    async view(row) {
      const params = Object.assign({}, this.chartForm)
      if (params.month) params.month = moment(params.month).format('YYYY-MM')
      params.pbsIdList = [row.PBS_ID];
      console.log(params, '参数')
      let res = await monthDayStatList(params);
      if (res.success) {
        this.dayTableData = res.data;
      }
      this.dialogShow = true;
      this.dialogTitle = row.PBS_NAME + '工程量月报表';
    }
  }
}
</script>
<style lang="scss" scoped>
.main-page {
  overflow-y: auto;
  padding: 24px 32px !important;

  .pbsBox {
    overflow-x: auto;
    overflow-y: hidden;
    border-bottom: 1px solid #e5e6eb;
    flex-wrap: nowrap;

    > div {
      background: #e6f9ff;
      font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
      font-weight: normal;
      font-size: 16px;
      color: #1298fa;
    }

    .activePbs {
      background: #1298fa;
      color: #ffffff;
    }
  }

  .searchBox {
    border-bottom: 1px solid #e5e6eb;
  }

  .chartBox {
    border-bottom: 1px solid #e5e6eb;

    > div {
      width: calc(100% / 3);
    }
  }

  .tableBox {
    /deep/ .table-content {
      .el-table {
        .el-table__header-wrapper {
          .gutter {
            background-color: white;
            border: none;
          }
        }
      }
    }

    /deep/ .pagination-container {
      display: none;
    }
  }
}

/deep/ .el-cascader__search-input {
  min-width: 10px !important;
  //margin: 1px !important;
}
</style>
