import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import bim from "./modules/bim";
import cad from "./modules/cad";

Vue.use(Vuex);

const types = {
  SHOW_PARTICLE: "SHOW_PARTICLE",
  ISHOME_LOGINEDPATH: "ISHOME_LOGINEDPATH",
  API_URL: "API_URL",
  MODEL_URL: "MODEL_URL", //模型地址
  BIM_SECRETKEY: "BIM_SECRETKEY", //bim秘钥
  MODEL_INPUT: "MODEL_INPUT",
  CAD_INPUT: "CAD_INPUT",
  BIM_INIT_CONFIG: "BIM_INIT_CONFIG",
  WEB_URL_CONFIG: "WEB_URL_CONFIG",
  DANGEROUS_ROCK: "DANGEROUS_ROCK",//首页进度展示数据 危岩体
  PROGRESS_SHOW_LIST: "PROGRESS_SHOW_LIST",//首页进度展示数据
  MINIO_URL_CONFIG: "MINIO_URL_CONFIG",
  VIDEO_URL_CONFIG: "VIDEO_URL_CONFIG",
  NTKO_URL_CONFIG: "NTKO_URL_CONFIG",
  SYSTEM_CONFIG: "SYSTEM_CONFIG",
  CUSTOMIZED_FILTER_UNITS: 'CUSTOMIZED_FILTER_UNITS'
};

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context("./modules", true, /\.js$/);

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

let getSetValue = (v) => {
  if (typeof v === "object") {
    return JSON.stringify(v)
  }
  return v;
}

let getGetValue = (v) => {
  let r;
  try {
    r = JSON.parse(v);
  } catch (error) {
    r = v;
  }
  return r;
}

const store = new Vuex.Store({
  modules,
  state: {
    baseUrl: getGetValue(sessionStorage.getItem(types.API_URL)) || undefined,
    modelUrl: getGetValue(sessionStorage.getItem(types.MODEL_URL)) || "",
    modelInput: getGetValue(sessionStorage.getItem(types.MODEL_INPUT)) || undefined,
    cadInput: getGetValue(sessionStorage.getItem(types.CAD_INPUT)) || undefined,
    webUrlConfig: getGetValue(sessionStorage.getItem(types.WEB_URL_CONFIG)) || undefined,
    bimInitConfig: getGetValue(sessionStorage.getItem(types.BIM_INIT_CONFIG)) || undefined,
    minioConfig: getGetValue(sessionStorage.getItem(types.MINIO_URL_CONFIG)) || undefined,
    videoConfig: getGetValue(sessionStorage.getItem(types.VIDEO_URL_CONFIG)) || undefined,
    ntkoConfig: getGetValue(sessionStorage.getItem(types.NTKO_URL_CONFIG)) || undefined,
    systemConfig: getGetValue(sessionStorage.getItem(types.SYSTEM_CONFIG)) || undefined,
    progressShowList: getGetValue(sessionStorage.getItem(types.PROGRESS_SHOW_LIST)) || undefined,
    dangerousRock: getGetValue(sessionStorage.getItem(types.DANGEROUS_ROCK)) || undefined,
    customizedFilterunits: getGetValue(sessionStorage.getItem(types.CUSTOMIZED_FILTER_UNITS)) || [],
  },
  mutations: {
    [types.SHOW_PARTICLE]: (state, showParticle) => {
      state.showParticle = showParticle;
      sessionStorage.setItem(types.SHOW_PARTICLE, getSetValue(showParticle))
    },
    [types.ISHOME_LOGINEDPATH]: (state, isHome_LoginedPath) => {
      state.isHome_LoginedPath = isHome_LoginedPath;
      sessionStorage.setItem(types.ISHOME_LOGINEDPATH, getSetValue(isHome_LoginedPath))
    },
    [types.API_URL]: (state, baseUrl) => {
      state.baseUrl = baseUrl;
      sessionStorage.setItem(types.API_URL, getSetValue(baseUrl))
    },
    [types.MODEL_URL]: (state, modelUrl) => {
      state.modelUrl = modelUrl;
      sessionStorage.setItem(types.MODEL_URL, getSetValue(modelUrl))
    },
    [types.BIM_SECRETKEY]: (state, bimSecretkey) => {
      bim.state.defaults.secretkey = bimSecretkey;
      cad.state.defaults.secretkey = bimSecretkey;
      sessionStorage.setItem(types.BIM_SECRETKEY, getSetValue(bimSecretkey))
    },
    [types.MODEL_INPUT]: (state, modelInput) => {
      state.modelInput = modelInput;
      sessionStorage.setItem(types.MODEL_INPUT, getSetValue(modelInput))
    },
    [types.CAD_INPUT]: (state, cadInput) => {
      state.cadInput = cadInput;
      sessionStorage.setItem(types.CAD_INPUT, getSetValue(cadInput))
    },
    [types.BIM_INIT_CONFIG]: (state, bimInitConfig) => {
      state.bimInitConfig = bimInitConfig;
      sessionStorage.setItem(types.BIM_INIT_CONFIG, getSetValue(bimInitConfig))
    },
    [types.WEB_URL_CONFIG]: (state, webUrlConfig) => {
      state.webUrlConfig = webUrlConfig;
      sessionStorage.setItem(types.WEB_URL_CONFIG, getSetValue(webUrlConfig))
    },
    [types.DANGEROUS_ROCK]: (state, dangerousRock) => {
      state.dangerousRock = dangerousRock;
      sessionStorage.setItem(types.DANGEROUS_ROCK, getSetValue(dangerousRock))
    },
    [types.PROGRESS_SHOW_LIST]: (state, progressShowList) => {
      state.progressShowList = progressShowList;
      sessionStorage.setItem(types.PROGRESS_SHOW_LIST, getSetValue(progressShowList))
    },
    [types.MINIO_URL_CONFIG]: (state, minioConfig) => {
      state.minioConfig = minioConfig;
      sessionStorage.setItem(types.MINIO_URL_CONFIG, getSetValue(minioConfig))
    },
    [types.VIDEO_URL_CONFIG]: (state, videoConfig) => {
      state.videoConfig = videoConfig;
      sessionStorage.setItem(types.VIDEO_URL_CONFIG, getSetValue(videoConfig))
    },
    [types.NTKO_URL_CONFIG]: (state, ntkoConfig) => {
      state.ntkoConfig = ntkoConfig;
      sessionStorage.setItem(types.NTKO_URL_CONFIG, getSetValue(ntkoConfig))
    },
    [types.SYSTEM_CONFIG]: (state, systemConfig) => {
      console.log(`mutations state ${types.SYSTEM_CONFIG}`, systemConfig)
      state.systemConfig = systemConfig;
      sessionStorage.setItem(types.SYSTEM_CONFIG, getSetValue(systemConfig))
    },
    [types.CUSTOMIZED_FILTER_UNITS]: (state, customizedFilterunits) => {
      state.customizedFilterunits = customizedFilterunits;
      sessionStorage.setItem(types.CUSTOMIZED_FILTER_UNITS, getSetValue(customizedFilterunits))
    },

  },
  actions: {},
  getters,
});

export default store;
