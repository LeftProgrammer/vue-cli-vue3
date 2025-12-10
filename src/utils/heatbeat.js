import request from "@/utils/request";
import { getToken, removeToken } from "@/utils/auth";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import router from "@/router";

let interval = null;

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
    heartbeat().then((res) => {
      if (!res.success) {
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

export default {
  /** 开始心跳 */
  start() {
    if (!interval) {
      exec();
      interval = setInterval(exec, 10 * 1000);
    }
  },
  /** 关闭心跳 */
  clear() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  },
};
