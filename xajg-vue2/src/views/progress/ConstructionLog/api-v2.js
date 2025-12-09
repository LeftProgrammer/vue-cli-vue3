import request from "@/utils/request";

let prefix = "/api";

export function byMonth(data) {
    return request({
        url: prefix + "/schedule/construction/log/information/v2/byMonth",
        method: "post",
        data,
    });
}

export function remove(data) {
    return request({
        url: prefix + "/schedule/construction/log/information/v2/delete",
        method: "post",
        data,
    });
}
// 查询当前日期的日志
export function logList(data) {
    return request({
        url: prefix + "/schedule/construction/log/information/v2/list",
        method: "post",
        data,
    });
}


//
export function save(data) {
    return request({
        url: prefix + "/schedule/construction/log/information/v2/save",
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
// 获取桩号
export function selectByPbs(data) {
    return request({
        url: prefix + "/schedule/construction/log/information/v2/selectByPbs",
        method: "post",
        data,
    });
}

// 获取桩号
export function page(data) {
    return request({
        url: prefix + "/schedule/construction/log/information/v2/page",
        method: "post",
        data,
    });
}
