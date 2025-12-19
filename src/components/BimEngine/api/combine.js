import request from '@/utils/request'
import { transformAbpListQuery, buildPagingQueryResult } from '@/utils/bimengine/abpParamsTransform'

const api = {
  combine: `/api/app/combine`,//合摸
}


// //getCombineList
// /**查询文档列表 */
// // export function getCombineList (parameter) {
// //  // const queryParams = transformAbpListQuery(parameter)//使用stable展示列表需要转换一下数据格式
// //   return request({
// //     url: api.combine,
// //     method: 'get',
// //     params: parameter
// //   }).then(data => {
// //     return buildPagingQueryResult(parameter, data)
// //   })
// // }

//保存合模
export function saveModelClosing (parameter) {
    let url =api.combine;
    return request({
        url: url,
        method:'post',
        data: parameter
    });
}

//getCombineList
/**查询合摸列表 */
export function getCombineList (parameter) {
   const queryParams = transformAbpListQuery(parameter)//使用stable展示列表需要转换一下数据格式
   return request({
     url: api.combine,
     method: 'get',
     params: queryParams
   }).then(data => {
     return buildPagingQueryResult(parameter, data)
   })
}

//getCombineList
/**查询文档列表 */
export function getDocumentList (id) {
 return request({
    url: api.combine/GetDocument,
    method: 'get',
    params: {id:id}
  }).then(data => {
    return data
  })
}



/**
 * 查询合模树结构-并且带
 * @param {*} projectId 项目Id
 * @param {*} combineName 合模名称
 * @returns 
 */
 export function getCombine(projectId, combineName) {
  return request({
    url: `${api.combine}/getalllistasync`,
    method: 'get',
    params: { projectId: projectId, combineName: combineName}
  })
}

export function deleted (id) {
  return request({
    url: `${api.combine}/${id}`,
    method: 'delete',
  })
}

export function getClampById (id) {
    return request({
      url: `${api.combine}/${id}`,
      method: 'get',
    })
  }
  
export function getHasClampById (id) {
    return request({
        url: `${api.combine}/has-combine/${id}`,
        method: 'get',
    })
}

//公开
export function openStatusClamping (parameter) {
    return request({
        url: `${api.combine}/set-open`,
        method:'post',
        params: {isOpen:parameter.isOpen},
        data: parameter.id,
    });
}

/**
 * 获取合模日志
*/
export function getCombineLogs(combineId){
  return request({
    url:`${api.combine}/by-combine-log-id/${combineId}`,
    method:'get'
  })
}
