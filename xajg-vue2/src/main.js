import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Element from "element-ui";
import "./permission"; // permission control
import "normalize.css/normalize.css";
import "@/styles/index.scss";
import MyPlugin from "@/common/js/MyPlugin.js"; // 导入公用插件
import base from "@/common/js/base.js"; // 导入公用方法
import "@/utils/dialogdrag.js"; // 全局引入v-draggable自定义指令
import "@/utils/debounce.js";

import { download } from "@/utils/request";
import "video.js/dist/video-js.css";
import { Decrypt } from "@/utils/encryp.js";
import Vue2OrgTree from "vue2-org-tree";

Vue.use(Vue2OrgTree);
// import VuePreview from 'vue-preview';
// Vue.use(VuePreview);

// 未知原因 @szgc/wbench会覆盖element默认组件
// 所以在此处全剧注册
import {
  SzgcFormGetor,
  SzgcProcessGetor,
  SzgcWbench,
  ntko_addon,
} from "@szgc/wbench";
import "@szgc/wbench/libs/wbench.css";
Vue.component("SzgcFormGetor", SzgcFormGetor);
Vue.component("SzgcProcessGetor", SzgcProcessGetor);
Vue.component("SzgcWbench", SzgcWbench);
import "@/icons"; // icon
import { getCookie } from "@szgc/plt-core";
// 水印
import watermark from "./utils/watermark";

Vue.directive("watermark", watermark);
/* ========== 遍历base工具包内部方法，挂载到vue示例上面 ========== */
Object.keys(base).forEach((item) => {
  // 将base里面得方法,全部挂载到vue上面,这个在其他地方,就可以用this去获取了
  Vue.prototype["$" + item] = base[item];
});
Vue.prototype.download = download;

Vue.use(Element, {
  size: "medium", // set element-ui default size
});
Vue.use(MyPlugin); // 使用插件
Vue.config.productionTip = false;
const _vue = new Vue({
  router,
  store,
  // created: bootstrap,
  render: (h) => h(App),
});
_vue.$mount("#app");

// 中央事件总线
Vue.prototype.$bus = new Vue({
  data: {
    arr: [], // 用来保存事件名
  },
  methods: {
    // 绑定事件
    on(eventname, callback) {
      // 判断事件名是否重复
      if (this.arr.includes(eventname)) {
        // throw "eventname events already regist!!";
      } else {
        this.arr.push(eventname);
        this.$on(eventname, callback);
      }
    },
    // 触发事件，传递数据
    emit(eventname, ...arg) {
      this.$emit(eventname, ...arg);
    },
    // 解绑
    off(eventname, callback) {
      const index = this.arr.indexOf(eventname);
      if (index > -1) {
        //  从arr 中剔除  第index 项
        this.arr.splice(index, 1);
      }
      this.$off(eventname, callback);
    },
  },
});
// 总线使用方法
// this.$bus.emit('定义名称',值) //触发事件
// this.$bus.on('定义名称' val=>{}) //绑定事件
// this.$bus.off('定义名称') //解绑

// new Vue({
//   router,
//   store,
//   render: (h) => h(App),
// }).$mount("#app");

Vue.directive("thousands", {
  inserted: function (el) {
    // 获取input节点
    if (el.tagName.toLocaleUpperCase() !== "INPUT") {
      el = el.getElementsByTagName("input")[0];
    }

    // 初始化时，格式化值为千分位
    const numberValue = parseFloat(el.value.replace(/,/g, ""));
    if (!isNaN(numberValue)) {
      el.value = numberValue.toLocaleString("zh", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    // 聚焦时转化为数字格式（去除千分位）
    el.onfocus = () => {
      if (el.value) {
        el.value = parseFloat(el.value.replace(/,/g, "")).toFixed(2);
      }
    };

    // 失去焦点时转化为千分位
    el.onblur = () => {
      const onBlurValue = parseFloat(el.value.replace(/,/g, ""));
      if (!isNaN(onBlurValue)) {
        el.value = onBlurValue.toLocaleString("zh", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
    };
  },
});

// if (sessionStorage.getItem("NTKO_URL_CONFIG")) {
//   try {
//     const ntkoConfig = JSON.parse(sessionStorage.getItem("NTKO_URL_CONFIG"));
//     let serverUrlKey;
//     let serverUrl;
//     try {
//       serverUrl = Decrypt(ntkoConfig.serverUrl);
//       serverUrlKey = Decrypt(ntkoConfig.iframeUrl);
//     } catch (error) {
//       serverUrl = ntkoConfig.serverUrl;
//       serverUrlKey = ntkoConfig.iframeUrl;
//     }
//     const url = new URL(serverUrlKey).origin;
//     const urlServer = new URL(serverUrl).origin;
//     const token = getCookie("szgc-mdg-sid");
//     ntko_addon
//       .use({
//         svr_url: `${urlServer}/ntkoSignServer`,
//         reader_iframe_url: `${url}/ntko-doc-viewer/`,
//         signMode: "Server",
//         authorizeCallback: `${location.origin}/security/authentication/user/oauth2?token=${token}&appId=ntko`,
//         unauthorizeCallback: `${url}/404`,
//         account_convert: (current) => current.username,
//         password_convert: () => getCookie("szgc-mdg-sid"),
//       })
//       .then((res) => {
//         console.log(res);
//       });
//   } catch (error) {
//     console.error("初始化ntko服务失败", error);
//   }
// }
