import request from "@/utils/request";

let prefix = "/api";

//成果供应查询：水电成果、营地成果
export function statisticsPageType(data) {
  return request({
    url: prefix + "/design/supply/detail/statisticsPageType",
    method: "post",
    data,
  });
}

//设计交底列表请求
export function DesignDicu(data) {
  return request({
    url: prefix + "/design/explain/list",
    method: "post",
    data,
  });
}
// 设计变更列表请求
export function DesignChange(data) {
  return request({
    url: prefix + "/design/change/list",
    method: "post",
    data,
  });
}

// 获取当月所有的 目标完成数量=》 从“设计管理-计划台账”中获取，统计当前月需要完成任务的总数，
export function Target(data) {
  return request({
    url: prefix + "/design/ledgert/tree",
    method: "get",
    data,
  });
}

// 获取当前用户的菜单
export function permissions(data) {
  return request({
    url: prefix + "/system/permissions-tree",
    method: "get",
    data,
  });
}

// 获取 待办事项
export function todoList(data) {
  return request({
    url: prefix + "/process/packages/self/proc-task-page/todo",
    method: "POST",
    data,
  });
}

// 按模块 获取 待办事项
export function todoListByModule(data) {
  return request({
    url: prefix + "/plt/flow/todoTaskList",
    method: "POST",
    data,
    enableThrottle: true,
  });
}

// 获取ids的收发文
export function getDatalistByIds(ids) {
  return request({
    url: prefix + "/synthesis/manage/listByIds",
    method: "post",
    data: ids,
    enableThrottle: true,
  });
}

// 风险隐患

// export function risk(data) {
//   return request({
//     url: prefix + "/safe/monitor/risk",
//     method: "post",
//     data,
//   });
// }

// 获取水请数据
export function water(data) {
  return request({
    url: prefix + "/safe/water-monitor/page",
    method: "post",
    data,
  });
}

export function rain(data) {
  return request({
    url: prefix + "/safe/rain-monitor/page",
    method: "post",
    data,
  });
}

export function statistics(params) {
  return request({
    url: prefix + "/quality/assess/info/statistics",
    method: "get",
    params,
  });
}

export function material(data) {
  return request({
    url: prefix + "/quality/material/statistics",
    method: "post",
    data,
  });
}

// 试验检测合格率
export function TestPassRate(data) {
  return request({
    url: prefix + "/quality/monitor/testResult",
    method: "post",
    data,
  });
}

//水雨情分析
export function waterInfo(data) {
  return request({
    url: prefix + "/safe/monitor/analysis",
    method: "post",
    data,
  });
}

//特种设备统计
export function deivece(data) {
  return request({
    url: prefix + "/safe/monitor/special-deivece",
    method: "post",
    data,
  });
}

// 危大工程与危险作业
export function danger(data) {
  return request({
    url: prefix + "/safe/monitor/danger",
    method: "post",
    data,
  });
}

// 收发文分页查询
export function managementPage(data) {
  return request({
    url: prefix + "/synthesis/manage/list",
    method: "post",
    data,
    enableThrottle: true,
  });
}

// 获取流程退回信息
export function noticeList(data) {
  return request({
    url: prefix + "/proc/notice/list",
    method: "post",
    data,
    enableThrottle: true,
  });
}

// 获取流程退回信息已读
export function noticeRead(data) {
  return request({
    url: prefix + "/proc/notice/read",
    method: "post",
    data,
    enableThrottle: true,
  });
}

export function statisticsSafetyHome(data) {
  return request({
    url: prefix + "/safe/hiddenDanger/statisticsHome",
    method: "post",
    data,
    enableThrottle: true,
  });
}

export function getSectionByUser() {
  return request.get("/api/project/section/getSectionByUser");
}

export function getPictures() {
  return request.get("/api/project/video/list?type=0");
}
export function zjdSchedule(params) {
  return request({
    url: "/api/construction/plan/zjdSchedule",
    method: "get",
    params: params,
  });
}
