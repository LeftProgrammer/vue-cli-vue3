import request from "@/utils/request";

let prefix = "/api";

export function notices(id) {
  return request({
    url: prefix + "/system/notices/" + id,
    method: "put",
  });
}

export function remove(id) {
  return request({
    url: prefix + "/system/notices/" + id,
    method: "DELETE",
  });
}

export function page(data) {
  // {current: 1, pageSize: 10, readStatus: ""}
  return request({
    url: prefix + "/system/notices",
    method: "post",
    data,
  });
}

export function noticesmulti(ids) {
  return request({
    url: prefix + "/system/notices-multi",
    method: "put",
    data: {
      data: ids,
    },
  });
}

// 收发文分页查询
export function managementPage(data) {
  return request({
    url: prefix + "/synthesis/manage/list",
    method: "post",
    data,
  });
}

export function getDatalistByIds(ids) {
  return request({
    url: prefix + "/synthesis/manage/listByIds",
    method: "post",
    data: ids,
  });
}

export function sendMessage(data) {
  return request({
    url: prefix + "/plt/flow/urge",
    method: "post",
    data: data,
  });
}
