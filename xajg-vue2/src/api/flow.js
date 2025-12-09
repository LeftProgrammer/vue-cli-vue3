import request from "@/utils/request";
import store from "@/store";
import base from "@/common/js/base.js";
/**
 * 获取流程的业务id
 * @param {*} data
 */
export function freshread(data) {
  return request({
    url: "/api/process/read/business/fresh-read",
    method: "post",
    data,
  });
}

/**
 * 更新每个菜单的代办数量
 */
export function todoStat() {
  //更新导航栏代办数量时，同步更新每个菜单的代办数量
  request({
    url: "/api/plt/flow/getTodoStat",
    method: "post",
    data: {
      entity: {
        documentType: "",
        unitType: "",
      },
    },
  }).then((res) => {
    if (res.success) {
      let todoStat = res.data;
      let menuRoutes = store.state.permission.menuRoutes;
      // 处理 收发文数据
      todoStat.forEach((element) => {
        if (element["DICT_REMARK"].includes("/office/designSendDoc")) {
          let index = 0;
          element.data.forEach((item) => {
            if (showEdit(item)) {
              index = index + 1;
            }
          });
          element["TODO_COUNT"] = index;
        } else if (
          element["DICT_REMARK"].includes("/office/designReceiveDoc")
        ) {
          let index = 0;
          element.data.forEach((item) => {
            if (showEdit(item)) {
              index = index + 1;
            }
          });
          element["TODO_COUNT"] = index;
        } else if (
          element["DICT_REMARK"].includes("/office/supervisionSendDoc")
        ) {
          let index = 0;
          element.data.forEach((item) => {
            if (showEdit(item)) {
              index = index + 1;
            }
          });
          element["TODO_COUNT"] = index;
        } else if (
          element["DICT_REMARK"].includes("/office/supervisionReceiveDoc")
        ) {
          let index = 0;
          element.data.forEach((item) => {
            if (showEdit(item)) {
              index = index + 1;
            }
          });
          console.log("sssss", index);
          element["TODO_COUNT"] = index;
        } else if (
          element["DICT_REMARK"].includes("/office/constructionSendDoc")
        ) {
          let index = 0;
          element.data.forEach((item) => {
            if (showEdit(item)) {
              index = index + 1;
            }
          });
          element["TODO_COUNT"] = index;
        } else if (
          element["DICT_REMARK"].includes("/office/constructionReceiveDoc")
        ) {
          let index = 0;
          element.data.forEach((item) => {
            if (showEdit(item)) {
              index = index + 1;
            }
          });
          element["TODO_COUNT"] = index;
        } else if (
          element["DICT_REMARK"].includes("/office/thirdPartySendDoc")
        ) {
          let index = 0;
          element.data.forEach((item) => {
            if (showEdit(item)) {
              index = index + 1;
            }
          });
          element["TODO_COUNT"] = index;
        } else if (
          element["DICT_REMARK"].includes("/office/thirdPartyReceiveDoc")
        ) {
          let index = 0;
          element.data.forEach((item) => {
            if (showEdit(item)) {
              index = index + 1;
            }
          });
          element["TODO_COUNT"] = index;
        }
      });
      setTodoCount(menuRoutes, todoStat);
    }
  });
}

/**
 * 获取流程的待办列表
 * @param {*} data
 * {clientType: "web", businessName: "", current: 1, pageSize: 20, clientTypeOnly: true}
 */
export function todo(data) {
  // console.log('todoStat todo 3')
  //更新导航栏代办数量时，同步更新每个菜单的代办数量
  todoStat();
  return request({
    url: "/api/process/packages/self/proc-task-page/todo",
    method: "post",
    data,
  });
}

function isCreatePerson(data) {
  // console.log("是不是创建人", this.row);
  // 判断当前登录人是不是创建人
  let delPromise = true;
  let userInfo = base.getStorage("userInfo");
  if (userInfo) {
    if (userInfo.userId == data.createUser) {
      delPromise = true;
    } else {
      delPromise = false;
    }
  } else {
    delPromise = false;
  }
  return delPromise;
}
function showEdit(data) {
  let bool = false;
  let userInfo = base.getStorage("userInfo");
  // 流程节点到自己的代办能办理  或者 自己创建的待发能办理
  // ||(this.row.taskStatus == 3 && this.isCreatePerson)
  if (
    (data.taskStatus == 1 &&
      data?.matterTaskTodo?.userId === userInfo.userId) ||
    (data.taskStatus == 4 && isCreatePerson(data))
  ) {
    bool = true;
  } else {
    bool = false;
  }
  // // signStatus 0 1 2 3 4 5 6   未签收 部分签收 已签收  拒签  签收退回 5完成(代表的是当前的子流程完全结束了)  6发起之后文秘之前
  if (bool) {
    const documentType = data.documentType;
    if (data.flowStatus == 2) {
      bool = false;
    } else if (data.flowStatus == 0) {
      if (documentType == 1 && (data.signStatus == 3 || data.signStatus == 4)) {
        // console.log(" 拒签 跟 退回");
        bool = false;
      } else {
        // console.log("排除拒签 ");
        bool = true;
      }
    } else {
      // 区分发文  界面还是收文界面
      // documentType 1 收文  2 发文
      if (documentType == 2) {
        // 判断 是不是 已经发文了
        if (data.signStatusList.length > 0) {
          // signStatus 0 1 2 3 4 5 6   未签收 部分签收 已签收  拒签  签收退回 5完成(代表的是当前的子流程完全结束了)  6发起之后文秘之前
          // data.signStatus == 2 ||
          if (data.signStatus == 0 && data.flowName == "文秘结束流程") {
            bool = false;
            return;
          }
          if (
            data.signStatus == 3 ||
            data.signStatus == 4 ||
            data.signStatus == 5 ||
            data.signStatus == 0 ||
            data.signStatus == 6
          ) {
            bool = true; //可以编辑
          } else {
            bool = false; //不可以编辑
          }
        } else {
          bool = true;
        }
      } else {
        if (data.signStatus == 3) {
          bool = false;
        }
      }
    }
  }
  // console.log("showEdit", bool);
  return bool;
}

function setTodoCount(menus, todoStat) {
  let todoCount = 0;
  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i];
    if (menu.children) {
      menu.todoCount = setTodoCount(menu.children, todoStat);
    } else {
      // console.log('setTodoCount todoStat', todoStat);
      //dataViewConfId
      let todoItem = todoStat.find(
        (item) =>
          item.DICT_REMARK.indexOf('"path":"' + menu.dataViewConfId + '"') > -1
      );
      menu.todoCount = todoItem ? Number(todoItem.TODO_COUNT) : 0;
      menu.businessIds = todoItem ? todoItem.BUSINESS_IDS : "";
    }
    todoCount += menu.todoCount;
  }
  return todoCount;
}

/**
 * 获取流程的已办列表
 * @param {*} data
 * {clientType: "web", businessName: "", current: 1, pageSize: 20, clientTypeOnly: true}
 */
export function done(data) {
  return request({
    url: "/api/process/packages/self/proc-task-page/done",
    // url: "/api/process/packages/self/proc-page/done",
    // url: "/api/process/packages/self/done",
    method: "post",
    data,
  });
}

/**
 * 获取流程的待发列表
 * @param {*} data
 * {clientType: "web", businessName: "", current: 1, pageSize: 20}
 */
export function readysend(data) {
  return request({
    url: "/api/process/packages/self/proc-page/todo",
    method: "post",
    data,
  });
}

/**
 * 获取流程的已发列表
 * @param {*} data
 * {clientType: "web", businessName: "", current: 1, pageSize: 20}
 */
export function oversend(data) {
  return request({
    url: "/api/process/packages/self/proc-page/done",
    method: "post",
    data,
  });
}

/**
 * 获取流程的办结列表
 * @param {*} data
 * {clientType: "web", businessName: "", current: 1, pageSize: 20}
 */
export function finished(data) {
  return request({
    url: "/api/process/packages/self/proc-page/finished",
    method: "post",
    data,
  });
}

/**
 * 获取流程的抄送列表
 * @param {*} data
 * {clientType: "web", businessName: "", current: 1, pageSize: 20}
 */
export function cc(data) {
  return request({
    url: "/api/process/packages/self/proc-page/cc",
    method: "post",
    data,
  });
}

/**
 * 获取数据列表
 * @param {*} listurl
 * @param {*} data
 * @returns
 */
export function getBusinessPage(listurl, data) {
  return request({
    url: listurl,
    method: "post",
    data: {
      current: 1,
      pageSize: 10,
      entity: {
        ...data,
      },
    },
  });
}

export function getBusinessList(listurl, data) {
  return request({
    url: listurl,
    method: "post",
    data,
  });
}

/**
 * 删除待发的数据
 * @param {*} listurl
 * @param {*} data
 * @returns
 */
export function deleteWait(businessId) {
  return request({
    url: "/api/process/write/wait/del",
    method: "DELETE",
    data: {
      businessId: businessId,
    },
  });
}

/**
 * 获取流程的待办属性列表
 * @param {*} data
 * {clientType: "web", businessId: "1168929212740927488", procTaskId:"1168930871617519617"}
 */
export function todoread(data) {
  return request({
    url: "/api/process/read/business/todo-read",
    method: "post",
    data,
  });
}

/**
 *
 * @param {*} businessId
 */
export function alllogs(businessId) {
  return request({
    url: `/api/process/packages/self/proc/${businessId}/all/logs`,
    method: "GET",
  });
}

/**
 * 通过流程包名获取流程信息
 * @param {*} packageId
 */
export function getFlowInfoByPackageId(packageId) {
  return request({
    url: `/api/plt/flow/getFlowInfoByPackageId?packageId=${packageId}`,
    method: "GET",
  });
}

/**
 * 撤销删除所有的数据
 * @param {*} businessId
 * @returns
 */
export function deleteTaskData(businessId) {
  return request({
    url: `/api/process/write/matter/${businessId}/del`,
    method: "DELETE",
  });
}

/**
 * 根据图片id数组获取图片地址
 * @param {*} userIdList
 * @returns
 */
export function getSignMapByIdList(userIdList) {
  return request({
    url: `/api/user/sign/getSignMapByIdList`,
    method: "POST",
    data: userIdList,
  });
}
