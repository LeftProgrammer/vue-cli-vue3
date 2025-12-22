import request from "@/utils/request";

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/quality/check/page",
    method: "post",
    data,
  });
}
