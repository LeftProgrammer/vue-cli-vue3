import request from "@/utils/request";

const prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/safe/rain-monitor/save",
    method: "post",
    data
  });
}

export function update(data) {
  return request({
    url: prefix + "/safe/rain-monitor/update",
    method: "put",
    data
  });
}

export function page(data) {
  return request({
    url: prefix + "/safe/rain-monitor/page",
    method: "post",
    data
  });
}

export function remove(data) {
  return request({
    url: prefix + "/safe/rain-monitor/delete",
    method: "post",
    data
  });
}

