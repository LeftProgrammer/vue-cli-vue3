import request from "@/utils/request";
import { getToken, removeToken } from "@/utils/auth";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import router from "@/router";
import workerTimer from "@/utils/workder";
import { getInfo } from "@/api/user";

let interval = null;
let intervalType = "native";
let keepAliveTick = 0;

function heartbeat() {
  return request({
    url: "/api/online-heartbeat?t=" + new Date().getTime(),
    method: "get",
    showLoading: false, // 心跳请求不显示全局 Loading，避免页面闪烁
  });
}

function exec() {
  const token = getToken();
  if (token && token !== ACCESS_TOKEN) {
    keepAliveTick += 1;
    if (keepAliveTick >= 6) {
      keepAliveTick = 0;
      getInfo(token).catch(e => {
        void e;
      });
    }

    heartbeat().then(res => {
      if (!res.success) {
        // 避免失败后继续循环触发
        try {
          heatbeat.clear();
        } catch (e) {
          void e;
        }
        removeToken();
        const current = router.currentRoute.value;
        const redirect = current && current.fullPath ? current.fullPath : "/";
        router
          .push(`/login?redirect=${redirect}`)
          .then(() => {
            location.reload();
          })
          .catch(() => {});
      }
    });
  }
}

const heatbeat = {
  /** 开始心跳 */
  start() {
    if (!interval) {
      exec();
      keepAliveTick = 0;
      if (workerTimer && workerTimer.setInterval) {
        intervalType = "worker";
        interval = workerTimer.setInterval(exec, 10 * 1000);
      } else {
        intervalType = "native";
        interval = setInterval(exec, 10 * 1000);
      }
    }
  },
  /** 关闭心跳 */
  clear() {
    if (interval) {
      if (intervalType === "worker" && workerTimer && workerTimer.clearInterval) {
        workerTimer.clearInterval(interval);
      } else {
        clearInterval(interval);
      }
      interval = null;
      intervalType = "native";
      keepAliveTick = 0;
    }
  },
};

export default heatbeat;
