import request from "@/utils/request";

let prefix = "/api";

export function getData(data) {
  return request({
    url: prefix + "/safe/hiddenDanger/statistics",
    method: "post",
    data,
  });
}
export function statisticsMonth(data) {
  return request({
    url: prefix + "/safe/hiddenDanger/statisticsMonth",
    method: "post",
    data,
  });
}
