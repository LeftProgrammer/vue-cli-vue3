import request from "@/utils/request";

let prefix = "/api";

// 获取本单位文秘
export function getSecretary(params) {
  return request({
    method: "get",
    url: prefix + "/plt/corporate/getSecretary",
    params,
  });
}

// 获取有标段数据权限的单位列表
export function getPermissionCorporates(corporateId, unitType) {
  let corpId = corporateId || "";
  return request({
    method: "get",
    url:
      prefix +
      `/plt/corporate/getPermissionCorporates?corpId=${corpId}&unitType=${unitType}`,
  });
}

// 获取整体单位列表
export function unitList() {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
  });
}
