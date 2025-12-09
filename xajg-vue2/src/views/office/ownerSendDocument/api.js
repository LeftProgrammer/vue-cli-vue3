
import request from "@/utils/request";

let prefix = "/api";


// 同步oa
export function syncOaData() {
  return request({
    method: "post",
    url: prefix + "/synthesis/oa/syncOa"
  });
}

// 请求列表
export function page(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/oa/page",
    data
  });
}

export function send(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/oa/send",
    data
  });
}

export function save(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/oa/save",
    data,
  });
}
// 获取整体单位列表
export function corporates(params) {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
    params,
  });
}

// http://localhost:8087/api/process/write/init/send


export function remove(data) {
  return request({
    // url: prefix + "/design/supply/delete",
    url: prefix + "/synthesis/oa/delete",
    method: "post",
    data,
  });
}
export function getfile(params) {
  return request({
    url: prefix + "/attachments/download",
    method: "get",
    params,
    // headers: { 'Accept': 'application/x-www-form-urlencoded' },
    responseType: "arraybuffer",
  });
}

// 获取整体单位列表
export function unitList() {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
  });
}

// 上传文件 旧版本
// export function fileUpload(data) {
//   return request({
//     method: "post",
//     url: prefix + "/attachments/single-upload",
//     data,
//     headers: {
//       'Content-Type': 'application/pdf',
//       "Accept": '*/*'
//     },
//   });
// }
// 上传文件 新版本
export function fileUpload(data) {
  return request({
    method: "post",
    url: prefix + "/file/upload",
    data,
    headers: {
      "Content-Type": "application/pdf",
      Accept: "*/*",
    },
  });
}
// 获取整体单位列表
export function getSecretary(corpId, roleName) {
  return request({
    method: "get",
    url: prefix + "/plt/corporate/getSecretary",
    params: {
      corpId,
      roleName,
    },
  });
}

// 获取整体单位列表
export function getSecretarys(corpIds, roleName) {
  return request({
    method: "get",
    url: prefix + "/plt/corporate/getSecretarys",
    params: {
      corpIds,
      roleName,
    },
  });
}

// 获取本单位文秘
export function getSecretarynew(params) {
  return request({
    method: "get",
    url: prefix + "/plt/corporate/getSecretary",
    params
  });
}


// 获取用户信息列表
// /api
export function userInfoList(data) {
  return request({
    method: "post",
    url: prefix + "/system/users/userIds/list",
    data,
  });
}

// 通过单位id 获取 单位下的人员
// getUserByCorpId
export function getUserByCorpId(CorpId) {
  return request({
    method: "get",
    url: prefix + `/system/user/corporates/${CorpId}`,
  });
}

// 获取业主单位list 通过id  获取
export function getOwnerById(data) {
  return request({
    method: "post",
    // url: prefix + `/synthesis/oa/list`,
    url: prefix + `/synthesis/oa/page`,
    data,
  });
}

export function logs(businessId) {
  return request({
    url: `api/process/packages/self/proc/${businessId}/all/logs`,
    method: "get",
  });
}

// 获取单位下的所有的部门
export function getDepartmentsByUnit(corpId) {
  return request({
    method: "get",
    url: prefix + `/system/departments/list/${corpId}`,
  });
}

export function archiveFile() {
  return request({
    method: "get",
    url: prefix + "/archiveFileCatalogueTree/tree",
  });
}

export function archiveFileAll() {
  return request({
    method: "get",
    url: prefix + "/archiveFileCatalogueTree/nopermission/tree",
  });
}

// 获取施工标段
export function sectionList(data) {
  return request({
    url: prefix + "/project/section/list",
    method: "post",
    data,
    enableThrottle: true
  });
}