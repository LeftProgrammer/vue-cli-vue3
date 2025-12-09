import request from "@/utils/request";

/**
 * 生成pdf签章文件
 * @export axios.request
 */
export function createBoomPdf(data) {
  return request({
    url: `/api/boom/createPdf`,
    method: "post",
    data,
  });
}
/**
 * 获取流水号
 * @returns
 */
export function getSerialNumber() {
  return request({
    url: `/api/boom/getSerialNumber`,
  });
}
/**
 * 校验流水号是否过期
 * @returns
 */
export function checkSerialNumber(params) {
  return request({
    url: `/api/boom/checkSerialNumber`,
    params,
  });
}
/**
 * 查询列表
 * @param {*} data
 * @returns
 */
export function getBoomPageList(data) {
  return request({
    url: `/api/boom/pageList`,
    method: "post",
    data,
  });
}
/**
 * 获取附件信息
 * @param {*} params
 * @returns
 */
export function getAttachmentInfo(params) {
  return request({
    url: `/api/boom/getAttachmentInfo`,
    params,
  });
}

export function getDataViewQueryConfig(viewDisplayConfId) {
  return request({
    url: `/api/process/data-view-query-config/${viewDisplayConfId}`,
  });
}
export function getFormViewList(data) {
  return request({
    url: `/api/process/form-view/dynamic-form/search`,
    method: "post",
    data,
  });
}
/**
 * 删除流程
 * @param {*} businessId
 * @returns
 */
export function delProcess(businessId) {
  return request({
    url: `/api/process/write/matter/${businessId}/del`,
    method: "delete",
  });
}

export function resetBoomApplyStatus(params) {
  return request({
    url: `/api/boom/resetBoomApplyStatus`,
    params,
  });
}
