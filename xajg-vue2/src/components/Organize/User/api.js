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

/**获取某单位某部门的人员 */
export function getUserList(corpId, departId) {
  let url = `/api/system/user/corporates/${corpId}`;
  if (departId) {
    url = `/api/system/user/corporates/${corpId}/departments/${departId}`;
  }
  return request({
    url: url,
    method: "GET",
  });
}

/**获取某单位某部门的人员 */
export function searchUserList(fuCon, departId) {
  let url = `/api/system/search/user`;
  // let url = `/api/system/search/all-user`;
  let departIds = [];
  if (Array.isArray(departId)) {
    departIds = departId;
  } else {
    departIds = [departId];
  }

  let key = "";
  if (fuCon) {
    key = "%" + fuCon.trim() + "%";
  }
  return request({
    url: url,
    method: "POST",
    data: {
      all: false,
      belongIds: departIds,
      fuCondition: key,
    },
    enableThrottle: true
  });
}

/**获取某单位某部门的人员 */
export function searchAllUserList(fuCon, departId) {
  let url = `/api/system/search/all-user`;
  let departIds = [];
  if (Array.isArray(departId)) {
    departIds = departId;
  } else {
    departIds = [departId];
  }

  let key = "";
  if (fuCon) {
    key = "%" + fuCon.trim() + "%";
  }
  return request({
    url: url,
    method: "POST",
    data: {
      all: false,
      belongIds: departIds,
      fuCondition: key,
    },
    enableThrottle: true,
  });
}

/**获取用户信息 */
export function getUserListByIds(userIds, enableThrottle) {
  let url = "/api/system/users/userIds/list";
  return request({
    url: url,
    method: "post",
    data: {
      data: userIds,
    },
    enableThrottle: true,
  });
}

/** 获取标段的所有关联单位 */
export function getSectionUnitIds(sectionId) {
  return request({
    url: "/api/project/section/getSectionUnitIds?sectionId=" + sectionId,
    method: "get",
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
