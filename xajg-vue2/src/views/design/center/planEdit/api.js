import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/design/planChange/save",
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
    url: prefix + "/design/planChange/delete",
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
    url: prefix + "/design/planChange/page",
    method: "post",
    data,
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

// 通过月份 查询的数据
export function listByMonth(data) {
  return request({
    url: prefix + "/design/plan/queryOne",
    method: "post",
    data
  });
}

// 通过月份 查询供应计划台账数据
export function ledgertByMonth() {
  return request({
    url: prefix + "/design/ledgert/tree",
    method: "get",
  });
}
