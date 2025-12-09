import request from '@/utils/request';

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/safe/notification/page",
    method: "post",
    data,
  });
}

export function save(data) {
  return request({
    url: prefix + "/safe/notification/save",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/safe/notification/delete",
    method: "post",
    data,
  });
}

// export function exportDoc(data) {
//   return request({
//     url: prefix + "/safe/notification/export",
//     method: "post",
//     responseType :"blob",
//     data,
//   });
// }

/**
 * 保存模版
 */
export function saveTemplate(data) {
  return request({
    url: prefix + "/safe/notification/saveTemplate",
    method: "post",
    data,
  });
}

/**
 * 获取模板（按用户）
 */
export function listTemplate(data) {
  return request({
    url: prefix + "/safe/notification/listTemplate",
    method: "post",
    data,
  });
}

/**
 * 删除模版
 */
export function deleteTemplate(data) {
  return request({
    url: prefix + "/safe/notification/deleteTemplate",
    method: "post",
    data,
  });
}
