import { createStore } from "vuex";
import user from "./modules/user";
import dict from "./modules/dict";
import permission from "./modules/permission";
import tagsView from "./modules/tagsView";
import bim from "./modules/bim";
import getters from "./getters";

const SESSION_KEYS = {
  API_URL: "API_URL",
  MODEL_URL: "MODEL_URL",
  BIM_SECRETKEY: "BIM_SECRETKEY",
  MODEL_INPUT: "MODEL_INPUT",
  CAD_INPUT: "CAD_INPUT",
  BIM_INIT_CONFIG: "BIM_INIT_CONFIG",
  WEB_URL_CONFIG: "WEB_URL_CONFIG",
  DANGEROUS_ROCK: "DANGEROUS_ROCK",
  PROGRESS_SHOW_LIST: "PROGRESS_SHOW_LIST",
  MINIO_URL_CONFIG: "MINIO_URL_CONFIG",
  VIDEO_URL_CONFIG: "VIDEO_URL_CONFIG",
  NTKO_URL_CONFIG: "NTKO_URL_CONFIG",
  SYSTEM_CONFIG: "SYSTEM_CONFIG",
  CUSTOMIZED_FILTER_UNITS: "CUSTOMIZED_FILTER_UNITS",
};

function getSetValue(v) {
  if (typeof v === "object") {
    return JSON.stringify(v);
  }
  return v;
}

function getGetValue(v) {
  let r;
  try {
    r = JSON.parse(v);
  } catch (e) {
    r = v;
  }
  return r;
}

const store = createStore({
  modules: {
    user,
    dict,
    permission,
    tagsView,
    bim,
  },
  state: {
    baseUrl: getGetValue(sessionStorage.getItem(SESSION_KEYS.API_URL)) || undefined,
    modelUrl: getGetValue(sessionStorage.getItem(SESSION_KEYS.MODEL_URL)) || "",
    modelInput: getGetValue(sessionStorage.getItem(SESSION_KEYS.MODEL_INPUT)) || undefined,
    cadInput: getGetValue(sessionStorage.getItem(SESSION_KEYS.CAD_INPUT)) || undefined,
    webUrlConfig: getGetValue(sessionStorage.getItem(SESSION_KEYS.WEB_URL_CONFIG)) || undefined,
    bimInitConfig: getGetValue(sessionStorage.getItem(SESSION_KEYS.BIM_INIT_CONFIG)) || undefined,
    minioConfig: getGetValue(sessionStorage.getItem(SESSION_KEYS.MINIO_URL_CONFIG)) || undefined,
    videoConfig: getGetValue(sessionStorage.getItem(SESSION_KEYS.VIDEO_URL_CONFIG)) || undefined,
    ntkoConfig: getGetValue(sessionStorage.getItem(SESSION_KEYS.NTKO_URL_CONFIG)) || undefined,
    systemConfig: getGetValue(sessionStorage.getItem(SESSION_KEYS.SYSTEM_CONFIG)) || undefined,
    progressShowList: getGetValue(sessionStorage.getItem(SESSION_KEYS.PROGRESS_SHOW_LIST)) || undefined,
    dangerousRock: getGetValue(sessionStorage.getItem(SESSION_KEYS.DANGEROUS_ROCK)) || undefined,
    customizedFilterunits: getGetValue(sessionStorage.getItem(SESSION_KEYS.CUSTOMIZED_FILTER_UNITS)) || [],
    bimSecretKey: getGetValue(sessionStorage.getItem(SESSION_KEYS.BIM_SECRETKEY)) || undefined,
  },
  mutations: {
    API_URL(state, baseUrl) {
      state.baseUrl = baseUrl;
      sessionStorage.setItem(SESSION_KEYS.API_URL, getSetValue(baseUrl));
    },
    MODEL_URL(state, modelUrl) {
      state.modelUrl = modelUrl;
      sessionStorage.setItem(SESSION_KEYS.MODEL_URL, getSetValue(modelUrl));
    },
    MODEL_INPUT(state, modelInput) {
      state.modelInput = modelInput;
      sessionStorage.setItem(SESSION_KEYS.MODEL_INPUT, getSetValue(modelInput));
    },
    CAD_INPUT(state, cadInput) {
      state.cadInput = cadInput;
      sessionStorage.setItem(SESSION_KEYS.CAD_INPUT, getSetValue(cadInput));
    },
    BIM_INIT_CONFIG(state, bimInitConfig) {
      state.bimInitConfig = bimInitConfig;
      sessionStorage.setItem(SESSION_KEYS.BIM_INIT_CONFIG, getSetValue(bimInitConfig));
    },
    WEB_URL_CONFIG(state, webUrlConfig) {
      state.webUrlConfig = webUrlConfig;
      sessionStorage.setItem(SESSION_KEYS.WEB_URL_CONFIG, getSetValue(webUrlConfig));
    },
    DANGEROUS_ROCK(state, dangerousRock) {
      state.dangerousRock = dangerousRock;
      sessionStorage.setItem(SESSION_KEYS.DANGEROUS_ROCK, getSetValue(dangerousRock));
    },
    PROGRESS_SHOW_LIST(state, progressShowList) {
      state.progressShowList = progressShowList;
      sessionStorage.setItem(SESSION_KEYS.PROGRESS_SHOW_LIST, getSetValue(progressShowList));
    },
    MINIO_URL_CONFIG(state, minioConfig) {
      state.minioConfig = minioConfig;
      sessionStorage.setItem(SESSION_KEYS.MINIO_URL_CONFIG, getSetValue(minioConfig));
    },
    VIDEO_URL_CONFIG(state, videoConfig) {
      state.videoConfig = videoConfig;
      sessionStorage.setItem(SESSION_KEYS.VIDEO_URL_CONFIG, getSetValue(videoConfig));
    },
    NTKO_URL_CONFIG(state, ntkoConfig) {
      state.ntkoConfig = ntkoConfig;
      sessionStorage.setItem(SESSION_KEYS.NTKO_URL_CONFIG, getSetValue(ntkoConfig));
    },
    SYSTEM_CONFIG(state, systemConfig) {
      state.systemConfig = systemConfig;
      sessionStorage.setItem(SESSION_KEYS.SYSTEM_CONFIG, getSetValue(systemConfig));
    },
    CUSTOMIZED_FILTER_UNITS(state, customizedFilterunits) {
      state.customizedFilterunits = customizedFilterunits || [];
      sessionStorage.setItem(
        SESSION_KEYS.CUSTOMIZED_FILTER_UNITS,
        getSetValue(state.customizedFilterunits)
      );
    },
    BIM_SECRETKEY(state, bimSecretKey) {
      state.bimSecretKey = bimSecretKey;
      sessionStorage.setItem(SESSION_KEYS.BIM_SECRETKEY, getSetValue(bimSecretKey));
    },
  },
  actions: {},
  getters,
});

export default store;
