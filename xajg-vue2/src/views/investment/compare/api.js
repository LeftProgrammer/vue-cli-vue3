import request from "@/utils/request";

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/investment/compare/list",
    method: "get",
    params: data,
  });
}

export function save(data) {
  return request({
    url: prefix + "/investment/compare/add",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/investment/compare/delete",
    method: "post",
    data,
  });
}
