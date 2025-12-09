import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/quality/reagentTest/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/protection/scheme/manage/save",
    method: "post",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/quality/reagentTest/page",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/quality/reagentTest/delete",
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
  });
}

//获取所有标段
export function sectionAllList(data) {
  return request({
    url: prefix + "/project/section/getAll",
    method: "post",
    data,
  });
}

//todo
// 更新文件
export function updateFile(data) {
  return request({

  });
}

