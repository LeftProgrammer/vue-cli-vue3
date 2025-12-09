<template>
  <div class="side-frame" @contextmenu.prevent="">
    <a-card :bordered="false">
      <a-space class="plate-operation">
        <el-tooltip title="隐藏" @click="CutBoxHide">
          <span class="iconfont icon-yincangmoxing"></span>
        </el-tooltip>
        <el-tooltip title="反向" @click="CutBoxReverse">
          <span class="iconfont icon-zhuanhuan"></span>
        </el-tooltip>
        <el-tooltip title="重置" @click="CutBoxReset">
          <span class="iconfont icon-reset"></span>
        </el-tooltip>
      </a-space>
      <a-table :columns="columns" :data-source="data" bordered :showHeader="false" :pagination="false">
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
    dataIndex: 'operation',
  },
]
const data = [
  {
    key: '1',
    name: '鼠标左键按住剖面框中心箭头线',
    operation: '拖动可平移剖面框，移出剖面框的部分将被剖切掉',
  },
  {
    key: '2',
    name: '鼠标左键按住剖面框中心箭头线之间的弧线',
    operation: '拖动可旋转剖面框，移出剖面框的部分将被剖切掉',
  },
  {
    key: '3',
    name: '鼠标滚轮按住剖面框的一个面',
    operation: '拖动可沿该面法向量方向剖切模型',
  },
]
export default {
  props: {
    modelList: {
      type: Array,
      default: [],
    },
    store: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      data,
      columns,
      clip: undefined,
      clipSet: {
        visible: true,
        direction: true,
      },
    }
  },
  mounted() {
    const that = this
    if (that.store.state.bim.clipSet) {
      that.clipSet = that.store.state.bim.clipSet
      that.clip = that.clipSet.clip
      that.clip.setVisible('plate', {
        Helpers: true, // 平移和旋转辅助线是否可视
        ClippingPlaneEntities: true, //剖面框是否可视
      })
    } else {
      that.clip = api.Plugin.initClippingSystem() // 此对象将用于后面几个接口的调用
      const modelList = []
      for (let i = 0; i < that.modelList.length; i++) {
        modelList.push(that.modelList[i].id)
      }
      that.clip.add({
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
          scalar: [0.1, 0.1, 0.1], // 剖切框尺寸缩放倍数
        },
        HelperLineWidth: 10, // 剖切辅助线线宽
      })
      that.clipSet = {
        snapshotData: that.clip.getById('plate').snapshotData,
        clip: that.clip,
        visible: true,
        direction: true,
      }
      that.store.dispatch('setClipConfig', that.clipSet)
    }
  },
  methods: {
    CutBoxHide() {
      //隐藏剖切框
      const that = this
      that.clipSet.visible = !that.clipSet.visible
      that.clip.setVisible('plate', {
        Helpers: that.clipSet.visible, // 平移和旋转辅助线是否可视
        ClippingPlaneEntities: that.clipSet.visible, //剖面框是否可视
      })
    },
    CutBoxReverse() {
      //反向剖切
      const that = this
      that.clipSet.direction = !that.clipSet.direction
      that.clip.updateUnionClippingRegions('plate', that.clipSet.direction)
    },
    CutBoxReset() {
      //重置剖切
      const that = this
      that.clipSet.visible = false;
      that.clipSet.direction = false;
      that.CutBoxHide();
      that.CutBoxReverse()
      that.clip.setClipMatrix('plate', {
        snapshot: that.clipSet.snapshotData, // snapshotData 本身为数组类型
      })
    },
  },
  destroyed() {
    const that = this
    var setState = Object.assign({}, that.store.state.bim.clipSet, that.clipSet)
    that.store.dispatch('setClipConfig', setState)
    that.clip.setVisible('plate', {
      Helpers: false, // 平移和旋转辅助线是否可视
      ClippingPlaneEntities: false, //剖面框是否可视
    })
  },
}
</script>
<style lang="scss" scoped>
.plate-operation {
  display: flex;
  justify-content: space-around;
  margin: 5px 20px;

  .iconfont {
    font-size: 24px;
  }

  .iconfont:hover {
    color: #00ffc5;
  }
}
</style>