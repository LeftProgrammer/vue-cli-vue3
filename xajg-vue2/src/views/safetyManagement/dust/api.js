import request from '@/utils/request';

// 项目测点API地址
const BASE_URL = '/api/safety/dust/point';

// 新增测点
export function addDustPoint(data) {
  return request({
    url: `${BASE_URL}/save`,
    method: 'post',
    data
  });
}

// 删除测点
export function deleteDustPoint(data) {
  return request({
    url: `${BASE_URL}/delete`,
    method: 'post',
    data
  });
}

// 分页查询测点
export function getDustPointPage(data) {
  return request({
    url: `${BASE_URL}/page`,
    method: 'post',
    data,
    enableThrottle: true
  });
}

// 列表查询项目模型配置
export function listDailyRecords(params) {
  return request({
    url: `${BASE_URL}/listDailyRecords`,
    method: 'get',
    params,
    enableThrottle: true
  });
}
