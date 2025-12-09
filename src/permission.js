import router from "./router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken, setToken } from "@/utils/auth";
import config from "@/utils/config";

NProgress.configure({ showSpinner: false });

const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  NProgress.start();

  const title = to.query.title || "雄安调蓄库工程智慧管理平台";
  const titleElement = document.getElementById("dynamicTitle");
  if (titleElement) {
    titleElement.textContent = title;
  }

  let token = getToken();

  if (!token) {
    const urlStr = window.location.href.split("?")[1] || "";
    const obj = {};
    if (urlStr) {
      const paramsArr = urlStr.split("&");
      for (let i = 0, len = paramsArr.length; i < len; i += 1) {
        const arr = paramsArr[i].split("=");
        obj[arr[0]] = arr[1];
      }
    }
    if (obj.token) {
      token = obj.token;
      setToken(token);
    }
  }

  if (token) {
    if (to.path === "/login") {
      next({ path: config.getLoginedPath() });
      NProgress.done();
    } else {
      next();
    }
  } else if (whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    next({ path: "/login", query: { redirect: to.fullPath } });
    NProgress.done();
  }
});

router.afterEach(() => {
  NProgress.done();
});
