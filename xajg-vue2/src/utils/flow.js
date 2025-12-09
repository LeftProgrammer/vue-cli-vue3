import {
  todo,
  done,
  readysend,
  oversend,
  finished,
  cc,
  getBusinessList,
  getBusinessPage,
  deleteWait,
  todoread,
  getFlowInfoByPackageId,
  deleteTaskData,
} from "@/api/flow";
import base from "@/common/js/base.js";
import store from "@/store";

let _storage_key = "szgc-mdg-web-flowinfo";
let _flowdata = {
  /**待办列表 */
  todolist: null,
  /**已办列表 */
  donelist: null,
  /**待发列表 */
  readysendlist: null,
  /**已发列表 */
  oversendlist: null,
  /**办结列表 */
  finishedlist: null,
  /**抄送列表 */
  cclist: null,
  //mine我的模板(初始) todo待办 done已办 wait待发 sent已发 fine办结 term终止 cc抄送
};

let _Bus_Data = {};

let data = {
  clientType: "web",
  businessName: "",
  current: 1,
  pageSize: 200,
  clientTypeOnly: true,
};
export default {
  /**获取流程包名 */
  getFlowInfoByPackageId(packageId) {
    return getFlowInfoByPackageId(packageId);
  },
  /**获取流程的信息：flowId，flowName */
  getFlowInfo(options, data) {
    if (!data) {
      return null;
    }

    let path = data.path;
    // let code = data.code;
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option.dictRemark) {
        let pac;
        try {
          pac = JSON.parse(option.dictRemark);
          if (pac && (pac.path === path || pac.formpath === path)) {
            let flowName = option.dictName;
            let flowId = pac.flowId;

            return { flowName: flowName, flowId: flowId };
          }
        } catch { }
      }
    }
    return null;
  },
  getBusinessList(url, data) {
    return getBusinessList(url, data);
  },
  getBusinessPage(url, data) {
    return getBusinessPage(url, data);
  },
  /**获取流程状态字典 */
  getFlowData(path) {
    return new Promise((resolve, reject) => {
      store.dispatch("dict/get", "FLOW_PACKAGE_DICT").then(async (options) => {

        if (options) {
          console.log("flowPackageOptions", options);
          // let code = data.code;
          for (let i = 0; i < options.length; i++) {
            const option = options[i];
            if (option.dictRemark) {
              let pac;
              try {
                pac = JSON.parse(option.dictRemark);
                //分别对应：列表打开form，和待办入口打开form
                if (pac && (pac.path === path || pac.formpath === path)) {
                  let flowName = option.dictName;
                  let flowId = pac.flowId;
                  //没有指定流程flowId时，从数据库接口中去取默认得值
                  if (!flowId) {
                    let pacId = pac.packageId;
                    if (pacId) {
                      let res = await getFlowInfoByPackageId(pacId);
                      if (res.success) {
                        let flowInfo = res.data;
                        flowId = flowInfo.flowConfigId;
                        if (flowId) {
                          resolve({ flowName: flowName, flowId: flowId });
                          return;
                        }
                      }
                      reject("获取流程id失败！" + res.message);
                      return;
                    } else {
                      reject("获取流程时，packageId为空！");
                      return;
                    }
                  } else {
                    resolve({ flowName: flowName, flowId: flowId });
                    return;
                  }
                }
              } catch { }
            }
          }
          reject("获取流程信息失败！");
          return;
        }
      });
    });
  },
  /**
   * 删除待发流程的数据
   * @param {*} id
   * @returns
   */
  deleteWait(id) {
    return deleteWait(id);
  },
  /**
   * 删除所有的数据
   */
  deleteTaskData(id) {
    return deleteTaskData(id);
  },
  /**
   * 获取任务的节点属性
   * @param {*} businessId
   * @param {*} taskId
   * @returns
   */
  todoread(businessId, taskId) {
    return todoread({
      businessId: businessId,
      clientType: "web",
      procTaskId: taskId,
    });
  },
  /**初始化 */
  init(businessName, callback) {
    return;
    let _data = _flowdata;
    if (businessName) {
      data.businessName = businessName;
      _data = _Bus_Data[businessName];
    }
    if (!_data) {
      _data = {};
    }

    let p1 = todo(data);
    let p2 = done(data);
    let p3 = readysend(data);
    let p4 = oversend(data);
    let p5 = finished(data);
    let p6 = cc(data);
    let reqArr = [p1, p2, p3, p4, p5, p6];
    Promise.all(reqArr)
      .then((res) => {
        if (res && res.length == reqArr.length) {
          if (res[0].success) {
            _data.todolist = res[0].data.records;
          }
          if (res[1].success) {
            _data.donelist = res[1].data.records;
          }
          if (res[2].success) {
            _data.readysendlist = res[2].data.records;
          }
          if (res[3].success) {
            _data.oversendlist = res[3].data.records;
          }
          if (res[4].success) {
            _data.finishedlist = res[4].data.records;
          }
          if (res[5].success) {
            _data.cclist = res[5].data.records;
          }
          // // 存下这些数据 详情 编辑 会用到。
          base.setStorage("all_flowdata", _data);

          if (businessName) {
            _Bus_Data[businessName] = _data;
          } else {
            _flowdata = _data;
          }
          if (callback && typeof callback === "function") {
            callback(_data);
          }
          console.log("flow inited", businessName, _Bus_Data, _flowdata);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  /**数据刷新 */
  refresh(businessName) {
    return;
    console.log("flow 数据刷新", businessName);
    if (businessName) {
      _Bus_Data[businessName] = null;
    } else {
      _flowdata = {
        todolist: null,
        donelist: null,
        readysendlist: null,
        oversendlist: null,
        finishedlist: null,
        cclist: null,
      };
    }
  },
  getTodoList(businessName, callback) {
    return;
    let _data = _flowdata;
    if (businessName) {
      data.businessName = businessName;
      _data = _Bus_Data[businessName];
    }

    if (_data && _data.todolist) {
      callback && callback(_data.todolist);
      return _data.todolist;
    }
    if (!_data) {
      _data = {};
    }

    // console.log("flow getTodoList before", businessName, _Bus_Data, _flowdata);
    let res = todo(data).then(() => { });
    if (res.success) {
      _data.todolist = res.data.records;
      callback && callback(_data.todolist);

      if (businessName) {
        _Bus_Data[businessName] = _data;
      } else {
        _flowdata = _data;
      }
      // console.log("flow getTodoList got", businessName, _Bus_Data, _flowdata);
    }
    return _data.todolist || [];
  },
  getDoneList(businessName, callback) {
    return;
    let _data = _flowdata;
    if (businessName) {
      data.businessName = businessName;
      _data = _Bus_Data[businessName];
    }

    if (_data && _data.donelist) {
      callback && callback(_data.donelist);
      return _data.donelist;
    }
    if (!_data) {
      _data = {};
    }
    done(data).then((res) => {
      if (res.success) {
        _data.donelist = res.data.records;
        callback && callback(_data.donelist);

        if (businessName) {
          _Bus_Data[businessName] = _data;
        } else {
          _flowdata = _data;
        }
      }
      return _data.donelist || [];
    });
  },
  getReadysendList(businessName, callback) {
    return;
    let _data = _flowdata;
    if (businessName) {
      data.businessName = businessName;
      _data = _Bus_Data[businessName];
    }

    if (_data && _data.readysendlist) {
      callback && callback(_data.readysendlist);
      return _data.readysendlist;
    }
    if (!_data) {
      _data = {};
    }

    readysend(data).then((res) => {
      if (res.success) {
        _data.readysendlist = res.data.records;
        callback && callback(_data.readysendlist);

        if (businessName) {
          _Bus_Data[businessName] = _data;
        } else {
          _flowdata = _data;
        }
      }
      return _data.readysendlist || [];
    });
  },
  getOversendList(businessName, callback) {
    return;
    let _data = _flowdata;
    if (businessName) {
      data.businessName = businessName;
      _data = _Bus_Data[businessName];
    }

    if (_data && _data.oversendlist) {
      callback && callback(_data.oversendlist);
      return _data.oversendlist;
    }
    if (!_data) {
      _data = {};
    }

    oversend(data).then((res) => {
      if (res.success) {
        _data.oversendlist = res.data.records;
        callback && callback(_data.oversendlist);

        if (businessName) {
          _Bus_Data[businessName] = _data;
        } else {
          _flowdata = _data;
        }
      }
      return _data.oversendlist || [];
    });
  },
  getFinishedList(businessName, callback) {
    return;
    let _data = _flowdata;
    if (businessName) {
      data.businessName = businessName;
      _data = _Bus_Data[businessName];
    }

    if (_data && _data.finishedlist) {
      callback && callback(_data.finishedlist);
      return _data.finishedlist;
    }
    if (!_data) {
      _data = {};
    }

    // console.log(
    //   "flow getFinishedList before",
    //   businessName,
    //   _Bus_Data,
    //   _flowdata
    // );
    finished(data).then((res) => {
      if (res.success) {
        _data.finishedlist = res.data.records;
        callback && callback(_data.finishedlist);

        if (businessName) {
          _Bus_Data[businessName] = _data;
        } else {
          _flowdata = _data;
        }
        // console.log(
        //   "flow getFinishedList got",
        //   businessName,
        //   _Bus_Data,
        //   _flowdata
        // );
      }
      return _data.finishedlist || [];
    });
  },
  getCcList(businessName, callback) {
    return;
    let _data = _flowdata;
    if (businessName) {
      data.businessName = businessName;
      _data = _Bus_Data[businessName];
    }

    if (_data && _data.cclist) {
      callback && callback(_data.cclist);
      return _data.cclist;
    }
    if (!_data) {
      _data = {};
    }

    // console.log(
    //   "flow getFinishedList before",
    //   businessName,
    //   _Bus_Data,
    //   _flowdata
    // );
    cc(data).then((res) => {
      if (res.success) {
        _data.cclist = res.data.records;
        callback && callback(_data.cclist);

        if (businessName) {
          _Bus_Data[businessName] = _data;
        } else {
          _flowdata = _data;
        }
        // console.log(
        //   "flow getFinishedList got",
        //   businessName,
        //   _Bus_Data,
        //   _flowdata
        // );
      }
      return _data.cclist || [];
    });
  },
};
