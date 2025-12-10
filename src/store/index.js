import { createStore } from "vuex";
import user from "./modules/user";
import dict from "./modules/dict";
import permission from "./modules/permission";
import tagsView from "./modules/tagsView";
import getters from "./getters";

const store = createStore({
  modules: {
    user,
    dict,
    permission,
    tagsView,
  },
  state: {
    baseUrl: undefined,
    modelUrl: "",
    modelInput: undefined,
    cadInput: undefined,
    webUrlConfig: undefined,
    bimInitConfig: undefined,
    minioConfig: undefined,
    videoConfig: undefined,
    ntkoConfig: undefined,
    systemConfig: undefined,
    progressShowList: undefined,
    dangerousRock: undefined,
    customizedFilterunits: [],
    bimSecretKey: undefined,
  },
  mutations: {
    API_URL(state, baseUrl) {
      state.baseUrl = baseUrl;
    },
    MODEL_URL(state, modelUrl) {
      state.modelUrl = modelUrl;
    },
    MODEL_INPUT(state, modelInput) {
      state.modelInput = modelInput;
    },
    CAD_INPUT(state, cadInput) {
      state.cadInput = cadInput;
    },
    BIM_INIT_CONFIG(state, bimInitConfig) {
      state.bimInitConfig = bimInitConfig;
    },
    WEB_URL_CONFIG(state, webUrlConfig) {
      state.webUrlConfig = webUrlConfig;
    },
    DANGEROUS_ROCK(state, dangerousRock) {
      state.dangerousRock = dangerousRock;
    },
    PROGRESS_SHOW_LIST(state, progressShowList) {
      state.progressShowList = progressShowList;
    },
    MINIO_URL_CONFIG(state, minioConfig) {
      state.minioConfig = minioConfig;
    },
    VIDEO_URL_CONFIG(state, videoConfig) {
      state.videoConfig = videoConfig;
    },
    NTKO_URL_CONFIG(state, ntkoConfig) {
      state.ntkoConfig = ntkoConfig;
    },
    SYSTEM_CONFIG(state, systemConfig) {
      state.systemConfig = systemConfig;
    },
    CUSTOMIZED_FILTER_UNITS(state, customizedFilterunits) {
      state.customizedFilterunits = customizedFilterunits || [];
    },
    BIM_SECRETKEY(state, bimSecretKey) {
      state.bimSecretKey = bimSecretKey;
    },
  },
  actions: {},
  getters,
});

export default store;
