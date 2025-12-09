
import request from "@/utils/request";

let prefix = "/api";
export function page(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/manage/page",
    data
  });
}

const removeUrl = {
  1: '/synthesis/manage/supervision/receive/delete',
  2: '/synthesis/manage/design/receive/delete',
  3: '/synthesis/oa/delete',
  4: '/synthesis/manage/construction/receive/delete',
  5: '/synthesis/manage/thirdParty/receive/delete',
}
export function save(data, unitType) {
  // data.unitType = unitType
  // data.documentType = documentType
  return request({
    method: "post",
    // url: prefix + "/synthesis/manage/save",
    url: prefix + removeUrl[`${unitType}`],
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
// http://localhost:8087/api/process/write/init/send
// 获取整体单位列表
export function unitList() {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
  });
}

export function getOrganizationTree() {
  return request({
    url: `/api/system/organization/tree`,
    method: "GET",
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
//   签收  sign
export function sign(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/manage/sign",
    data
  });
}

//管理员删除
export function del(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/manage/delete",
    data
  });
}
