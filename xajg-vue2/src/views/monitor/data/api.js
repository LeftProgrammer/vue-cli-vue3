import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/monitor/data/save",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/monitor/data/update",
    method: "put",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/monitor/data/page",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/monitor/data/delete",
    method: "post",
    data,
  });
}

export function confirmWarning(data) {
  return request({
    url: prefix + "/monitor/data/confirmWarning",
    method: "post",
    data,
  });
}

export function list(data) {
  return request({
    url: prefix + "/monitor/data/list",
    method: "post",
    data,
  });
}
