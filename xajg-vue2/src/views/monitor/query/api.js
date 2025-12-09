import request from "@/utils/request";

let prefix = "/api";

export function list(data) {
  data = data || {};
  return request({
    url: prefix + "/monitor/device/list",
    method: "post",
    data,
  });
}
