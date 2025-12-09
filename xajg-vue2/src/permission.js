import Vue from "vue";
import router from "./router";
import Cookie from "js-cookie";
import store from "@/store";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
// import { generateIndexRouter } from "@/utils/util"
import { getToken, setToken, verifyPermission } from "@/utils/auth";
import { fromApp } from "@/utils/index";
import Element from "element-ui";
import { getSystemMenu } from "@/api/user";
import { socket } from "@szgc/plt-core";
import config from "@/utils/config";
import { MENU_INDEX } from "@/store/mutation-types";

NProgress.configure({ showSpinner: false }); // NProgress Configuration
const whiteList = ["/login"]; // no redirect whitelist
// console.log('getToken',router.getRoutes())
router.beforeEach(async (to, from, next) => {
  NProgress.start(); // start progress bar
  // 来自app
  // this.$nextTick(() => {
  // appUrlList 只要是app 就一定会传递这个参数
  // if (this.fromapp) {
  //this.appformDisabled = true;
  let title = to.query.title || "雄安调蓄库工程智慧管理平台"
  const titleElement = document.getElementById("dynamicTitle");
  // 设置动态标题
  titleElement.textContent = title;
  // }
  // });

  let token = getToken();
  if (!token) {
    // 通过 ? 分割获取后面的参数字符串
    let urlStr = window.location.href.split("?")[1] || "";
    // 创建空对象存储参数
    let obj = {};
    // 再通过 & 将每一个参数单独分割出来
    let paramsArr = urlStr.split("&");
    for (let i = 0, len = paramsArr.length; i < len; i++) {
      // 再通过 = 将每一个参数分割为 key:value 的形式
      let arr = paramsArr[i].split("=");
      obj[arr[0]] = arr[1];
    }
    if (obj.token) {
      token = obj.token;
      // Cookie.set(ACCESS_TOKEN, token, "");
      Cookie.remove(ACCESS_TOKEN);
      setToken(token);
    }
  }
  if (token) {
    if (token != ACCESS_TOKEN && fromApp()) {
      let loginInfo = store.getters.loginInfo;
      if (!loginInfo || !loginInfo.userId) {
        //初始化前端参数
        await config.init();
        //存下用户的信息
        await store.dispatch("user/getInfo");
      }
    }

    /* has token */
    if (to.path === "/login" && token != ACCESS_TOKEN) {
      next({ path: config.getLoginedPath() });
      // next();
      NProgress.done();
    } else {
      //
      let loginInfo = store.getters.loginInfo;
      if (!loginInfo || !loginInfo.userId) {
        //存下用户的信息
        await store.dispatch("user/getInfo");
      }
      // 获取系统资源树
      const { data: menus, success, message } = await getSystemMenu();
      if (!success) {
        next();
      } else {
        let menuRoutes = menus[MENU_INDEX].children;
        // 查找树
        let treeFind = function (tree, func) {
          tree = tree || [];
          for (const data of tree) {
            if (func(data)) return data;
            if (data.children) {
              const res = treeFind(data.children, func);
              if (res) return res;
            }
          }
          return null;
        };
        const redirect = decodeURIComponent(from.query.redirect || to.path);
        if (verifyPermission(to.path)) {
          next();
          return;
        }
        let result = treeFind(
          menuRoutes,
          (node) =>
            node.dataViewConfId && redirect.indexOf(node.dataViewConfId) > -1
        );

        let verified =
          result &&
          !store.getters.permissions.includes(result.permCode) &&
          !verifyPermission(result.dataViewConfId);


        if (verified) {
          Element.MessageBox({
            message:
              "抱歉，您无权访问[" +
              result.permName +
              "], 请联系管理员获取权限?",
            title: "页面访问受限",
            confirmButtonText: "工作中心",
            cancelButtonText: "重新登录",
            showCancelButton: true,
            showClose: false,
            closeOnClickModal: false,
            type: "warning",
          })
            .then(() => {
              next({ path: "/homeIndex/index" });
            })
            .catch(() => {
              // 退出登录
              store.dispatch("user/logout").then((res) => {
                //取消订阅
                socket.off("NOTICE");
                next({ path: "/login", query: { redirect: to.fullPath } });
              });
            });
        } else {
          next();
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next({ path: "/login", query: { redirect: to.fullPath } });
      NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
