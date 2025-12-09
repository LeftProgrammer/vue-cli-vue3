import request from "@/utils/request";

let prefix = "/api";

// 分页查询
export function page(data) {
  return request({
    url: prefix + "/schedule/management/page",
    method: "post",
    data,
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
export function remove(data) {
  let apiType = "";
  if (data.type === 1) {
    apiType = "year";
  } else if (data.type === 2) {
    apiType = "month";
  } else if (data.type === 3) {
    apiType = "total";
  }
  return request({
    url: prefix + "/schedule/management/" + apiType + "/delete",
    method: "post",
    data,
  });
}

// 更新
export function update(data) {
  let apiType = "";
  if (data.type === 1) {
    apiType = "year";
  } else if (data.type === 2) {
    apiType = "month";
  } else if (data.type === 3) {
    apiType = "total";
  }
  return request({
    url: prefix + "/schedule/management/" + apiType + "/update",
    method: "put",
    data,
  });
}

export function save(data) {
  let apiType = "";
  if (data.type === 1) {
    apiType = "year";
  } else if (data.type === 2) {
    apiType = "month";
  } else if (data.type === 3) {
    apiType = "total";
  }
  return request({
    url: prefix + "/schedule/management/" + apiType + "/save",
    method: "post",
    data,
  });
}

export function list(data) {
  return request({
    url: prefix + "/schedule/management/list",
    method: "post",
    data,
  });
}

export function getVersion(data) {
  return request({
    url: prefix + "/schedule/management/getVersion",
    method: "post",
    data,
  });
}

// 获取整体单位列表
export function corporates() {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
  });
}
