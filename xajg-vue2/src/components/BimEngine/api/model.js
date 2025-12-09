import request from '@/utils/request'

const api = {
  modelTree: `/api/app/model-tree`,
  modelType: `/api/app/model-type`,
  modelDrawing: `/api/app/model-drawing`,
  modelVersion: `/api/app/document-ver-than`,
  FeartureInfo: `/api/app/queryFeartureInfo`
}

/**
 * 获取构件属性
 * @returns {Promise<AxiosResponse<T>>}
 */
export function queryFeartureInfo(params) {
  return request(
    {
      url: api.FeartureInfo,
      method: 'get',
      params: params
    }
  )
}

export function getTreeList(parameter) {
  return request({
    url: `${api.modelTree}/tree`,
    method: 'get',
    params: parameter
  })
}
export function getChildrenTreeList(parameter) {
  return request({
    url: `${api.modelTree}/children-tree`,
    method: 'get',
    params: parameter
  })
}
export function getPartTreeList(parameter) {
  return request({
    url: `${api.modelTree}/get-part-tree`,
    method: 'post',
    params: parameter
  })
}
export function getTypeList(parameter) {
  return request({
    url: `${api.modelType}/tree`,
    method: 'get',
    params: parameter
  })
}
export function getChildrenTypeList(parameter) {
  return request({
    url: `${api.modelType}/children-tree`,
    method: 'get',
    params: parameter
  })
}

export function getDrawingType(parameter) {
  return request({
    url: `${api.modelDrawing}/type`,
    method: 'get',
    params: parameter
  })
}

export function getDrawingData(parameter) {
  return request({
    url: `${api.modelDrawing}/drawing`,
    method: 'get',
    params: parameter
  })
}

export function getDrawingGuid(parameter) {
  return request({
    url: `${api.modelDrawing}/drawing-rvt-id`,
    method: 'get',
    params: parameter
  })
}

export function getModelVersionHave(parameter) {
  return request({
    url: `${api.modelVersion}/entity`,
    method: 'get',
    params: parameter
  })
}

export function setModelVersion(parameter) {
  return request({
    url: `${api.modelVersion}`,
    method: 'post',
    data: parameter
  })
}

export function getModelVersion(id) {
  return request({
    url: `${api.modelVersion}/${id}`,
    method: 'get',
  })
}

export function getModelVersionData(id, parameter) {
  return request({
    url: `${api.modelVersion}/${id}/start-than`,
    method: 'post',
    params: parameter,
    // data: {glid: parameter.glid}
  })
}

export function setModelVersionData(id, parameter, data) {
  return request({
    url: `${api.modelVersion}/${id}/metadata-save`,
    method: 'post',
    params: parameter,
    data: data
  })
}
