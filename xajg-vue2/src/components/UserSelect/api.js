import request from '@/utils/request'

export function getCorpList() {
  return request({
    url: '/api/system/corporates/tree',
    method: 'get'
  })
}

export function getDepartList(corpId) {
  return request({
    url: `/api/system/departments/tree/${corpId}/corp`,
    method: 'get'
  })
}

export function getUserList(corpId, departId) {
  return request({
    url: `/api/system/member/corporates/${corpId}/departments/${departId}`,
    method: 'get'
  })
}

export function getUserListByIds(userIds = []) {
  return request({
    url: '/api/system/users/userIds/list',
    method: 'post',
    data: {
      data: userIds
    }
  })
}

export function getRecentUserList() {
  return request({
    url: `/api/system/users/latest-select`,
    method: 'get'
  })
}

export function addRecentUserList(data) {
  return request({
    url: `/api/system/users/latest-select`,
    method: 'put',
    data
  })
}

export function getManagerList() {
  return request({
    url: '/api/system/manager/all',
    method: 'get'
  })
}
