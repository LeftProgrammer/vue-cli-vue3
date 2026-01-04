<template>
  <div class="EnginePage">
    <div class="layout-content">
      <div :id="'cesiumContainerCad_' + domId"></div>
      <div :id="domId" class="cesiumContainer"></div>
    </div>
    <div class="oprate-btns" v-if="false">
      <div class="btn-item" @click="getViewpoint">获取视角</div>
      <div class="btn-item" @click="setViewpoint(viewpoint)">设置视角</div>
    </div>
  </div>
</template>

<script>
// import BottomNav from './modules/BottomNav'
import { getDocById } from "@/components/BimEngine/api/document";
import { getClampById } from "@/components/BimEngine/api/combine";
import { findByModelCode } from "@/components/BimEngine/api/index";
// import { bimconfig as bimList } from "@/config/bimconfig";
import localforage from "localforage";
export default {
  name: "BimEngine",
  components: {
    // BottomNav,
  },
  props: {
    id: {
      type: String,
      default: "",
    },
    point: {
      type: Boolean,
      default: false,
    },
    coorType: {
      type: String,
      default: "0",
    },
  },
  data() {
    return {
      // bimList, // 模型配置集合
      bimconfig: {}, // 模型配置集合
      domId: "cesiumContainer_" + new Date().getTime(),
      projectMessage: {}, // 模型数据
      modelList: [], // 模型列表
      options: {
        imgs: {
          // 六面图片
          top: "../../static/Cesium/Assets/Images/Navigation/bim/top.png",
          bottom: "../../static/Cesium/Assets/Images/Navigation/bim/under.png",
          east: "../../static/Cesium/Assets/Images/Navigation/bim/east.png",
          south: "../../static/Cesium/Assets/Images/Navigation/bim/south.png",
          west: "../../static/Cesium/Assets/Images/Navigation/bim/west.png",
          north: "../../static/Cesium/Assets/Images/Navigation/bim/north.png",
        },
        offset: {
          // 屏幕坐标偏移
          corner: (window.GLENavigationCube && window.GLENavigationCube.RightTop) || undefined,
          x: 10,
          y: 10,
        },
        cube: {
          // hoverColor: '#22ee22', // 立方导航快鼠标移过显示颜色
          size: 40, // 导航立方尺寸
          hotPointSize: 2, // 导航立方棱角热点区域尺寸
          cubeTextColor: "#4c4c4ccc", // cube 各个面文字颜色
          cubeStrokeColor: "#0000004d", // cube 各个面边框颜色
          cubeFillColor: "#d2d2d299", // cube 各个面填充颜色
          // corner:
        },
      },
      spinning: false, // 加载中
      layerVisible: false, // 层显隐

      api: null,
      scale: 1, // 模型缩放
      selectColor: {
        // 选中颜色
        red: 0,
        green: 0,
        blue: 108,
        alpha: 1,
      },
      defaultColor: {
        // 默认颜色
        red: 255,
        green: 255,
        blue: 255,
        alpha: 1,
      },
      // bSelectChangeColor: false, // 是否选中变色
      // bSelectHidden: false, // 是否选中影藏
      defaultViewPoint: {
        position: [1.9005113990880358, 0.5970570992662663, 398.3852008639792],
        heading: 3.3976485057524286,
        pitch: -0.47100739848627793,
      }, // 默认视角
      viewpoint: {
        heading: 0.3530054050721345,
        pitch: -1.3144762359136344,
        position: [1.8983696819660068, 0.5969517117333644, 7468.0432972566105],
      }, // 当前视角

      modelinitedNum: 0, // modellist加载完成数量
      modelDataInitedIds: [], // modellist 数据加载完成
      selectedFeatureId: "", // 选择的id
      cid: "",
      lightSource: null,
      noAdjustme: false, //是否需要调整
    };
  },
  created() {
    // api.Entity.drawCircle(options, callback); // 画圆/圆柱
  },
  computed: {},
  async mounted() {
    // const that = this;
    // await that.InitEngine(this.id);
  },
  methods: {
    /**
     * 模拟时使用 - 设置显示隐藏
     * @returns
     */
    setActorVisible(bimCode, visible) {
      this.getFeatureIdsByBimCodes(bimCode).then(options => {
        if (options) {
          for (const modelId in options) {
            if (Object.hasOwnProperty.call(options, modelId)) {
              let featureIds = options[modelId].map(x => modelId + "^" + x);
              if (visible) {
                this.api.Feature.showFeatures(featureIds.join("#"), modelId);
              } else {
                this.api.Feature.setVisible(featureIds.join("#"), visible, modelId);
              }
            }
          }
        }
      });
    },
    /**
     * 通过bimCode进行模型初始化
     * @returns
     */
    render(bimCode, isInit = true) {
      // 初始化前，重置状态
      if (isInit) {
        this.initModelAlpha();
      }
      if (bimCode) {
        this.getFeatureIdsByBimCodes(bimCode).then(options => {
          if (options) {
            for (const modelId in options) {
              if (Object.hasOwnProperty.call(options, modelId)) {
                const featureIds = options[modelId];
                this.zoomTo({ featureId: featureIds, modelId: modelId });
              }
            }
          }
        });
      }
    },
    /**
     * 通过bimCodes获取构件的id
     * bimCode
     * @returns
     */
    getFeatureIdsByBimCodes(bimCode) {
      return new Promise(resolve => {
        if (!bimCode) {
          resolve(null);
        }
        let bimCodes;
        if (Array.isArray(bimCode)) {
          bimCodes = bimCode;
        } else {
          bimCodes = bimCode.split(",");
        }
        if (Array.isArray(bimCodes) && bimCodes.length > 0) {
          // this.$nextTick(() => {
          let reqArrs = [];
          for (let i = 0; i < bimCodes.length; i++) {
            const bimCode = bimCodes[i];

            let req = this.$store.dispatch("bim/getStructureItem", bimCode);
            reqArrs.push(req);
          }
          // let options = { featureId: [], modelId: "" };
          let options = {};
          Promise.all(reqArrs).then(ress => {
            if (reqArrs.length === ress.length) {
              for (let i = 0; i < bimCodes.length; i++) {
                let bimItem = ress[i];
                if (bimItem) {
                  if (bimItem.modelid) {
                    if (!options[bimItem.modelid]) {
                      options[bimItem.modelid] = [bimItem.glid];
                    } else {
                      options[bimItem.modelid].push(bimItem.glid);
                    }
                  }
                }
              }
              resolve(options);
            } else {
              resolve(null);
            }
          });
          // });
        } else {
          resolve(null);
        }
      });
    },
    /**
     * 屏蔽浏览器右键操作
     * @returns
     */
    contextmenuHandle(event) {
      // 此处可以使用判断条件控制是否需要阻止右键
      event && event.preventDefault();
    },
    /**
     * 跳转到视角
     */
    setViewpoint(viewpoint) {
      if (!viewpoint) {
        console.error("视角为空");
        return;
      }
      this.api.Camera.flyToViewPort(viewpoint.position, viewpoint.heading, viewpoint.pitch);
    },
    /**
     * 获取视角
     */
    getViewpoint() {
      this.viewpoint = this.api.Camera.getViewPort();
      console.error("getViewpoint-this.viewpoint===>", this.viewpoint);
    },
    inited() {
      this.$store.dispatch("bim/getModelIds").then(modelIds => {
        // console.error('inited-modelIds===>', modelIds, modelIds.length)

        setTimeout(() => {
          if (modelIds.length > 0 && modelIds.length === this.modelList.length) {
            this.$emit("datainited");
          }
        }, 500);
      });
    },
    /**
     * 添加构件置顶渲染
     * @param featureIds 构件ids
     * @param modelId 模型id
     * @returns
     */
    topRendering({ featureIds, modelId }) {
      var options = {
        featureIds: featureIds,
        tagName: modelId,
        isMultiple: true,
      };
      this.api.Feature.topRendering(options);
    },
    /**
     * 设置模型透明度
     */
    initModelAlpha() {
      for (let i = 0; i < this.modelList.length; i++) {
        const model = this.modelList[i];
        let option = {
          featureId: [],
          modelId: model.id,
          iszoom: true,
          modelAlpha: 0.02,
          callback: null,
          flyHeading: 90,
          flyPitch: 60,
        };
        this.api.Model.setAlpha(option.modelId, option.modelAlpha);

        this.api.Model.setColor(this.cid, 255, 255, 255, 1); // 设置模型颜色
      }
    },
    setModelAlpha(alpha, modelId = this.bimconfig.modelId) {
      this.api.Model.setAlpha(modelId, alpha);
    },
    /**
     * @description 设置构件透明度
     * @param featureIds 构件id
     * @param alpha 透明度
     * @param modelId 模型id
     */
    setFeatureAlpha(featureIds, alpha, modelId = this.bimconfig.modelId) {
      this.api.Feature.setAlpha(featureIds, alpha, modelId);
    },
    /**
     * 定位构件
     */
    zoomTo(
      featureId,
      modelId = this.bimconfig.modelId,
      isZoom = true,
      modelAlpha = 0.2,
      callback,
      flyHeading = 90,
      flyPitch = 60,
      flyRange = 10,
      isDrawBox = true,
      flyTime = 0.5,
      isOnlyZoom = false
    ) {
      this.api.Feature.zoomTo(
        featureId,
        modelId || this.bimconfig.modelId,
        isZoom,
        modelAlpha,
        callback,
        flyHeading,
        flyPitch,
        flyRange,
        isDrawBox,
        flyTime,
        isOnlyZoom
      );
    },
    clearBOX23line() {
      this.api.Public.clearBOX23line();
    },
    /**
     * 左键选取
     */
    leftClick(click) {
      // 拾取坐标
      this.api.Public.pickupCoordinate(
        click.position,
        pos => {
          this.$emit("getpos", pos);
        },
        this.coorType
      );
      // 拾取模型
      // this.api.Model.getByScreenCoord(click.position, function (json) {
      //   if (json !== undefined) {
      //     // console.error("leftClick-getByScreenCoord-json===>", json);
      //   }
      // });
      // 构件拾取
      this.api.Feature.getByEvent(click.position, json => {
        // console.error("leftClick-getByEvent-json===>", json, click.position);
        this.$emit("clickMap", json, click.position);
        if (json !== undefined) {
          this.selectedFeatureId = json.id;
        }
      });
    },
    // 右键点击
    rightClick(click) {
      this.api.Public.pickupCoordinate(click.position, pos => {
        this.$emit("rightClick", pos);
      });
    },
    /**
     * 鼠标移动
     */
    mouseMove(click) {
      this.api.Feature.getByEvent(click.endPosition, json => {
        // console.error('json===>', json)
        if (json) {
          this.api.Feature.clearSelectColor();
          this.$emit("mouseMove", click.endPosition, json);
        }
      });
    },
    /**
     * 模型缩放
     */
    setScale(value = 1) {
      let modelTag = this.modelList[0].id;
      this.api.Model.scale(modelTag, value);
    },
    /**
     * 设置指定的构件显示隐藏
     */
    setItemVisible(featureList, visible) {
      if (!Array.isArray(featureList)) {
        return;
      }
      this.api.Feature.setVisible(featureList.join("#"), visible, this.bimconfig.modelId);
    },
    /**
     * 设置模型显示隐藏
     */
    setVisible(modelId) {
      if (!modelId) {
        console.error("modelId 不能为空！");
        return;
      }
      this.api.Model.original(modelId);
    },
    /**
     * 设置模型显示隐藏
     */
    setModelVisible(visible = true, modelId = null) {
      // if (!modelId) {
      //   console.error("modelId 不能为空！");
      //   return;
      // }
      let modelIds = [];
      if (modelId) {
        modelIds.push(modelId);
      } else {
        modelIds = this.modelList.map(x => x.id);
      }
      modelIds.forEach(x => {
        this.api.Model.setVisible(x, visible);
      });
    },
    /**
     * 设置指定的构件颜色
     */
    setItemColor(featureList, color, modelId) {
      if (!modelId) {
        console.error("modelId 不能为空！");
        return;
      }
      if (!color) {
        color = this.selectColor;
      }
      if (!Array.isArray(featureList)) {
        return;
      }
      let { red, green, blue, alpha } = color;
      this.api.Feature.setColor(featureList.join("#"), red, green, blue, alpha, modelId);
    },
    /**
     * 设置指定的构件颜色
     */
    setBimcodeColor(bimCode, color) {
      if (bimCode) {
        let { red, green, blue, alpha } = color;
        this.getFeatureIdsByBimCodes(bimCode).then(options => {
          if (options) {
            for (const modelId in options) {
              if (Object.hasOwnProperty.call(options, modelId)) {
                const featureIds = options[modelId];
                this.api.Feature.setColor(featureIds.join("#"), red, green, blue, alpha, modelId);
              }
            }
          }
        });
      }
    },
    /**
     * 设置指定的构件颜色
     */
    setColor(featureList, color) {
      if (!Array.isArray(featureList) || featureList.length === 0) {
        // 清除选中高亮效果
        this.api.Feature.clearSelectColor();
        if (!color) {
          color = this.defaultColor;
        }
        let { red, green, blue, alpha } = color;
        for (let i = 0; i < this.modelList.length; i++) {
          const model = this.modelList[i];
          const modelId = model.id;
          this.api.Model.setColor(modelId, red, green, blue, alpha);
        }
        return;
      }
      let dict = {};
      for (let i = 0; i < featureList.length; i++) {
        const feature = featureList[i];
        let id;
        if (typeof feature === "string") {
          id = feature;
        } else {
          id = feature.id;
        }
        if (id.indexOf("^") !== -1) {
          let modelId = id.split("^")[0];
          let featureid = id.split("^")[1];
          if (dict[modelId]) {
            dict[modelId].push(featureid);
          } else {
            dict[modelId] = [featureid];
          }
        }
      }

      let modelIds = Object.keys(dict);

      if (modelIds.length === 0) {
        console.error("modelId 不能为空！");
        return;
      }
      if (!color) {
        color = this.selectColor;
      }
      let { red, green, blue, alpha } = color;
      for (let i = 0; i < modelIds.length; i++) {
        const modelId = modelIds[i];
        let list = dict[modelId];
        this.api.Feature.setColor(list.join("#"), red, green, blue, alpha, modelId);
      }
    },
    // /**设置模型颜色 */
    // setColor(color, modelId) {
    //   if (!modelId) {
    //     modelId = this.modelList[0].id;
    //   }
    //   if (!color) {
    //     color = this.defaultColor;
    //   }
    //   let { red, green, blue, alpha } = color;
    //   this.api.Model.setColor(modelId, red, green, blue, alpha);
    // },
    /**
     * 模型初始化
     */
    async InitEngine(code = "PCPoint") {
      const modelInfo = await findByModelCode({ modelCode: code });
      if (!modelInfo || !Array.isArray(modelInfo.data) || modelInfo.data.length === 0) {
        this.$message && this.$message.error("模型配置未找到");
        return;
      }
      const config = modelInfo.data[0];
      if (config && config.defaultViewpoint) {
        try {
          config.defaultViewpoint = JSON.parse(config.defaultViewpoint);
        } catch (e) {
          config.defaultViewpoint = null;
        }
      }
      // this.noAdjustme = config.modelCode != "gisBim";
      this.bimconfig = config;
      this.cid = this.bimconfig.modelId;
      let api;
      const that = this;
      that.modelList = [];
      // 初始化模型加载
      const defaults = { ...that.$store.state.bim.defaults };
      defaults.container = this.domId;
      defaults.openterrain = this.bimconfig.openterrain === 1;
      defaults.openearth = this.bimconfig.openearth === 1;
      that.currentDeviceType
        ? (defaults.isRequestWebgl2 = false)
        : (defaults.isRequestWebgl2 = true);

      defaults.maxspaceerror = 2000; // 模型可视距 - 与原始项目保持一致

      const API = window.API;
      if (!API) {
        this.$message && this.$message.error("BIM API 未加载");
        return;
      }

      // 简化 secretkey 处理 - 直接使用 store 中的配置
      if (!defaults.secretkey) {
        defaults.secretkey = sessionStorage.getItem("BIM_SECRETKEY") || '';
      }
      
      // 确保 secretkey 是字符串类型，避免 JSON 解析问题
      if (typeof defaults.secretkey === 'string') {
        defaults.secretkey = defaults.secretkey.trim();
      } else {
        defaults.secretkey = String(defaults.secretkey || '');
      }

      // 直接初始化 API，不添加复杂的错误处理
      try {
        api = new API(defaults);
      } catch (error) {
        console.error('BIM API 初始化失败:', error);
        this.$message && this.$message.error('BIM 引擎初始化失败: ' + error.message);
        return;
      }
      
      // 禁用 Cesium Ion 服务，避免 401 错误
      if (typeof Cesium !== 'undefined' && Cesium.Ion) {
        Cesium.Ion.defaultAccessToken = '';
      }
      
      api.Public.addImageryProvider("https://image.glendale.top", true, {
        serverType: 1,
        maximumLevel: 21,
      });

      api.viewer._cesiumWidget._showRenderLoopErrors = true;
      api.viewer.scene.sun.show = false;
      api.Plugin.InitNavCube(that.options); // 导航立方初始化
      that.spinning = true;
      let isCombineId = this.bimconfig.isCombineid; // 单模 / 合模
      // 单模
      if (!isCombineId) {
        let res = await getDocById(this.cid);
        that.modelList.push({
          name: res.modelName,
          id: res.id,
          docName: res.docName,
          suffix: res.suffix,
          docType: res.docType,
          checked: true,
        });
        that.projectMessage = res; // ？？？
        that.projectMessage.modelList = that.modelList;
        that.projectMessage.sceneType = 0;
      } else {
        // 合模
        const routeQuery = (that.$route && that.$route.query) || {};
        const combineId = routeQuery.combineId ? routeQuery.combineId : that.cid;
        var res = await getClampById(combineId);
        if (res.combineDetails.length === 0) return;
        for (let i = 0; i < res.combineDetails.length; i++) {
          that.modelList.push({
            name: res.combineDetails[i].document.modelName,
            id: res.combineDetails[i].document.id,
            docName: res.combineDetails[i].document.docName,
            suffix: res.combineDetails[i].document.suffix,
            docType: res.combineDetails[i].document.docType,
            matrix: res.combineDetails[i].matrix ? JSON.parse(res.combineDetails[i].matrix) : "",
            checked: true,
          });
          that.projectMessage = res;
          that.projectMessage.modelList = that.modelList;
          that.projectMessage.sceneType = 0;
          that.projectMessage.id = undefined;
          if (this.projectMessage.camera && !this.projectMessage.camera.pitch) {
            that.projectMessage.camera = JSON.parse(that.projectMessage.camera);
          }
        }
      }
      this.api = api;
      window.api = api;
      // this.api.Public.setIsflipUnderground(false); //限制相机翻转到地底
      this.api.Public.Event("LEFT_CLICK", this.leftClick); // 绑定鼠标左侧点击事件
      this.api.Public.Event("RIGHT_CLICK", this.rightClick); // 绑定鼠标左侧点击事件
      this.api.Public.Event("MOUSE_MOVE", this.mouseMove); // 绑定鼠标左侧点击事件
      this.api.Public.setModelRotationCenter(true); // 设置以模型中心点为旋转中心
      this.api.Public.setSceneRenderState(false); // 自动实时刷新
      // this.api.Public.setSceneLight(1.3, true) //光源跟随视角
      // this.lightSource = this.api.Plugin.initLightSource() //实例化光源对象
      const myIndexedDB = localforage.createInstance({
        name: code,
      });
      this.api.Public.setIndexDB(myIndexedDB);

      this.setViewpoint(this.bimconfig.defaultViewpoint);
      this.modelinitedNum = 0;
      for (let i = 0; i < that.modelList.length; i++) {
        that.AddModel(that.modelList[i]); // 初始加载模型
      }
    },
    getConfigByCode(modelCode) {
      findByModelCode({ modelCode }).then(res => {
        console.log("🚀 ~ findByModelCode ~ res:", res);
      });
    },
    /**
     * 设置自定义标签
     */
    setTitle(text, position) {
      const option = {
        axisType: 1,
        id: "lableId1",
        position,
        text,
        // textColor: 'red' || '#22BEFE',
        displayRange: [0, 100000],
        maxDistance: 100000,
      };
      // 添加自定义标签
      this.api.Label.addBalloon(option, data => {});
      this.api.Label.getBalloonByEvent(data => {
        this.$emit("clickTag", data);
      });
    },
    /**
     * Html自定义标签-更新
     */
    updateCustomHtml(options) {
      let imgLabelExist = this.api.Label.getCustomHtml(options.id);
      if (imgLabelExist) {
        this.api.Label.updateCustomHtml(options);
      } else {
        console.error("没有Html自定义标签");
      }
    },
    /**
     * 加载模型
     */
    AddModel(data) {
      const that = this;
      var url = `${that.$store.getters.modelUrl}/tools/output/model/${data.name}/root.glt`;
      // var url = `http://192.168.10.110:18086/tools/output/model/${data.name}/root.glt`;
      if (+data.docType === 6) {
        url = `${that.$store.getters.modelUrl}/tools/output/model/${data.name}/tileset.json`;
        // url = `http://192.168.10.110:18086/tools/output/model/${data.name}/tileset.json`;
      }
      console.log("🚀 ~ AddModel ~ url:", url);
      
      // 添加模型加载前的验证
      if (!url || !that.api) {
        console.error('模型加载失败: URL 或 API 不存在');
        that.$message && that.$message.error('模型加载失败：引擎未初始化');
        return;
      }
      
      this.api.Model.mergeModel(
        url,
        data.id,
        null,
        res => {
          console.log("🚀 ~ AddModel ~ res:", res);
          
          // 检查模型加载结果
          if (res && res.loaded) {
            let complete = true;
            for (let i = 0; i < that.modelList.length; i++) {
              if (that.modelList[i].complete || that.modelList[i].id === res.obj.id) {
                that.modelList[i].complete = true;
              } else {
                complete = false;
              }
            }
            if (complete) {
              // 模型加载完成回调
              that.spinning = false;
              console.log("AddModel===>", "模型加载完成");
              // 添加光源
              this.api.Model.original(this.bimconfig.modelId);
              // if (!this.noAdjustme) this.setConfig();
              this.$emit("LoadComplete", this.api, this.modelList);
            }
            that.InitPartialEffect();
          } else {
            console.error('模型加载失败:', res);
            that.$message && that.$message.warning('模型加载部分失败，请检查模型文件');
          }
        },
        error => {
          console.error('模型加载错误:', error);
          
          // 根据错误类型提供不同的提示
          let errorMessage = '模型加载失败';
          
          if (error.message) {
            if (error.message.includes('INVALID_TOKEN')) {
              errorMessage = '模型授权失败，请重新登录或联系管理员';
            } else if (error.message.includes('域名') || error.message.includes('domain')) {
              errorMessage = '域名验证失败，请检查访问域名配置';
            } else if (error.message.includes('not exist') || error.message.includes('不存在')) {
              errorMessage = '模型文件不存在，请检查模型配置';
            } else {
              errorMessage = `模型加载失败: ${error.message}`;
            }
          }
          
          that.$message && that.$message.error(errorMessage);
          
          // 标记模型加载失败
          for (let i = 0; i < that.modelList.length; i++) {
            if (that.modelList[i].id === data.id) {
              that.modelList[i].loadError = true;
              break;
            }
          }
          // RotateAxis: 90,
          // initView: [50, -30, 0.5]
        }
      );
    },
    /**
     * @description 为项目添加配置
     */
    setConfig() {
      // 项目定制化，
      const bimId = this.cid;
      // 1.移动模型雄安
      this.api.Model.moveToPosition([115.367_688, 39.085_288, 150], 0, bimId);
      // 2.模型按z轴旋转
      this.api.Model.rotate(3, bimId);
      // 3.模型制定轴旋转
      const options = {
        point1: [2.012_984_797_117_227_7, 0.682_630_569_845_682_4, 602.528_917_847_328_6],
        point2: [2.013_774_700_247_905_6, 0.682_042_888_669_139_8, 543.207_836_075_235],
        rotate: -7,
        tags: [bimId],
        type: 0, // 經緯度高程
      };
      this.api.Model.rotateByAnyAxis(options);
      // 5.下水库地表压平
      const opt = {
        height: 0,
        id: "ssk",
        positions: [
          [2.012_886_996_648_588, 0.682_562_785_070_357_7, 492.073_574_298_146_64],
          [2.012_998_567_887_434_5, 0.682_325_652_391_520_2, 204.077_404_556_022_83],
          [2.013_121_073_343_485, 0.682_305_867_296_576_5, 198.245_238_082_922_24],
          [2.013_356_992_957_943, 0.682_367_941_377_134_3, 203.921_585_712_027_34],
          [2.013_509_870_970_774_6, 0.682_518_050_069_936_6, 319.919_116_045_433_95],
          [2.013_521_248_399_342, 0.682_604_491_523_523_5, 187.144_019_971_837_3],
          [2.013_363_743_889_489_6, 0.682_706_516_184_731_8, 370.249_110_191_792_8],
          [2.013_107_820_543_859, 0.682_719_630_270_534_2, 308.344_611_717_928_73],
        ],
      };
      this.api.Public.addEarthFlatten(opt);
      // 下水库地表压平
      const opt1 = {
        height: 0,
        id: "xsk",
        positions: [
          [2.013_688_933_872_652, 0.682_134_495_322_986_2, 92.611_821_780_018_03],
          [2.013_682_861_255_16, 0.682_151_007_993_471_5, 123.749_438_879_842_44],
          [2.013_693_669_532_812_7, 0.682_166_020_192_469_6, 130.689_593_830_032_72],
          [2.013_732_625_859_782_7, 0.682_226_266_226_788, 108.291_283_383_515_58],
          [2.013_787_987_124_451_3, 0.682_287_212_551_644_2, 161.739_445_228_338_5],
          [2.013_819_758_602_717_3, 0.682_331_164_706_827_6, 200.499_594_303_602_2],
          [2.013_822_602_833_596_6, 0.682_366_109_392_051_7, 148.697_279_577_156_85],
          [2.013_797_546_226_296, 0.682_398_704_138_510_4, 122.878_671_924_743_37],
          [2.013_757_654_188_801, 0.682_398_964_822_973_1, 135.858_081_108_187],
          [2.013_702_248_844_727_4, 0.682_370_653_459_583_9, 164.791_989_857_218_77],
          [2.013_651_392_360_338, 0.682_338_593_363_665_6, 144.670_586_425_027_4],
          [2.013_614_999_819_918, 0.682_303_596_658_712_1, 134.252_397_660_272_9],
          [2.013_576_820_288_064_6, 0.682_278_164_205_226_5, 120.478_538_035_076_27],
          [2.013_535_845_974_404, 0.682_247_205_215_539_2, 111.935_600_421_871_23],
          [2.013_522_601_997_531_4, 0.682_204_182_385_593_5, 111.260_216_072_206_69],
          [2.013_549_875_222_968, 0.682_154_619_891_481_9, 104.605_753_498_179_03],
          [2.013_589_468_781_347_6, 0.682_106_241_745_065_1, 87.523_623_569_517_06],
          [2.013_602_031_386_172_4, 0.682_065_140_115_807_1, 80.288_587_880_519_22],
          [2.013_600_974_258_570_5, 0.682_062_053_922_120_9, 82.352_582_478_444_35],
          [2.013_624_687_760_808, 0.682_018_196_652_505_2, 95.996_498_009_862_86],
          [2.013_678_273_705_722_6, 0.681_983_202_906_025_1, 76.776_402_233_116_22],
          [2.013_716_407_189_589, 0.681_983_641_949_017_3, 91.927_279_089_614_66],
          [2.013_739_850_539_720_6, 0.682_001_734_943_516_6, 113.943_287_391_040_67],
          [2.013_780_257_561_629_5, 0.682_022_700_558_132_7, 130.075_995_255_298_95],
          [2.013_830_096_592_786, 0.682_034_047_305_578_5, 99.017_801_122_480_69],
          [2.013_861_668_090_497, 0.682_054_631_674_772_6, 112.498_321_713_842_5],
          [2.013_905_071_988_546, 0.682_054_951_617_206_2, 99.299_083_621_999_32],
          [2.013_937_341_414_444_6, 0.682_061_772_828_208_3, 94.361_338_322_692_43],
          [2.013_950_420_306_945, 0.682_066_148_477_411_9, 94.146_426_001_916_17],
          [2.013_983_834_918_815_5, 0.682_077_281_582_734_6, 89.587_072_128_156_98],
          [2.014_012_735_514_162, 0.682_095_384_655_889, 81.074_543_660_389_75],
          [2.014_028_263_318_028_4, 0.682_111_028_707_166_2, 82.188_769_753_141_83],
          [2.014_023_784_904_035, 0.682_133_595_793_446_8, 95.357_964_880_035_04],
          [2.014_000_385_579_455_7, 0.682_150_950_333_876_5, 93.126_895_264_264_68],
          [2.013_970_874_551_639_6, 0.682_159_523_450_742_7, 83.134_569_574_979_47],
          [2.013_927_127_450_106_3, 0.682_163_084_807_324_8, 113.993_504_109_901_42],
          [2.013_895_655_096_699_3, 0.682_161_900_522_370_7, 153.962_948_951_624_4],
          [2.013_865_696_136_395, 0.682_155_602_766_353_5, 132.961_360_669_476_6],
          [2.013_832_154_922_674, 0.682_146_639_388_395_5, 109.866_619_084_334_26],
          [2.013_789_980_111_709, 0.682_151_623_179_117_7, 106.749_664_991_341_4],
          [2.013_760_045_816_173_5, 0.682_144_637_114_914_9, 98.974_361_663_428_37],
          [2.013_725_818_503_506, 0.682_133_686_132_517_6, 89.021_716_599_359_35],
          [2.013_691_015_254_403_6, 0.682_138_217_267_413_7, 96.310_670_987_184_03],
        ],
      };
      this.api.Public.addEarthFlatten(opt1);
      // 6.开启水波纹
      const WaterRippleRadar = this.api.Plugin.initWaterRipple();
      // 上水库
      WaterRippleRadar.addWaterRipple(
        "ssk",
        [
          115.343_005_436_868_42, 39.115_561_957_270_34, 115.356_152_211_530_24,
          39.115_283_241_851_19, 115.359_077_756_611_04, 39.113_194_415_334_11,
          115.361_026_336_874_59, 39.111_047_189_044_12, 115.364_187_422_058_17,
          39.109_682_899_491_04, 115.364_027_307_236_82, 39.106_589_072_506_004,
          115.359_704_278_159_87, 39.103_832_222_674_924, 115.356_633_139_164_4,
          39.098_614_676_596_16, 115.355_944_704_912_69, 39.098_104_633_983_7,
          115.345_401_297_328_95, 39.096_631_136_441_246, 115.343_775_834_154_5,
          39.095_812_452_621_34, 115.342_746_257_713_83, 39.094_955_581_967_376,
          115.337_399_616_075_05, 39.095_745_677_048_114, 115.336_559_368_697_24,
          39.096_693_985_768_69, 115.334_755_329_096_01, 39.100_055_395_845_644,
          115.332_425_617_166_83, 39.107_985_865_143_34,
        ],
        55.1,
        55,
        [0.2, 0.3, 0.6, 1]
      );
      // 下水库
      WaterRippleRadar.addWaterRipple(
        "xsk",
        [
          115.374_277_153_790_22, 39.084_416_520_849_18, 115.376_853_079_296_11,
          39.088_650_767_207_78, 115.381_275_979_133_73, 39.094_220_643_177_38,
          115.381_871_935_288_74, 39.096_730_984_238_88, 115.380_880_102_120_81,
          39.097_021_333_219_74, 115.377_841_046_893_88, 39.095_872_160_781_59,
          115.372_142_347_440_91, 39.092_668_291_489_9, 115.367_349_300_796_08,
          39.088_334_980_247_01, 115.367_466_516_730_99, 39.086_720_179_487_52,
          115.371_196_537_523_97, 39.082_585_301_017_88, 115.372_304_104_637_51,
          39.078_464_864_865_04, 115.373_793_135_632_94, 39.076_898_047_008_15,
          115.374_870_822_048_83, 39.076_241_155_665_855, 115.377_011_222_844_71,
          39.075_581_636_976_914, 115.381_206_914_677_95, 39.078_641_642_866_88,
          115.389_259_097_271_73, 39.080_415_386_322_15, 115.390_563_445_595_46,
          39.080_308_022_925_706, 115.393_905_018_225_44, 39.081_965_593_092_17,
          115.393_408_817_645_34, 39.083_413_928_945_24, 115.387_734_989_820_7,
          39.083_807_335_189_526, 115.385_121_143_315_3, 39.083_086_093_006_66,
          115.382_730_196_103_24, 39.083_043_475_308_87, 115.380_472_375_017_35,
          39.083_214_945_312_18, 115.377_164_894_256_47, 39.081_892_005_514_09,
          115.376_400_905_699_8, 39.082_118_537_040_01,
        ],
        55.1,
        55,
        [0.2, 0.3, 0.6, 1]
      );
    },
    /**
     * 主视图
     */
    MainView() {
      if (this.projectMessage.id) {
        this.api.Model.location(this.projectMessage.id);
      } else {
        if (this.projectMessage.camera) {
          this.api.Camera.SetCamera(
            this.projectMessage.camera.position,
            this.projectMessage.camera.heading,
            this.projectMessage.camera.pitch
          );
        }
      }
    },
    InitPartialEffect() {
      const that = this;
      let labelList = JSON.parse(localStorage.getItem("LabelList_" + that.projectMessage.id));
      if (labelList) {
        labelList.forEach(element => {
          if (element.state) {
            this.api.Label.addBalloon(element);
          }
        });
      }
    },
    /**
     * 构件发光
     */
    addUnrealBloom(selfLuminousList, option, batchId) {
      let that = this;
      const Cesium = window.Cesium;
      if (!Cesium) {
        return;
      }
      for (let i = 0; i < selfLuminousList.length; i++) {
        var tempmap = new Map();
        tempmap.set(selfLuminousList[i], batchId); // batchId如果没有传入-1
        let options = {
          featureIds: tempmap,
          bloomColor: Cesium.Color.YELLOW,
          ...option,
        };
        that.api.Lights.addUnrealBloom(options);
      }
    },
    // _isMobile() {
    //   let flag = navigator.userAgent.match(
    //     /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    //   )
    //   return flag
    // },
  },
  unmounted() {},
  watch: {
    modelinitedNum: {
      handler(newValue) {
        if (newValue === this.modelList.length && newValue > 0) {
          this.inited();
          this.$emit("inited");
        }
      },
      immediate: true,
      deep: true,
    },
    modelDataInitedIds: {
      handler(newValue) {
        if (newValue.length > 0 && newValue.length === this.modelList.length) {
          this.$emit("datainited");
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.EnginePage :deep(.cesium-plugin-cube) {
  // display: none;
}
@import "./BimCss.scss";
</style>
<style lang="scss">
.oprate-btns {
  position: absolute;
  top: 30px;
  right: 500px;
  width: auto;
  text-align: left;
  cursor: pointer;

  .btn-item {
    margin: 5px;
    display: flex;
    align-items: center;
    background: #eee;
    padding: 7px;
    border-radius: 3px;
  }
}

.model-list {
  position: absolute;
  left: 0px;
  top: 0px;
  // z-index: 1;
  // padding: 5px;
  background: #15123e;
  // border-radius: 5px;

  .model-item {
    margin: 5px;
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
