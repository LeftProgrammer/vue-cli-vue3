import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/synthesis/train-record/save",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/synthesis/train-record/update",
    method: "put",
    data,
  });
}
export function update1(data) {
  return request({
    url: prefix + "/synthesis/train-plan-detail/edit",
    method: "put",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/synthesis/train-record/page",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/synthesis/train-record/delete",
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