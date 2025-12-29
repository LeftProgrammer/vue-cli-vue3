import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/design/plan/save",
    method: "post",
    data,
  });
}

export function add(data) {
  return request({
    url: prefix + "/design/plan/add",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/design/plan/delete",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/design/plan/update",
    method: "put",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/design/plan/page",
    method: "post",
    data,
    enableThrottle: true
  });
}

export function list(data) {
  return request({
    url: prefix + "/design/plan/list",
    method: "post",
    data,
  });
}

export function detailList(id) {
  return request({
    url: prefix + "/design/plan/detailList?id=" + id,
    method: "get",
  });
}

export function planMonth(data) {
  return request({
    url: prefix + "/design/plan/planMonth",
    method: "post",
    data,
  });
}

export function getUser(data) {
  return request({
    url: prefix + "/users/info",
    method: "post",
    data,
  });
}

export function getSection(params) {
  return request({
    url: `/api/project/section/getSectionByUser`,
    method: 'get',
    params
  });
}
