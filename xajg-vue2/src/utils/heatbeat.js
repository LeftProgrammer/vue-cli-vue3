import request from "@/utils/request";
import { getToken, setToken, verifyPermission, removeToken } from "@/utils/auth";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { dateFormat } from "@/utils";
import workerTimer from "@/utils/workder";
import router from '@/router';

let intervel = null;
let lastTime = null;

function timeFormat() {
  lastTime = new Date().getTime();
  return dateFormat(lastTime, "YYYY-MM-DD HH:mm:ss.SSS");
}

function heartbeat() {
  return request({
    url: "/api/online-heartbeat?t=" + new Date().getTime(),
    method: "get",
  });
}

function consolelog(msg, token) {
  let diff = (new Date().getTime() - lastTime) / 1000;
  console.log(msg, timeFormat(), diff, token);
}

function exec() {
  let token = getToken();
  if (token && token != ACCESS_TOKEN) {
    // consolelog("发送心跳", token);
    heartbeat().then(res => {
      if (!res.success) {
        console.log("token失效了......")

        removeToken();

        router.push(`/login?redirect=${router.history.current.fullPath}`)
          .then(() => {
            location.reload();
          });
      }
    });
  } else {
    // consolelog("不发送心跳", token);
  }
}

export default {
  /**开始心跳 */
  start() {
    if (!intervel) {
      exec();
      // 开启
      intervel = workerTimer.setInterval(exec, 10 * 1000);
    }
  },
  /**关闭心跳 */
  clear() {
    if (intervel) {
      // 注销
      workerTimer.clearInterval(intervel);
      intervel = null;
      consolelog("clear 心跳 intervel 成功");
    } else {
      consolelog("clear 心跳 intervel");
    }
  },
};
