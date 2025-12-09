import request from "@/utils/request";

let prefix = "/api";


export function getPbsTree(data) {
    return request({
        url: prefix + "/actual/quantities/getPbsTree",
        method: "post",
        data,
    });
}

export function byMonth(data) {
    return request({
        url: prefix + "/actual/quantities/byMonth",
        method: "post",
        data,
    });
}

export function remove(data) {
    return request({
        url: prefix + "/actual/quantities/delete",
        method: "post",
        data,
    });
}
// 查询当前日期的日志
export function logList(data) {
    return request({
        url: prefix + "/actual/quantities/list",
        method: "post",
        data,
    });
}

export function save(data) {
    return request({
        url: prefix + "/actual/quantities/save",
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
