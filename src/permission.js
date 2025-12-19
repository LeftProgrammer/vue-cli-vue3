import router from "./router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken, setToken } from "@/utils/auth";
import { verifyPermission } from "@/utils/auth";
import config from "@/utils/config";
import store from "@/store";
import { ElMessageBox } from "element-plus";

NProgress.configure({ showSpinner: false });

const whiteList = ["/login"];

function treeFind(tree, func) {
  const list = tree || [];
  for (const data of list) {
    if (func(data)) return data;
    if (data.children && data.children.length) {
      const res = treeFind(data.children, func);
      if (res) return res;
    }
  }
  return null;
}

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
    const loginInfo = store.state.user && store.state.user.loginInfo;
    if (!loginInfo || !loginInfo.userId) {
      try {
        await config.init();
        await store.dispatch("user/getInfo");
        try {
          await store.dispatch("permission/refreshTodoCount");
        } catch (e) {
          void e;
        }
      } catch (e) {
        void e;
      }
    }

    // 刷新任意页面时，可能因动态路由尚未注入而先被 catch-all 重定向到 /404
    // Vue Router 4 会把原始目标路由放在 to.redirectedFrom
    if (to.path === "/404" && to.redirectedFrom && to.redirectedFrom.fullPath) {
      try {
        const redirectedFrom = to.redirectedFrom;
        next({
          path: redirectedFrom.path,
          query: redirectedFrom.query,
          hash: redirectedFrom.hash,
          replace: true,
        });
        NProgress.done();
        return;
      } catch (e) {
        void e;
      }
    }

    // 对齐旧项目：基于 dataViewConfId 做权限反查拦截
    // 说明：新项目菜单会被过滤为 menuRoutes；这里用 rawMenuRoutes 保留未过滤树用于权限判断
    try {
      if (!verifyPermission(to.path)) {
        const permissions = store.getters && store.getters.permissions;
        const rawMenuRoutes = store.getters && store.getters.rawMenuRoutes;
        const redirect = decodeURIComponent(from.query.redirect || to.path);
        const result = treeFind(rawMenuRoutes, (node) => {
          if (!node) return false;
          const id = node.dataViewConfId;
          return id && typeof id === "string" && redirect.indexOf(id) > -1;
        });

        const verified =
          result &&
          Array.isArray(permissions) &&
          !permissions.includes(result.permCode) &&
          !verifyPermission(result.dataViewConfId);

        if (verified) {
          ElMessageBox.confirm(
            `抱歉，您无权访问[${result.permName || result.title || ""}], 请联系管理员获取权限?`,
            "页面访问受限",
            {
              confirmButtonText: "工作中心",
              cancelButtonText: "重新登录",
              showCancelButton: true,
              showClose: false,
              closeOnClickModal: false,
              type: "warning",
              distinguishCancelAndClose: true,
            }
          )
            .then(() => {
              next({ path: "/homeIndex/index" });
            })
            .catch(() => {
              store.dispatch("user/logout").then(() => {
                next({ path: "/login", query: { redirect: to.fullPath } });
              });
            });
          NProgress.done();
          return;
        }
      }
    } catch (e) {
      void e;
    }

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
