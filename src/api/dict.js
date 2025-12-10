import request from "@/utils/request";

/**
 * 获取字典项列表
 * @param {string} dictType
 */
export function getDictItemList(dictType) {
  return request({
    url: `/api/system/dicts/types/${dictType}/list`,
    method: "get",
  });
}

/**
 * 清理字典缓存
 * @param {string} dictType
 */
export function refreshDictItemList(dictType) {
  return request({
    url: `/api/common/dict/refresh/${dictType}`,
    method: "get",
  });
}
