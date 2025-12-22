export function getCurrent() {
  return "/api/current";
}

export function getCorpList() {
  return "/api/system/corporates/tree";
}

export function getDepartList(corpId) {
  return `/api/system/departments/tree/${corpId}/corp`;
}

export function getUserList(corpId, departId) {
  return `/api/system/user/corporates/${corpId}/departments/${departId}`;
}

export function getUserListByIds() {
  return "/api/system/users/userIds/list";
}

export function getRecentUserList() {
  return `/api/system/users/latest-select`;
}

export function addRecentUserList() {
  return `/api/system/users/latest-select`;
}

export function getManagerList() {
  return "/api/system/manager/all";
}

export const trim = (s) => {
  return s.replace(/(^\s*)|(\s*$)/g, "");
};

export function getOrgList() {
  return "/api/system/organization/tree";
}

export function systemSearchUser() {
  return "/api/system/search/user";
}
