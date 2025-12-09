import request from "@/utils/request";

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/quality/dissmission/page",
    method: "post",
    data,
  });
}

export function save(data) {
  return request({
    url: prefix + "/quality/dissmission/save",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/quality/dissmission/delete",
    method: "post",
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
