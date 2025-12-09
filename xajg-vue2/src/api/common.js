import request from "@/utils/request";
const prefix = '/api'
/**
 * 获取唯一id
 * @param {*} type
 */
export function getId() {
  return request({
    url: `/api/common/getid`,
    method: "get",
  });
}

/**
 * 统一分页查询
 * @param {*} type
 */
export function page(url, data) {
  return request({
    url: url,
    method: "post",
    data: data,
  });
}

/**
 * 获取删除
 * @param {*} type
 */
export function remove(url, data) {
  return request({
    url: url,
    method: "post",
    data: data,
  });
}
//   获取标段的信息
export function sectionNameById(id) {
  return request({
    method: "post",
    url: prefix + "/project/section/list",
    data: {
      id: id
    }
  });
}

// 获取密码校验规则
export function getPasswordRule() {
  return request({
    url: `/api/authentication/password-rule`,
    method: "get",
  });
}
