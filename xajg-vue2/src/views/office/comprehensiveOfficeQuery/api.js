import request from "@/utils/request";

const prefix = "/api";
// 获取整体单位列表
export function corporates(params) {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
    params,
  });
}
// 获取收发文分析
export function getReceiveSend(params) {
  return request({
    method: "post",
    url: prefix + "/synthesis/manage/statistics",
    data: params,
  });
}
// 获取公文处理时长
export function getDuration(params) {
  return request({
    method: "post",
    url: prefix + "/synthesis/manage/duration",
    data: params,
  });
}
// 获取资金调拨分析左侧
export function getMoneyTotal(params) {
  return request({
    method: "post",
    url: prefix + "/schedule/fund/info/total",
    data: params,
  });
}
// 获取资金调拨分析右側
export function getMoneyAnalyze(params) {
  return request({
    method: "post",
    url: prefix + "/schedule/fund/info/analyze",
    data: params,
  });
}
// 获取培训情况
export function getTrain(params) {
  return request({
    method: "post",
    url: prefix + "/synthesis/train-record/condition",
    data: params,
  });
}
