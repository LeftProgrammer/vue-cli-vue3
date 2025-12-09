import request from "@/utils/request";

let prefix = "/api";

// 无分页
// export function detailAll(data) {
//     return request({
//         method: "post",
//         url: prefix + "/drawing/issue/list",
//         data
//     });
// }

export function detailAll(data) {
  return request({
    method: "post",
    url: prefix + "/drawing/issue/pageWithExplain",
    data
  });
}

export function getMeetingList(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/manage/page",
    data
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

// 获取有标段数据权限的单位列表
export function getPermissionCorporates(corporateId, unitType) {
  let corpId = corporateId ? corporateId : "";
  return request({
    method: "get",
    url:
      prefix +
      `/plt/corporate/getPermissionCorporates?corpId=${corpId}&unitType=${unitType}`,
  });
}

// 获取本单位文秘
export function getSecretary(params) {
  return request({
    method: "get",
    url: prefix + "/plt/corporate/getSecretary",
    params,
  });
}
// 获取所有的标段
export function sectionList(data) {
  return request({
    method: "post",
    url: prefix + "/project/section/getAll",
    enableThrottle: true,
    data
  });
}

// ==========================
export function page(data) {
  return request({
    url: prefix + "/design/supply/detail/pageAll",
    method: "post",
    data
  });
}
