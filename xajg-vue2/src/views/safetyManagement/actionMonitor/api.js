import request from "@/utils/request";

const prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/safe/action/monitor/add",
    method: "post",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/safe/action/monitor/page",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/safe/action/monitor/delete",
    method: "post",
    data,
  });
}

export function equipmentList() {
  return request({
    url: prefix + "/safe/equipment/list",
    method: "get",
  });
}
