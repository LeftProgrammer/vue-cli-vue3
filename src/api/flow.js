import request from "@/utils/request";

// 待办列表（任务维度）
export function todo(data) {
  return request({
    url: "/api/process/packages/self/proc-task-page/todo",
    method: "post",
    data,
    showLoading: false,
  });
}

// 已办列表（任务维度）
export function done(data) {
  return request({
    url: "/api/process/packages/self/proc-task-page/done",
    method: "post",
    data,
    showLoading: false,
  });
}

// 待发列表（流程维度）
export function readysend(data) {
  return request({
    url: "/api/process/packages/self/proc-page/todo",
    method: "post",
    data,
    showLoading: false,
  });
}

// 已发列表（流程维度）
export function oversend(data) {
  return request({
    url: "/api/process/packages/self/proc-page/done",
    method: "post",
    data,
    showLoading: false,
  });
}

// 办结列表（流程维度）
export function finished(data) {
  return request({
    url: "/api/process/packages/self/proc-page/finished",
    method: "post",
    data,
    showLoading: false,
  });
}

// 抄送列表（流程维度）
export function cc(data) {
  return request({
    url: "/api/process/packages/self/proc-page/cc",
    method: "post",
    data,
    showLoading: false,
  });
}

export function getBusinessPage(listurl, data) {
  return request({
    url: listurl,
    method: "post",
    data: {
      current: 1,
      pageSize: 10,
      entity: {
        ...(data || {}),
      },
    },
    showLoading: false,
  });
}

export function getBusinessList(listurl, data) {
  return request({
    url: listurl,
    method: "post",
    data,
    showLoading: false,
  });
}

// 获取待办属性
export function todoread(data) {
  return request({
    url: "/api/process/read/business/todo-read",
    method: "post",
    data,
    showLoading: false,
  });
}

// 获取流程日志
export function alllogs(businessId) {
  return request({
    url: `/api/process/packages/self/proc/${businessId}/all/logs`,
    method: "get",
    showLoading: false,
  });
}

// 通过流程包名获取流程信息
export function getFlowInfoByPackageId(packageId) {
  return request({
    url: `/api/plt/flow/getFlowInfoByPackageId?packageId=${packageId}`,
    method: "get",
    showLoading: false,
  });
}

// 删除待发的数据
export function deleteWait(businessId) {
  return request({
    url: "/api/process/write/wait/del",
    method: "delete",
    data: {
      businessId,
    },
  });
}

// 删除流程数据（管理员）
export function deleteTaskData(businessId) {
  return request({
    url: `/api/process/write/matter/${businessId}/del`,
    method: "delete",
  });
}

// 根据签名ID数组获取签名图片映射（FlowHandle 中用于日志签名展示）
export function getSignMapByIdList(userIdList) {
  return request({
    url: `/api/user/sign/getSignMapByIdList`,
    method: "post",
    data: userIdList,
    showLoading: false,
  });
}
