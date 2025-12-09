import request from "@/utils/request";

let prefix = "/api";

export function getPbsTree(data) {
  return request({
    url: prefix + "/actual/quantities/getPbsTree",
    method: "post",
    data,
  });
}

export function getConfigureList() {
  return request({
    url: prefix + `/design/quantities/getConfigureList`,
    method: "post",
  });
}

export function constructionType() {
  return request({
    url: prefix + `/imageStat/constructionType`,
    method: "post",
  });
}

export function quantitiesCompare(data) {
  return request({
    url: prefix + "/imageStat/quantitiesCompare",
    method: "post",
    data,
  });
}

export function dayCompare(data) {
  return request({
    url: prefix + "/imageStat/dayCompare",
    method: "post",
    data,
  });
}

export function monthStatList(data) {
  return request({
    url: prefix + "/imageStat/monthStatList",
    method: "post",
    data,
  });
}

export function monthDayStatList(data) {
  return request({
    url: prefix + "/imageStat/monthDayStatList",
    method: "post",
    data,
  });
}
