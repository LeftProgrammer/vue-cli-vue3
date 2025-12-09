import request from "@/utils/request";

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/design/account/info",
    method: "post",
    data,
  });
}
export function explainPage(data) {
  return request({
    url: prefix + "/design/explain/list",
    method: "post",
    data,
  });
}

export function drawingIssuePage(data) {
  return request({
    url: prefix + "/drawing/issue/list",
    method: "post",
    data,
  });
}
