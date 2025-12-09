<template>
  <div style="height: 100%" class="smaple case-div">
    <div class="html-main">
      <div class="show-main">
        <div class="pre-div" style="height: 100%">
          <div id="cesiumContainer" class="cesiumContainer"></div>
          <div class="range bom">
            <span
              id="progress"
              class="play bom"
              @click="processStartClick"
            ></span>
            <span id="sliderline">
              <el-slider v-model="sliderValue"></el-slider>
            </span>
          </div>
        </div>
      </div>
      <div class="show-main">
        <div id="gantt_here" class="gantt_here"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDocById,
  getDocumentConfig,
  getFeatureProperty,
  getFloorStructureTree,
  getModelTypeTreeIdList,
} from "@/components/BimEngine/api/document";
import { getClampById } from "@/components/BimEngine/api/combine";
// import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";

export default {
  data() {
    return {
      //进度开始
      GoOn: false,
      timer: "",
      markid: null,
      //进度模拟
      markIndex: 0,
      y: 0,
      x: 0,
      dateary: [],
      guidsstr: null,
      guidsAry: [],
      hideval: null,
      ModelShow: false,
      ms: [],
      zNodes: [],
      Mids: [],
      clippercent: 0,
      blowValue: 0.1,

      sliderValue: 0,

      gisData: {
        data: "kongyazhan_gis^1671893#kongyazhan_gis^1735058#kongyazhan_gis^1742616#kongyazhan_gis^1724175#kongyazhan_gis^1714929#kongyazhan_gis^1672091#kongyazhan_gis^1675045#kongyazhan_gis^1721417#kongyazhan_gis^1672092#kongyazhan_gis^1676795#kongyazhan_gis^1722483#kongyazhan_gis^1675122#kongyazhan_gis^1724269#kongyazhan_gis^1677131#kongyazhan_gis^1677188#kongyazhan_gis^1675531#kongyazhan_gis^1672086#kongyazhan_gis^1716379#kongyazhan_gis^1716377#kongyazhan_gis^1716378#kongyazhan_gis^1724311#kongyazhan_gis^1721892#kongyazhan_gis^1734840#kongyazhan_gis^1672087#kongyazhan_gis^1672088#kongyazhan_gis^1704474#kongyazhan_gis^1722099#kongyazhan_gis^1722115#kongyazhan_gis^1722196#kongyazhan_gis^1702591#kongyazhan_gis^1675576#kongyazhan_gis^1672223#kongyazhan_gis^1698499#kongyazhan_gis^1703050#kongyazhan_gis^1676297#kongyazhan_gis^1675982#kongyazhan_gis^1726696#kongyazhan_gis^1721855#kongyazhan_gis^1690993#kongyazhan_gis^1702901#kongyazhan_gis^1690994#kongyazhan_gis^1704784#kongyazhan_gis^1698404#kongyazhan_gis^1672246#kongyazhan_gis^1723890#kongyazhan_gis^1723783#kongyazhan_gis^1702742#kongyazhan_gis^1702783#kongyazhan_gis^1682767#kongyazhan_gis^1672222#kongyazhan_gis^1676992#kongyazhan_gis^1731006#kongyazhan_gis^1748951#kongyazhan_gis^1704988#kongyazhan_gis^1727285#kongyazhan_gis^1684422#kongyazhan_gis^1720940#kongyazhan_gis^1672881#kongyazhan_gis^1734631#kongyazhan_gis^1741473#kongyazhan_gis^1699961#kongyazhan_gis^1672583#kongyazhan_gis^1675653#kongyazhan_gis^1672481#kongyazhan_gis^1723724#kongyazhan_gis^1699987#kongyazhan_gis^1672224#kongyazhan_gis^1726797#kongyazhan_gis^1681388#kongyazhan_gis^1681308#kongyazhan_gis^1723686#kongyazhan_gis^1677212#kongyazhan_gis^1672398#kongyazhan_gis^1675210#kongyazhan_gis^1672484#kongyazhan_gis^1727376#kongyazhan_gis^1686335#kongyazhan_gis^1672940#kongyazhan_gis^1672501#kongyazhan_gis^1672744#kongyazhan_gis^1727594#kongyazhan_gis^1699860#kongyazhan_gis^1676086#kongyazhan_gis^1699798#kongyazhan_gis^1727779#kongyazhan_gis^1676946#kongyazhan_gis^1672485#kongyazhan_gis^1705100#kongyazhan_gis^1684797#kongyazhan_gis^1731482#kongyazhan_gis^1676898#kongyazhan_gis^1672301#kongyazhan_gis^1702715#kongyazhan_gis^1681790#kongyazhan_gis^1681629#kongyazhan_gis^1675364#kongyazhan_gis^1702238#kongyazhan_gis^1676852#kongyazhan_gis^1672225#kongyazhan_gis^1672482#kongyazhan_gis^1740845#kongyazhan_gis^1672226#kongyazhan_gis^1672227#kongyazhan_gis^1672228#kongyazhan_gis^1699437#kongyazhan_gis^1703334#kongyazhan_gis^1704318#kongyazhan_gis^1702593#kongyazhan_gis^1687506#kongyazhan_gis^1682943#kongyazhan_gis^1687612#kongyazhan_gis^1689591#kongyazhan_gis^1689282#kongyazhan_gis^1735100#kongyazhan_gis^1683255#kongyazhan_gis^1735890#kongyazhan_gis^1729337#kongyazhan_gis^1735692#kongyazhan_gis^1715200#kongyazhan_gis^1705492#kongyazhan_gis^1705360#kongyazhan_gis^1705158#kongyazhan_gis^1676486#kongyazhan_gis^1686404#kongyazhan_gis^1676512#kongyazhan_gis^1686355#kongyazhan_gis^1723732#kongyazhan_gis^1684655#kongyazhan_gis^1676972#kongyazhan_gis^1684738#kongyazhan_gis^1720874#kongyazhan_gis^1724097#kongyazhan_gis^1724163#kongyazhan_gis^1690996#kongyazhan_gis^1690995#kongyazhan_gis^1701790#kongyazhan_gis^1735262#kongyazhan_gis^1723911#kongyazhan_gis^1715419#kongyazhan_gis^1715583#kongyazhan_gis^1715549#kongyazhan_gis^1715383#kongyazhan_gis^1721298#kongyazhan_gis^1732186#kongyazhan_gis^1734765#kongyazhan_gis^1715214#kongyazhan_gis^1715413#kongyazhan_gis^1720372#kongyazhan_gis^1708381#kongyazhan_gis^1706025#kongyazhan_gis^1708390#kongyazhan_gis^1749263#kongyazhan_gis^1731796#kongyazhan_gis^1749260#kongyazhan_gis^1734337#kongyazhan_gis^1672992#kongyazhan_gis^1731743#kongyazhan_gis^1726846#kongyazhan_gis^1681422#kongyazhan_gis^1726826#kongyazhan_gis^1681410#kongyazhan_gis^1731838#kongyazhan_gis^1731846#kongyazhan_gis^1731784#kongyazhan_gis^1731792#kongyazhan_gis^1731818#kongyazhan_gis^1731765#kongyazhan_gis^1682986#kongyazhan_gis^1682965#kongyazhan_gis^1689609#kongyazhan_gis^1720588#kongyazhan_gis^1712472#kongyazhan_gis^1732146#kongyazhan_gis^1681802#kongyazhan_gis^1672993#kongyazhan_gis^1734385#kongyazhan_gis^1681814#kongyazhan_gis^1673004#kongyazhan_gis^1683213#kongyazhan_gis^1732126#kongyazhan_gis^1681826#kongyazhan_gis^1673015#kongyazhan_gis^1734743#kongyazhan_gis^1732105#kongyazhan_gis^1683192#kongyazhan_gis^1681838#kongyazhan_gis^1731941#kongyazhan_gis^1675823#kongyazhan_gis^1683171#kongyazhan_gis^1689619#kongyazhan_gis^1683045#kongyazhan_gis^1673026#kongyazhan_gis^1689627#kongyazhan_gis^1689637#kongyazhan_gis^1721299#kongyazhan_gis^1713828#kongyazhan_gis^1713818#kongyazhan_gis^1712555#kongyazhan_gis^1712514#kongyazhan_gis^1720628#kongyazhan_gis^1720607#kongyazhan_gis^1739555#kongyazhan_gis^1673044#kongyazhan_gis^1684356#kongyazhan_gis^1684301#kongyazhan_gis^1673025#kongyazhan_gis^1731904#kongyazhan_gis^1726886#kongyazhan_gis^1681446#kongyazhan_gis^1735031#kongyazhan_gis^1731892#kongyazhan_gis^1731926#kongyazhan_gis^1731900#kongyazhan_gis^1739182#kongyazhan_gis^1683028#kongyazhan_gis^1739052#kongyazhan_gis^1740014#kongyazhan_gis^1740116#kongyazhan_gis^1749257#kongyazhan_gis^1672891#kongyazhan_gis^1672950#kongyazhan_gis^1732166#kongyazhan_gis^1731850#kongyazhan_gis^1673003#kongyazhan_gis^1731730#kongyazhan_gis^1731738#kongyazhan_gis^1749266#kongyazhan_gis^1673014#kongyazhan_gis^1726866#kongyazhan_gis^1681434#kongyazhan_gis^1731872#kongyazhan_gis^1683234#kongyazhan_gis^1689599#kongyazhan_gis^1683007#kongyazhan_gis^1707689#kongyazhan_gis^1734649#kongyazhan_gis^1712290#kongyazhan_gis^1721645#kongyazhan_gis^1705441#kongyazhan_gis^1705222#kongyazhan_gis^1734772#kongyazhan_gis^1672089#kongyazhan_gis^1722521#kongyazhan_gis^1722664#kongyazhan_gis^1722759#kongyazhan_gis^1724018#kongyazhan_gis^1723978",
      },
    };
  },
  props: {
    id: {
      type: String,
      default: "3a0d6217-4be9-fb3a-c934-d757586fc520",
    },
    cid: {
      type: String,
      default: "",
    },
  },
  async mounted() {
    const that = this;
    await that.InitEngine();
    this.initGantt();
    this.ProgressStart();
  },
  methods: {
    //滑块处理
    sliderChangeHandle(newValue, oldValue) {
      gantt.scrollTo(newValue, 0);
      var today = gantt.getMarker(this.markid);
      today.start_date = Date.parse(this.dateary[newValue]);
      gantt.updateMarker(this.markid);
      if (newValue > oldValue) {
        for (var i = oldValue; i < newValue; i++) {
          api.Feature.SetActorVisible(this.guidsAry[i], true);
        }
        if (newValue < this.hideval) {
          for (var i = newValue; i < this.guidsAry.length; i++) {
            api.Feature.SetActorVisible(this.guidsAry[i], false);
          }
          this.hideval = newValue;
        }
      } else {
        for (var i = newValue; i < oldValue; i++) {
          api.Feature.SetActorVisible(this.guidsAry[i], false);
        }
      }
      this.markIndex = newValue;
    },
    ProgressStart() {
      let markerDom = document.querySelector(".gantt_marker");
      if (markerDom) {
        markerDom.parentElement.removeChild(markerDom);
      }

      for (var y = 1; y <= 11; y++) {
        for (var i = 0; i <= 23; i++) {
          this.dateary.push("2018-4-" + y + " " + i + ":00:00");
        }
      }
      this.markid = gantt.addMarker({
        start_date: Date.parse(this.dateary[this.markIndex]), // new Date(),
        css: "today",
      });
    },
    //初始化变量
    reset() {
      this.GoOn = false;
      this.timer = "";
      this.markid = null;
      //进度模拟
      this.markIndex = 0;
      this.y = 0;
      this.x = 0;
    },
    start() {
      this.timer = setInterval(() => {
        this.y = this.y + 1;
        this.markIndex++;
        var today = gantt.getMarker(this.markid);
        today.start_date = Date.parse(this.dateary[this.markIndex]);
        gantt.updateMarker(this.markid);
        gantt.scrollTo(this.x, this.y);
        if (this.markIndex >= this.guidsAry.length - 9) {
          clearInterval(this.timer);
          // $("#progress").removeClass("pauseon").addClass("play");
          let progressDom = document.querySelector("#progress");
          progressDom.classList.remove("pauseon");
          progressDom.classList.add("play");

          this.GoOn = false;
        }
        this.sliderValue = this.markIndex;
      }, 100);
    },
    //暂停
    ProgressPauseon() {
      clearInterval(this.timer);
    },
    /** 点击开始 */
    processStartClick() {
      let progressDom = document.querySelector("#progress");

      console.log(
        "processStartClick",
        this.GoOn,
        progressDom.classList.contains("play")
      );

      if (progressDom.classList.contains("play")) {
        progressDom.classList.remove("play");
        progressDom.classList.add("pauseon");
        if (this.GoOn) {
          //暂停后继续
          this.start();
        } else {
          this.reset();
          setTimeout(() => {
            this.ProgressStart();
            this.start();
          }, 50);
        }
      } else {
        progressDom.classList.remove("pauseon");
        progressDom.classList.add("play");
        this.GoOn = true;
        this.ProgressPauseon();
      }
    },
    async InitEngine() {
      const that = this;

      this.guidsstr = this.gisData.data;
      this.guidsAry = this.guidsstr.split("#");
      this.hideval = this.guidsAry.length;

      that.modelList = [];
      //初始化模型加载
      const defaults = { ...that.$store.state.bim.defaults };
      defaults.container = this.domId;
      that.currentDeviceType
        ? (defaults.isRequestWebgl2 = false)
        : (defaults.isRequestWebgl2 = true);

      defaults.showfps = true; //显示 fps
      // defaults.openearth = true; //开启场
      defaults.maxspaceerror = 1000; //模型可视距
      // defaults.selectedcolor = `rgba(${this.selectColor.red},${this.selectColor.green},${this.selectColor.blue},${this.selectColor.alpha})`;
      // defaults.colorBlendMode = 1;

      console.log("defaults", defaults);
      api = new API(defaults);
      // var nowTime = that.$store.state.bim.sunshineTime
      // var hour = parseInt(nowTime / 60)
      // var minute = nowTime % 60
      // var time = (hour < 10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute)
      // api.Public.setSunshineDuration(time);
      api.viewer._cesiumWidget._showRenderLoopErrors = true;
      api.Plugin.InitNavCube(that.options); // 实例化出来的对象可用于更新和设置可视状态
      that.spinning = true;
      const docId = that.$route.query.modelId
        ? that.$route.query.modelId
        : that.id;
      if (docId) {
        var res = await getDocById(docId);
        var config = await getDocumentConfig({ DocumentId: docId });
        if (config.items.length) that.DocConfig = config.items[0];
        console.log(that.DocConfig);
        that.modelList.push({
          name: res.modelName,
          id: res.id,
          docName: res.docName,
          suffix: res.suffix,
          docType: res.docType,
          checked: true,
        });
        that.projectMessage = res;
        that.projectMessage.modelList = that.modelList;
        that.projectMessage.sceneType = 0;
      } else {
        //合模
        const combineId = that.$route.query.combineId
          ? that.$route.query.combineId
          : that.cid;
        var res = await getClampById(combineId);
        if (res.combineDetails.length == 0) return;
        for (let i = 0; i < res.combineDetails.length; i++) {
          that.modelList.push({
            name: res.combineDetails[i].document.modelName,
            id: res.combineDetails[i].document.id,
            docName: res.combineDetails[i].document.docName,
            suffix: res.combineDetails[i].document.suffix,
            docType: res.combineDetails[i].document.docType,
            matrix: JSON.parse(res.combineDetails[i].matrix),
            checked: true,
          });
          that.projectMessage = res;
          that.projectMessage.modelList = that.modelList;
          that.projectMessage.sceneType = 0;
          that.projectMessage.id = undefined;
          if (this.projectMessage.camera && !this.projectMessage.camera.pitch)
            that.projectMessage.camera = JSON.parse(that.projectMessage.camera);
        }
      }
      that.hasEdit = false; //不可以编辑

      // 拾取构件获取构件id
      api.Public.Event("LEFT_CLICK", this.leftClick);

      console.log("modelList", that.modelList);

      this.modelinitedNum = 0;
      for (let i = 0; i < that.modelList.length; i++) {
        that.AddModel(that.modelList[i]); //初始加载模型
      }

      /***获取默认视角 */
      if (!this.defaultViewPoint) {
        // this.defaultViewPoint = api.Camera.getViewPort();
      } else {
        let viewpoint = this.defaultViewPoint;
        api.Camera.setViewPort(
          viewpoint.position,
          viewpoint.heading,
          viewpoint.pitch
        );
      }
      this.api = api;
    },
    AddModel(data) {
      // let data = {
      //   name: "202309011644394688",
      //   id: "3a0d6217-4be9-fb3a-c934-d757586fc520",
      //   docName: "kongyazhan.glzip",
      //   suffix: ".glzip",
      //   docType: 2,
      // };
      let that = this;
      var url = `${that.$store.getters.modelUrl}/tools/output/model/${data.name}/root.glt`;
      if (data.docType == 6) {
        url = `${that.$store.getters.modelUrl}/tools/output/model/${data.name}/tileset.json`;
      }
      //加载模型
      api.Model.mergeModel(
        url, // configJson.modelUrl + configJson.planModelName + "/root.glt",
        "kongyazhan_gis",
        function (data) {
          console.log(data);
        },
        function (data) {
          if (data.loaded) {
            //模型加载完成
            console.log("模型加载完成", data);
          }
        }
      );
    },
    initGantt() {
      gantt.config.xml_date = "%Y-%m-%d %H:%i:%s";
      gantt.init("gantt_here");
      gantt.load("/static/dhtmlxgantt/data.json", "json");
      var date_to_str = gantt.date.date_to_str(gantt.config.task_date);
    },
  },
  watch: {
    sliderValue: {
      handler(newValue, oldValue) {
        this.sliderChangeHandle(newValue, oldValue);
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./ProgressShow_gis.css"; //

.html-main {
  width: 100%;
  height: 100%;
  display: flex;

  .show-main {
    width: 50%;
    height: 100%;

    .pre-div {
      position: relative;
    }

    .cesiumContainer {
      height: 100%;
      width: 100%;
    }

    .gantt_here {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
