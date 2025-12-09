import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/synthesis/train-plan/save",
    method: "post",
    data,
  });
}
export function save1(data) {
  return request({
    url: prefix + "/synthesis/train-plan-detail/save",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/synthesis/train-plan/update",
    method: "put",
    data,
  });
}
export function update1(data) {
  return request({
    url: prefix + "/synthesis/train-plan-detail/update",
    method: "put",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/synthesis/train-plan/page",
    method: "post",
    data,
  });
}

export function page1(data) {
  return request({
    url: prefix + "/synthesis/train-plan-detail/all-list",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/synthesis/train-plan/delete",
    method: "post",
    data,
  });
}
export function remove1(data) {
  return request({
    url: prefix + "/synthesis/train-plan-detail/delete",
    method: "post",
    data,
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
