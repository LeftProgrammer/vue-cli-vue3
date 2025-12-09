<template>
  <a-layout id="EnginePage" :class="currentDeviceType ? 'mobile-box' : ''">
    <a-layout-content>
      <div id="cesiumContainerCad"></div>
      <div id="cesiumContainer"></div>
    </a-layout-content>
    <BottomNav ref="bootomNav" @MainView="MainView" :projectMessage="projectMessage" :layerVisible.sync="layerVisible"
      :settingVisible.sync="settingVisible" :currentDeviceType="currentDeviceType" />
    <GISSceneSettings v-if="settingVisible" :settingVisible.sync="settingVisible" :projectMessage="projectMessage"
      @AddModel="AddModel" @InitEngine="InitEngine" />
    <LayerStructure v-if="layerVisible" :layerVisible.sync="layerVisible" :projectMessage="projectMessage" />
  </a-layout>
</template>

<script>
import BottomNav from './modules/BottomNav'
import GISSceneSettings from './modules/GISSceneSettings'
import LayerStructure from './modules/LayerStructure'
import { getDocById, getDocumentConfig } from '@/components/BimEngine/api/document'
import { getClampById } from '@/api/combine'
export default {
  name: 'BIM',
  props: {
    id: {
      type: String,
      default: '',
    },
    cid: {
      type: String,
      default: '3a0d385f-4f76-c556-511c-2b7252c17503',
    },
  },
  components: {
    BottomNav,
    GISSceneSettings,
    LayerStructure,
  },
  data() {
    return {
      projectMessage: {},
      modelList: [],
      options: {
        imgs: {
          // 六面图片
          top: '../../static/Cesium/Assets/Images/Navigation/bim/top.png',
          bottom: '../../static/Cesium/Assets/Images/Navigation/bim/under.png',
          east: '../../static/Cesium/Assets/Images/Navigation/bim/east.png',
          south: '../../static/Cesium/Assets/Images/Navigation/bim/south.png',
          west: '../../static/Cesium/Assets/Images/Navigation/bim/west.png',
          north: '../../static/Cesium/Assets/Images/Navigation/bim/north.png',
        },
        offset: {
          // 屏幕坐标偏移
          corner: GLENavigationCube.RightTop,
          x: 10,
          y: 10,
        },
        cube: {
          hoverColor: '#22ee22', // 立方导航快鼠标移过显示颜色
          size: 60, // 导航立方尺寸
          hotPointSize: 7, // 导航立方棱角热点区域尺寸
          cubeTextColor: '#4c4c4ccc', // cube 各个面文字颜色
          cubeStrokeColor: '#0000004d', // cube 各个面边框颜色
          cubeFillColor: '#d2d2d299', // cube 各个面填充颜色
        },
      },
      spinning: false,
      settingVisible: false,
      layerVisible: false,
      currentDeviceType: false,
      DocConfig: undefined,
      isCombine: false,
    }
  },
  created() {
    if (this._isMobile() != null) {
      import('./mobile.less');
      this.currentDeviceType = true
    }
  },
  async mounted() {
    const that = this
    await that.InitEngine()
    //此系统仅保留卡开后操作的数据，效果数据如需保存，请自行保存在数据库
    localStorage.removeItem("selfLuminousList_" + that.projectMessage.id)
    localStorage.removeItem("componentFilckerList_" + that.projectMessage.id)
  },
  methods: {
    async InitEngine() {
      const that = this
      that.modelList = []
      //初始化模型加载
      const defaults = { ...that.$store.state.bim.defaults }
      defaults.container = 'cesiumContainer'
      that.currentDeviceType ? defaults.isRequestWebgl2 = false : defaults.isRequestWebgl2 = true
      api = new API(defaults)
      // var nowTime = that.$store.state.bim.sunshineTime
      // var hour = parseInt(nowTime / 60)
      // var minute = nowTime % 60
      // var time = (hour < 10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute)
      // api.Public.setSunshineDuration(time);
      api.viewer._cesiumWidget._showRenderLoopErrors = true;
      api.Plugin.InitNavCube(that.options) // 实例化出来的对象可用于更新和设置可视状态
      that.spinning = true
      const docId = that.$route.query.modelId ? that.$route.query.modelId : that.id
      if(docId){
        var res = await getDocById(docId)
        var config = await getDocumentConfig({ DocumentId: docId})
        if(config.items.length) that.DocConfig = config.items[0];
        console.log(that.DocConfig)
        that.$refs.bootomNav.init(that.DocConfig);
        that.modelList.push({
          name: res.modelName,
          id: res.id,
          docName: res.docName,
          suffix: res.suffix,
          docType: res.docType
        })
        that.projectMessage = res
        that.projectMessage.modelList = that.modelList
        that.projectMessage.sceneType = 0
      }
      else{
        //合模
        that.$refs.bootomNav.init();
        const combineId = that.$route.query.combineId ? that.$route.query.combineId : that.cid
        var res = await getClampById(combineId)
        if(res.combineDetails.length == 0) return;
        for (let i = 0; i < res.combineDetails.length; i++) {
          that.modelList.push({
            name: res.combineDetails[i].document.modelName,
            id: res.combineDetails[i].document.id,
            docName: res.combineDetails[i].document.docName,
            suffix: res.combineDetails[i].document.suffix,
            docType: res.combineDetails[i].document.docType,
            matrix: JSON.parse(res.combineDetails[i].matrix),
          })
          that.projectMessage = res
          that.projectMessage.modelList = that.modelList
          that.projectMessage.sceneType = 0
          that.projectMessage.id = undefined;
          if(this.projectMessage.camera && !this.projectMessage.camera.pitch)
            that.projectMessage.camera = JSON.parse(that.projectMessage.camera)
        }
      }
      that.hasEdit = false //不可以编辑
      for (let i = 0; i < that.modelList.length; i++) {
        that.AddModel(that.modelList[i]) //初始加载模型
      }
    },
    AddModel(data) {
      //加载模型
      const that = this
      var url = `${that.$store.getters.modelUrl}/tools/output/model/${data.name}/root.glt`
      if (data.docType == 6) {
        url = `${that.$store.getters.modelUrl}/tools/output/model/${data.name}/tileset.json`
      }
      console.log(data)
      api.Model.mergeModel(
        url,
        data.id,
        null,
        (res) => {
          let complete = true
          for (let i = 0; i < that.modelList.length; i++) {
            if (that.modelList[i].complete || that.modelList[i].id == res.obj.id) {
              that.modelList[i].complete = true
            } else {
              complete = false
            }
          }
          complete ? (that.spinning = false) : null
          that.InitPartialEffect()
        },
        {
          flyto: true,
          matrix: data.matrix ? data.matrix : undefined,
          visualRange: data.docType === 6 ? 0.2 : 2000, //可视距离
          maxspaceerror: data.docType === 6 ? 0.2 : 2000, //可视距离
        }
      )
    },
    MainView() {
      //主视图
      if (this.projectMessage.id) {
        api.Model.location(this.projectMessage.id)
      } else {
        if (this.projectMessage.camera) {
          api.Camera.SetCamera(
            this.projectMessage.camera.position,
            this.projectMessage.camera.heading,
            this.projectMessage.camera.pitch
          )
        }
      }
    },
    InitPartialEffect() {
      const that = this;
      let labelList = JSON.parse(localStorage.getItem("LabelList_" + that.projectMessage.id));
      if (labelList) {
        labelList.forEach(element => {
          if (element.state) {
            api.Label.addBalloon(element);
          }
        });
      }
    },
    _isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
      return flag
    },
  },
  destroyed() {
    this.$notification.destroy()
  },
}
</script>

// <style lang="scss" scoped>
// @import './BimCss.less';
// </style>
<style lang="scss">
.ant-notification-topRight {
  top: 15vh !important;

  .ant-notification-notice-description {
    border-top: 1px solid #5a738b;
  }

}

.ant-notification-topLeft {
  .linkage-notification {
    margin-left: 20px !important;
  }
}

.ant-notification-bottomRight {
  .engine-notification {
    border-radius: 6px;
  }

  .tip-notification {
    .ant-notification-notice-message {
      display: none;
    }

    .ant-notification-notice-close {
      display: none;
    }
  }
}

.ant-notification {
  width: auto !important;
  margin: 0;

  .engine-notification {
    background-color: #001529cc;
    color: #fff;
    margin: 0;
    padding: 10px;

    .ant-notification-notice-message {
      color: #ffffff;
    }

    .ant-notification-notice-close {
      color: #fff;
    }

    .ant-card,
    .ant-input-number,
    .ant-input,
    .ant-select,
    .ant-select-selection {
      background: transparent;
      color: #fff;
    }

    .ant-form-item {

      //margin-bottom: 6px;
      .ant-form-item-label>label {
        color: #fff;
      }
    }

    .ant-tabs-nav-wrap {
      text-align: center;

      .ant-tabs-tab {
        color: #fff;
      }

      .ant-tabs-tab-active.ant-tabs-tab {
        color: #05a081;
      }
    }

    .ant-tabs,
    .ant-select-arrow-icon {
      color: #ffffff;
    }

    .ant-list-header {
      color: #ffffff;
    }

    .ant-list-items {
      max-height: 1500px;
      overflow-y: auto;

      .anticon {
        color: rgb(5, 160, 129);
      }
    }

    .ant-list-item {
      color: #fff;
      border-bottom: 1px dashed rgba(185, 185, 185, 0.5);

      a {
        color: #fff;
      }

      a.active {
        color: #e4d904;
      }

      span {
        color: #b6c9da;
      }
    }

    .ant-list-item:last-child {
      border-bottom: none;
    }

    .ant-list-item.edit {
      padding-top: 10px;
      padding-bottom: 10px;
    }

    .ant-list-empty-text {
      color: #fff;
    }

    .ant-list-footer {
      padding-bottom: 0;
    }

    .ant-tabs-tabpane {
      .property-box {
        max-height: 50vh;
        overflow-y: auto;
        overflow-x: hidden;

        .ant-table {
          color: #ffffff;

          .ant-table-thead {
            display: none;
          }

          .ant-table-tbody>tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)>td {
            background: #05a08173;
          }

        }
      }
    }

    .ant-notification-notice-description {

      .model-tree-box {
        height: 50vh;
        overflow: hidden;
        overflow-y: auto;
        max-width: 100% !important;
        width: 100% !important;
      }

      .property-box {

        .ant-table-thead>tr>th,
        .ant-table-tbody>tr>td {
          padding: 6px;
        }
      }
    }

    .model-tree-box,
    .property-box,
    .scroll-box {
      &::-webkit-scrollbar {
        //整体样式
        height: 5px;
        width: 2px;
      }

      &::-webkit-scrollbar-thumb {
        //滑动滑块条样式
        border-radius: 1px;
        box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.2);
        background: #ffffff;
      }

      &::-webkit-scrollbar-track {
        //轨道的样式
        box-shadow: 0;
        border-radius: 0;
        background: rgba(255, 255, 255, 0.3);
      }

      .ant-tree-node-content-wrapper {
        color: #ffffff;
      }
    }

    .ant-empty-description {
      color: #ffffff;
    }
  }
}

.btn-tool {
  .iconfont {
    font-size: 24px;
    color: #ffffff;
  }
}

.submit-btn {
  background: #05a081 !important;
  border-color: #05a081;

  &:hover {
    background: transparent !important;
    // color: #ffffff;
  }

  &:focus {
    color: #ffffff;
  }
}
</style>
