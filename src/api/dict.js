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
