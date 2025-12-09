<template>
  <div class="side-frame" @contextmenu.prevent="">
    <a-card :bordered="false">
      <a-table id="table1" :columns="columns" :data-source="data" bordered :showHeader="false" :pagination="false">
        <template slot="name" slot-scope="text">
          <a>{{ text }}</a>
        </template>
        <template slot="title"> 操作指南 </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
const columns = [
  {
    dataIndex: 'name',
  },
  {
    dataIndex: 'money',
  },
]

const data = [
  {
    key: '1',
    name: '鼠标左键按住剖面框中心箭头线',
    money: '拖动可平移剖面框，移出剖面框的部分将被剖切掉',
  },
  {
    key: '2',
    name: '鼠标左键按住剖面框中心箭头线之间的弧线',
    money: '拖动可旋转剖面框，移出剖面框的部分将被剖切掉',
  },
  {
    key: '3',
    name: '鼠标滚轮按住剖面框的一个面',
    money: '拖动可沿该面法向量方向剖切模型',
  },
]

export default {
  props: {
    projectMessage: {
      type: Object,
      default: undefined,
    },
    openCut: {
      type: Object,
      default: undefined,
    },
    changeOpenCut: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      data,
      columns,
      clip: {},
    }
  },
  mounted() {
    const that = this
    if (Object.keys(that.openCut).length > 0) {
      that.clip = that.openCut
      that.openCut.SetVisible('plate', {
        Helpers: true, // 平移和旋转辅助线是否可视
        ClippingPlaneEntities: true, //剖面框是否可视
      })
    } else {       
      that.clip = that.$api.Plugin.InitClippingSystem() // 此对象将用于后面几个接口的调用
      const modelList = []
      for (let i = 0; i < that.projectMessage.modelList.length; i++) {
        modelList.push(that.projectMessage.modelList[i].id)
      }
      that.clip.Create({
        id: 'plate', // 剖面框id （唯一）
        tags: modelList, // 要剖切的模型tag
        plateLineColor: Cesium.Color.RED, // 剖面线颜色
        isShowClipLine: true, //是否显示剖面线
        ClipSpeed: 1, // 剖切速度
        RotateSpeed: 1, // 旋转速度
        box: {
          // 剖面框相关设置
          outline: true, //是否显示剖面框边框线
          outlineColor: '#001529', //剖面框边框线颜色
          planeColor: '#001529cc', //剖面颜色
          scalar: [1.0, 1.0, 1.0], // 剖切框尺寸缩放倍数
        },
        HelperLineWidth: 10, // 剖切辅助线线宽
      })
      that.changeOpenCut(that.clip)      
    }
    that.$api.Public.Event('RIGHT_CLICK', (click) => {
      if (Object.keys(that.clip).length > 0) {
        that.clip.Destroy('plate')
        that.changeOpenCut({})
      }
    })
  },
  methods: {
    // _isMobile() {
    //   const flag = navigator.userAgent.match(
    //     /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    //   )
    //   return flag ? 1 : 0
    // },
  },
  destroyed() {
    const that = this
    if (Object.keys(that.clip).length > 0) {
      that.clip.Destroy('plate')
      that.changeOpenCut({})
    }
    //this.openCut.Destroy('plate')
    //   this.openCut = {}

    // for (let i = 0; i < this.projectMessage.modelList.length; i++) {
    //   this.$api.Model.CloseClip(this.projectMessage.modelList[i].id)
    // }
  },
}
</script>

<style lang="scss" scoped>
#table1{
  /deep/.ant-table-tbody > tr > td {
    padding: 10px 10px;    
  }   
}
</style>