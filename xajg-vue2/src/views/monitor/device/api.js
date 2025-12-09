import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/monitor/device/save",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/monitor/device/update",
    method: "put",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/monitor/device/page",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/monitor/device/delete",
    method: "post",
    data,
  });
}

export function list(data) {
  data = data || {};
  return request({
    url: prefix + "/monitor/device/list",
    method: "post",
    data,
  });
}
