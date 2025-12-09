import request from "@/utils/request";

const prefix = '/api';

export function getSectionList(data) {
  return request({
    url: prefix + "/project/section/allList",
    method: "post",
    data
  });
}

export function save(data) {
  return request({
    url: prefix + "/safe/equipment/add",
    method: "post",
    data
  });
}

export function update(data) {
  return request({
    url: prefix + "/safe/equipment/update",
    method: "put",
    data
  });
}

export function page(data) {
  return request({
    url: prefix + "/safe/equipment/page",
    method: "post",
    data
  });
}

export function remove(data) {
  return request({
    url: prefix + "/safe/equipment/delete",
    method: "post",
    data
  })
}

// 通过用户id 获取当前用户的所属机构
export function BelongTo(params) {
  return request({
    method: "get",
    url: prefix + "/plt/corporate/getBelongTo",
    params,
  });
}

export function getStaffList(data) {
  return request({
    url: prefix + "/safe/staff/list",
    method: "post",
    data
  });
}
// 获取整体单位列表
export function unitAllList() {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
  });
}
