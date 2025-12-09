import request from '@/utils/request';

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/safe/education/page",
    method: "post",
    data,
  });
}

export function save(data) {
  return request({
    url: prefix + "/safe/education/save",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/safe/education/delete",
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