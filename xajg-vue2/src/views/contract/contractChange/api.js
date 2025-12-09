import request from "@/utils/request";

const prefix = '/api';

export function save(data) {
  return request({
    url: prefix + "/contract/change/add",
    method: "post",
    data
  });
}

export function update(data) {
  return request({
    url: prefix + "/contract/change/update",
    method: "put",
    data
  });
}

export function page(data) {
  return request({
    url: prefix + "/contract/change/page",
    method: "post",
    data
  });
}

export function remove(data) {
  return request({
    url: prefix + "/contract/change/delete",
    method: "post",
    data
  })
}


