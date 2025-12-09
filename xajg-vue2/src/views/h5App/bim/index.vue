<template>
  <div class="appbim" style="height: 100%;overflow-y: hidden">
    <div style="height: calc(100% - 210px)">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane v-for="pbs in pbsList" :key="pbs.code" :label="pbs.name" :name="pbs.code">
          <div class="tabsLabelSlot" :class="pbs.class" slot="label">
            <p v-if="pbs.name.length <= 6">{{ pbs.name }}</p>
            <p v-if="pbs.name.length > 6">{{ pbs.name.substring(0, 6) }}</p>
            <p v-if="pbs.name.length > 6">{{ pbs.name.substring(6) }}</p>
          </div>
        </el-tab-pane>
      </el-tabs>
      <bim-engine ref="bimEngine" :cid="bimconfig.id" v-if="modelIds.length > 0"
        :filterLoadModelHandle="filterLoadModelHandle" :showfps="false"></bim-engine>
    </div>
    <div id="chartContainer-qt" class="chartContainer-qt h-100pre w-100pre" :style="{ zoom: 1 / scaleFactor }">
    </div>
  </div>
</template>

<script>
import { bimconfig } from "@/config/bimconfig";
import BimEngine from "@/components/BimEngine/index";
import config from "@/utils/config";
import * as api from "./api";
import { appBimStat } from './api';
import * as echarts from 'echarts';

export default {
  name: "h5App-bim-index",
  components: {
    BimEngine,
  },
  data() {
    let _bimconfig = bimconfig.find((x) => x.use) || {};
    console.log("_bimconfig", _bimconfig, bimconfig)
    return {
      /**bim相关参数 */
      bimconfig: _bimconfig,
      scaleFactor: 1,

      activeName: "dldsyb,dldxyb",

      pbsList: [{
        code: "dldsyb,dldxyb",
        name: "导流洞",
        class: "one",
        modelIds: []
      }, {
        code: "MDGK01",
        name: "跨江桥梁及其连接道路工程",
        class: "",
        modelIds: []
      }, {
        code: "yajt",
        name: "右岸交通及自然边坡治理",
        class: "",
        modelIds: []
      }, {
        code: "zajt",
        name: "左岸交通及自然边坡治理",
        class: "",
        modelIds: []
      }],

      //模型id
      modelIds: []
    };
  },
  props: {

  },
  created() {
    this.getPieData();
  },
  async beforeCreate() {
    //初始化前端参数
    await config.init();

    let modelids = [];
    let codes = this.pbsList.map(x => x.code).join(",");
    api.getByCodes(codes).then(res => {
      console.log("getByCodes", res)
      if (res.success) {
        for (let i = 0; i < res.data.length; i++) {
          const pbs = res.data[i];
          modelids.push(...pbs.modelIds);

          for (let k = 0; k < this.pbsList.length; k++) {
            let pbsitem = this.pbsList[k];
            if (pbs.code === pbsitem.code) {
              pbsitem.modelIds = pbs.modelIds;
              break;
            }
          }
        }
      }
      this.modelIds = modelids;
    })
  },
  computed: {},
  watch: {

  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      console.log(this.activeName);
      for (let i = 0; i < this.pbsList.length; i++) {
        const pbsitem = this.pbsList[i];

        // this.$refs.bimEngine.setModelVisible();
      }

      this.getPieData()
    },
    filterLoadModelHandle(modelname, modelid, dataid) {
      if (this.modelIds.includes(modelid)) {
        return true;
      }
      return false;
    },
    async getPieData() {

      let res = await appBimStat(this.activeName);
      console.log(res)
      if (res.success) {
        let arr = []
        let sum = 0
        res.data.forEach((item) => {
          let obj = {}
          obj.name = item.NAME;
          obj.value = item.COUNT
          arr.push(obj)
          sum = sum + Number(item.COUNT)
        })
        this.initPie(arr, sum)
      }

    },
    /** 统计饼图 */
    initPie(arr, total) {
      console.log(arr, 'arr')
      let chartDom = document.getElementById('chartContainer-qt')
      let myChart = echarts.init(chartDom)
      // 定义图表的配置项和数据
      const option = {
        backgroundColor: '#092249',
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
              '}{percent|' +
              Number(value / total * 100).toFixed(1) +
              '%}{value|' +
              value +
              '}'
            ]
            return title.join('\n')
          },
          textStyle: {
            rich: {
              name: {
                fontSize: 10,
                align: 'left',
                width: 80,
                color: '#5d7eb0',
                overflow: 'truncate',
                ellipsis: '...'
              },
              percent: {
                color: '#5d7eb0',
                fontSize: 10,
                width: 20,
                align: 'right'
              },
              value: {
                color: '#fff',
                fontSize: 10,
                width: 30,
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
            radius: ['40%', '50%'],
            center: ['20%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: "center",
              fontSize: 20,
              fontWeight: "bold",
              formatter: (item) => {
                return `{total| ${total || 0} }\n\r{active|总数}`;
              },
              rich: {
                total: {
                  fontSize: 30,
                  fontFamily: "微软雅黑",
                  color: "#ffffff",
                },
                active: {
                  fontFamily: "微软雅黑",
                  fontSize: 12,
                  color: "#cbcbcb",
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
              borderColor: '#092249',
              borderWidth: 3
            },
            data: arr
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表
      myChart.setOption(option)
    },
  },
};
</script>

<style scoped lang="scss">
.tabsLabelSlot {
  display: inline-grid;
  line-height: 18px;
  max-width: 85px;
  text-align: left;
  vertical-align: middle;
  justify-items: center;
}

.appbim {
  margin: 0 15px !important;
}

.chartContainer-qt {
  width: 100%;
  height: 210px;
}

/deep/ .el-tabs__item {
  height: auto;
}
</style>
