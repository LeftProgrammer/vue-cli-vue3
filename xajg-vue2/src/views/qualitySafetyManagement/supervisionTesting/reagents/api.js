import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/quality/supervisionTest/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/protection/scheme/manage/save",
    method: "post",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/quality/supervisionTest/page",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/quality/supervisionTest/delete",
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

//获取所有标段
export function sectionAllList(data) {
  return request({
    url: prefix + "/project/section/getAll",
    method: "post",
    data,
  });
}

