import request from "@/utils/request";

// 项目模型配置API地址
const BASE_URL = "/api/project/model/config";
export function updateModelConfig(data) {
  return request({
    url: `${BASE_URL}/save`,
    method: "post",
    data,
  });
}
export function findByModelCode(params) {
  return request({
    url: `${BASE_URL}/findByModelCode`,
    method: "get",
    params,
  });
}
