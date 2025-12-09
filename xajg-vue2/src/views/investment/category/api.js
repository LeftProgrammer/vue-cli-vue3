import request from "@/utils/request";

const prefix = "/api/investment";

export function save(data) {
  return request({
    url: prefix + "/category/save",
    method: "post",
    data,
  });
}
export function update(data) {
  return request({
    url: prefix + "/category/update",
    method: "put",
    data,
  });
}
export function remove(id) {
  return request({
    url: prefix + `/category/delete/${id}`,
    method: "post",
  });
}

export function list(data) {
  return request({
    url: prefix + "/category/list",
    method: "post",
    data,
  });
}
