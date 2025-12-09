import request from "@/utils/request";

const prefix = '/api';

export function save(data) {
  return request({
    url: prefix + "/safe/water-monitor/save",
    method: "post",
    data
  });
}

export function update(data) {
  return request({
    url: prefix + "/safe/water-monitor/update",
    method: "put",
    data
  });
}

export function page(data) {
  return request({
    url: prefix + "/safe/water-monitor/page",
    method: "post",
    data
  });
}

export function remove(data) {
  return request({
    url: prefix + "/safe/water-monitor/delete",
    method: "post",
    data
  })
}

