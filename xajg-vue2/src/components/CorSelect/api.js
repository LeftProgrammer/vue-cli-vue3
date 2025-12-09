import request from '@/utils/request'

/* 获取整体单位树*/
export function getTypeCorp() {
  return request({
    url: '/api/system/corporates/tree',
    method: 'GET'
  })
}

/* 获取单位的整体部门树*/
export function getTypeDepart(corpId) {
  return request({
    url: `/api/system/departments/tree/${corpId}/corp`,
    method: 'GET'
  })
}
