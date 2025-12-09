import request from '@/utils/request'
import { transformAbpListQuery, buildPagingQueryResult } from '@/utils/bimengine/abpParamsTransform'
const api = {
  share: `/api/app/share-record`,
}
/**
 * 分享列表
 * @param {*} parameter 
 * @returns 
 */
 export async function getList (params) {
    return await request(
      {
        url: api.share,
        method: 'get',
        params: params
      }
    )
  }
  export function saveShare (parameter) {
    let url = api.share
    if (parameter.id) url = `${url}/${parameter.id}`
    return request({
      url: url,
      method: parameter.id ? 'put' : 'post',
      data: parameter
    })
  }
  export function deleted (id) {
    return request({
      url: `${api.share}/${id}`,
      method: 'delete',
    })
  }
/**
 * 获取分享对象
*/
  export function getShare(id){
    return request({
      url:`/api/app/share-record/${id}`,
      method:'get'
    })
  }
/**
 * 累加分享次数
*/
  export function addPvm(id){
    return request({
      url:`/api/app/share-record/${id}/pvm`,
      method:'post'
    })
  }

