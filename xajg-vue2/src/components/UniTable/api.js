

import request from "@/utils/request";

let prefix = "/api";


// 获取本单位文秘
export function getSecretary(params) {
    return request({
        method: "get",
        url: prefix + "/plt/corporate/getSecretary",
        params
    });
}

// 获取多单位下的加色
export function getSecretarys(params) {
    return request({
        method: "get",
        url: prefix + "/plt/corporate/getSecretarys",
        params: params
    });
}

// 获取整体单位列表
export function unitAllList() {
    return request({
        method: "get",
        url: prefix + "/custom/system/corporates/list",
    });
}

// 获取本单位文秘
export function getUserList(params) {
    return request({
        method: "get",
        url: prefix + "/plt/corporate/getSecretary",
        params
    });
}
// 获取所有的标段
export function sectionList(data) {
    return request({
        method: "post",
        url: prefix + "/project/section/getAll",
        enableThrottle: true,
        data
    });
}

// 获取单位下的所有的部门
export function getDepartmentsByUnit(corpId) {
    return request({
        method: "get",
        url: prefix + `/system/departments/list/${corpId}`,
    });
}
