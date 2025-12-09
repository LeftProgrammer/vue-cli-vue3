import request from "@/utils/request";

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/construction/plan/page",
    method: "post",
    data,
  });
}

export function save(data) {
  return request({
    url: prefix + "/construction/plan/save",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/construction/plan/delete",
    method: "post",
    data,
  });
}
// 获取所有的标段
export function sectionList(data) {
  return request({
    method: "post",
    url: prefix + "/project/section/getAll",
    enableThrottle: true,
    data,
  });
}
export function getSection(params) {
  return request({
    url: `/api/project/section/getSectionByUser`,
    method: 'get',
    params
  });
}

export function subPlan(data) {
  return request({
    url: prefix + "/construction/plan/subPlan",
    method: "post",
    data,
  });
}
export function subSave(data) {
  return request({
    url: prefix + "/construction/plan/subSave",
    method: "post",
    data,
  });
}
export function subDelete(data) {
  return request({
    url: prefix + "/construction/plan/subDelete",
    method: "post",
    data,
  });
}
export function subUpdate(data) {
  return request({
    url: prefix + "/construction/plan/subUpdate",
    method: "post",
    data,
  });
}
