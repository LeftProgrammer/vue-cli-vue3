<template>
  <div class="footer-box" :class="currentDeviceType ? 'footer-mobile' : ''">
    <div class="footer-btn">
      <div
        class="btn-tool"
        v-for="value in functionMenu"
        :key="value.id"
        v-show="value.show"
        @click.stop="value.children == undefined ? FunctionChoose(value) : null"
      >
        <el-tooltip
          v-if="value.children && value.children.length > 0"
          placement="top"
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode;
            }
          "
          :overlayClassName="'example-overlay'"
        >
          <template v-if="value.children" slot="title">
            <el-tooltip
              v-for="item in value.children"
              :key="item.id"
              placement="rightTop"
              :title="item.name"
              v-show="item.show"
              @click="FunctionChoose(item)"
            >
              <div class="meature-btn">
                <span class="iconfont" :class="'icon-' + item.icon"></span>
              </div>
            </el-tooltip>
          </template>
          <span class="iconfont" :class="'icon-' + value.icon"></span>
        </el-tooltip>
        <el-tooltip v-else :title="value.name">
          <span class="iconfont" :class="'icon-' + value.icon"></span>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { MeasurementType } from "./Measurement";
import ProfessionalStructureTree from "./ProfessionalStructureTree";
import FloorStructureTree from "./FloorStructureTree";
import SpatialStructureTree from "./SpatialStructureTree";
import ModelView from "./ModelView";
import ModelSectioning from "./ModelSectioning.vue";
import ComponentSectioning from "./ComponentSectioning";
import FirstPersonRoaming from "./FirstPersonRoaming";
import CustomViewpoint from "./CustomViewpoint";
import ModelTransparency from "./ModelTransparency";
import DrawGrids from "./DrawGrids";
import ModelExplosion from "./ModelExplosion.vue";
import ModelScaling from "./ModelScaling.vue";
import DimensionalLinkage from "./DimensionalLinkage";
import ViewpointManagement from "./ViewpointManagement.vue";
import PostilList from "./PostilList.vue";
import LabelManagement from "./LabelManagement";
import ComponentSelection from "./ComponentSelection";
import ComponentFraming from "./ComponentFraming";
import ComponentProperties from "./ComponentProperties";
import ComponentHiding from "./ComponentHiding";
import ComponentColor from "./ComponentColor";
import ComponentTransparency from "./ComponentTransparency";
import ComponentOffset from "./ComponentOffset";
import ComponentRotation from "./ComponentRotation";
import WeatherEffect from "./WeatherEffect";
import ParticleEffect from "./ParticleEffect";
import SelfLuminous from "./SelfLuminous";
import ComponentFlicker from "./ComponentFlicker";
import RadarScanning from "./RadarScanning";
import BackgroundColor from "./BackgroundColor";
import SunshineTime from "./SunshineTime";
import ModelEffect from "./ModelEffect";
import FloorLayering from "./FloorLayering";
export default {
  props: {
    projectMessage: {
      type: Object,
      default: undefined,
    },
    layerVisible: {
      type: Boolean,
    },
    settingVisible: {
      type: Boolean,
    },
    currentDeviceType: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ProfessionalStructureTree,
    FloorStructureTree,
    SpatialStructureTree,
    ModelSectioning,
    ComponentSectioning,
    ModelView,
    FirstPersonRoaming,
    CustomViewpoint,
    ModelTransparency,
    DrawGrids,
    ModelExplosion,
    ModelScaling,
    DimensionalLinkage,
    ViewpointManagement,
    PostilList,
    LabelManagement,
    ComponentSelection,
    ComponentFraming,
    ComponentProperties,
    ComponentHiding,
    ComponentColor,
    ComponentTransparency,
    ComponentOffset,
    ComponentRotation,
    WeatherEffect,
    ParticleEffect,
    SelfLuminous,
    ComponentFlicker,
    RadarScanning,
    BackgroundColor,
    SunshineTime,
    ModelEffect,
    FloorLayering,
  },
  data() {
    return {
      DocConfig: undefined,
      functionMenu: undefined,
      specialShow: false,
    };
  },
  mounted() {},
  methods: {
    init(docConfig) {
      this.DocConfig = docConfig;
      console.log(docConfig);
      this.functionMenu = [
        {
          id: "MainView",
          icon: "zhushitu",
          name: "主视图",
          show: true,
        },
        {
          icon: "zuzhijiegou",
          name: "结构",
          show: this.DocConfig ? true : false,
          children: [
            {
              id: "LayerStructure",
              icon: "layer",
              name: "图层结构",
              show: true,
            },
            {
              id: "ProfessionalStructure",
              icon: "tree",
              name: "专业结构",
              show: true,
            },
            {
              id: "FloorStructure",
              icon: "loucengchaifen",
              name: "楼层结构",
              show: true,
            },
            // {
            //   id: 'SpaceStructure',
            //   icon: 'kongjian',
            //   name: '空间结构',
            // },
          ],
        },
        // {
        //   id: 'ModelView',
        //   icon: 'view',
        //   name: '模型视图',
        //   show: true,
        // },
        {
          icon: "moxingyingyong",
          name: "模型操作",
          show: this.DocConfig ? true : false,
          children: [
            {
              id: "ModelTransparency",
              icon: "toumingdutiaojie",
              name: "模型透明",
              show: true,
            },
            {
              id: "DrawGrids",
              icon: "dituleiwanggequ",
              name: "绘制轴网",
              show: true,
            },
            {
              id: "ModelExplosion",
              icon: "boom",
              name: "模型爆炸",
              show: this.currentDeviceType ? false : true,
            },
            {
              id: "ModelScaling",
              icon: "scale",
              name: "模型缩放",
              show: true,
            },
          ],
        },
        {
          icon: "liandong",
          name: "构件操作",
          show: this.DocConfig ? this.DocConfig.modelSuffix != "osgb" : false,
          children: [
            {
              id: "ComponentSelection",
              icon: "xuanze",
              name: "构件选择",
              show: true,
            },
            {
              id: "ComponentFraming",
              icon: "icon_kuangxuanQuery",
              name: "构件框选",
              show: true,
            },
            {
              id: "ComponentProperties",
              icon: "yinqing_goujianshuxing",
              name: "构件属性",
              show: true,
            },
            {
              id: "ComponentHiding",
              icon: "bimgis_yincang",
              name: "构件隐藏",
              show: true,
            },
            {
              id: "ComponentColor",
              icon: "yanse",
              name: "构件颜色",
              show: true,
            },
            {
              id: "ComponentTransparency",
              icon: "touming",
              name: "构件透明",
              show: true,
            },
            {
              id: "ComponentOffset",
              icon: "pianyiweiyi",
              name: "构件偏移",
              show: this.currentDeviceType ? false : true,
            },
            {
              id: "ComponentRotation",
              icon: "raogoujianxuanzhuan",
              name: "构件旋转",
              show: this.currentDeviceType ? false : true,
            },
          ],
        },
        {
          icon: "yinqing_pouqie",
          name: "剖切",
          show: this.DocConfig ? this.DocConfig.modelSuffix != "osgb" : false,
          children: [
            {
              id: "ModelSectioning",
              icon: "shitupouqiehe",
              name: "模型剖切",
              show: true,
            },
            {
              id: "ComponentSectioning",
              icon: "pouqie",
              name: "构件剖切",
              show: true,
            },
          ],
        },
        {
          icon: "gis_manyou",
          name: "漫游",
          show: true,
          children: [
            {
              id: "FirstPersonRoam",
              icon: "roam",
              name: "第一人称漫游",
              show: this.currentDeviceType ? false : true,
            },
            {
              id: "CustomViewpoint",
              icon: "zhushidian",
              name: "自定义视点漫游",
              show: true,
            },
          ],
        },
        {
          id: "DimensionalLinkage",
          icon: "liandongguanli",
          name: "二三维联动",
          show: this.DocConfig
            ? (this.DocConfig.modelSuffix == "revit" ||
                this.DocConfig.modelSuffix == "tekla") &&
              this.DocConfig.drawing == 1
            : false,
        },
        {
          id: "ViewpointManagement",
          icon: "shitushidianguanli",
          name: "视点管理",
          show: true,
        },
        {
          id: "ViewPostil",
          icon: "zhushidian",
          name: "批注问题",
          show: this.DocConfig ? true : false,
        },
        {
          id: "LabelManagement",
          icon: "biaoqian",
          name: "标签管理",
          show: true,
        },
        {
          id: "FloorLayering",
          icon: "fenceng",
          name: "楼层分层",
          show: this.currentDeviceType && !this.DocConfig ? false : true,
        },
        {
          icon: "shituxuanranmoshi",
          name: "效果设置",
          show: true,
          children: [
            {
              id: "WeatherEffect",
              icon: "tianqi",
              name: "天气效果",
              show: true,
            },
            {
              id: "ParticleEffect",
              icon: "xiaoguo",
              name: "粒子效果",
              show: true,
            },
            {
              id: "SelfLuminous",
              icon: "bulb",
              name: "自发光",
              show: this.currentDeviceType ? false : true,
            },
            {
              id: "ComponentFlicker",
              icon: "shanshuo",
              name: "构件闪烁",
              show: true,
            },
            {
              id: "RadarScanning",
              icon: "yunliankeji_gongyinglianfuben",
              name: "雷达扫描",
              show: true,
            },
            {
              id: "BackgroundColor",
              icon: "beijingyanse",
              name: "背景颜色",
              show: true,
            },
            {
              id: "SunshineTime",
              icon: "rizhaoshishu",
              name: "日照时间",
              show: true,
            },
            {
              id: "ModelEffect",
              icon: "moxingguanli1",
              name: "模型效果",
              show: true,
            },
          ],
        },
        {
          icon: "celiang",
          name: "测量",
          show: true,
          children: [
            {
              id: "DistanceMeasurement",
              icon: "shitudianduidian",
              name: "距离测量",
              show: true,
            },
            {
              id: "AreaMeasurement",
              icon: "mianjiceliang",
              name: "面积测量",
              show: true,
            },
            {
              id: "AngleMeasurement",
              icon: "jiaodu",
              name: "角度测量",
              show: true,
            },
            {
              id: "ComponentAreaMeasurement",
              icon: "mianji",
              name: "构件面积",
              show: this.currentDeviceType ? false : true,
            },
            {
              id: "ComponentVolumeMeasurement",
              icon: "iconfonttubiao_tiji",
              name: "构件体积",
              show: this.currentDeviceType ? false : true,
            },
            {
              id: "ComponentSizeMeasurement",
              icon: "bianjidaxiao",
              name: "构件尺寸",
              show: this.currentDeviceType ? false : true,
            },
            {
              id: "ElevationSurveyMeasurement",
              icon: "gaodu",
              name: "高程测量",
              show: true,
            },
            // {
            //   id: 'SubExcavationMeasurement',
            //   icon: 'tianwafangfenxi',
            //   name: '填挖方',
            //   show: this.specialShow,
            // },
            {
              id: "ClearResults",
              icon: "qiangzhiqingchu",
              name: "清除测量",
              show: true,
            },
          ],
        },
        {
          id: "GISSceneSettings",
          icon: "logistic",
          name: "GIS场景设置",
          show: true,
        },
      ];
    },
    FunctionChoose(type) {
      const that = this;
      if (type.id.indexOf("Measurement") == -1) {
        MeasurementType(
          {
            id: "ClearResults",
          },
          that
        );
      }
      that.ClearEvent();
      switch (type.id) {
        case "MainView":
          that.$emit("MainView");
          break;
        case "LayerStructure": //图层结构
          that.$emit("update:layerVisible", true);
          break;
        case "ProfessionalStructure": //专业结构
          that.NotificationPopup({
            title: type.name,
            description: (
              <ProfessionalStructureTree
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "FloorStructure": //楼层结构
          that.NotificationPopup({
            title: type.name,
            description: (
              <FloorStructureTree
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "SpaceStructure": //空间结构
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <SpatialStructureTree
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "ModelView": //模型视图
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ModelView
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "ModelSectioning": //模型剖切
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ModelSectioning
                modelList={that.projectMessage.modelList}
                store={that.$store}
              />
            ),
          });
          break;
        case "ComponentSectioning": //构件剖切
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ComponentSectioning
                modelList={that.projectMessage.modelList}
                store={that.$store}
              />
            ),
          });
          break;
        case "DistanceMeasurement": //距离测量
        case "AreaMeasurement": //面积测量
        case "AngleMeasurement": //角度测量
        case "ComponentAreaMeasurement": //构件面积
        case "ComponentVolumeMeasurement": //构件体积
        case "ComponentSizeMeasurement": //构件尺寸
        case "ElevationSurveyMeasurement": //高程测量
        case "SubExcavationMeasurement": //填挖方
          MeasurementType(type, that);
          break;
        case "FirstPersonRoam": //第一人称漫游
          that.NotificationPopup({
            title: type.name,
            description: (
              <FirstPersonRoaming projectMessage={that.projectMessage} />
            ),
          });
          break;
        case "CustomViewpoint": //自定义视点漫游
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <CustomViewpoint
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "ModelTransparency": //模型透明
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ModelTransparency
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "DrawGrids": //绘制轴网
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <DrawGrids
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "ModelExplosion": //模型爆炸
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ModelExplosion
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "ModelScaling": //模型缩放
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ModelScaling
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "DimensionalLinkage": //二三维联动
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <DimensionalLinkage
                projectMessage={that.projectMessage}
                store={that.$store}
                currentDeviceType={that.currentDeviceType}
              />
            ),
            placement: "topLeft",
            tips: "linkage-notification",
          });
          break;
        case "ViewpointManagement": //视点管理
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ViewpointManagement
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "ViewPostil": //批注
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            width: "320px",
            description: (
              <PostilList
                projectMessage={that.projectMessage}
                store={that.$store}
                show={true}
              />
            ),
          });
          break;
        case "LabelManagement": //标签管理
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <LabelManagement
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "ComponentSelection": //构件选择
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ComponentSelection
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "ComponentFraming": //构件框选
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ComponentFraming
                projectMessage={that.projectMessage}
                store={that.$store}
                currentDeviceType={that.currentDeviceType}
              />
            ),
            tips: "tip-notification",
            placement: "bottomRight",
            width: "105px",
          });
          break;
        case "ComponentProperties": //构件属性
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ComponentProperties
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "ComponentHiding": //构件隐藏
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ComponentHiding
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "ComponentColor": //构件颜色
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ComponentColor
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "ComponentTransparency": //构件透明
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ComponentTransparency
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "ComponentOffset": //构件偏移
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ComponentOffset
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "ComponentRotation": //构件旋转
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ComponentRotation
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "WeatherEffect": //天气效果
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <WeatherEffect
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "ParticleEffect": //粒子效果
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ParticleEffect
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "SelfLuminous": //自发光
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <SelfLuminous
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "ComponentFlicker": //构件闪烁
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ComponentFlicker
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "RadarScanning": //雷达扫描
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <RadarScanning
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "BackgroundColor": //背景颜色
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <BackgroundColor
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "SunshineTime": //日照时间
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <SunshineTime
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "ModelEffect": //模型效果
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <ModelEffect
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "FloorLayering": //楼层分层
          that.NotificationPopup({
            title: type.name,
            id: type.id,
            description: (
              <FloorLayering
                projectMessage={that.projectMessage}
                store={that.$store}
              />
            ),
          });
          break;
        case "GISSceneSettings": //GIS场景设置
          that.$emit("update:settingVisible", true);
          break;
      }
    },
    NotificationPopup(parameter) {
      const that = this;
      that.$notification.open({
        key: "EngineKey",
        message: parameter.title,
        description: parameter.description,
        class: "engine-notification " + (parameter.tips ? parameter.tips : ""),
        duration: null,
        placement: parameter.placement ? parameter.placement : "topRight",
        style: {
          width: parameter.width ? parameter.width : "280px",
          marginRight: `20px`,
        },
      });
    },
    ClearEvent() {
      const that = this;
      that.$notification.destroy();
      api.Public.clearHandler();
      api.Feature.clearSelectColor();
      api.Feature.cancelBoxSelect();
      that.projectMessage.modelList.forEach((item) => {
        api.Model.original(item.id);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../BimCss.scss";
</style>