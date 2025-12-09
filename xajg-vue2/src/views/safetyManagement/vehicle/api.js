import request from "@/utils/request";

const prefix = '/api';

export function save(data) {
  return request({
    url: prefix + "/safety/vehicle/add",
    method: "post",
    data
  });
}



export function page(data) {
  return request({
    url: prefix + "/safety/vehicle/page",
    method: "post",
    data
  });
}

export function remove(data) {
  return request({
    url: prefix + "/safety/vehicle/delete",
    method: "post",
    data
  })
}



export function unitAllList(params) {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
    params,
  });
}