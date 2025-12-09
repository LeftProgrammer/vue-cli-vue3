<template>
  <!--  <div>-->
  <!--    <img-->
  <!--          :class="(contentName==='zhbgContent'?'zhbgContent':'') +' '+-->
  <!--          (contentName==='sjglContent'?'sjglContent':'') +' '+-->
  <!--          (contentName==='zlglContent'?'zlglContent':'') +' '+-->
  <!--          (contentName==='hsbglContent'?'hsbglContent':'') +' '+-->
  <!--          (contentName==='syglContent'?'syglContent':'')"-->
  <!--         :src="contentName?require('@/assets/img/mdgHome/'+contentName+'.png'):''">-->
  <!--  </div>-->
  <div>
    <div class="noPerm" :class="noPermInfo ? 'active' : ''">
      <i></i><span>无界面权限</span>
    </div>
    <div v-if="contentName === 'zhbgContent'" class="zhbgContent">
      <img
        class="menuButton zhbgContent_gwfw"
        :src="require('@/assets/img/mdgHome/zhbgContent_gwfw.png')"
        @click="toUrl('send')"
      />
      <img
        class="menuButton zhbgContent_gwsw"
        :src="require('@/assets/img/mdgHome/zhbgContent_gwsw.png')"
        @click="toUrl('receive')"
      />
      <img
        class="menuButton zhbgContent_zjdb"
        :src="require('@/assets/img/mdgHome/zhbgContent_zjdb.png')"
        @click="toUrl('schedule-fund-info')"
      />
      <img
        class="menuButton zhbgContent_jypx"
        :src="require('@/assets/img/mdgHome/zhbgContent_jypx.png')"
        @click="toUrl('synthesis-profile-manage')"
      />
    </div>
    <div v-if="contentName === 'sjglContent'" class="sjglContent">
      <img
        class="menuButton sjglContent_sjyy"
        :src="require('@/assets/img/mdgHome/sjglContent_sjyy.png')"
        @click="toUrl('Design-and-application')"
      />
      <img
        class="menuButton sjglContent_gyjhxg"
        :src="require('@/assets/img/mdgHome/sjglContent_gyjhxg.png')"
        @click="toUrl('design-planChange')"
      />
      <img
        class="menuButton sjglContent_gyjh"
        :src="require('@/assets/img/mdgHome/sjglContent_gyjh.png')"
        @click="toUrl('design-plan')"
      />
      <img
        class="menuButton sjglContent_sdcggy"
        :src="require('@/assets/img/mdgHome/sjglContent_sdcggy.png')"
        @click="toUrl('design-hydroStandard')"
      />
      <img
        class="menuButton sjglContent_ydcggy"
        :src="require('@/assets/img/mdgHome/sjglContent_ydcggy.png')"
        @click="toUrl('design-campsiteMarker')"
      />
      <img
        class="menuButton sjglContent_tzff"
        :src="require('@/assets/img/mdgHome/sjglContent_sjbg.png')"
        @click="toUrl('design-change')"
      />
      <img
        class="menuButton sjglContent_sjjd"
        :src="require('@/assets/img/mdgHome/sjglContent_sjjd.png')"
        @click="toUrl('design-explain')"
      />
      <img
        class="menuButton sjglContent_gytz"
        :src="require('@/assets/img/mdgHome/sjglContent_gytz.png')"
        @click="toUrl('Supply-plan-ledger')"
      />
    </div>
    <div v-if="contentName === 'jdglContent'" class="jdglContent">
      <img
        class="menuButton jdglContent_jdjh"
        :src="require('@/assets/img/mdgHome/jdglContent_jdjh.png')"
        @click="toUrl('schedule-management-month')"
      />
      <img
        class="menuButton jdglContent_jlrz"
        :src="require('@/assets/img/mdgHome/jdglContent_jlrz.png')"
        @click="toUrl('schedule-supervision-log-equipment')"
      />
      <img
        class="menuButton jdglContent_sgrz"
        :src="require('@/assets/img/mdgHome/jdglContent_sgrz.png')"
        @click="toUrl('schedule-construction-log-information-v3')"
      />
      <img
        class="menuButton jdglContent_xxjd"
        :src="require('@/assets/img/mdgHome/jdglContent_xxjd.png')"
        @click="toUrl('')"
      />
      <img
        class="menuButton jdglContent_bpgl"
        :src="require('@/assets/img/mdgHome/jdglContent_bpgl.png')"
        @click="toUrl('')"
      />
      <img
        class="menuButton jdglContent_fbgl"
        :src="require('@/assets/img/mdgHome/jdglContent_fbgl.png')"
        @click="toUrl('')"
      />
      <img
        class="menuButton jdglContent_sgjs"
        :src="require('@/assets/img/mdgHome/jdglContent_sgjs.png')"
        @click="toUrl('')"
      />
    </div>
    <div v-if="contentName === 'zlglContent'" class="zlglContent">
      <img
        class="menuButton zlglContent_syzxcy"
        :src="require('@/assets/img/mdgHome/zlglContent_syzxcy.png')"
        @click="toUrl('test-detection-thirdParty')"
      />
      <img
        class="menuButton zlglContent_syjc"
        :src="require('@/assets/img/mdgHome/zlglContent_syjc.png')"
        @click="toUrl('test-detection')"
      />
      <img
        class="menuButton zlglContent_sgzj"
        :src="require('@/assets/img/mdgHome/zlglContent_sgzj.png')"
        @click="toUrl('test-detection-construction')"
      />
      <img
        class="menuButton zlglContent_jlcc"
        :src="require('@/assets/img/mdgHome/zlglContent_jlcc.png')"
        @click="toUrl('test-detection-supervisor')"
      />
      <img
        class="menuButton zlglContent_zlyp"
        :src="require('@/assets/img/mdgHome/zlglContent_zlyp.png')"
        @click="toUrl('quality-assess-info')"
      />
      <img
        class="menuButton zlglContent_clsb"
        :src="require('@/assets/img/mdgHome/zlglContent_clsb.png')"
        @click="toUrl('')"
      />
      <img
        class="menuButton zlglContent_clcg"
        :src="require('@/assets/img/mdgHome/zlglContent_clcg.png')"
        @click="toUrl('')"
      />
      <img
        class="menuButton zlglContent_clgl"
        :src="require('@/assets/img/mdgHome/zlglContent_clgl.png')"
        @click="toUrl('')"
      />
      <img
        class="menuButton zlglContent_cltx"
        :src="require('@/assets/img/mdgHome/zlglContent_cltx.png')"
        @click="toUrl('')"
      />
      <img
        class="menuButton zlglContent_clry"
        :src="require('@/assets/img/mdgHome/zlglContent_clry.png')"
        @click="toUrl('')"
      />
    </div>
    <div v-if="contentName === 'aqglContent'" class="aqglContent">
      <img
        class="menuButton aqglContent_sqjc"
        :src="require('@/assets/img/mdgHome/aqglContent_sqjc.png')"
        @click="toUrl('safe-water-monitor')"
      />
      <img
        class="menuButton aqglContent_yqjc"
        :src="require('@/assets/img/mdgHome/aqglContent_yqjc.png')"
        @click="toUrl('safe-rain-monitor')"
      />
      <img
        class="menuButton aqglContent_slfhjc"
        :src="require('@/assets/img/mdgHome/aqglContent_slfhjc.png')"
        @click="toUrl('forestFirePreventionMonitor')"
      />
      <img
        class="menuButton aqglContent_fbqspjk"
        :src="require('@/assets/img/mdgHome/aqglContent_fbqspjk.png')"
        @click="toUrl('fengbiqujiankong')"
      />
      <img
        class="menuButton aqglContent_nsljk"
        :src="require('@/assets/img/mdgHome/aqglContent_qxjk.png')"
        @click="toUrl('')"
      />
    </div>
    <div v-if="contentName === 'hsbglContent'" class="hsbglContent">
      <img
        class="menuButton1 hsbglContent_sgwfs"
        :src="require('@/assets/img/mdgHome/hsbglContent_sgwfs.png')"
        @click="toUrl('protection-monitor', 'constructionWastewater')"
      />
      <img
        class="menuButton1 hsbglContent_wxfw"
        :src="require('@/assets/img/mdgHome/hsbglContent_wxfw.png')"
        @click="toUrl('protection-monitor', 'hazardousWasteMonitoring')"
      />
      <img
        class="menuButton1 hsbglContent_shjjc"
        :src="require('@/assets/img/mdgHome/hsbglContent_shjjc.png')"
        @click="toUrl('protection-monitor', 'waterEnvironmentMonitoring')"
      />
      <img
        class="hsbglContent_fagl"
        :src="require('@/assets/img/mdgHome/hsbglContent_fagl.png')"
      />
      <img
        class="menuButton hsbglContent_lssgfa"
        :src="require('@/assets/img/mdgHome/hsbglContent_lssgfa.png')"
        @click="toUrl('protectionSystem', '1')"
      />
      <img
        class="menuButton hsbglContent_stbcssfa"
        :src="require('@/assets/img/mdgHome/hsbglContent_stbcssfa.png')"
        @click="toUrl('protectionSystem', '1')"
      />
      <img
        class="menuButton hsbglContent_stsfa"
        :src="require('@/assets/img/mdgHome/hsbglContent_stsfa.png')"
        @click="toUrl('protectionSystem', '1')"
      />
      <img
        class="menuButton hsbglContent_hjbhssfa"
        :src="require('@/assets/img/mdgHome/hsbglContent_hjbhssfa.png')"
        @click="toUrl('protectionSystem', '1')"
      />
      <img
        class="hsbglContent_bggl"
        :src="require('@/assets/img/mdgHome/hsbglContent_bggl.png')"
      />
      <img
        class="menuButton hsbglContent_yb"
        :src="require('@/assets/img/mdgHome/hsbglContent_yb.png')"
        @click="toUrl('protectionSystem', '2')"
      />
      <img
        class="menuButton hsbglContent_jb"
        :src="require('@/assets/img/mdgHome/hsbglContent_jb.png')"
        @click="toUrl('protectionSystem', '2')"
      />
      <img
        class="menuButton hsbglContent_nb"
        :src="require('@/assets/img/mdgHome/hsbglContent_nb.png')"
        @click="toUrl('protectionSystem', '2')"
      />
      <img
        class="hsbglContent_gccsgl"
        :src="require('@/assets/img/mdgHome/hsbglContent_gccsgl.png')"
      />
      <img
        class="menuButton hsbglContent_stbccswj"
        :src="require('@/assets/img/mdgHome/hsbglContent_stbccswj.png')"
        @click="toUrl('protectionSystem', '3')"
      />
      <img
        class="menuButton hsbglContent_hjbhcswj"
        :src="require('@/assets/img/mdgHome/hsbglContent_hjbhcswj.png')"
        @click="toUrl('protectionSystem', '3')"
      />
      <img
        class="hsbglContent_sbssgl"
        :src="require('@/assets/img/mdgHome/hsbglContent_sbssgl.png')"
      />
      <img
        class="menuButton hsbglContent_jcdgl"
        :src="require('@/assets/img/mdgHome/hsbglContent_jcdgl.png')"
        @click="toUrl('protection-point')"
      />
      <img
        class="menuButton hsbglContent_jcsbgl"
        :src="require('@/assets/img/mdgHome/hsbglContent_jcsbgl.png')"
        @click="toUrl('protection-device')"
      />
      <img
        class="menuButton hsbglContent_jcxmgl"
        :src="require('@/assets/img/mdgHome/hsbglContent_jcxmgl.png')"
        @click="toUrl('processData')"
      />
    </div>
    <div
      v-if="contentName === 'syglContent'"
      class="syglContent"
      @click="toUrl('waterTransport')"
    ></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { unitList } from "../office/fundAllocation/api";
import * as UrlUtil from "@/utils/url";

export default {
  name: "contentView",
  props: {
    contentName: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapGetters(["loginInfo", "permissions", "menuRoutes"]),
    isDev() {
      return process.env.NODE_ENV === "development";
    },
    pageMenuRoutes() {
      let menuRoutes = this.menuRoutes;
      return menuRoutes;
    }
  },
  data() {
    return {
      contents: [""],
      data: "",
      unitData: [],
      noPermInfo: false
    };
  },
  async mounted() {
    // await this.$store.dispatch('user/getInfo').then((res) => {
    //   const flag = res.needUpdatePassword
    //   if (flag !== undefined && flag === 2) {
    //     // 首次登陆修改密码
    //     this.$router.push('/password');
    //   }
    // });
    await this.getUnitList();
  },
  methods: {
    /** 获取整体单位树*/
    async getUnitList() {
      const { data, success } = await unitList();
      if (success) {
        this.unitData = data;
      }
    },
    /** 根据权限获取菜单 */
    findMenu(menuRoutes, permCode) {
      let menu;
      if (menuRoutes) {
        for (let i = 0; i < menuRoutes.length; i++) {
          if (menu) {
            return menu;
          }
          if (menuRoutes[i].permCode === permCode) {
            menu = menuRoutes[i];
          } else {
            menu = this.findMenu(menuRoutes[i].children, permCode);
          }
        }
      }
      return menu;
    },
    /** 查找树 */
    treeFind(tree, func) {
      for (const data of tree) {
        if (func(data)) return data;
        if (data.children) {
          const res = this.treeFind(data.children, func);
          if (res) return res;
        }
      }
      return null;
    },
    /** 路由跳转 */
    toUrl(permCode, activeName) {
      console.log(this.$store.state);
      // console.log(JSON.parse(JSON.stringify(this.$store.state)))
      // console.log(JSON.parse(JSON.stringify(this.menuRoutes)))

      // 综合办公-发文收文特殊处理
      if (permCode === "send" || permCode === "receive") {
        // let list = this.unitData.filter(item => item.corpId === this.loginInfo.corpId);
        let unit = this.treeFind(
          this.unitData,
          (node) => node.corpId === this.loginInfo.corpId
        );
        console.log(unit);
        let corpType = unit ? unit.corpType : "";
        if (corpType === "sjdw") {
          // 设计单位收发文
          if (permCode === "send") {
            permCode = "synthesis-manage-design";
          } else {
            permCode = "synthesis-manage-design-receive";
          }
        } else if (corpType === "jldw") {
          // 监理单位收发文
          if (permCode === "send") {
            permCode = "synthesis-manage-supervision";
          } else {
            permCode = "synthesis-manage-supervision-receive";
          }
        } else if (corpType === "sgdw") {
          // 施工单位收发文
          if (permCode === "send") {
            permCode = "synthesis-manage-construction";
          } else {
            permCode = "synthesis-manage-construction-receive";
          }
        } else {
          // 业主单位收发文
          if (permCode === "send") {
            permCode = "synthesis-oa";
          } else {
            permCode = "synthesis-manage-owner-receive";
          }
        }
      }

      // 先判断是否访问权限
      let hasPermissions = false;
      hasPermissions = this.permissions.includes(permCode);
      if (hasPermissions) {
        let menu = this.findMenu(this.menuRoutes, permCode);
        console.log(JSON.parse(JSON.stringify(menu)));
        console.log(new RegExp(/^\d+$/).test(menu.dataViewConfId));

        if (permCode === "processData" || permCode === "protectionSystem") {
          // 部分菜单需要定位子集tag
          // processData：监测管理，protectionSystem：体系管理
          let routerName = permCode;
          // 体系管理权限名称和路由名称不一致，需单独赋值
          if (permCode === "protectionSystem") {
            routerName = "documentSystem";
          }
          this.$router.push({
            name: routerName,
            query: { permCode: permCode, name: menu.name },
            params: { activeNameProps: activeName } // 传递参数的同时，不会修改浏览器地址，不会导致同一个菜单多个标签
          });
        } else if (new RegExp(/^\d+$/).test(menu.dataViewConfId)) {
          // 部分菜单是流程的页面，dataViewConfId是流程id
          let routerUrl =
            "customTable?viewId=" +
            menu.dataViewConfId +
            "&permCode=" +
            permCode +
            "&name=" +
            menu.name;
          this.$router.push(routerUrl);
        } else {
          // 普通菜单
          let routerUrl =
            menu.dataViewConfId +
            "?permCode=" +
            permCode +
            "&name=" +
            menu.name;
          if (menu.dataViewConfId) {
            if (
              menu.dataViewConfId.indexOf("http://") === 0 ||
              menu.dataViewConfId.indexOf("https://") === 0
            ) {
              if (menu.dataViewConfId.indexOf("?") >= 0) {
                routerUrl = `${menu.dataViewConfId}&permCode=${menu.permCode}&name=${menu.name}`;
              }
              routerUrl = UrlUtil.computeUrl(routerUrl);
              window.open(routerUrl);
              return;
            }
          }
          this.$router.push(routerUrl);
        }
      } else {
        this.noPermInfo = true;
        let thiss = this;
        setTimeout(() => (thiss.noPermInfo = false), 2000);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/*img{*/
/*  width: 65%;*/
/*  position: absolute;*/
/*  top:40%;*/
/*  transform:translate(27%,0)*/
/*}*/
.zhbgContent {
  width: 55%;
  height: 65%;
  position: absolute;
  top: 35%;
  transform: translate(40%, 0);
  background: url("@/assets/img/mdgHome/zhbgContent.png") center no-repeat;
  background-size: 100% auto;

  .menuButton {
    width: 13%;
    position: absolute;
    cursor: pointer;
    transition: transform 0.15s ease-in;
  }

  .menuButton:hover {
    transform: translateY(-7px);
  }

  .zhbgContent_gwfw {
    top: 31%;
    left: 25.5%;
  }

  .zhbgContent_gwfw:hover {
    content: url("@/assets/img/mdgHome/zhbgContent_gwfw_hover.png");
  }

  .zhbgContent_gwsw {
    top: 31%;
    right: 26%;
  }

  .zhbgContent_gwsw:hover {
    content: url("@/assets/img/mdgHome/zhbgContent_gwsw_hover.png");
  }

  .zhbgContent_zjdb {
    bottom: 19%;
    left: 25.5%;
  }

  .zhbgContent_zjdb:hover {
    content: url("@/assets/img/mdgHome/zhbgContent_zjdb_hover.png");
  }

  .zhbgContent_jypx {
    bottom: 19%;
    right: 26%;
  }

  .zhbgContent_jypx:hover {
    content: url("@/assets/img/mdgHome/zhbgContent_jypx_hover.png");
  }
}

.sjglContent {
  width: 70%;
  position: absolute;
  top: 36%;
  height: 64%;
  transform: translate(21%, 0);
  background: url("@/assets/img/mdgHome/sjglContent.png") center 60% no-repeat;
  background-size: 80% auto;

  .menuButton {
    height: 20%;
    position: absolute;
    cursor: pointer;
    transition: transform 0.15s ease-in;
  }

  .menuButton:hover {
    transform: translateY(-7px);
    filter: brightness(1.15);
  }

  .sjglContent_sjyy {
    top: -8%;
    left: -8%;
    width: 20%;
    height: auto;
  }

  .sjglContent_gyjhxg {
    top: 44%;
    left: 11.5%;
  }

  .sjglContent_gyjh {
    top: 22%;
    left: 24.5%;
  }

  .sjglContent_sdcggy {
    top: 49%;
    left: 32%;
  }

  .sjglContent_ydcggy {
    top: 49%;
    right: 32%;
  }

  .sjglContent_tzff {
    top: 22%;
    right: 24.5%;
  }

  .sjglContent_sjjd {
    top: 44%;
    right: 11.5%;
  }

  .sjglContent_gytz {
    top: -8%;
    right: -8.5%;
    width: 20%;
    height: auto;
  }
}

.jdglContent {
  width: 65%;
  height: 60%;
  position: absolute;
  top: 35%;
  transform: translate(27%, 0);
  background: url("@/assets/img/mdgHome/jdglContent.png") center no-repeat;
  background-size: 80% auto;

  .menuButton {
    width: 17%;
    position: absolute;
    cursor: pointer;
    transition: transform 0.15s ease-in;
  }

  .menuButton:hover {
    transform: translateY(-7px);
    filter: brightness(1.15);
  }

  .jdglContent_jdjh {
    top: -2%;
    left: -6%;
  }

  .jdglContent_jlrz {
    bottom: 42%;
    left: -6%;
  }

  .jdglContent_sgrz {
    bottom: 10%;
    left: -6%;
  }

  .jdglContent_xxjd {
    bottom: 10%;
    left: 40%;
  }

  .jdglContent_bpgl {
    top: -2%;
    right: -6%;
  }

  .jdglContent_fbgl {
    bottom: 42%;
    right: -6%;
  }

  .jdglContent_sgjs {
    bottom: 10%;
    right: -6%;
  }

}

.zlglContent {
  width: 70%;
  position: absolute;
  top: 34%;
  height: 64%;
  transform: translate(20.5%, 0);
  background: url("@/assets/img/mdgHome/zlglContent.png") center no-repeat;
  background-size: 100% auto;

  .menuButton {
    width: 9%;
    position: absolute;
    cursor: pointer;
    transition: transform 0.15s ease-in;
  }

  .menuButton:hover {
    transform: translateY(-7px);
    filter: brightness(1.15);
  }

  .zlglContent_syzxcy {
    top: 22%;
    left: 8%;
    width: 12%;
  }

  .zlglContent_syjc {
    top: 37%;
    left: 9%;
    width: 10%;
  }

  .zlglContent_sgzj {
    bottom: 17%;
    left: -4%;
  }

  .zlglContent_jlcc {
    bottom: 17%;
    left: 23%;
  }

  .zlglContent_zlzhfx {
    top: 36%;
    left: 42%;
    width: 15%;
  }

  .zlglContent_zlyptz {
    bottom: 40%;
    left: 42%;
    width: 15%;
  }

  .zlglContent_zlyp {
    top: 39%;
    right: 44%;
    width: 10%;
  }

  .zlglContent_clsb{
    top: 46%;
    right: 24%;
  }

  .zlglContent_clcg{
    top: 15%;
    right: 10%;
  }

  .zlglContent_clgl{
    top: 40%;
    right: 10%;
  }

  .zlglContent_cltx{
    top: 78%;
    right: 10%;
  }

  .zlglContent_clry{
    top: 46%;
    right: -4%;
  }
}

.aqglContent {
  width: 73%;
  position: absolute;
  top: 57%;
  height: 40%;
  transform: translate(19%, 0);
  background: url("@/assets/img/mdgHome/aqglContent.png") center no-repeat;
  background-size: 90% auto;

  .menuButton {
    width: 12%;
    position: absolute;
    cursor: pointer;
    transition: transform 0.15s ease-in;
  }

  .menuButton:hover {
    transform: translateY(-7px);
    filter: brightness(1.15);
  }

  .aqglContent_sqjc {
    top: -8%;
    left: 12%;
  }

  .aqglContent_yqjc {
    top: -22%;
    left: 28%;
  }

  .aqglContent_slfhjc {
    top: -36%;
    left: 44%;
  }

  .aqglContent_fbqspjk {
    top: -22%;
    left: 60%;
  }

  .aqglContent_nsljk {
    top: -8%;
    left: 76%;
  }
}

.hsbglContent {
  width: 72%;
  position: absolute;
  top: 40%;
  transform: translate(19%, 0);
  height: 60%;

  .menuButton,
  .menuButton1 {
    width: 18%;
    position: absolute;
    cursor: pointer;
    transition: transform 0.15s ease-in;
  }

  .menuButton:hover {
    transform: translateY(-7px);
    filter: brightness(1.15);
  }

  .menuButton1:hover {
    transform: translateY(-7px);
    box-shadow: 3px 3px 5px 1px rgba(116, 177, 229, 1);
    border-radius: 10px;
  }

  .hsbglContent_sgwfs {
    top: -3%;
    left: -1%;
    width: 22%;
  }

  .hsbglContent_wxfw {
    top: -3%;
    left: 26%;
    width: 22%;
  }

  .hsbglContent_shjjc {
    top: -3%;
    left: 53%;
    width: 48%;
  }

  .hsbglContent_fagl {
    position: absolute;
    width: 22%;
    top: 24%;
    left: -1%;
  }

  .hsbglContent_lssgfa {
    top: 38%;
    left: 1%;
  }

  .hsbglContent_stbcssfa {
    top: 48%;
    left: 1%;
  }

  .hsbglContent_stsfa {
    top: 58%;
    left: 1%;
  }

  .hsbglContent_hjbhssfa {
    top: 68%;
    left: 1%;
  }

  .hsbglContent_bggl {
    position: absolute;
    width: 22%;
    top: 24%;
    left: 26%;
  }

  .hsbglContent_yb {
    top: 38%;
    left: 28%;
  }

  .hsbglContent_jb {
    top: 48%;
    left: 28%;
  }

  .hsbglContent_nb {
    top: 58%;
    left: 28%;
  }

  .hsbglContent_gccsgl {
    position: absolute;
    width: 22%;
    top: 24%;
    left: 53%;
  }

  .hsbglContent_stbccswj {
    top: 38%;
    left: 55%;
  }

  .hsbglContent_hjbhcswj {
    top: 48%;
    left: 55%;
  }

  .hsbglContent_sbssgl {
    position: absolute;
    width: 22%;
    top: 24%;
    left: 79%;
  }

  .hsbglContent_jcdgl {
    top: 38%;
    left: 81%;
  }

  .hsbglContent_jcsbgl {
    top: 48%;
    left: 81%;
  }

  .hsbglContent_jcxmgl {
    top: 58%;
    left: 81%;
  }
}

.syglContent {
  width: 77%;
  position: absolute;
  top: 38%;
  height: 62%;
  transform: translate(13%, 0);
  background: url("@/assets/img/mdgHome/syglContent.png") center no-repeat;
  background-size: 100% auto;
  cursor: pointer;
  z-index: 1;
}

.noPerm {
  /*transition: transform 2s ease-in-out;*/

  position: absolute;
  top: -5%;
  /*transform: translateY(0);*/
  left: calc(50% - 90px);
  font-size: 20px;
  color: white;
  background: #303133a1;
  padding: 12px 25px 13px 54px;
  border-radius: 5px;
}

.noPerm i {
  content: url("@/assets/img/mdgHome/noPerm.png");
  margin-top: 2px;
  position: absolute;
  left: 25px;
}

.active {
  animation: opacity1 0.3s ease-out;
  top: 13%;
}

@keyframes opacity1 {
  from {
    top: 7%;
  }

  to {
    top: 13%;
  }

  25% {
    opacity: 0.2;
  }

  50% {
    opacity: 0.6;
  }

  75% {
    opacity: 0.8;
  }

  100% {
    opacity: 1;
  }
}
</style>
