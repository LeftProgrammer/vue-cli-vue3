import axios from "axios";
import { Message } from "element-ui";
import { Loading } from "element-ui";

import store from "@/store";
import { getToken, removeToken } from "@/utils/auth";
import { blobValidate } from "@/utils/utils.js";
import errorCode from "@/utils/errorCode";
import { saveAs } from "file-saver";
import base from "@/common/js/base.js";
import router from "@/router";

let loading = null;

function loginOut() {
  removeToken();
  router.push(`/login?redirect=${router.history.current.fullPath}`).then(() => {
    location.reload();
  });
}

// create an axios instance
const service = axios.create({
  // process.env.VUE_APP_BASE_API
  baseURL: "", // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 300000, // request timeout
});

let lastRequestInfo = {
  url: "",
  params: {},
  time: 0,
};

const throttleDelay = 1000; // 1秒的节流延迟

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (!config.url) {
      const errReq = {
        tips: `请求路径不能为空！`,
        url: config.url,
        errorCode: 10000,
      };
      return Promise.reject(errReq);
    }

    // let userInfo = base.getStorage("userInfo");
    // if (userInfo && userInfo.needUpdatePassword === 2 && !location.hash.startsWith("#/login") && config.url.indexOf("/api/system/permissions-tree") !== -1) {
    //   const errReq = {
    //     tips: `请修改密码！`,
    //     url: config.url,
    //     errorCode: 10000
    //   }
    //   return Promise.reject(errReq);
    // }

    const currentTime = Date.now();
    // 检查是否为相同的请求地址和参数 因为系统可能 存在promise.all() 这种情况  但是这样的情况 参数应该是不会相同的。主要用在post 方法中
    if (
      // enableThrottle 为true表示不节流
      !config.enableThrottle &&
      config.url === lastRequestInfo.url &&
      JSON.stringify(config.data) === JSON.stringify(lastRequestInfo.params) &&
      currentTime - lastRequestInfo.time < throttleDelay
    ) {
      // 如果请求间隔小于节流延迟，取消当前请求
      const jieliu = {
        tips: `请求太频繁，已被节流`,
        url: config.url,
        errorCode: 10000,
      };
      return Promise.reject(jieliu);
    }
    // 更新最后一次请求信息
    lastRequestInfo = {
      url: config.url,
      params: config.data || {},
      time: currentTime,
    };

    if (!loading) {
      loading = Loading.service({
        fullscreen: true,
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    }
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["X-Token"] = getToken();
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.error("请求异常", error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    loading && loading.close();
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (response.status !== 200) {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });
      console.error("请求异常", response); // for debug
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      // console.log("router.currentRoute", router.currentRoute)
      if (
        response.data &&
        !response.data.success &&
        response.data.message === "请修改密码" &&
        !location.hash.startsWith("#/login")
      ) {
        if (
          response.request.responseURL.indexOf("/api/online-heartbeat") != -1
        ) {
          loginOut();
        }
        return Promise.reject(new Error(response.data.message || "Error"));
      }
      return res;
    }
  },
  (error) => {
    // console.error("请求异常", error); // for debug
    loading && loading.close();
    if (error.response?.status === 401) {
      if (window.location.href.indexOf("login") === -1) {
        loginOut();
      } else {
        removeToken();
      }
    } else if (error.response?.status === 404) {
      // TODO
      // Message({
      //   message: errorCode[error.response.status],
      //   type: 'error',
      //   duration: 5 * 1000
      // });
    } else if (error.response?.status === 500) {
      // TODO
      // Message({
      //   message: errorCode[error.response.status],
      //   type: 'error',
      //   duration: 5 * 1000
      // });
    } else {
      console.log("error---", error);
      if (error?.errorCode === 10000) {
        // console.log("10000", '节流')
      } else {
        // Message({
        //   message: errorCode['default'],
        //   type: 'error',
        //   duration: 5 * 1000
        // });
      }
    }
    return Promise.reject(error);
  },
  // finally
  () => {
    loading && loading.close();
    console.log("执行finally，关闭loading");
  }
);

export function download(url, params, filename, config) {
  loading = Loading.service({
    text: "正在下载数据，请稍候",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  return service
    .post(url, params, {
      // transformRequest: [(params) => { return tansParams(params) }],
      headers: { "Content-Type": "application/json;charset=utf-8" },
      responseType: "blob",
      ...config,
    })
    .then(async (data) => {
      const isBlob = blobValidate(data);
      if (isBlob) {
        const blob = new Blob([data]);
        saveAs(blob, filename);
      } else {
        const resText = await data.text();
        const rspObj = JSON.parse(resText);
        const errMsg = errorCode[rspObj.code] || rspObj.msg;
        if (
          rspObj.code === 0 &&
          (errMsg == "" || errMsg == undefined || errMsg == null)
        ) {
          Message.error("暂无数据！");
        } else {
          Message.error(errMsg);
        }
      }
      loading.close();
    })
    .catch((r) => {
      console.error(r);
      Message.error("下载文件出现错误，请联系管理员！");
      loading.close();
    });
}

export function bimService({ url, params }) {
  return service
    .get(url, {
      params,
      headers: {
        Token: sessionStorage.getItem("BIM_SECRETKEY"),
      },
    })
    .then((res) => {
      return res;
    });
}

export default service;
