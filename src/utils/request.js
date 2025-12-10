import axios from "axios";
import { ElMessage, ElLoading } from "element-plus";
import { saveAs } from "file-saver";
import router from "@/router";
import { getToken, removeToken } from "@/utils/auth";
import errorCode from "@/utils/errorCode";
import { blobValidate } from "@/utils/utils";

let loadingInstance = null;

function closeLoading() {
  if (loadingInstance) {
    loadingInstance.close();
    loadingInstance = null;
  }
}

function loginOut() {
  removeToken();
  const current = router.currentRoute && router.currentRoute.value;
  const redirect = (current && current.fullPath) || "/";
  router
    .push({
      path: "/login",
      query: { redirect },
    })
    .then(() => {
      window.location.reload();
    });
}

const service = axios.create({
  baseURL: "",
  withCredentials: true,
  timeout: 300000,
});

let lastRequestInfo = {
  url: "",
  params: {},
  time: 0,
};

const throttleDelay = 1000;

service.interceptors.request.use(
  (config) => {
    if (!config.url) {
      const errReq = {
        tips: "请求路径不能为空！",
        url: config.url,
        errorCode: 10000,
      };
      return Promise.reject(errReq);
    }

    const currentTime = Date.now();
    if (
      !config.enableThrottle &&
      config.url === lastRequestInfo.url &&
      JSON.stringify(config.data || {}) ===
        JSON.stringify(lastRequestInfo.params || {}) &&
      currentTime - lastRequestInfo.time < throttleDelay
    ) {
      const jieliu = {
        tips: "请求太频繁，已被节流",
        url: config.url,
        errorCode: 10000,
      };
      return Promise.reject(jieliu);
    }

    lastRequestInfo = {
      url: config.url,
      params: config.data || {},
      time: currentTime,
    };

    // showLoading 显式为 false 时，不展示全局 Loading（用于心跳等静默请求）
    if (!loadingInstance && config.showLoading !== false) {
      loadingInstance = ElLoading.service({
        fullscreen: true,
        lock: true,
        text: "加载中...",
        background: "rgba(0, 0, 0, 0.7)",
      });
    }

    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers["X-Token"] = token;
    }

    return config;
  },
  (error) => {
    console.error("请求异常", error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    closeLoading();
    const res = response.data;
    if (response.status !== 200) {
      ElMessage({
        message: res.message || "请求错误",
        type: "error",
        duration: 5 * 1000,
      });
      console.error("请求异常", response);
      return Promise.reject(new Error(res.message || "Error"));
    }

    if (
      res &&
      !res.success &&
      res.message === "请修改密码" &&
      !window.location.hash.startsWith("#/login")
    ) {
      if (
        response.request &&
        response.request.responseURL &&
        response.request.responseURL.indexOf("/api/online-heartbeat") !== -1
      ) {
        loginOut();
      }
      return Promise.reject(new Error(res.message || "Error"));
    }

    return res;
  },
  (error) => {
    closeLoading();
    const status = error.response && error.response.status;
    if (status === 401) {
      if (window.location.href.indexOf("login") === -1) {
        loginOut();
      } else {
        removeToken();
      }
    } else if (error && error.errorCode === 10000) {
      // 请求节流，不提示
    } else if (status === 404 || status === 500) {
      // 这里按需补充全局错误提示
      const msg = errorCode[status] || "请求错误";
      ElMessage.error(msg);
    } else if (status) {
      const serverMsg =
        (error.response &&
          error.response.data &&
          (error.response.data.message || error.response.data.msg)) ||
        error.message;
      const msg = serverMsg || errorCode[status] || errorCode.default;
      ElMessage.error(msg);
    } else {
      console.log("error---", error);
    }
    return Promise.reject(error);
  }
);

export function download(url, params, filename, config = {}) {
  loadingInstance = ElLoading.service({
    text: "正在下载数据，请稍候",
    background: "rgba(0, 0, 0, 0.7)",
  });
  return service
    .post(url, params, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
      responseType: "blob",
      ...config,
    })
    .then(async (data) => {
      const isBlob = blobValidate(data);
      if (isBlob) {
        const blob = new Blob([data]);
        saveAs(blob, filename);
      } else if (data) {
        try {
          const text = await data.text();
          const obj = JSON.parse(text);
          const code = obj.code;
          const msgFromCode =
            (code && errorCode[code]) || obj.msg || obj.message || "下载失败";
          ElMessage.error(msgFromCode);
        } catch (e) {
          ElMessage.error("下载文件出现错误，请联系管理员！");
        }
      }
      closeLoading();
    })
    .catch((err) => {
      console.error(err);
      ElMessage.error("下载文件出现错误，请联系管理员！");
      closeLoading();
    });
}

export default service;
