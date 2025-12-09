import request from '@/utils/request'

// 获取限定条数的平台通知公告
export function getLimitCount(params) {
  return request({
    url: `/authc-api/first-page-notice/get-limit-count`,
    params
  })
}
// 获取平台制度体系
export function getInstitutionReleaseList(data) {
//  let url='/api/zhgl/list?M_ZDLB='+data
  return request({
    url: `/api/zhgl/list`,
    method: 'get',
    data
  })
}
// 制度体系隐藏
export function ignoreInstitutionReleaseList(params) {
  return request({
    url: `/api/zhgl/ignore`,
    method: 'get',
    params
  })
}
// 获取限定条数的平台通知公告
export function getNewReleaseList(data) {
  return request({
    url: `/api/process/packages/custom/newRelease/list`,
    method: 'post',
    data
  })
}
/**
 * 获取流程详情
 * @param {*} data
 * @returns
 */
export function getFinishedRead(data) {
  return request({
    url: `/api/process/read/business/finished-read`,
    method: 'post',
    data
  })
}
/**
 * 获取待办任务
 * @param {*} data
 * @returns
 */
export function getTaskTodo(data) {
  return request({
    url: `/api/process/packages/self/todo`,
    method: 'post',
    data
  })
}
