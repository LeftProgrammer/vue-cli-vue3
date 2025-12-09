import request from "@/utils/request";

const prefix = '/api';

export function save(data) {
  return request({
    url: prefix + "/safe/risk/add",
    method: "post",
    data
  });
}

export function update(data) {
  return request({
    url: prefix + "/safe/risk/update",
    method: "put",
    data
  });
}

export function page(data) {
  return request({
    url: prefix + "/safe/risk/page",
    method: "post",
    data
  });
}

export function remove(data) {
  return request({
    url: prefix + "/safe/risk/delete",
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

