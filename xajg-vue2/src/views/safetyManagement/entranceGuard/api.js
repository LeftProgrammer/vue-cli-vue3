import request from "@/utils/request";

// 项目测点API地址
const BASE_URL = "/api/external/service/entranceGuard";

// 分页查询测点
export function page(data) {
  return request({
    url: `${BASE_URL}/page`,
    method: "post",
    data,
    enableThrottle: true,
  });
}

// 获取机构
export function unitAllList(params) {
  return request({
    method: "get",
    url: "api/custom/system/corporates/list",
    params,
  });
}
