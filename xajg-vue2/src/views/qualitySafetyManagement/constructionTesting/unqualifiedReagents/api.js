import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/quality/constructionTest/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/quality/constructionTest/update",
    method: "post",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/quality/constructionTest/page",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/protection/scheme/manage/delete",
    method: "post",
    data,
  });
}
// 获取施工标段
export function sectionList(data) {
  return request({
      url: prefix + "/project/section/list",
      method: "post",
      data,
  });
}

