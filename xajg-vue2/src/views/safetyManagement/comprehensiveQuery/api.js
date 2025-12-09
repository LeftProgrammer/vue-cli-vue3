import request from "@/utils/request";

let prefix = "/api";
//水雨情分析
export function quer1(data) {
  return request({
    url: prefix + "/safe/monitor/analysis",
    method: "post",
    data,
  });
}
//森林防火
export function quer2(data) {
  return request({
    url: prefix + "/safe/monitor/fire",
    method: "post",
    data,
  });
}
//风险隐患
// export function quer3(data) {
//   return request({
//     url: prefix + "/safe/monitor/risk",
//     method: "post",
//     data,
//   });
// }
//特种设备统计
export function quer4(data) {
  return request({
    url: prefix + "/safe/monitor/special-deivece",
    method: "post",
    data,
  });
}
// 危大工程与危险作业
export function quer5(data) {
  return request({
    url: prefix + "/safe/monitor/danger",
    method: "post",
    data,
  });
}

// 监测设备数量统计
export function jcsbCount(data) {
  return request({
    url: prefix + "/safe/monitor/jcsbCount",
    method: "post",
    data,
  });
}

export function list(data) {
  return request({
    url: prefix + "/safe/rain-monitor/list",
    method: "get",
    data,
  });
}
