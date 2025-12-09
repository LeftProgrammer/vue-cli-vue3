import mode from "@/config/index";
import store from "@/store";
import { INDEX_HOMEPAGE_PATH } from "@/store/mutation-types";
import heatbeat from "@/utils/heatbeat";

export default {
  async init(callback) {
    try {
      const items = await store.dispatch("dict/get", "qdxtpz");
      if (!items || !items.length) {
        // 字典未配置时直接返回
        return;
      }
      const item = items.find((x) => x.dictCode === mode) || items[0];
      if (!item || !item.dictRemark) {
        return;
      }

      let json = {};
      try {
        json = JSON.parse(item.dictRemark);
      } catch (error) {
        // 配置 JSON 解析失败
        return;
      }

      const res = json;
      const systemConfig = res.systemConfig;
      const modelUrl = res.modelUrl;
      const secretKey = res.secretKey;
      const modelInput = res.modelInput;
      const cadInput = res.cadInput;
      const modelInitConfig = res.modelInitConfig;
      const webUrlConfig = res.webUrlConfig;
      const dangerousRock = res.dangerousRock;
      const progressShowList = res.progressShowList;
      const videoConfig = res.videoConfig;
      const minioConfig = res.minioConfig;
      const customizedFilterunits = res.customizedFilterunits;

      if (systemConfig) {
        store.commit("SYSTEM_CONFIG", systemConfig);
      }
      if (modelUrl) {
        store.commit("MODEL_URL", modelUrl);
      }
      if (secretKey) {
        store.commit("BIM_SECRETKEY", secretKey);
      }
      if (modelInput) {
        store.commit("MODEL_INPUT", modelInput);
      }
      if (cadInput) {
        store.commit("CAD_INPUT", cadInput);
      }
      if (modelInitConfig) {
        store.commit("BIM_INIT_CONFIG", modelInitConfig);
      }
      if (webUrlConfig) {
        store.commit("WEB_URL_CONFIG", webUrlConfig);
      }
      if (dangerousRock) {
        store.commit("DANGEROUS_ROCK", dangerousRock);
      }
      if (progressShowList) {
        store.commit("PROGRESS_SHOW_LIST", progressShowList);
      }
      if (videoConfig) {
        store.commit("VIDEO_URL_CONFIG", videoConfig);
      }
      if (minioConfig) {
        store.commit("MINIO_URL_CONFIG", minioConfig);
      }
      if (customizedFilterunits) {
        store.commit("CUSTOMIZED_FILTER_UNITS", customizedFilterunits);
      }
    } finally {
      if (typeof callback === "function") {
        callback();
      }
      heatbeat.start();
    }
  },
  getLoginedPath() {
    return INDEX_HOMEPAGE_PATH;
  },
};
