import request from '@/utils/request'
import store from '@/store'

const api = {
  upload: `/api/file-management/files/upload`,   
  download:`/api/file-management/files`,
  downfile:`api/file-management/files`
  // preview: `/api/file-management/files`
}

/**
 * 上传文件
 * @param {*} parameter 
 * @returns 
 */
export function uploadFile (parameter) {
  return request({
    url: api.upload,
    method: 'post',
    data: parameter
  })
}

/**
 * 下载文件
*/
export function downloadFile(blobName){
  return request({
    url: `${api.download}/${blobName}`,
    method: 'get'     
  })
}
/**
 * 查看文件
 * @returns 
 */
 export function getFileByBlobName (blobName) {
  return `${store.state.baseUrl}${api.download}/${blobName}`
}
// /**
//  * 文件浏览
//  * @param {*} blobName 
//  * @returns 
//  */
// export function previewFile (blobName) {
//   return request({
//     url: `${api.preview}/` + blobName,
//     method: 'get',
//   })
// }


