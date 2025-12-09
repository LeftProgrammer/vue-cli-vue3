import request from "@/utils/request";

const prefix = "/api";


export function save(data) {
  return request({
    url: prefix + "/safe/warningConfig/save",
    method: "post",
    data
  });
}

export function update(data) {
  return request({
    url: prefix + "/safe/warningConfig/update",
    method: "put",
    data
  });
}

export function page(data) {
  return request({
    url: prefix + "/safe/warningConfig/page",
    method: "post",
    data
  });
}

export function remove(data) {
  return request({
    url: prefix + "/safe/warningConfig/delete",
    method: "post",
    data
  });
}

