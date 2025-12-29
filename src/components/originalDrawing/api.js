import request from "@/utils/request";

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/design/supply/detail/page",
    method: "post",
    data
  });
}

export function pageNotSelect(data, page) {
  return request({
    url: prefix + "/design/supply/detail/pageNotSelect",
    method: "post",
    data
  });
}