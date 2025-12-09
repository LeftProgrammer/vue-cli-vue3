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
