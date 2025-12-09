import request from "@/utils/request";

let prefix = "/api";

// 获取整体单位列表
export function corporates(params) {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
    params,
  });
}

export function save(data) {
  return request({
    url: prefix + "/test/detection/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/test/detection/update",
    method: "post",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/test/detection/page",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/test/detection/delete",
    method: "post",
    data,
  });
}
export function selectById(data) {
  return request({
    url: prefix + "/test/detection/selectById",
    method: "post",
    data,
  });
}

// 获取施工标段
export function sectionList(data) {
  return request({
    url: prefix + "/project/section/list",
    method: "post",
    data,
  });
}

export function sectionAllList(data) {
  return request({
    url: prefix + "/project/section/getAll",
    method: "post",
    data,
    enableThrottle: true
  });
}

// 通过用户id 获取当前用户的所属机构
export function BelongTo(params) {
  return request({
    method: "get",
    url: prefix + "/plt/corporate/getBelongTo",
    params,
  });
}

// 通过用户id 获取当前用户的所属机构
export function getByBaseId(params) {
  return request({
    method: "get",
    url: prefix + "/test/detection/getByBaseId",
    params,
  });
}
