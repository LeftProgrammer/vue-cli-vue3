import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/quality/assess/info/save",
    method: "post",
    data,
  });
}
/**
 * 查询树(节点配置用)
 * @returns
 */
export function getArchiveFileCatalogueManagerTree(params) {
  return request({
    method: "get",
    url: `/api/quality/catalogue/tree/manager`,
    params
  });
}
export function update(data) {
  return request({
    url: prefix + "/quality/assess/info/save",
    method: "post",
    data,
  });
}

// export function page(data) {
//   return request({
//     url: prefix + "/quality/assess/info/page",
//     method: "post",
//     data,
//   });
// }
export function page(data) {
  return request({
    url: prefix + "/quality/assess/info/page",
    method: "post",
    data,
  });
}

export function tree() {
  return request({
    url: `/api/quality/catalogue/tree/getTree`,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/quality/assess/info/delete",
    method: "post",
    data,
  });
}

// 查询文件
export function fileList(params) {
  return request({
    url: prefix + "/quality/assess/info/file",
    method: "get",
    params,
  });
}
// 请求文件
export function getFile(params) {
  return request({
    url: prefix + "/quality/assess/info/getFileById",
    method: "get",
    params,
    responseType: 'arraybuffer'
  });
}

export function getSection(params) {
  return request({
    url: `/api/project/section/getSectionByUser`,
    method: 'get',
    params
  });
}

export function getDetailList(baseId) {
  return request({
    url: prefix + "/quality/assess/info/getInfoDetail",
    method: "get",
    params: { baseId },
  });
}

export function sectionList(data) {
    return request({
        url: prefix + "/project/section/getAll",
        method: "post",
        data,
        enableThrottle: true
    });
}
