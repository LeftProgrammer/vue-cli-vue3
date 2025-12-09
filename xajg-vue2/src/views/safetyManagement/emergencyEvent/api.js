import request from "@/utils/request";

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/safe/event/page",
    method: "post",
    data,
  });
}

export function save(data) {
  return request({
    url: prefix + "/safe/event/save",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/safe/event/delete",
    method: "post",
    data,
  });
}

// 获取整体单位列表
export function unitAllList() {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
  });
}

export function exportDoc(data) {
  return request({
    url: prefix + "/safe/event/export",
    method: "post",
    responseType :"blob",
    data,
  });
}