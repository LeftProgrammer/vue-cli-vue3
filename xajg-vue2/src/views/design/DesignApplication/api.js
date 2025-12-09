import request from "@/utils/request";

let prefix = "/api";

export function designPage(data) {
  return request({
    url: prefix + "/design/account/info",
    method: "post",
    data,
  });
}

export function explainPage(data) {
  return request({
    url: prefix + "/design/explain/page",
    method: "post",
    data
  });
}

export function designChangePage(data) {
  return request({
    url: prefix + "/design/change/page",
    method: "post",
    data
  });
}

export function projectChangePage(data) {
  return request({
    url: prefix + "/design/projectChange/page",
    method: "post",
    data
  });
}

export function statisticsResultsType(pbsCode) {
  return request({
    url: prefix + "/design/supply/detail/statistics/results-type?pbsCode=" + pbsCode,
    method: "get"
  });
}