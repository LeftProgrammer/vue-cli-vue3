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
    url: prefix + "/test/detection/supervisor/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/test/detection/supervisor/update",
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
    url: prefix + "/test/detection/supervisor/delete",
    method: "post",
    data,
  });
}

// 获取施工标段
export function sectionList(data) {
  return request({
    url: prefix + "/project/section/getAll",
    method: "post",
    data,
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

export function closeMultiple(data) {
  return request({
    method: "post",
    url: prefix + "/test/detection/supervisor/closeMultiple",
    data,
  });
}
