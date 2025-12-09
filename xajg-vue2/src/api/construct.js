import request from "@/utils/request";

/**
 * 单位列表
 * @returns
 */
export function getCorporateList() {
  return request({
    url: `/api/construction/corporateList`,
  });
}
/**
 * 字典查询,参数dictType: 分包类型 sg-fblx, 分包文件类型 sg-fbwjlx
 * @param {*} params
 * @returns
 */
export function getConstructionDict(params) {
  return request({
    url: `/api/construction/dict`,
    params,
  });
}
/**
 * 根据id查详情
 * @param {*} params
 * @returns
 */
export function getConstructionDetail(params) {
  return request({
    url: `/api/construction/getDetail`,
    params,
  });
}

/**
 * 自定义上附件列表
 * @param {*} params
 * @returns
 */
export function getConstructionCustomFileList(params) {
  return request({
    url: `/api/construction/customFileList`,
    params,
  });
}
/**
 * 自定义上附件
 * @param {*} params
 * @returns
 */
export function uploadConstructionCustomFile(params) {
  return request({
    url: `/api/construction/uploadCustomFile`,
    params,
  });
}
/**
 * 分包管理列表
 * @param {*} data
 * @returns
 */
export function getConstructionoPageList(data) {
  return request({
    url: `/api/construction/fb/pageList`,
    method: "post",
    data,
  });
}
/**
 * 技术管理列表
 * @param {*} data
 * @returns
 */
export function getConstructionoTechnologyPageList(data) {
  return request({
    url: `/api/construction/technology/pageList`,
    method: "post",
    data,
  });
}
