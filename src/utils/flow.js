import store from "@/store";
import {
  getBusinessList,
  getBusinessPage,
  getFlowInfoByPackageId,
  todoread,
  deleteWait,
  deleteTaskData,
  todo,
  done,
  readysend,
  oversend,
  finished,
  cc,
} from "@/api/flow";

// 流程数据缓存
let _flowCache = {
  todolist: null,
  donelist: null,
  readysendlist: null,
  oversendlist: null,
  finishedlist: null,
  cclist: null,
};

// 按业务名称缓存
let _businessCache = {};

const defaultParams = {
  clientType: "web",
  businessName: "",
  current: 1,
  pageSize: 200,
  clientTypeOnly: true,
};

export default {
  getBusinessList(url, data) {
    return getBusinessList(url, data);
  },
  getBusinessPage(url, data) {
    return getBusinessPage(url, data);
  },
  getFlowInfo(options, data) {
    if (!options || !data) return null;
    const path = data.path;
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (!option || !option.dictRemark) continue;
      try {
        const pac = JSON.parse(option.dictRemark);
        if (pac && (pac.path === path || pac.formpath === path)) {
          return { flowName: option.dictName, flowId: pac.flowId };
        }
      } catch (e) {
        void e;
      }
    }
    return null;
  },

  async getFlowData(path) {
    const options = await store.dispatch("dict/get", "FLOW_PACKAGE_DICT");
    if (!options) {
      throw new Error("获取流程信息失败");
    }

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (!option || !option.dictRemark) continue;
      try {
        const pac = JSON.parse(option.dictRemark);
        if (!pac) continue;
        if (pac.path !== path && pac.formpath !== path) continue;

        const flowName = option.dictName;
        let flowId = pac.flowId;
        if (flowId) {
          return { flowName, flowId };
        }

        const packageId = pac.packageId;
        if (!packageId) {
          throw new Error("获取流程时 packageId 为空");
        }

        const res = await getFlowInfoByPackageId(packageId);
        if (res && res.success && res.data && res.data.flowConfigId) {
          flowId = res.data.flowConfigId;
          return { flowName, flowId };
        }

        throw new Error((res && res.message) || "获取流程id失败");
      } catch (e) {
        void e;
      }
    }

    throw new Error("获取流程信息失败");
  },

  todoread(businessId, taskId) {
    return todoread({
      businessId,
      clientType: "web",
      procTaskId: taskId,
    });
  },

  // 删除待发数据
  deleteWait(businessId) {
    return deleteWait(businessId);
  },

  // 删除流程数据（管理员）
  deleteTaskData(businessId) {
    return deleteTaskData(businessId);
  },

  // 刷新缓存
  refresh(businessName) {
    if (businessName) {
      _businessCache[businessName] = null;
    } else {
      _flowCache = {
        todolist: null,
        donelist: null,
        readysendlist: null,
        oversendlist: null,
        finishedlist: null,
        cclist: null,
      };
    }
  },

  // 获取待办列表
  async getTodoList(businessName, callback) {
    const cache = businessName ? _businessCache[businessName] : _flowCache;
    if (cache && cache.todolist) {
      callback && callback(cache.todolist);
      return cache.todolist;
    }

    const params = { ...defaultParams, businessName: businessName || "" };
    const res = await todo(params);
    if (res && res.success) {
      const records = res.data?.records || [];
      if (businessName) {
        _businessCache[businessName] = _businessCache[businessName] || {};
        _businessCache[businessName].todolist = records;
      } else {
        _flowCache.todolist = records;
      }
      callback && callback(records);
      return records;
    }
    return [];
  },

  // 获取已办列表
  async getDoneList(businessName, callback) {
    const cache = businessName ? _businessCache[businessName] : _flowCache;
    if (cache && cache.donelist) {
      callback && callback(cache.donelist);
      return cache.donelist;
    }

    const params = { ...defaultParams, businessName: businessName || "" };
    const res = await done(params);
    if (res && res.success) {
      const records = res.data?.records || [];
      if (businessName) {
        _businessCache[businessName] = _businessCache[businessName] || {};
        _businessCache[businessName].donelist = records;
      } else {
        _flowCache.donelist = records;
      }
      callback && callback(records);
      return records;
    }
    return [];
  },

  // 获取待发列表
  async getReadysendList(businessName, callback) {
    const cache = businessName ? _businessCache[businessName] : _flowCache;
    if (cache && cache.readysendlist) {
      callback && callback(cache.readysendlist);
      return cache.readysendlist;
    }

    const params = { ...defaultParams, businessName: businessName || "" };
    const res = await readysend(params);
    if (res && res.success) {
      const records = res.data?.records || [];
      if (businessName) {
        _businessCache[businessName] = _businessCache[businessName] || {};
        _businessCache[businessName].readysendlist = records;
      } else {
        _flowCache.readysendlist = records;
      }
      callback && callback(records);
      return records;
    }
    return [];
  },

  // 获取已发列表
  async getOversendList(businessName, callback) {
    const cache = businessName ? _businessCache[businessName] : _flowCache;
    if (cache && cache.oversendlist) {
      callback && callback(cache.oversendlist);
      return cache.oversendlist;
    }

    const params = { ...defaultParams, businessName: businessName || "" };
    const res = await oversend(params);
    if (res && res.success) {
      const records = res.data?.records || [];
      if (businessName) {
        _businessCache[businessName] = _businessCache[businessName] || {};
        _businessCache[businessName].oversendlist = records;
      } else {
        _flowCache.oversendlist = records;
      }
      callback && callback(records);
      return records;
    }
    return [];
  },

  // 获取办结列表
  async getFinishedList(businessName, callback) {
    const cache = businessName ? _businessCache[businessName] : _flowCache;
    if (cache && cache.finishedlist) {
      callback && callback(cache.finishedlist);
      return cache.finishedlist;
    }

    const params = { ...defaultParams, businessName: businessName || "" };
    const res = await finished(params);
    if (res && res.success) {
      const records = res.data?.records || [];
      if (businessName) {
        _businessCache[businessName] = _businessCache[businessName] || {};
        _businessCache[businessName].finishedlist = records;
      } else {
        _flowCache.finishedlist = records;
      }
      callback && callback(records);
      return records;
    }
    return [];
  },

  // 获取抄送列表
  async getCcList(businessName, callback) {
    const cache = businessName ? _businessCache[businessName] : _flowCache;
    if (cache && cache.cclist) {
      callback && callback(cache.cclist);
      return cache.cclist;
    }

    const params = { ...defaultParams, businessName: businessName || "" };
    const res = await cc(params);
    if (res && res.success) {
      const records = res.data?.records || [];
      if (businessName) {
        _businessCache[businessName] = _businessCache[businessName] || {};
        _businessCache[businessName].cclist = records;
      } else {
        _flowCache.cclist = records;
      }
      callback && callback(records);
      return records;
    }
    return [];
  },

  // 初始化所有列表
  async init(businessName, callback) {
    const params = { ...defaultParams, businessName: businessName || "" };
    const [p1, p2, p3, p4, p5, p6] = await Promise.all([
      todo(params),
      done(params),
      readysend(params),
      oversend(params),
      finished(params),
      cc(params),
    ]);

    const data = {
      todolist: p1?.success ? p1.data?.records || [] : [],
      donelist: p2?.success ? p2.data?.records || [] : [],
      readysendlist: p3?.success ? p3.data?.records || [] : [],
      oversendlist: p4?.success ? p4.data?.records || [] : [],
      finishedlist: p5?.success ? p5.data?.records || [] : [],
      cclist: p6?.success ? p6.data?.records || [] : [],
    };

    if (businessName) {
      _businessCache[businessName] = data;
    } else {
      _flowCache = data;
    }

    callback && callback(data);
    return data;
  },
};
