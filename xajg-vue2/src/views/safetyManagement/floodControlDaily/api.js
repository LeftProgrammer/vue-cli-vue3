import request from '@/utils/request';

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/safe/floodControlDaily/page",
    method: "post",
    data,
  });
}

export function save(data) {
  return request({
    url: prefix + "/safe/floodControlDaily/save",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/safe/floodControlDaily/delete",
    method: "post",
    data,
  });
}

export function exportDoc(data) {
  return request({
    url: prefix + "/safe/floodControlDaily/export",
    method: "post",
    responseType :"blob",
    data,
  });
}