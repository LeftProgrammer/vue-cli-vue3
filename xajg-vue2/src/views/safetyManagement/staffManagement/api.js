import request from "@/utils/request";

const prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/safe/staff/add",
    method: "post",
    data,
  });
}
export function batchImport(data) {
  return request({
    url: prefix + "/safe/staff/batchImport",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/safe/staff/update",
    method: "put",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/safe/staff/page",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/safe/staff/delete",
    method: "post",
    data,
  });
}

// 获取所有单位
export function BelongTo(params) {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
  });
}
