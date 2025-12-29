import request from "@/utils/request";

const BASE_URL = "api/safe/entranceRecord";

// 分页查询门禁记录
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
    enableThrottle: true,
  });
}
