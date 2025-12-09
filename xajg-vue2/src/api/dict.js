import request from "@/utils/request";

/**
 * 获取字典项列表
 * @param {*} type
 */
export function getDictItemList(dictType) {
  return request({
    url: `/api/system/dicts/types/${dictType}/list`,
    method: "get",
  });
}
export function getCorporatesTree() {
  return request({
    // url: `/api/system/corporates/tree`,
    // method: "get",
    url: `/api/plt/corporate/getSelfCorporate`,
    method: "post",
  });
}

export function buildTree(array, parentId) {
  const tree = [];
  for (const item of array) {
    if (item.dictUpCode === parentId) {
      const children = buildTree(array, item.dictCode);
      if (children.length) {
        item.children = children;
      }
      tree.push(item);
    }
  }

  return tree;
}


/**
 * 获取字典项树
 * @param {*} type
 */
export function getDictItemTree(dictType) {
  return request({
    url: `/api/system/dicts/types/${dictType}/tree`,
    method: "get",
  });
}


/**
 * 清理字典缓存
 * @param {*} type
 */
export function refreshDictItemList(dictType) {
  return request({
    url: `/api/common/dict/refresh/${dictType}`,
    method: "get",
  });
}