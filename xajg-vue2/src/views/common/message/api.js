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

/**
 *
 删除全部通知
 * @param {*} data
 */
export function removeNoticeAll(data) {
  return request({
    url: `/api/system/notices-all`,
    method: "delete",
    data,
  });
}
