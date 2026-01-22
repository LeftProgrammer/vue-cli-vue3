import axios from "axios";
import { ElMessage, ElLoading } from "element-plus";
import { saveAs } from "file-saver";
import router from "@/router";
import { getToken, removeToken } from "@/utils/auth";
import errorCode from "@/utils/errorCode";
import { blobValidate } from "@/utils/utils";

let loadingInstance = null;
let loadingTimer = null;
let loadingStartAt = 0;
let activeRequestCount = 0;
const LOADING_DELAY_MS = 150;
const MIN_LOADING_DURATION_MS = 300;

function closeLoading() {
  if (loadingInstance) {
    loadingInstance.close();
    loadingInstance = null;
  }
}

function beginLoading(config) {
  if (config && config.showLoading === false) {
    return;
  }
  activeRequestCount += 1;
  if (activeRequestCount !== 1) {
    return;
  }
  if (loadingTimer) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
  loadingTimer = setTimeout(() => {
    loadingTimer = null;
    if (activeRequestCount <= 0 || loadingInstance) {
      return;
    }
    loadingStartAt = Date.now();
    loadingInstance = ElLoading.service({
      fullscreen: true,
      lock: true,
      text: "加载中...",
      background: "rgba(0, 0, 0, 0.7)",
    });
  }, LOADING_DELAY_MS);
}

function endLoading() {
  activeRequestCount = Math.max(0, activeRequestCount - 1);
  if (activeRequestCount > 0) {
    return;
  }
  if (loadingTimer) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
  if (!loadingInstance) {
    return;
  }
  const elapsed = Date.now() - (loadingStartAt || 0);
  const remaining = Math.max(0, MIN_LOADING_DURATION_MS - elapsed);
  if (remaining === 0) {
    closeLoading();
    return;
  }
  setTimeout(() => {
    if (activeRequestCount === 0) {
      closeLoading();
    }
  }, remaining);
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

let lastRequestInfo = {
  url: "",
  params: {},
  time: 0,
};

const throttleDelay = 1000;

const service = axios.create({
  baseURL: "",
  withCredentials: true,
  timeout: 300000,
});

service.interceptors.request.use(
  config => {
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
      JSON.stringify(config.data || {}) === JSON.stringify(lastRequestInfo.params || {}) &&
      currentTime - lastRequestInfo.time < throttleDelay
    ) {
      // 节流时返回一个特殊的成功响应，默认静默处理
      console.log(`请求被节流: ${config.url}`);
      return Promise.resolve({
        data: { success: true, message: null, data: null, throttled: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      });
    }

    lastRequestInfo = {
      url: config.url,
      params: config.data || {},
      time: currentTime,
    };

    beginLoading(config);

    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers["X-Token"] = token;
    }

    return config;
  },
  error => {
    console.error("请求异常", error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    endLoading();
    const res = response.data;
    if (response.status !== 200) {
      ElMessage({
        message: res.message || "请求错误",
        type: "error",
        duration: 5 * 1000,
      });
      console.error("请求异常", response);
      return Promise.reject(new Error(res.message || "Error"));
    } else {
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
    }
  },
  error => {
    endLoading();
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
  const downloadLoadingInstance = ElLoading.service({
    text: "正在下载数据，请稍候",
    background: "rgba(0, 0, 0, 0.7)",
  });
  return service
    .post(url, params, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
      responseType: "blob",
      showLoading: false,
      ...config,
    })
    .then(async data => {
      const isBlob = blobValidate(data);
      if (isBlob) {
        const blob = new Blob([data]);
        saveAs(blob, filename);
      } else if (data) {
        try {
          const text = await data.text();
          const obj = JSON.parse(text);
          const code = obj.code;
          const msgFromCode = (code && errorCode[code]) || obj.msg || obj.message || "下载失败";
          ElMessage.error(msgFromCode);
        } catch (e) {
          ElMessage.error("下载文件出现错误，请联系管理员！");
        }
      }
    })
    .catch(err => {
      console.error(err);
      ElMessage.error("下载文件出现错误，请联系管理员！");
    })
    .finally(() => {
      downloadLoadingInstance.close();
    });
}

export function bimService({ url, params }) {
  return service
    .get(url, {
      params,
      headers: {
        Token: sessionStorage.getItem("BIM_SECRETKEY"),
      },
      showLoading: false,
    })
    .then((res) => {
      return res;
    });
}

export default service;
