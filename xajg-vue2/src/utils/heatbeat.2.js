import request from "@/utils/request";
import { getToken, setToken, verifyPermission } from "@/utils/auth";
import { INDEX_MAIN_PAGE_PATH, ACCESS_TOKEN } from "@/store/mutation-types";
import { dateFormat } from "@/utils";

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
    heartbeat();
  } else {
    // consolelog("不发送心跳", token);
  }
}

export default {
  /**开始心跳 */
  start() {
    if (!intervel) {
      exec();
      intervel = setInterval(exec, 10 * 1000);
    }
  },
  /**关闭心跳 */
  clear() {
    if (intervel) {
      clearInterval(intervel);
      intervel = null;
      consolelog("clear 心跳 intervel 成功");
    } else {
      consolelog("clear 心跳 intervel");
    }
  },
};
