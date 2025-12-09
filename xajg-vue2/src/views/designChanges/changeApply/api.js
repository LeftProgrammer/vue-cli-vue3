import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    method: "post",
    url: prefix + "/design/change/add",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/design/change/delete",
    method: "post",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/design/change/page",
    method: "post",
    data,
  });
}

export function getObjForCode(code) {
  return request({
    url: prefix + "/design/change/list/" + code,
    method: "get",
  });
}
export function getSection(params) {
  return request({
    url: `/api/project/section/getSectionByUser`,
    method: "get",
    params,
  });
}

// 获取施工标段列表
export function sectionList(data) {
  return request({
    url: prefix + "/project/section/list",
    method: "post",
    data,
  });
}
