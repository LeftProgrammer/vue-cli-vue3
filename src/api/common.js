import request from "@/utils/request";

const prefix = "/api";

export function getId() {
  return request({
    url: `${prefix}/common/getid`,
    method: "get",
  });
}

// 通用分页查询
export function page(url, data) {
  return request({
    url,
    method: "post",
    data,
  });
}

// 通用删除
export function remove(url, data) {
  return request({
    url,
    method: "post",
    data,
  });
}

// 根据标段 id 获取标段信息
export function sectionNameById(id) {
  return request({
    url: `${prefix}/project/section/list`,
    method: "post",
    data: { id },
  });
}

// 获取密码校验规则
export function getPasswordRule() {
  return request({
    url: `${prefix}/authentication/password-rule`,
    method: "get",
  });
}
