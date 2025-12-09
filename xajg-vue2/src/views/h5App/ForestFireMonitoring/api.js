import request from "@/utils/request";

// 森林防火监控 列表
export function list(data) {
  return request({
    url: "/api/safe/protection-device/list",
    method: "post",
    data,
  });
}