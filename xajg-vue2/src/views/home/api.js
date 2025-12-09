import request from "@/utils/request";

let prefix = "/api";
//质量验评优良率统计
export function quer1(data) {
  return request({
    url: prefix + "/quality/monitor/analysis",
    method: "post",
    data,
  });
}
//近七日现场投入情况
export function quer2(data) {
  return request({
    url: prefix + "/schedule/log/scene-list",
    method: "post",
    data,
  });
}
export function getStatisticsInfo() {
  return request.get("/api/construction/plan/getStatisticsInfo");
}

export function getQualityAssessInfo() {
  return request.post("/api/quality/assess/info/staticsQualityAssessInfo", {});
}

// 水雨情数据
export function quer3(data) {
  return request({
    url: prefix + "/schedule/log/rw-list",
    method: "post",
    data,
  });
}
//工程概况
export function quer4(data) {
  return request({
    url: prefix + "/schedule/log/pro-list",
    method: "post",
    data,
  });
}
// 获取待办任务
export function quer5(data) {
  return request({
    url: prefix + "/process/packages/self/todo",
    method: "post",
    data,
  });
}
//风险隐患
// export function quer6(data) {
//   return request({
//     url: prefix + "/safe/monitor/risk",
//     method: "post",
//     data,
//   });
// }

export function analyzeCompare(params) {
  return request({
    url: prefix + "/schedule/management/analyzeCompare",
    method: "post",
    data: params,
  });
}
// 获取当前用户的常用功能
export function getPermissionsByUserId(params) {
  return request({
    url: prefix + "/user/common/function/list",
    method: "post",
    data: params,
  });
}

export function setPermissions(params) {
  return request({
    url: prefix + "/user/common/function/addPromise",
    method: "post",
    data: params,
  });
}

export function saveAppBtns(data) {
  return request({
    url: "/api/appindex/saveAppBtns",
    method: "post",
    data,
  });
}

export function warningStatByType(data) {
  return request({
    url: "/api/safe/warningConfig/statByType",
    method: "post",
    data,
  });
}
