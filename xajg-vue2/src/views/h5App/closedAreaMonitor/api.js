
import request from "@/utils/request";

// 封闭区监控 列表
export function list(data) {
  return request({
    url: "/api/safe/protection-device/list",
    method: "post",
    data,
  });
}

export function firstFrame(data) {
  return request({
    url: "/api/video/firstFrame",
    method: "post",
    data,
  });
}