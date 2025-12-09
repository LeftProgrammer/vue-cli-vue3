import request from "@/utils/request";

let prefix = "/api";

export function page(data) {
  return request({
    url: prefix + "/project/pbs/page",
    method: "post",
    data: data,
  });
}

export function list(data) {
  let url = 'getDetailList';
  if(data.isParent){
    url = 'getPbs';
    data.id = data.pid;
  }
  return request({
    url: prefix + "/design/quantities/"+url,
    method: "post",
    data,
  });
}

export function get(id) {
  return request({
    url: prefix + "/project/pbs/get/id/" + id,
    method: "get",
  });
}

export function getById(data) {
  return request({
    url: prefix + "/design/quantities/getPbs",
    method: "post",
    data,
  });
}

export function getByCode(code) {
  return request({
    url: prefix + "/project/pbs/get/code/" + code,
    method: "get",
  });
}

export function save(data) {
  return request({
    url: prefix + "/design/quantities/save",
    method: "post",
    data: data,
  });
}


export function getConfigureList() {
  return request({
    url: prefix + `/design/quantities/getConfigureList`,
    method: "post",
  });
}
