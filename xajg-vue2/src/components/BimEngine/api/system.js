import request from '@/utils/request'
import store from '@/store'
import { transformAbpListQuery, buildPagingQueryResult } from '@/utils/bimengine/abpParamsTransform'
 
const api = {  
  fileManagement: `/api/file-management/files`,   
}
 
 
/**
 * 查看文件
 * @returns 
 */
export function getFileByBlobName (blobName) {
  return `${store.state.baseUrl}${api.fileManagement}/${blobName}`
}

export function getDocumentById (id) {
  return `${store.state.baseUrl}${api.fileManagement}/?blobName=${id}`
}
/**
 * 上传文件
 * @returns {Promise<AxiosResponse<T>>}
 */
export function uploadFile (fileData) {
  return request({
    url: `${api.fileManagement}/upload`,
    method: 'post',
    data: fileData
  })
}
 

 



