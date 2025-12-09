import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  data.designSupply.type = '1'
  return request({
    // url: prefix + "/design/supply/save",
    method: "post",
    url: prefix + "/design/supply/detail/drawing/save",
    data: {
      ...data,
    },
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
    // url: prefix + "/design/supply/delete",
    url: prefix + "/design/supply/detail/drawing/delete",
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
    url: prefix + "/design/supply/detail/page",
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

export function detailAll(params) {
  return request({
    method: "get",
    url: prefix + "/design/plan/detailAll",
    params
  });
}

export function getfile(params) {
  return request({
    url: prefix + "/attachments/download",
    method: "get",
    params,
    // headers: { 'Accept': 'application/x-www-form-urlencoded' },
    responseType: 'arraybuffer'
  });
}

// 工程变更 筛选出已完成的工程变更申请流程。
export function engineeringChange(data) {
  return request({
    method: "post",
    url: prefix + "/design/projectChange/page",
    data
  });
}
