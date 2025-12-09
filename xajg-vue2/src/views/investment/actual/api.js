import request from "@/utils/request";

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/investment/actual/page",
    method: "post",
    data,
  });
}

export function save(data) {
  return request({
    url: prefix + "/investment/actual/save",
    method: "post",
    data,
  });
}
export function update(data) {
  return request({
    url: prefix + "/investment/actual/update",
    method: "put",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/investment/actual/delete",
    method: "post",
    data,
  });
}
export function getTotalAmountByMonth(data) {
  return request({
    url: prefix + "/investment/actual/getTotalAmountByMonth",
    method: "get",
    params: data,
  });
}
