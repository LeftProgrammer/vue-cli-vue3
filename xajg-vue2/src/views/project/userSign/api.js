import request from "@/utils/request";

let prefix = "/api";

/**
 * 新增或更新用户签名
 * @param {Object} data - 用户签名数据
 * @returns {Promise}
 */
export function save(data) {
  return request({
    url: prefix + "/user/sign/save",
    method: "post",
    data,
  });
}

/**
 * 删除用户签名
 * @param {Number} id - 签名ID
 * @returns {Promise}
 */
export function remove(id) {
  return request({
    url: prefix + "/user/sign/delete",
    method: "post",
    params: { id },
  });
}

/**
 * 分页查询用户签名列表
 * @param {Object} data - 分页查询参数
 * @returns {Promise}
 */
export function page(data) {
  return request({
    url: prefix + "/user/sign/page",
    method: "post",
    data,
  });
}

/**
 * 获取所有用户签名
 * @returns {Promise}
 */
export function getAllUserSigns() {
  return request({
    url: prefix + "/user/sign/all",
    method: "get",
  });
}
