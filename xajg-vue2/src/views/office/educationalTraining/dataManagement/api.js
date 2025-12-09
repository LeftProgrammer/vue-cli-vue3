import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/synthesis/profile-manage/save",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/synthesis/profile-manage/update",
    method: "put",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/synthesis/profile-manage/page",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/synthesis/profile-manage/delete",
    method: "post",
    data,
  });
}
export function list() {
  return request({
    url: prefix + `/plt/department/getAllDepartment`,
    method: "GET",
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

// 获取整体单位列表
export function unitList() {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
  });
}
