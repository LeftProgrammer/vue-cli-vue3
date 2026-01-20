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

// 获取已办/查看属性
export function finishedRead(data) {
  return request({
    url: "/api/process/read/business/finished-read",
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

// 催办消息
export function sendMessage(data) {
  return request({
    url: "/api/plt/flow/urge",
    method: "post",
    data,
  });
}

// 刷新读取业务流程信息
export function freshread(data) {
  return request({
    url: "/api/process/read/business/fresh-read",
    method: "post",
    data,
  });
}

// 流程提交
export function submitTodo(data) {
  return request({
    url: "/api/process/write/todo/submit",
    method: "post",
    data,
  });
}

// 获取常用语列表
export function getPhrases() {
  return request({
    url: "/api/process/phrases",
    method: "get",
    showLoading: false,
  });
}

// 获取子流程日志
export function childMatterLogs(businessId) {
  return request({
    url: `/api/process/packages/self/proc/${businessId}/all/child-matter-logs`,
    method: "get",
    showLoading: false,
  });
}

function getUserInfoFromStorage() {
  try {
    const raw = window.localStorage.getItem("userInfo");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function isCreatePerson(item, userInfo) {
  if (!userInfo) return false;
  return String(userInfo.userId) === String(item && item.createUser);
}

function showEdit(item, userInfo) {
  if (!item || !userInfo) return false;

  let canEdit = false;
  if (
    (item.taskStatus == 1 &&
      item?.matterTaskTodo?.userId != null &&
      String(item.matterTaskTodo.userId) === String(userInfo.userId)) ||
    (item.taskStatus == 4 && isCreatePerson(item, userInfo))
  ) {
    canEdit = true;
  }

  if (!canEdit) return false;

  const documentType = item.documentType;
  if (item.flowStatus == 2) {
    return false;
  }
  if (item.flowStatus == 0) {
    if (documentType == 1 && (item.signStatus == 3 || item.signStatus == 4)) {
      return false;
    }
    return true;
  }

  if (documentType == 2) {
    if (item.signStatusList && item.signStatusList.length > 0) {
      if (item.signStatus == 0 && item.flowName == "文秘结束流程") {
        return false;
      }
      if (
        item.signStatus == 3 ||
        item.signStatus == 4 ||
        item.signStatus == 5 ||
        item.signStatus == 0 ||
        item.signStatus == 6
      ) {
        return true;
      }
      return false;
    }
    return true;
  }

  if (item.signStatus == 3) {
    return false;
  }
  return true;
}

function setTodoCount(menus, todoStatList) {
  const list = menus || [];
  let todoCount = 0;
  for (let i = 0; i < list.length; i++) {
    const menu = list[i];
    if (!menu) continue;

    if (menu.children && menu.children.length) {
      menu.todoCount = setTodoCount(menu.children, todoStatList);
    } else {
      const path = menu.dataViewConfId;
      const todoItem = (todoStatList || []).find((item) => {
        const remark = item && item.DICT_REMARK;
        if (!remark || !path) return false;
        return String(remark).indexOf(`"path":"${path}"`) > -1;
      });
      menu.todoCount = todoItem ? Number(todoItem.TODO_COUNT) : 0;
      menu.businessIds = todoItem ? todoItem.BUSINESS_IDS : "";
    }
    todoCount += Number(menu.todoCount) || 0;
  }
  return todoCount;
}

/**
 * 更新每个菜单的待办数量（原地修改 menuRoutes 节点）
 * @param {Array} menuRoutes permission 模块生成的菜单树（filterAsyncRoutes 输出）
 */
export async function todoStat(menuRoutes) {
  const routes = menuRoutes || [];
  if (!routes.length) return;

  const res = await request({
    url: "/api/plt/flow/getTodoStat",
    method: "post",
    data: {
      entity: {
        documentType: "",
        unitType: "",
      },
    },
    showLoading: false,
  });

  if (!res || !res.success) return;

  const list = res.data || [];
  const userInfo = getUserInfoFromStorage();

  // 处理收发文数据：旧项目是基于 showEdit 重新计算 TODO_COUNT
  list.forEach((element) => {
    const remark = element && element["DICT_REMARK"];
    if (!remark || !element || !Array.isArray(element.data)) return;

    const isOfficeMatch =
      String(remark).includes("/office/designSendDoc") ||
      String(remark).includes("/office/designReceiveDoc") ||
      String(remark).includes("/office/supervisionSendDoc") ||
      String(remark).includes("/office/supervisionReceiveDoc") ||
      String(remark).includes("/office/constructionSendDoc") ||
      String(remark).includes("/office/constructionReceiveDoc") ||
      String(remark).includes("/office/thirdPartySendDoc") ||
      String(remark).includes("/office/thirdPartyReceiveDoc");

    if (!isOfficeMatch) return;

    let index = 0;
    element.data.forEach((item) => {
      if (showEdit(item, userInfo)) {
        index += 1;
      }
    });
    element["TODO_COUNT"] = index;
  });

  setTodoCount(routes, list);
}
