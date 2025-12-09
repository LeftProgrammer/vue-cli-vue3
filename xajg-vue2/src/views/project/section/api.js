import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/project/section/save",
    method: "post",
    data,
  });
}

export function add(data) {
  return request({
    url: prefix + "/project/section/add",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/project/section/delete",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/project/section/update",
    method: "put",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/project/section/page",
    method: "post",
    data,
  });
}

export function list(data) {
  return request({
    url: prefix + "/project/section/list",
    method: "post",
    data,
  });
}

export function detailList(id) {
  return request({
    url: prefix + "/project/section/detailList?id=" + id,
    method: "get",
  });
}
