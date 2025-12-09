import request from "@/utils/request";

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/investment/real/page",
    method: "post",
    data,
  });
}

export function save(data) {
  return request({
    url: prefix + "/investment/real/add",
    method: "post",
    data,
  });
}
export function update(data) {
  return request({
    url: prefix + "/investment/real/update",
    method: "put",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/investment/real/delete",
    method: "post",
    data,
  });
}
export function getTotalAmountByMonth(data) {
  return request({
    url: prefix + "/investment/real/getTotalAmountByMonth",
    method: "get",
    params: data,
  });
}



