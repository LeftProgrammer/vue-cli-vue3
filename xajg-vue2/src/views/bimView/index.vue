<template>
  <div class="bimView">
    <div class="cesiumContainer" :id="domId" />
    <div class="footer_btn">
      <div v-for="(item, index) in configuration" :key="index" class="btn-tool">
        <el-tooltip
          v-if="item.children && item.children.length != 0"
          effect="dark"
          popper-class="bimView_tooltip"
          placement="top"
        >
          <div slot="content">
            <el-tooltip
              v-for="child in item.children"
              :key="child.id"
              placement="right"
              :content="child.name"
            >
              <svg-icon
                :icon-class="child.icon"
                @click="FunctionChoose(child, sceneInfo)"
              />
            </el-tooltip>
          </div>
          <svg-icon :icon-class="item.icon" />
        </el-tooltip>
        <el-tooltip v-else effect="dark" :content="item.name" placement="top">
          <svg-icon :icon-class="item.icon" @click="FunctionChoose(item, sceneInfo)" />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { getDocById } from "@/components/BimEngine/api/document";
import { getClampById } from "@/components/BimEngine/api/combine";
import configuration from "./js/configuration";
import methodMixin from "./js/methodMixin";
import { findByModelCode } from "./api";
// 组件引入
// 组件引入

export default {
  components: {},
  mixins: [methodMixin],
  data() {
    return {
      configuration,
      domId: "cesiumContainer_" + new Date().getTime(),
      sceneInfo: {}, //场景信息
      modelList: [],
      api: null,
      options: {
        imgs: {
          // 六面图片
          top: "../../static/Cesium/Assets/Images/Navigation/bim/top.png",
          bottom: "../../static/Cesium/Assets/Images/Navigation/bim/under.png",
          east: "../../static/Cesium/Assets/Images/Navigation/bim/east.png",
          south: "../../static/Cesium/Assets/Images/Navigation/bim/south.png",
          west: "../../static/Cesium/Assets/Images/Navigation/bim/west.png",
          north: "../../static/Cesium/Assets/Images/Navigation/bim/north.png"
        },
        offset: {
          // 屏幕坐标偏移
          corner: GLENavigationCube.LeftTop,
          x: 10,
          y: 10
        },
        cube: {
          size: 40, // 导航立方尺寸
          hotPointSize: 2, // 导航立方棱角热点区域尺寸
          cubeTextColor: "#4c4c4ccc", // cube 各个面文字颜色
          cubeStrokeColor: "#0000004d", // cube 各个面边框颜色
          cubeFillColor: "#d2d2d299" // cube 各个面填充颜色
        }
      },
      settingVisible: false,
      modelCode: ""
    };
  },
  created() {},
  computed: {
    bimId() {
      return this.sceneInfo.modelId;
    },
    bimConfig() {
      if (this.sceneInfo.argument) return JSON.parse(this.sceneInfo.argument);
      else return {};
    }
  },
  mounted() {
    this.modelCode = this.$route.query.code;
    this.getBimConfig();
  },
  methods: {
    getBimConfig() {
      findByModelCode({ modelCode: this.modelCode }).then((res) => {
        this.sceneInfo = res.data[0];
        this.InitEngine();
      });
    },
    /**
     * @description 初始化引擎
     */
    async InitEngine() {
      const that = this;
      const defaults = { ...this.$store.state.bim.defaults };
      defaults.container = this.domId;
      defaults.maxspaceerror = 1000; // 模型可视距
      defaults.openterrain = this.sceneInfo.openterrain === 1;
      defaults.openearth = this.sceneInfo.openearth === 1;
      console.log("🚀 ~ defaults:", defaults);
      defaults.imageryprovider = "arcgis_image";
      const api = new API(defaults);
      //   使用格兰岱尔的地图
      // api.Public.addImageryProvider("https://image.glendale.top", true, {
      //   serverType: 1,
      //   maximumLevel: 21,
      // });
      api.viewer._cesiumWidget._showRenderLoopErrors = true;
      api.Plugin.InitNavCube(this.options); // 导航立方初始化
      if (this.sceneInfo.isCombineid === 1) {
        // 合模
        var res = await getClampById(this.bimId);
        if (res.combineDetails.length === 0) return;
        for (let i = 0; i < res.combineDetails.length; i++) {
          this.modelList.push({
            name: res.combineDetails[i].document.modelName,
            id: res.combineDetails[i].document.id,
            docName: res.combineDetails[i].document.docName,
            suffix: res.combineDetails[i].document.suffix,
            docType: res.combineDetails[i].document.docType,
            matrix: res.combineDetails[i].matrix
              ? JSON.parse(res.combineDetails[i].matrix)
              : "",
            checked: true
          });
        }
      } else {
        // 单模
        let res = await getDocById(this.bimId);
        this.modelList.push({
          name: res.modelName,
          id: res.id,
          docName: res.docName,
          suffix: res.suffix,
          docType: res.docType,
          checked: true
        });
      }
      this.api = api;
      window.api = api;
      this.api.Public.Event("LEFT_CLICK", this.leftClick); // 绑定鼠标左侧点击事件
      this.api.Public.Event("RIGHT_CLICK", this.rightClick); // 绑定鼠标左侧点击事件
      this.api.Public.setModelRotationCenter(true); // 设置以模型中心点为旋转中心
      //   初始加载模型;
      for (let i = 0; i < this.modelList.length; i++) {
        const show =
          this.sceneInfo.isCombineid != 1 ||
          !this.bimConfig.modelList ||
          this.bimConfig.modelList.length == 0 ||
          this.bimConfig.modelList.find((x) => x.id === this.modelList[i].id).defaultShow;
        if (show) this.AddModel(this.modelList[i]);
      }
    },
    AddModel(data) {
      var url = `${this.$store.getters.modelUrl}/tools/output/model/${data.name}/root.glt`;
      if (+data.docType === 6) {
        url = `${this.$store.getters.modelUrl}/tools/output/model/${data.name}/tileset.json`;
      }
      this.api.Model.mergeModel(
        url,
        data.id,
        null,
        (res) => {
          // let complete = true;
          // for (let i = 0; i < this.modelList.length; i++) {
          //   if (
          //     this.modelList[i].complete ||
          //     this.modelList[i].id === res.obj.id
          //   ) {
          //     this.modelList[i].complete = true;
          //   } else {
          //     complete = false;
          //   }
          // }
          const index = this.modelList.findIndex((x) => x.id == data.id);
          this.modelList[index] = {
            ...this.modelList[index],
            complete: true,
            show: true
          };
          const index1 = this.modelList
            .filter((x) => x.show)
            .findIndex((x) => !x.complete);
          if (index1 == -1) {
            console.log("加载完成");
            this.api.Model.original(this.bimId);
            this.LoadComplete();
          }
        },
        {
          flyto: true, // 是否飞到模型跟前,false是静默加载，针对多个模型
          matrix: data.matrix ? data.matrix : undefined, // 模型矩阵，gis模式下使用较多
          maxspaceerror: data.docType === 6 ? 0.2 : 2000 // 模型可视距离
        }
      );
    },
    LoadComplete() {
      // this.setViewpoint(this.bimConfig.defaultViewpoint);
      //  对自定义的配置进行初始化
      this.$message.success("模型加载完成");
      // 1.模型偏移
      if (this.bimConfig.modelOffset) {
        Object.keys(this.bimConfig.modelOffset).forEach((item) => {
          const offset = this.bimConfig.modelOffset[item];
          this.api.Model.offset(offset.xValue, offset.YValue, offset.ZValue, item);
          this.api.Model.rotate(offset.rotateValue, item);
        });
      }
      // =======
      let DD, chunkedArray, newArr;
      setTimeout(() => {
        DD = this.api.Feature.getVertex(
          "2624365416288",
          "3a1ab3a7-2fce-ef47-0ce5-c0bad4b4ffbf"
        );
      }, 1000);
      setTimeout(() => {
        function chunkArray(arr, size = 3) {
          const result = [];
          for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
          }
          return result;
        }
        chunkedArray = chunkArray(DD);
        console.log(chunkedArray);
      }, 2000);
      setTimeout(() => {
        newArr = chunkedArray.map((x) => {
          var pos = this.api.Public.convertModelToWorld(
            x[0],
            x[1],
            x[2],
            "3a1ab3a7-2fce-ef47-0ce5-c0bad4b4ffbf"
          );
          return pos;
        });
        console.log(newArr);
      }, 3000);
      setTimeout(() => {
        // var opt = {
        //   id: "4cd19872-46ed-44d2-ac9a-7c50e9744b46",
        //   positions: newArr,
        //   height: 40,
        // };
        // console.log("🚀 ~ setTimeout ~ opt:", opt);
        // this.api.Public.addEarthFlatten(opt);
      }, 6000);
    },
    /**
     * 设置视角
     */
    setViewpoint(viewpoint) {
      if (!viewpoint) {
        console.error("视角为空");
        return;
      }
      this.api.Camera.flyToViewPort(
        viewpoint.position,
        viewpoint.heading,
        viewpoint.pitch
      );
    },
    leftClick(click) {},
    rightClick() {}
  }
};
</script>

<style scoped lang="scss">
.bimView {
  height: 100%;
  width: 100% !important;
  margin: 0 !important;
  position: relative;
  .cesiumContainer {
    width: 100%;
    height: 100%;
  }
  .footer_btn {
    position: absolute;
    bottom: 10px;
    padding: 0;
    left: 50%;
    transform: translate(-50%);
    border-radius: 3px;
    z-index: 10;
    display: flex;
    align-items: center;
    background-color: rgba(0, 21, 41, 0.8);
    .btn-tool {
      text-align: center;
      margin: 0;
      cursor: pointer;
      svg {
        width: 24px;
        height: 24px;
        padding: 11px 10px;
        box-sizing: content-box;
        &:hover {
          background-color: #666;
        }
      }
    }
  }
}
</style>
<style lang="scss">
@import "./css/index.scss";
.bimView_tooltip {
  padding: 0;
  > div:first-child {
    display: flex;
    flex-direction: column;
    svg {
      cursor: pointer;
      box-sizing: content-box;
      padding: 10px;
      &:hover {
        background-color: #666;
      }
    }
  }
}
</style>
