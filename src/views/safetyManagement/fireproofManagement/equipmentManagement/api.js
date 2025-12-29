import request from "@/utils/request";

const prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/safe/protection-device/saveInfo",
    method: "post",
    data
  });
}

export function update(data) {
  return request({
    url: prefix + "/safe/protection-device/updateInfo",
    method: "put",
    data
  });
}

export function page(data) {
  return request({
    url: prefix + "/safe/protection-device/page",
    method: "post",
    data
  });
}

export function getList() {
  return request({
    url: prefix + "/safe/protection-device/tree",
    method: "post"
  });
}

export function remove(data) {
  return request({
    url: prefix + "/safe/protection-device/deleteInfo",
    method: "post",
    data
  });
}

export function getSection(params) {
  return request({
    url: `/api/project/section/getSectionByUser`,
    method: 'get',
    params
  });
}
