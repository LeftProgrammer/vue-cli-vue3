import request from "@/utils/request";

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/quality/Inspect/page",
    method: "post",
    data,
  });
}

export function save(data) {
  return request({
    url: prefix + "/quality/Inspect/save",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/quality/Inspect/delete",
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
