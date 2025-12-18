import store from "@/store";
import { getBusinessList, getBusinessPage, getFlowInfoByPackageId, todoread } from "@/api/flow";

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
};
