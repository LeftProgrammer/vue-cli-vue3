import request from "@/utils/request";

let prefix = "/api";

export function saverequest(data) {
  return request({
    method: "post",
    url: prefix + "/quality/material/add",
    data
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
    url: prefix + "/quality/material/page",
    method: "post",
    data
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

// 获取施工标段(用作与施工单位匹配)
export function sectionListByPage(data) {
  return request({
    url: prefix + "/project/section/page",
    method: "post",
    data,
  });
}

// http://localhost:8087/api/process/write/init/send
// 获取整体单位列表
export function unitList() {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
  });
}

