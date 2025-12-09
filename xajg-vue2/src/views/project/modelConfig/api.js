import request from '@/utils/request';

// 项目模型配置API地址
const BASE_URL = '/api/project/model/config';

// 新增项目模型配置
export function addModelConfig(data) {
  return request({
    url: `${BASE_URL}/save`,
    method: 'post',
    data
  });
}

// 删除项目模型配置
export function deleteModelConfig(data) {
  return request({
    url: `${BASE_URL}/delete`,
    method: 'post',
    data
  });
}

// 更新项目模型配置
export function updateModelConfig(data) {
  return request({
    url: `${BASE_URL}/save`,
    method: 'post',
    data
  });
}

// 分页查询项目模型配置
export function getModelConfigPage(data) {
  return request({
    url: `${BASE_URL}/page`,
    method: 'post',
    data,
    enableThrottle: true
  });
}

// 列表查询项目模型配置
export function getModelConfigList(data) {
  return request({
    url: `${BASE_URL}/list`,
    method: 'post',
    data
  });
}

// 查询项目模型配置详情
export function getModelConfigDetail(id) {
  return request({
    url: `${BASE_URL}/detail/${id}`,
    method: 'get'
  });
}
