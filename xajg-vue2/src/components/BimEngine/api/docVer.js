import request from '@/utils/request'
const api = {
  BaseDocVer:'/api/app/document-ver',
  documentHandle: '/api/app/document-handle'
}



/**
 * 上传文件
 * @returns {Promise<AxiosResponse<T>>}
 */
 export async function uploadDocumentFile (docId,formData) {
  return await request(
    {
      url: `${api.documentHandle}/upload-file/?docId=${docId}`,
      method: 'post',
      data: formData
    }
  )
}

export async function uploadBimOrCad (param) {
  console.log('bim')
  return await request(
    {
      url: `${api.documentHandle}/upload-bim-or-cad`,
      method: 'post',
      params: param
    }
  )
}

/**
 * 查询版本信息
 * @param {*} parameter 
 * @returns 
 */
 export async function getDocVerList(params){
  return await request({
    url: api.BaseDocVer,
    method: 'get',
    params: params
  })
}
/**
 * 版本详情
*/
export async function getDocVer(id){
  return await request(
    {
      url: `${api.BaseDocVer}/${id}`,
      method: 'get',      
    }
  )
}

///删除模型信息
export function DocVerDeleted(id) {
  return request({
    url: `${api.BaseDocVer}/${id}`,
    method: 'delete',
  })
}
//设置版本
export function SetDocVerCurrent(id){
  return request({
    url: `${api.BaseDocVer}/${id}/set-current`,
    method: 'post',
  })
}