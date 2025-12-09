import request from '@/utils/request'
const modelApi = {
  ModelTree: `/api/app/model-type/GetALLAsync`,
  ModelTreeIdList: `/api/app/model-type/child-id-list`,
  FeatureProperty: `/api/app/model-property/getproperty`,
  GetViewpointData: `/api/app/viewpoint/GetALLAsync`,
  ViewpointData: `/api/app/view-point`,
  RoamingTrack: `/api/app/roaming`,
  ImportViewpoint: `/api/app/viewpoint/uploading-file`,
  GetFileUrl: `/api/file-management/files`,
  SetModelClosingData: `/api/app/combine`,
  SharedUrlSave: `/api/app/share-record`,
  SharedViewpoint: `/api/app/sharerecordlink/getviewpointdata`,
  SharedRoaming: `/api/app/sharerecordlink/getroamingdata`,
  SharedCode: `/api/app/share-record/getallasync`,
  SharedModelColsing: `/api/app/sharerecordlink/getcombinedata`,
  SharedDoc: `/api/app/sharerecordlink/doctree`
}

/**
 * 获取模型结构树
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getModelTypeTree(params) {
  return await request(
    {
      url: modelApi.ModelTree,
      method: 'get',
      params: params
    }
  )
}

/**
 * 获取模型结构树构件id
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getModelTypeTreeIdList(params) {
  return await request(
    {
      url: modelApi.ModelTreeIdList,
      method: 'get',
      params: params
    }
  )
}
/**
 * 获取构件属性
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getFeatureProperty(params) {
  return await request(
    {
      url: modelApi.FeatureProperty,
      method: 'get',
      params: params
    }
  )
}
/**
 * 获取视点数据tree
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getViewpointData(params) {
  return await request(
    {
      url: modelApi.GetViewpointData,
      method: 'get',
      params: params,
    }
  )
}

/**
 * 获取视点列表
*/
export async function getViewpointList(params) {
  return await request({
    url: modelApi.ViewpointData,
    method: 'get',
    params: params
  })
}
/**
 * 保存视点数据
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function setViewpointData(params) {
  return await request(
    {
      url: modelApi.ViewpointData,
      method: 'post',
      data: params
    }
  )
}

/**
 * 获取视点图片
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getFileUrl(id) {
  return await request(
    {
      url: `${modelApi.GetFileUrl}/${id}`,
      method: 'get',
      responseType: 'arraybuffer'
    }
  )
}
/**
 * 删除视点
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function deleteViewPoint(id) {
  return await request(
    {
      url: `${modelApi.ViewpointData}/${id}`,
      method: 'delete',
    }
  )
}
/**
 * 存储漫游轨迹
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function setRoamingTrack(params) {
  return await request(
    {
      url: modelApi.RoamingTrack,
      method: 'post',
      data: params
    }
  )
}
/**
 * 获取漫游轨迹
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getRoamingTrack(params) {
  return await request(
    {
      url: modelApi.RoamingTrack,
      method: 'get',
      params: params
    }
  )
}
/**
 * 删除漫游轨迹
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function deleteRoamingTrack(id) {
  return await request(
    {
      url: `${modelApi.RoamingTrack}/${id}`,
      method: 'delete',
    }
  )
}


/**
 * 分享保存
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function setSharedUrlSave(params) {
  return await request(
    {
      url: modelApi.SharedUrlSave,
      method: 'post',
      data: params
    }
  )
}
/**
 * 分享校验
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function stateShared(id) {
  return await request(
    {
      url: `${modelApi.SharedUrlSave}/${id}`,
      method: 'get',
    }
  )
}
/**
 * 验证码验证
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getSharedCode(params) {
  return await request(
    {
      url: modelApi.SharedCode,
      method: 'get',
      params: params
    }
  )
}
/**
 * 分享视点
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function sharedViewpoint(params) {
  return await request(
    {
      url: modelApi.SharedViewpoint,
      method: 'get',
      params: params
    }
  )
}
/**
 * 分享漫游
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function sharedRoaming(params) {
  return await request(
    {
      url: modelApi.SharedRoaming,
      method: 'get',
      params: params
    }
  )
}

export async function ifIsAuthCode(id) {
  return await request({
    url: `${modelApi.SharedUrlSave}/${id}` + '/is-auth',
    method: 'get'
  })
}


export default {
  getModelTypeTree,
  getModelTypeTreeIdList,
  getFeatureProperty,
  getViewpointData,
  setViewpointData,
  setRoamingTrack,
  getRoamingTrack,
  deleteRoamingTrack,
  getFileUrl,
  deleteViewPoint,
  setSharedUrlSave,
  sharedViewpoint,
  sharedRoaming,
  getSharedCode,
  stateShared,
  ifIsAuthCode,
  getViewpointList
}
