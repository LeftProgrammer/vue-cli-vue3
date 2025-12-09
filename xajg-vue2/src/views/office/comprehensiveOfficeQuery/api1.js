import request from "@/utils/request";

let prefix = "/api";
// 收发文对象统计分析
export function query1(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/query/documentList",
    data
  });
}
// 平均处理效率统计分析
export function query2(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/query/dealList",
    data
  });
}
// 培训情况统计查询
export function query3(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/query/trainCaseList",
    data
  });
}
// 培训排行榜统计查询
export function query4(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/query/trainRankList",
    data
  });
}

export function unitList() {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
  });
}