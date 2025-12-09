import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    method: "post",
    url: prefix + "/design/explain/add",
    data
  });
}

export function add(data) {
  return request({
    url: prefix + "/design/supply/add",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/design/explain/delete",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/design/supply/update",
    method: "put",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/design/explain/page",
    method: "post",
    data
  });
}

export function supplyList(data) {
  return request({
    url: prefix + "/design/supply/list",
    method: "post",
    data,
  });
}

export function detailList(id) {
  return request({
    url: prefix + "/design/supply/detailList?id=" + id,
    method: "get",
  });
}

// 供应计划
export function planList(data) {
  return request({
    url: prefix + "/design/plan/list",
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
