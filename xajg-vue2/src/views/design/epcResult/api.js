
import request from "@/utils/request";

let prefix = "/api";

export function send(data) {
    return request({
        method: "post",
        url: prefix + "/synthesis/oa/send",
        data
    });
}
// http://localhost:8087/api/process/write/init/send
// 获取整体单位列表
export function unitList() {
    return request({
        method: "get",
        url: prefix + "/custom/system/corporates/list",
    });
}

export function cggyReportOa(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/manage/cggyReportOa",
    data
  });
}

export function getOrganizationTree() {
    return request({
        url: `/api/system/organization/tree`,
        method: "GET",
    });
}

// 获取本单位文秘
export function getSecretary(params) {
    return request({
        method: "get",
        url: prefix + "/plt/corporate/getSecretary",
        params
    });
}

// 获取本单位角色通过code
export function getSecretarysByCode(params) {
    return request({
        method: "get",
        url: prefix + "/plt/corporate/getSecretarysByCode",
        params
    });
}


//   签收  sign
export function sign(data) {
    return request({
        method: "post",
        url: prefix + "/synthesis/manage/sign",
        data
    });
}

//管理员删除
export function del(data) {
    return request({
        method: "post",
        url: prefix + "/design/supply/detail/drawing/delete",
        data
    });
}
// =========================================
// 获取施工标段
export function sectionList(data) {
    return request({
        url: prefix + "/project/section/getAll",
        method: "post",
        data,
        enableThrottle: true
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

export function save(data) {
    return request({
        // url: prefix + "/design/supply/save",
        method: "post",
        url: prefix + "/design/supply/detail/drawing/save",
        data: {
            ...data,
        },
    });
}

export function page(data) {
    console.log(data)
    let url = '';
    if (data.entity.pageType == 1 || data.entity.pageType == 2|| data.entity.pageType == 3) {
        url = '/design/supply/detail/page'
    } else {
        url = '/design/supply/detail/pageAll'
    }
    return request({
        url: prefix + url,
        method: 'post',
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
