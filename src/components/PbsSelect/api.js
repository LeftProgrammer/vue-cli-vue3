import request from "@/utils/request";

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/project/pbs/page",
    method: "post",
    data: data,
  });
}

export function list(data) {
  return request({
    url: prefix + "/project/pbs/list",
    method: "post",
    data,
  });
}

export function get(id) {
  return request({
    url: prefix + "/project/pbs/get/id/" + id,
    method: "get",
  });
}

export function getByCode(code) {
  return request({
    url: prefix + "/project/pbs/get/code/" + code,
    method: "get",
  });
}

export function page3(data) {
  return request({
    url: prefix + "/synthesis/train-plan-detail/list",
    method: "post",
    data: data,
  });
}
export function page4(data) {
  return request({
    url: prefix + "/synthesis/profile-manage/page",
    method: "post",
    data: data,
  });
}
export function list1(corpId) {
  return request({
    url: prefix + `/system/departments/list/${corpId}`,
    method: "GET",
  });
}
