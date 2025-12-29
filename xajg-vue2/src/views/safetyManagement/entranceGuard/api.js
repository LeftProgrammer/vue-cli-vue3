import request from "@/utils/request";

// 门禁设备API地址
const BASE_URL = "/api/external/service/entranceGuard";

// 分页查询门禁设备
export function page(data) {
  return request({
    url: `${BASE_URL}/page`,
    method: "post",
    data,
    enableThrottle: true,
  });
}

// 编辑门禁设备（仅可编辑所属单位、安装位置、备注）
export function save(data) {
  return request({
    url: `${BASE_URL}/save`,
    method: "post",
    data,
  });
}

// 删除门禁设备
export function remove(id) {
  return request({
    url: `${BASE_URL}/${id}`,
    method: "delete",
  });
}

// 同步门禁设备
export function sync() {
  return request({
    url: `${BASE_URL}/sync`,
    method: "post",
  });
}

// 获取所有门禁设备列表
export function getDeviceList() {
  return request({
    url: `${BASE_URL}/list`,
    method: "get",
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
