import request from "@/utils/request";

/**
 * 单位列表
 * @returns
 */
export function getCorporateList() {
  return request({
    url: `/api/measure/common/corporateList`,
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
    method: 'post',
    data
  });
}
export function getAllSection(data) {
  return request({
    url: `/api/project/section/allList`,
    method: 'post',
    data
  });
}

/**
 * 根据单位id查询标段
 * @param {*} params
 * @returns
 */
export function getSectionByCorpId(params) {
  return request({
    url: `/api/project/section/getSectionByCorpId`,
    method: 'get',
    params
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
 * 人员信息列表
 * @export axios.request
 */
export function getPersonInfoPageList(data) {
  return request({
    url: `/api/measure/personInfo/pageList`,
    method: "post",
    data,
  });
}
/**
 * 人员信息创建
 * @param {*} data
 * @returns
 */
export function createPersonInfo(data) {
  return request({
    url: `/api/measure/personInfo/addFo`,
    method: "post",
    data,
  });
}
/**
 * 人员信息修改
 * @param {*} data
 * @returns
 */
export function updatePersonInfo(data) {
  return request({
    url: `/api/measure/personInfo/updateFo`,
    method: "post",
    data,
  });
}
/**
 * 人员信息删除
 * @param {*} id
 * @returns
 */
export function deletePersonInfo(id) {
  return request({
    url: `/api/measure/personInfo/deleteById/${id}`,
    method: "delete",
  });
}

/**
 * 设备信息列表
 * @export axios.request
 */
export function getEquipmentInfoPageList(data) {
  return request({
    url: `/api/measure/equipmentInfo/pageList`,
    method: "post",
    data,
  });
}
/**
 * 设备信息创建
 * @param {*} data
 * @returns
 */
export function createEquipmentInfo(data) {
  return request({
    url: `/api/measure/equipmentInfo/addFo`,
    method: "post",
    data,
  });
}
/**
 * 设备信息修改
 * @param {*} data
 * @returns
 */
export function updateEquipmentInfo(data) {
  return request({
    url: `/api/measure/equipmentInfo/updateFo`,
    method: "post",
    data,
  });
}
/**
 * 设备信息删除
 * @param {*} id
 * @returns
 */
export function deleteEquipmentInfo(id) {
  return request({
    url: `/api/measure/equipmentInfo/deleteById/${id}`,
    method: "delete",
  });
}

/**
 * 标准体系列表
 * @export axios.request
 */
export function getStandardInfoPageList(data) {
  return request({
    url: `/api/measure/standardInfo/pageList`,
    method: "post",
    data,
  });
}
/**
 * 标准体系创建
 * @param {*} data
 * @returns
 */
export function createStandardInfo(data) {
  return request({
    url: `/api/measure/standardInfo/addFo`,
    method: "post",
    data,
  });
}
/**
 * 标准体系修改
 * @param {*} data
 * @returns
 */
export function updateStandardInfo(data) {
  return request({
    url: `/api/measure/standardInfo/updateFo`,
    method: "post",
    data,
  });
}
/**
 * 标准体系删除
 * @param {*} id
 * @returns
 */
export function deleteStandardInfo(id) {
  return request({
    url: `/api/measure/standardInfo/deleteById/${id}`,
    method: "delete",
  });
}

/**
 * 测量成果列表
 * @export axios.request
 */
export function getResultPageList(data) {
  return request({
    url: `/api/measure/result/pageList`,
    method: "post",
    data,
  });
}
/**
 * 测量成果创建
 * @param {*} data
 * @returns
 */
export function createResult(data) {
  return request({
    url: `/api/measure/result/addFo`,
    method: "post",
    data,
  });
}
/**
 * 测量成果修改
 * @param {*} data
 * @returns
 */
export function updateResult(data) {
  return request({
    url: `/api/measure/result/updateFo`,
    method: "post",
    data,
  });
}
/**
 * 测量成果删除
 * @param {*} id
 * @returns
 */
export function deleteResult(id) {
  return request({
    url: `/api/measure/result/deleteById/${id}`,
    method: "delete",
  });
}
