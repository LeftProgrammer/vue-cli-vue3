
// 业主 收文
import request from "@/utils/request";

let prefix = "/api";

// 同步oa
export function syncOaData() {
    return request({
        method: "post",
        url: prefix + "/synthesis/manage/syncOa"
    });
}

export function reportOasw(data) {
    return request({
        method: "post",
        url: prefix + "/synthesis/manage/reportOasw",
        data
    });
}

// 业主单位  收文
export function page(data) {
    //1收文2发文
    // data.entity.unitType = unitType
    data.entity.documentType = 1
    return request({
        method: "post",
        url: prefix + "/synthesis/manage/page",
        data
    });
}
//管理员删除
export function remove(data) {
    return request({
        method: "post",
        // url: prefix + "/synthesis/manage/delete",
        url: prefix + "/synthesis/manage/owner/receive/delete",
        data
    });
}
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
// http://localhost:8087/api/process/write/init/send
// 签收
export function setSign(data) {
    return request({
        method: "post",
        // url: prefix + "/synthesis/manage/sign",
        // url: prefix + "/synthesis/manage/sign",
        url: prefix + "/synthesis/manage/owner/receive/sign",
        data
    });
}



// 获取业主单位list 通过id  获取
export function getOwnerById(data) {
    return request({
        method: "post",
        // url: prefix + `/synthesis/oa/list`,
        url: prefix + `/synthesis/manage/list`,
        data,
    });
}


// 获取本单位文秘
export function getSecretarynew(params) {
    return request({
        method: "get",
        url: prefix + "/plt/corporate/getSecretary",
        params
    });
}



// 获取单位下的所有的部门
export function getDepartmentsByUnit(corpId) {
    return request({
        method: "get",
        url: prefix + `/system/departments/list/${corpId}`,
    });
}

export function archiveFileAll() {
    return request({
      method: "get",
      url: prefix + "/archiveFileCatalogueTree/nopermission/tree",
    });
  }

// 获取施工标段
export function sectionList(data) {
    return request({
        url: prefix + "/project/section/list",
        method: "post",
        data,
        enableThrottle: true
    });
}

