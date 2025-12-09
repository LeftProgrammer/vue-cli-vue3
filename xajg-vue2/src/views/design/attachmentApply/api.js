
import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/design/apply/add",
    method: "post",
    data
  });
}

export function update(data) {
  return request({
    url: prefix + "/design/apply/update",
    method: "put",
    data
  });
}

export function page(data) {
  return request({
    url: prefix + "/design/apply/processList",
    method: "post",
    data
  });
}

export function remove(data) {
  return request({
    url: prefix + "/design/apply/delete",
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

export function getSection(params) {
  return request({
    url: `/api/project/section/getSectionByUser`,
    method: 'get',
    params
  });
}
