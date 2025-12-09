import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/quality/check/add",
    method: "post",
    data
  });
}

export function update(data) {
  return request({
    url: prefix + "/quality/check/update",
    method: "put",
    data
  });
}

export function page(data) {
  return request({
    url: prefix + "/quality/check/page",
    method: "post",
    data
  });
}

export function remove(data) {
  return request({
    url: prefix + "/quality/check/delete",
    method: "post",
    data
  })
}


export function getSection(params) {
  return request({
    url: `/api/project/section/getSectionByUser`,
    method: 'get',
    params
  });
}

/**
 * 查询树(节点配置用)
 * @returns
 */
export function getArchiveFileCatalogueManagerTree(params) {
  console.log("paramsparamsparamsparams", params);
  return request({
    method: "get",
    url: `/api/quality/catalogue/tree/manager`,
    params,
    enableThrottle: true,
  });
}

// 获取施工标段
export function sectionList(data) {
    return request({
        url: prefix + "/project/section/getAll",
        method: "post",
        data,
        enableThrottle: true
    });
}
