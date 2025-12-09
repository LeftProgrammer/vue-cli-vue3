<template>
  <a-card :bordered="false">
    <a-select v-model="drawingType" :options="options" @change="ChangeDrawingType"></a-select>
    <a-radio-group v-model="currentDrawing" @change="ChangeDrawing">
      <a-radio v-for="(item, index) in drawingList" :key="index" :value="item.value">{{ item.name
      }}</a-radio>
    </a-radio-group>
  </a-card>
</template>

<script>
import { getModelDrawing } from '@/components/BimEngine/api/document'
export default {
  props: {
    projectMessage: {
      type: Object,
      default: undefined,
    },
    store: {
      type: Object,
      default: null,
    },
    currentDeviceType: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      options: [],
      drawingType: '',
      currentDrawing: '',
      drawingList: [],
      tempOrthogonalScreenshot: undefined,
    }
  },
  async mounted() {
    const that = this
    const res = await getModelDrawing({ LightweightName: that.projectMessage.modelName })
    if (res.code == 1) {
      res.datas.forEach((value, key) => {
        let name = ''
        if (value.type == "Sheet" || value.type == "图纸") {
          name = "图纸"
        } else if (value.type == "Structural Plan" || value.type == "结构平面") {
          name = "结构平面"
        } else if (value.type == "Floor Plan" || value.type == "楼层平面") {
          name = "楼层平面"
        } else if (value.type == "Ceiling Plan" || value.type == "天花板平面") {
          name = "天花板平面"
        } else if (value.type == "Building Section" || value.type == "Building Elevation" || value.type == "建筑剖面") {
          name = "建筑剖面"
        } else if (value.type == "剖面") {
          name = "剖面"
        }
        let index = that.options.findIndex(item => item.value == value.type)
        value.value = value.fileName.split(".dwg")[0]
        index != -1 ? that.options[index].children.push(value) : that.options.push({ value: value.type, label: name, children: [value] })
      });
    }
    that.drawingType = that.options[0].value;
    that.drawingList = that.options[0].children;
    that.currentDrawing = that.options[0].children[0].fileName.split(".dwg")[0]
    const defaults = { ...that.store.state.bim.defaults }
    //CAD场景初始化
    var defaults_Cad = {
      container: "cesiumContainerCad",
      showfps: false,
      maxspaceerror: 5000,
      bgcolor: '#87CEFA',
      selectedcolor: "#FF0000",
      isRequestWebgl2: true,
      colorBlendMode: 1,
      secretkey: defaults.secretkey,
      openearth: false, //[可选]开启场景，如果只关心图纸图像本身的话可以选择关闭
      openterrain: false, //[可选]开启地形
      cadmode: true, // <-- CAD场景需设置CAD mode为true
    };
    //二三维初始化
    var options = {
      cadEngineType: 1,
      modelId: that.projectMessage.id,
      div_2d: "cesiumContainerCad",
      cadOptions: defaults_Cad,
      div_3d: "cesiumContainer",
      notZoomTo: true,
      zoomScalar: "1.0",
      modelAlpha: 1,
      styleType: this.currentDeviceType ? "Mobile" : "Webpage",

    };
    api.Model.mapNavigator2D(options, (data) => {
      if (!isEmpty(data)) {
        that.tempOrthogonalScreenshot = data;
        that.ChangeDrawing(that.options[0].children[0])
      }
    })

  },
  methods: {
    ChangeDrawingType(value, option) {
      const that = this;
      let index = that.options.findIndex(item => item.value == value)
      if (index != -1) {
        that.drawingType = that.options[index].value;
        that.drawingList = that.options[index].children;
        that.currentDrawing = that.options[index].children[0].fileName.split(".dwg")[0]
        that.ChangeDrawing({
          value: that.currentDrawing
        })
      }
    },
    ChangeDrawing(e) {
      const that = this;
      api.Feature.clearTopRenderSelectColor();
      if (that.tempOrthogonalScreenshot != undefined) {
        //加载图纸
        that.tempOrthogonalScreenshot.openDrawing(
          `${that.store.getters.modelUrl}/tools/output/drawing/${that.projectMessage.modelName}/${e.target ? e.target.value : e.value}/root.glt`
        );
      }
      //三维到二维
      api.Public.Event("LEFT_CLICK", (click) => {
        api.Feature.getByEvent(click.position, (json) => {
          api.Public.clearBOX23line(); //清空已选择的线框
          if (json != undefined) {
            var tempmap = new Map();
            tempmap.set(json.id, json.batchId);
            var options = {
              featureIds: tempmap,
              tagName: json.id.split('^')[0],
              isMultiple: false
            };
            api.Feature.topRendering(options);
            var featureId = json.id.replace(that.projectMessage.id + '^', '');
            if (that.tempOrthogonalScreenshot._lastRevitId != undefined) {
              that.tempOrthogonalScreenshot._cad.Entity.resetRevitColor(
                that.projectMessage.id,
                that.tempOrthogonalScreenshot._lastRevitId
              );
            }
            that.tempOrthogonalScreenshot._cad.Entity.setRevitColor(
              that.projectMessage.id,
              featureId,
              0xff0000
            );
            that.tempOrthogonalScreenshot._cad.Entity.zoomToRevit(
              that.projectMessage.id,
              featureId,
              {
                modelAlpha: 1.0,
                flyTime: 1,
                callback: (res) => {
                  if (res == -1) {
                    that.$message.warning('当前图纸中不包含此构件');
                  }
                }
              });
            that.tempOrthogonalScreenshot._lastRevitId = featureId;
            that.tempOrthogonalScreenshot._featureId = undefined;
          }
        });
      });
    },
  },
  destroyed() {
    const that = this;
    if (that.tempOrthogonalScreenshot != undefined) {
      that.tempOrthogonalScreenshot.exit();
    }
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
  }
}
</script>

<style lang="scss" scoped>
.ant-select {
  width: 100%;
}

.ant-radio-group {
  width: 100%;
  margin: 10px;

  .ant-radio-wrapper {
    color: #ffffff;
    width: 100%;
    line-height: 36px;
    text-indent: 10px;
    color: #fff;
    line-height: 30px;

    /deep/.ant-radio-inner {
      background: #fff0;
    }
  }
}
</style>