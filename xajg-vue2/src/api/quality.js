import request from "@/utils/request";

/**
 * 单位列表
 * @returns
 */
export function getCorporateList() {
  return request({
    url: `/api/qualitySystemManagement/corporateList`,
  });
}
/**
 * 根据单位id查询标段
 * @param {*} params
 * @returns
 */
export function getSectionList(data) {
  return request({
    url: `/api/project/section/list`,
    method: "post",
    data,
  });
}
/**
 * 字典查询,参数dictType: 成果类型 cl-cglx, 报审类型 cl-bslx
 * @param {*} params
 * @returns
 */
export function getMeasureDict(params) {
  return request({
    url: `/api/measure/common/dict`,
    params,
  });
}

/**
 * 质量体系列表
 * @export axios.request
 */
export function getQualitySystemManagementPageList(data) {
  return request({
    url: `/api/qualitySystemManagement/selectList`,
    method: "post",
    data,
  });
}
/**
 * 添加质量体系
 * @param {*} data
 * @returns
 */
export function addQualitySystemManagement(data) {
  return request({
    url: `/api/qualitySystemManagement/addData`,
    method: "post",
    data,
  });
}
/**
 * 修改质量体系
 * @param {*} data
 * @returns
 */
export function updateQualitySystemManagement(data) {
  return request({
    url: `/api/qualitySystemManagement/updateData`,
    method: "post",
    data,
  });
}
/**
 * 删除质量体系
 * @param {*} params
 * @returns
 */
export function deleteQualitySystemManagement(params) {
  return request({
    url: `/api/qualitySystemManagement/deleteData`,
    method: "delete",
    params,
  });
}
/**
 * 质量体系详情
 * @param {*} params
 * @returns
 */
export function getQualitySystemManagementDetail(params) {
  return request({
    url: `/api/qualitySystemManagement/getDtail`,
    params,
  });
}
/**
 * 业主收文，及其他收发文
 * @param {*} data 
 * @returns 
 */
export function getSynthesisManagePage(data) {
  return request({
    url: `/api/synthesis/manage/page`,
    method: "post",
    data,
  });
}
/**
 * 业主发文
 * @param {*} data 
 * @returns 
 */
export function getSynthesisOaPage(data) {
  return request({
    url: `/api/synthesis/oa/page`,
    method: "post",
    data,
  });
}
/**
 * 获取我的单位信息
 * @param {*} data 
 * @returns 
 */
export function getSlefCorporates() {
  return request({
    url: `/api/system/corporates/one/self`,
  });
}
