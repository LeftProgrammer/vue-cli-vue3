import request from "@/utils/request";

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/contract/investGeneralPay/page",
    method: "post",
    data,
  });
}

export function save(data) {
  return request({
    url: prefix + "/contract/cost/handle",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/contract/cost/delete",
    method: "post",
    data,
  });
}
export function detail(data) {
  return request({
    method: "post",
    url: prefix + "/contract/cost/getDetailList",
    data,
  });
}
// 获取整体单位列表
export function unitAllList() {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
  });
}
