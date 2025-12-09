import request from "@/utils/request";

let prefix = "/api";

export function byMonth(data) {
    return request({
        url: prefix + "/schedule/supervision/log/equipment/byMonth",
        // url: prefix + "/schedule/construction/log/information/byMonth",
        method: "post",
        data,
    });
}

export function remove(data) {
    return request({
        url: prefix + "/schedule/supervision/log/equipment/delete",
        method: "post",
        data,
    });
}
// 查询当前日期的日志
export function logList(data) {
    return request({
        url: prefix + "/schedule/supervision/log/equipment/list",
        method: "post",
        data,
    });
}
export function save(data) {
    return request({
        url: prefix + "/schedule/supervision/log/equipment/save",
        method: "post",
        data,
    });
}

export function getFile(params) {
    return request({
        url: "/api/attachments/download",
        method: "get",
        params,
        responseType: 'arraybuffer'
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
