import request from "@/utils/request";

let prefix = "/api";

export function list(data) {
  return request({
    url: prefix + "/schedule/management/list",
    method: "post",
    data,
  });
}

export function getTaskList(id) {
  return request({
    url: prefix + "/schedule/management/tasklist?planid=" + id,
    method: "get",
  });
}

export function getPbsListByCode(codes) {
  return request({
    url: prefix + "/project/pbs/get/code/" + codes,
    method: "get",
  });
}

export function planAnalyze(params) {
  return request({
    url: prefix + "/schedule/management/planAnalyze",
    method: "post",
    data: params
  });
}

export function analyzeCompare(params) {
  return request({
    url: prefix + "/schedule/management/analyzeCompare",
    method: "post",
    data: params
  });
}

export function managementDetail(params) {
  return request({
    url: prefix + "/schedule/management/managementDetail",
    method: "post",
    data: params
  });
}
