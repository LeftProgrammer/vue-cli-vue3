import request from '@/utils/request';

const prefix = '/api';
// 质量验评优良率统计
export function quer1(data) {
  return request({
    url: prefix + '/quality/monitor/meritRatio',
    method: 'post',
    data
  });
}
// 质量验评完成量统计
export function quer2(data) {
  return request({
    url: prefix + '/quality/monitor/finish',
    method: 'post',
    data
  });
}
// 验评数量统计
export function quer3(data) {
  return request({
    url: prefix + '/quality/monitor//quantityBySection',
    method: 'post',
    data
  });
}

// 进场报验统计
export function statistics() {
  return request({
    url: prefix + '/quality/check/statistics/section',
    method: 'get',
  });
}

// 月度验评数量统计
export function quer4(data) {
  return request({
    url: prefix + '/quality/monitor/month-check',
    method: 'post',
    data
  });
}
// 试验检测结果统计
export function testResult(data) {
  return request({
    url: prefix + '/quality/monitor/testResult',
    method: 'post',
    data
  });
}
// 近一年检测完成量
export function yearTestCount(data) {
  return request({
    url: prefix + '/quality/monitor/yearTestCount',
    method: 'post',
    data
  });
}

// 获取施工标段
export function sectionList(data) {
  return request({
    url: prefix + "/project/section/list",
    method: "post",
    data,
  });
}
