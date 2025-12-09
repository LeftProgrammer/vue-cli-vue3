import request from "@/utils/request";
import router from '@/router';
// import md5 from 'js-md5'

export function login(data) {
  // data.password = md5(data.password)
  let formData = new FormData();
  formData.append("kaptcha", data.kaptcha)
  formData.append("password", data.password)
  formData.append("rememberMe", false)
  formData.append("username", data.username)
  return request({
    url: "/security/login",
    method: "post",
    data: formData
  });
}
export function getLoginPublicKey() {
  return request({
    url: "/security/login-public-key",
  });
}

export function getInfo(token) {
  return request({
    url: "/api/current",
    method: "get",
    params: { token },
  });
}

export function logout() {
  return request({
    url: "/security/logout",
    method: "post",
  });
}
export function resetUserPassword(data) {
  return request({
    url: `/api/system/user/password`,
    method: "put",
    data,
  });
}
export function resetUserPasswordAdmin(id, data) {
  return request({
    url: `/authc/manage/user/update-password-admin/${id}`,
    method: "put",
    data,
  });
}
export function getUserList(params) {
  return request({
    url: "/authc/manage/user/user-list",
    method: "get",
    params,
  });
}
export function getTodoNum() {
  return request({
    url: "/authc-api/task/todoNum",
    method: "get",
  });
}
/* 获取图片验证码 */
export function getKaptcha() {
  return request({
    url: "/security/kaptcha.data",
    method: "get",
  });
}
export function getSystemMenu() {
  return request({
    url: `/api/system/permissions-tree`,
    method: "get",
  });
}
export function getUserGroup(ownerId) {
  return request({
    url: `/api/system/user/${ownerId}/custom-user-groups`,
    method: "get",
  });
}
export function deleteUserGroup(ownerId, groupId) {
  return request({
    url: `/api/system/user/${ownerId}/group-id/${groupId}/custom-user-group`,
    method: "delete",
  });
}
export function saveUserGroup(data) {
  return request({
    url: `/api/system/user/${data.ownerId}/custom-user-groups`,
    method: "post",
    data,
  });
}

// 旧版本 文件流
export function getFile(params) {
  return request({
    url: "/api/attachments/download",
    method: "get",
    params,
    responseType: 'arraybuffer'
  });
}

// 新版本 文件流
export function getFileById(data) {
  return request({
    url: "/api/file/getFileStream",
    method: "post",
    data,
    responseType: 'arraybuffer'
    // responseType: 'blob'
  });
}

// 新版本 文件路径
export function getFilePath(data) {
  return request({
    url: "/api/file/getFilePath",
    method: "post",
    data,
    enableThrottle: true,
  });
}


// 获取oa文件流
export function getYljoaFileStream(url) {
  return request({
    url: "/api/synthesis/oa/getOaFileStream?isDownload=1&url=" + encodeURI(url),
    method: "get",
    // responseType: 'arraybuffer'
    // responseType: 'blob'
  });
}


// 获取整体单位列表
export function unitList() {
  return request({
    method: "get",
    url: "/api/custom/system/corporates/list",
  });
}

//强制下线
export function forceLogout(sid) {
  return request({
    url: '/api/online-users/' + sid + '/kick',
    method: "post",
  });
}

export function getConfig() {
  return request({
    url: '/security/helper/config',
    method: "get",
  });
}

//同意登录
export function allowLogin(sid) {
  return request({
    url: '/api/online-users/allow/' + sid + '/login',
    method: "post",
  });
}

export function disallowLogin(sid) {
  return request({
    url: '/api/online-users/disallow/' + sid + '/login',
    method: "post",
  });
}

//重复登录
export function repeatedLogin() {
  return request({
    url: '/api/online-users/repeatedLogin',
    method: "get",
  });
}
