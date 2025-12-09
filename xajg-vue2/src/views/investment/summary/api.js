import request from "@/utils/request";

let prefix = "/api";

export function list(params) {
  return request({
    url: prefix + "/investment/actual/queryExport",
    method: "get",
    params,
  });
}

export function save(data) {
  return request({
    url: prefix + "/investment/schedule/add",
    method: "post",
    data,
  });
}
export function update(data) {
  return request({
    url: prefix + "/investment/schedule/update",
    method: "put",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/investment/schedule/delete",
    method: "post",
    data,
  });
}

export function getEstimateList() {
  return request({
    url: prefix + "/investment/estimate/item/list",
    method: "get",
  });
}

export function getInvestmentPlanDetailList(data) {
  return request({
    url: prefix + "/investment/schedule/getInvestmentPlanDetailList",
    method: "get",
    params: data,
  });
}

export function getInvestmentCategoryTree() {
  return request({
    url: prefix + "/investment/category/tree",
    method: "get",
  });
}
export function lock(data) {
  return request({
    url: prefix + "/investment/actual/lock?year=" + data,
    method: "post",
    data,
  });
}
export function unlock(data) {
  return request({
    url: prefix + "/investment/actual/unlock?year=" + data,
    method: "post",
    data,
  });
}
export function exportUrl(data) {
  return request({
    url: prefix + "/investment/actual/export",
    method: "get",
    params: data,
  });
}
export function lockStatus(data) {
  return request({
    url: prefix + "/investment/actual/lockStatus",
    method: "get",
    params: data,
  });
}
