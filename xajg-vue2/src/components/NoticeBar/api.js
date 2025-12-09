import request from '@/utils/request'
/**
 *
 获取未读数量
 * @param {*}
 */
export function getNoticeReadedCount() {
  return request({
    url: `/api/system/notices/count`,
    method: 'get'
  })
}

/**
 *
 获取通知列表
 * @param {*} params
 */
export function getNoticeList(data) {
  return request({
    url: `/api/system/notices`,
    method: 'post',
    data
  })
}

/**
 *
 获取单个更新已读
 * @param {*} params
 */
export function putReadStatus(noticeId) {
  return request({
    url: `/api/system/notices/${noticeId}`,
    method: 'put'
  })
}

/**
 *
 删除单个通知
 * @param {*} params
 */
export function removeNotice(noticeId) {
  return request({
    url: `/api/system/notices/${noticeId}`,
    method: 'delete'
  })
}

/**
 *
 删除多个通知
 * @param {*} data
 */
export function removeNoticeReaded(data) {
  return request({
    url: `/api/system/notices-multi`,
    method: 'delete',
    data
  })
}
/**
 *
 删除已读通知
 */
export function removeNoticeRead() {
  return request({
    url: `/api/system/notices-read`,
    method: 'delete'
  })
}
/**
 *
 删除全部通知
 * @param {*} data
 */
export function removeNoticeAll(data) {
  return request({
    url: `/api/system/notices-all`,
    method: 'delete',
    data
  })
}
/**
 *
 更新多个已读状态
 * @param {*} data
 */
export function putNoticeStatusAll(data) {
  return request({
    url: `/api/system/notices-multi`,
    method: 'put',
    data
  })
}
/**
 *
 获取用户的通知详细结果
 * @param {*} data
 */
export function getNoticeDetail(data) {
  return request({
    url: `/api/system/notices/${data.noticeId}`,
    method: 'get'
  })
}

// 获取详情
export function getInfo(id) {
  return request({
    url: 'api/information/get-info/' + id,
    method: 'get'
  })
}


// 设置某条消息已读
export function noticesSetRead(noticeId) {
  return request({
    url: `/api/system/notices/${noticeId}`,
    method: 'put',
  })

}