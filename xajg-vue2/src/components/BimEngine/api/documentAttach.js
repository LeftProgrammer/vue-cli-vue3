import request from '@/utils/request'
export function breakpointContinuation(parameter) {
  return request({
    url: `/api/app/document-attach/breakpoint-continuation`,
    method: 'post',
    data: parameter
  })
}
export function mergeAttach(parameter) {
  return request({
    url: `/api/app/document-attach/merge`,
    method: 'post',
    params: parameter
  })
}
export async function saveAttach(params) {
  return await request({
    url: '/api/app/document-attach',
    method: 'post',
    data: params
  })
}
export async function deleteAttach(id) {
  return await request({
    url: `/api/app/document-attach/${id}`,
    method: 'delete'
  })
}
export async function getListAttach(params) {
  return await request({
    url: '/api/app/document-attach',
    method: 'get',
    params: params
  })
}