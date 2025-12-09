import request from "@/utils/request";

let prefix = "/api";
// 供应计划完成情况
export function queryPlan(data) {
  return request({
    method: "post",
    url: prefix + "/design/account/queryPlan",
    data
  });
}
// 设计成果供应情况
export function querySupply(params) {
  return request({
    method: "get",
    url: prefix + "/design/account/querySupply",
    params
  });
}
// 设计交底次数
export function queryExplain(params) {
  return request({
    method: "get",
    url: prefix + "/design/account/queryExplain",
    params
  });
}

//变更金额统计
export function getChangeCosts(params) {
  return request({
    method: "get",
    url: prefix + "/design/change/getChangeCosts",
    params
  });
}

//变更次数
export function getChangeCounts(params) {
  return request({
    method: "get",
    url: prefix + "/design/change/getChangeCounts",
    params
  });
}
