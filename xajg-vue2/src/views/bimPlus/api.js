import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/project/pbs/save",
    method: "post",
    data,
  });
}

export function add(data) {
  return request({
    url: prefix + "/project/pbs/add",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/project/pbs/delete",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/project/pbs/update",
    method: "put",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/project/pbs/page",
    method: "post",
    data: data,
  });
}

export function list(data) {
  return request({
    url: prefix + "/project/pbs/list",
    method: "post",
    data,
  });
}

export function supplyBimCount(pbsCode) {
  return request({
    method: "get",
    url: prefix + "/design/supply/bimCount/" + pbsCode,
  });
}

export function supplyBimCategory(pbsCode) {
  return request({
    method: "get",
    url: prefix + "/design/supply/bimCategory/" + pbsCode,
  });
}

//bim设计文件列表查询
export function supplyBimFileList(data) {
  return request({
    url: prefix + "/design/supply/bimFileList",
    method: "post",
    data,
  });
}

//bim成果列表查询
export function supplyDetailList(data) {
  return request({
    url: prefix + "/design/supply/detail/getAllForBimPlus?pbsCode=" + data.pbsCode,
    method: "get"
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

// 获取整体单位列表
export function corporates(params) {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
    params,
  });
}

// 环水保管理-体系文件统计
export function txwjtj(data) {
  return request({
    method: "post",
    url: prefix + "/protection/scheme/manage/withPbs",
    data: data,
  });
}

// 质量管理
export function zlgl(data) {
  return request({
    method: "post",
    url: prefix + "/quality/assess/info/withPbs",
    data: data,
  });
}

// 综合业务
export function zhyw(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/manage/withPbs",
    data: data,
  });
}

// 进度计划
export function jdjh(data) {
  return request({
    method: "post",
    url: prefix + "/schedule/management/withPbs",
    data: data,
  });
}

