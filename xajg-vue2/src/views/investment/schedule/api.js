import request from "@/utils/request";

let prefix = "/api";

export function list(data) {
  return request({
    url: prefix + "/investment/schedule/list",
    method: "post",
    data,
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

export function getInvestmentCategoryTree(data) {
  return request({
    url: prefix + "/investment/category/tree",
    method: "get",
    params: data,
  });
}
