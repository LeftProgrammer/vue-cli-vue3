import request from "@/utils/request";

let prefix = "/api";
export function page(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/manage/page",
    data,
  });
}

// let unitType = 2 // 监理 设计 施工 业主 第三方  type 1 2 3 4 5
// let documentType = 2 //1收文2发文
const saveUrl = {
  1: '/synthesis/manage/supervision/save',
  2: '/synthesis/manage/design/save',
  3: '/synthesis/manage/construction/save', //不要
  4: '/synthesis/manage/construction/save',
  5: '/synthesis/manage/thirdParty/save',
}

export function save(data, unitType) {
  return request({
    method: "post",
    // url: prefix + "/synthesis/manage/save",
    url: prefix + saveUrl[`${unitType}`],
    data,
  });
}

const removeUrl = {
  1: '/synthesis/manage/supervision/delete',
  2: '/synthesis/manage/design/delete',
  3: '/synthesis/manage/construction/delete',
  4: '/synthesis/manage/construction/delete',//不要
  5: '/synthesis/manage/thirdParty/delete',
}

export function remove(data, unitType) {
  return request({
    // url: prefix + "/synthesis/manage/delete",
    url: prefix + removeUrl[`${unitType}`],
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
export function corporates(params) {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
    params,
  });
}

// 获取整体单位列表
export function getSecretary(corpId, roleName) {
  roleName = roleName || "文秘";
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

// 通过用户id 获取当前用户的所属机构
export function BelongTo(params) {
  return request({
    method: "get",
    url: prefix + "/plt/corporate/getBelongTo",
    params,
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

// 签收
// let unitType = 2 // 监理 设计 施工 业主 第三方  type 1 2 3 4 5
// let documentType = 2 //1收文2发文
const signUrl = {
  1: '/synthesis/manage/supervision/receive/sign',
  2: '/synthesis/manage/design/receive/sign',
  3: '/synthesis/manage/construction/receive/sign',
  4: '/synthesis/manage/construction/receive/sign',//不要
  5: '/synthesis/manage/thirdParty/receive/sign',
}

export function setSign(data, unitType) {
  return request({
    method: "post",
    // url: prefix + "/synthesis/manage/sign",
    url: prefix + signUrl[`${unitType}`],
    data
  });
}

//修改签章文件路径
export function updateFile(data) {
  return request({
    url: prefix + "/schedule/fund/info/update/file",
    method: "post",
    data,
  });
}

// 分页查询
export function managementPage(data) {
  return request({
    url: prefix + "/schedule/management/page",
    method: "post",
    data,
  });
}

// 新版本 文件流
export function getFileById(data) {
  return request({
    url: "/api/file/getFile",
    method: "post",
    data,
    responseType: 'arraybuffer'
    // responseType: 'blob'
  });
}

export function logs(businessId) {
  return request({
    url: `api/process/packages/self/proc/${businessId}/all/logs`,
    method: "get",
  });
}

// 根据(雄安/签章服务)账号获取签字文件名称
export function signFileName(user) {
  return request({
    url: `/api/ntko/getSignfileByUser?signName=${user}`,
    method: "get",
  });
}

// 下载签字文件
export function downSignFile(fileName) {
  return request({
    url: `/api/ntko/download/signfile?fileName=${fileName}`,
    method: "get",
    responseType: 'arraybuffer'
  });
}

// 获取单位下的所有的部门
export function getDepartmentsByUnit(corpId) {
  return request({
    method: "get",
    url: prefix + `/system/departments/list/${corpId}`,
  });
}

export function getDocById(data) {
  return request({
    method: "post",
    url: prefix + `/synthesis/manage/list`,
    data
  });
}

// 获取用户信息列表
export function userInfoList(data) {
  return request({
    method: "post",
    url: prefix + "/system/users/userIds/list",
    data,
    enableThrottle: true
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
//  获取施工标段
export function sectionList(data) {
  return request({
    url: prefix + "/project/section/list",
    method: "post",
    data,
    enableThrottle: true
  });
}

//  获取业主发文数据通过Id
export function getOwnerSendById(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/oa/page",
    data
  });
}

//  获取业主发文数据通过Id
export function getOwnerReceiveById(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/manage/page",
    data
  });
}
