import request from "@/utils/request";

/* 获取整体单位树*/
export function getTypeCorp() {
  return request({
    url: "/api/system/corporates/tree",
    method: "GET",
  });
}

/* 获取单位的整体部门树*/
export function getTypeDepart(corpId) {
  return request({
    url: `/api/system/departments/tree/${corpId}/corp`,
    method: "GET",
  });
}

/* 获取整体单位-部门树*/
export function getOrganizationTree() {
  return request({
    url: `/api/system/organization/tree`,
    method: "GET",
  });
}

/* 获取指定部门*/
export function getDeptByIds(departIds) {
  return request({
    url: `/api/system/departments/list`,
    method: "POST",
    data: {
      data: departIds,
    },
  });
}

/* 获取指定单位*/
export function getCorpByIds(corpIds) {
  return request({
    url: `/api/custom/system/corporates/list`,
    method: "POST",
    data: {
      data: corpIds,
    },
  });
}
