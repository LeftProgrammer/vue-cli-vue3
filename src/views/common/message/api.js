import request from "@/utils/request";

const prefix = "/api";

export function getNoticeReadedCount() {
  return request({
    url: `${prefix}/system/notices/count`,
    method: "get",
    showLoading: false,
  });
}

export function getNoticeDetail(noticeId) {
  return request({
    url: `${prefix}/system/notices/${noticeId}`,
    method: "get",
  });
}

export function notices(id) {
  return request({
    url: `${prefix}/system/notices/${id}`,
    method: "put",
  });
}

export function remove(id) {
  return request({
    url: `${prefix}/system/notices/${id}`,
    method: "delete",
  });
}

export function page(data) {
  // { current: 1, pageSize: 10, readStatus: "" }
  return request({
    url: `${prefix}/system/notices`,
    method: "post",
    data,
  });
}

export function noticesmulti(ids) {
  return request({
    url: `${prefix}/system/notices-multi`,
    method: "put",
    data: {
      data: ids,
    },
  });
}

/**
 * 删除全部通知
 */
export function removeNoticeAll(data) {
  return request({
    url: `${prefix}/system/notices-all`,
    method: "delete",
    data,
  });
}
