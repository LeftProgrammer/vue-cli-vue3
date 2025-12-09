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
    url: prefix + "/contract/investGeneralPay/save",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/contract/investGeneralPay/delete",
    method: "post",
    data,
  });
}
export function detail(data) {
  return request({
    method: "post",
    url: prefix + "/contract/investGeneralPay/getDetailList",
    data,
  });
}
export function getCount(data) {
  return request({
    method: "post",
    url: prefix + "/contract/investGeneralPay/getCount",
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
export function getContractDetail(params) {
  return request({
    method: "get",
    url: prefix + "/contract/investGeneralPay/getContractDetail",
    params,
  });
}
