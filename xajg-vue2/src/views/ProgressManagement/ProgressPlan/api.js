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
    });
}
export function remove(data) {
    return request({
        url: prefix + "/schedule/management/delete",
        method: "post",
        data,
    });
}

// 更新
export function update(data) {
    return request({
        url: prefix + "/schedule/management/update",
        method: "put",
        data,
    });
}


export function save(data) {
    return request({
        url: prefix + "/schedule/management/save",
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