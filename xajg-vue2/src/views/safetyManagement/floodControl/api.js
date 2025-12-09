import request from '@/utils/request';

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/safe/flood/page",
    method: "post",
    data,
  });
}

export function save(data) {
  return request({
    url: prefix + "/safe/flood/save",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/safe/flood/delete",
    method: "post",
    data,
  });
}

export function exportDoc(data) {
  return request({
    url: prefix + "/safe/flood/export",
    method: "post",
    responseType :"blob",
    data,
  });
}