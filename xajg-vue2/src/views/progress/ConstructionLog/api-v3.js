import request from "@/utils/request";

let prefix = "/api";

export function byMonth(data) {
    return request({
        url: prefix + "/schedule/construction/log/information/v3/byMonth",
        method: "post",
        data,
    });
}

export function remove(data) {
    return request({
        url: prefix + "/schedule/construction/log/information/v3/delete",
        method: "post",
        data,
    });
}
// 查询当前日期的日志
export function logList(data) {
    return request({
        url: prefix + "/schedule/construction/log/information/v3/list",
        method: "post",
        data,
    });
}

//
export function save(data) {
    return request({
        url: prefix + "/schedule/construction/log/information/v3/save",
        method: "post",
        data,
    });
}

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
// 获取桩号
export function selectByPbs(data) {
    return request({
        url: prefix + "/schedule/construction/log/information/v3/selectByPbs",
        method: "post",
        data,
    });
}

// 获取桩号
export function page(data) {
    return request({
        url: prefix + "/schedule/construction/log/information/v3/page",
        method: "post",
        data,
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

// 获取整体单位列表
export function unitList() {
    return request({
        method: "get",
        url: prefix + "/custom/system/corporates/list",
    });
}
