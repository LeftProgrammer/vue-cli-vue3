import request from "@/utils/request";

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/investment/plan/page",
    method: "post",
    data,
  });
}

export function save(data) {
  return request({
    url: prefix + "/investment/plan/add",
    method: "post",
    data,
  });
}
export function update(data) {
  return request({
    url: prefix + "/investment/plan/update",
    method: "put",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/investment/plan/delete",
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
    url: prefix + "/investment/plan/getInvestmentPlanDetailList",
    method: "get",
    params: data,
  });
}
