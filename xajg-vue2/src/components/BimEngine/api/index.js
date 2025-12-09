import request from "@/utils/request";

let prefix = "/api";

export function findByModelCode(params) {
  return request({
    url: prefix + "/project/model/config/findByModelCode",
    method: "get",
    params,
  });
}

