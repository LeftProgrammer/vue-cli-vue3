import request from "@/utils/request";

let prefix = "/api";

export function byMonth(data) {
    return request({
        url: prefix + "/schedule/construction/log/information/byMonth",
        method: "post",
        data,
    });
}

export function remove(data) {
    return request({
        url: prefix + "/schedule/construction/log/information/delete",
        method: "post",
        data,
    });
}
// 查询当前日期的日志
export function logList(data) {
    return request({
        url: prefix + "/schedule/construction/log/information/list",
        method: "post",
        data,
    });
}



// 
export function save(data) {
    return request({
        url: prefix + "/schedule/construction/log/information/save",
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
        url: prefix + "/schedule/construction/log/information/selectByPbs",
        method: "post",
        data,
    });
}






