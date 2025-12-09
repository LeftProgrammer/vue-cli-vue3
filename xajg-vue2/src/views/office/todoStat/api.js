import request from "@/utils/request";

let prefix = "/api";

export function todoStat(data) {
  return request({
    url: prefix + "/office/stat/todoStat",
    method: "post",
    data,
  });
}

export function hourStat(data) {
  return request({
    url: prefix + "/office/stat/hourStat",
    method: "post",
    data,
  });
}
