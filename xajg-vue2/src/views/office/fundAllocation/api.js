import request from "@/utils/request";

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/schedule/fund/info/page",
    method: "post",
    data,
  });
}

export function save(data) {
  return request({
    url: prefix + "/schedule/fund/info/save",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/schedule/fund/info/delete",
    method: "post",
    data,
  });
}

// 获取整体单位列表
export function unitList() {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
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

// 通过用户id 获取当前用户的所属机构
export function BelongTo(params) {
  return request({
    method: "get",
    url: prefix + "/plt/corporate/getBelongTo",
    params,
  });
}
