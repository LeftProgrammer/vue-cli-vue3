import request from "@/utils/request";
import { bimService } from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/project/pbs/save",
    method: "post",
    data,
  });
}

export function add(data) {
  return request({
    url: prefix + "/project/pbs/add",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/project/pbs/delete",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/project/pbs/update",
    method: "put",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/project/pbs/page",
    method: "post",
    data: data,
  });
}

export function list(data) {
  return request({
    url: prefix + "/project/pbs/list",
    method: "post",
    data,
  });
}
export function bimTree(data) {
  return bimService({
    url: prefix + "/app/model/GetFloorStructureData",
    method: "get",
    params: data,
  });
}
export function bimProperty(data) {
  return bimService({
    url: prefix + "/app/model/property-data-by-externalid",
    method: "get",
    params: data,
  });
}
