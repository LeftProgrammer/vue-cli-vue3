import request from "@/utils/request";

const prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/contract/sign/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/contract/sign/update",
    method: "put",
    data,
  });
}
export function getDepartList(corpId) {
  return request({
    url: `/api/system/departments/tree/${corpId}/corp`,
    method: "get",
  });
}

export function page(data) {
  return request({
    url: prefix + "/contract/sign/page",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/contract/sign/delete",
    method: "post",
    data,
  });
}
export function unitList() {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
  });
}
