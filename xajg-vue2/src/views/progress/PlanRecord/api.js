import request from "@/utils/request";

let prefix = "/api";

// 获取施工标段
export function sectionList(data) {
  return request({
    url: prefix + "/project/section/list",
    method: "post",
    data,
  });
}

// 分页查询
export function page(data) {
  return request({
    url: prefix + "/schedule/management/page",
    method: "post",
    data,
  });
}
