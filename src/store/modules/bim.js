import leftClick from "./bim/leftClick";
import mouseMove from "./bim/mouseMove";
import { getcookie, setcookie } from "@/utils/bimengine/util";
import { getFloorStructureTree } from "@/components/BimEngine/api/document";
import { getClampById } from "@/components/BimEngine/api/combine";

const types = {
  LEFT_CLICK_TYPE: "LEFT_CLICK_TYPE", //点击事件类型
  LEFT_CLICK_POSITION: "LEFT_CLICK_POSITION", //点击事件位置
  LEFT_CLICK_CALLBACKS: "LEFT_CLICK_CALLBACKS", //点击事件回调列表
  SET_IS_TABLE: "SET_IS_TABLE", //点击事件回调列表
  ClipConfig: "ClipConfig", //剖切相关配置
  SunshineTime: "SunshineTime",
  ModelEffect: "ModelEffect",
  ConfigurationItem: "ConfigurationItem",
  CustomViewpointList: "CustomViewpointList",
  FeatureOffectList: "FeatureOffectList",
  FeatureRotateList: "FeatureRotateList",
};

let getGetValue = (v) => {
  // 如果值为 null、undefined 或空字符串，直接返回空字符串
  if (!v || v === 'null' || v === 'undefined') {
    return '';
  }
  let r;
  try {
    r = JSON.parse(v);
  } catch (error) {
    r = v;
  }
  return r;
};

function getQueryParams(modelid, modelname, pid) {
  return {
    modelid: modelid,
    modelname: modelname,
    Pid: pid,
    LightweightName: modelid,
  };
}

let _modelids = [];
async function getRecursiveFetchModelData(data, commit) {
  let modelId = data.modelid || data.LightweightName;
  let query = getQueryParams(modelId, data.modelname, data.Pid || "RootNode");

  let jsonData = JSON.stringify(query);

  if (typeof query.modelid !== "number" && query.modelid.indexOf("-") >= 0) {
    console.log("getFloorStructureTree 111", query.modelid, query, data);
  }

  let res = await getFloorStructureTree(query);
  if (res && res.datas && res.datas.length > 0) {
    let datas = res.datas.sort((a, b) => {
      return a.id - b.id;
    });

    commit("SET_FLOORSTRUCTURETREE", {
      key: jsonData,
      value: datas,
    });

    commit("SET_MODELMAPDATAS", {
      modelid: modelId,
      array: datas,
    });

    commit("SET_MODELMAPDATAS_GLID2ITEM", {
      modelid: modelId,
      array: datas,
    });

    commit("SET_FEATUREDATAMAP", {
      modelid: modelId,
      array: datas,
    });

    for (let i = 0; i < datas.length; i++) {
      let item = datas[i];
      item.modelname = query.modelname;
      item.modelid = query.modelid;
      if (item.externalId === "0" && item.glid) {
        query.Pid = item.glid;
        await getRecursiveFetchModelData(query, commit);
      } else {
        if (!_modelids.includes(modelId)) {
          _modelids.push(modelId);
        }
        commit("SET_ModelDataInitedIds", modelId);
      }
    }
  }
}

const bim = {
  namespaced: true,
  state: {
    defaults: {
      container: undefined,
      showfps: false,
      openterrain: false,
      openearth: false,
      imageryprovider: "tianditu_image",
      maxspaceerror: 2000,
      loading: false,
      navigation: false,
      editmode: true,
      searchbox: false,
      mapbox: false,
      bgcolor: "#87CEFA",
      sitepath: "/static/Cesium/",
      loadAnimation: false,
      secretkey: getGetValue(sessionStorage.getItem("BIM_SECRETKEY")) || "",
      throughwall: true,
      isRequestWebgl2: true,
      colorBlendMode: 2,
    },
    isTable: getcookie("isTable") ? JSON.parse(getcookie("isTable")).isTable : true,
    modelTree: [],
    left_click_type: 1,
    left_click_position: undefined,
    callbacks: {},
    clipSet: undefined,
    sunshineTime: 780,
    modelEffect: {
      contrastRatio: 0.0,
      saturationValue: 0.0,
      exposureValue: 0.0,
    },
    customViewpointList: [],
    featureOffectList: [],
    featureRotateList: [],
    modelTreeDatas: new Map(),
    modelMapDatas: new Map(),
    modelMapDatas_glid2item: new Map(),
    modelDataInitedIds: [],
    featureDataMap: new Map(),
    modelList: [],
  },
  getters: {
    getLeftClickType: (state) => state.left_click_type,
  },
  mutations: {
    [types.LEFT_CLICK_TYPE]: (state, click_type) => {
      state.left_click_type = click_type;
    },
    [types.LEFT_CLICK_CALLBACKS]: (state, { click_type, callback }) => {
      if (typeof callback === "function") state.callbacks[click_type] = callback;
    },
    [types.LEFT_CLICK_POSITION]: (state, position) => {
      state.left_click_position = position;
    },
    [types.ClipConfig]: (state, data) => {
      state.clipSet = data;
    },
    [types.SunshineTime]: (state, data) => {
      state.sunshineTime = data;
    },
    [types.ModelEffect]: (state, data) => {
      state.modelEffect = data;
    },
    [types.ConfigurationItem]: (state, data) => {
      Object.assign(state.defaults, data);
    },
    [types.SET_IS_TABLE]: (state, info) => {
      state.isTable = info;
    },
    [types.CustomViewpointList]: (state, data) => {
      state.customViewpointList = data;
    },
    [types.FeatureOffectList]: (state, data) => {
      state.featureOffectList = data;
    },
    [types.FeatureRotateList]: (state, data) => {
      state.featureRotateList = data;
    },
    SET_FLOORSTRUCTURETREE: (state, { key, value }) => {
      if (!state.modelTreeDatas) {
        state.modelTreeDatas = new Map();
      }
      if (!state.modelTreeDatas.has(key)) {
        state.modelTreeDatas.set(key, value);
      }
    },
    SET_MODELMAPDATAS: (state, { modelid, array }) => {
      if (!state.modelMapDatas) {
        state.modelMapDatas = new Map();
      }
      const map = state.modelMapDatas;
      for (let i = 0; i < array.length; i++) {
        const row = array[i];
        if (!row.code) {
          row._name = row.name;
          if (row._name && row._name.indexOf("|") >= 0) {
            row.code = row._name.split("|")[0];
            row.name = row._name.split("|")[1];
            row.modelid = modelid;
          } else {
            row.code = row.name;
          }
        }
        if (row.code) {
          map.set(modelid + "^" + row.code, row);
        }
      }
      state.modelMapDatas = map;
    },
    SET_MODELMAPDATAS_GLID2ITEM: (state, { modelid, array }) => {
      if (!state.modelMapDatas_glid2item) {
        state.modelMapDatas_glid2item = new Map();
      }
      const map = state.modelMapDatas_glid2item;
      for (let i = 0; i < array.length; i++) {
        const row = array[i];
        row.modelid = modelid;

        if (!row.code) {
          row._name = row.name;
          if (row._name && row._name.indexOf("|") >= 0) {
            row.code = row._name.split("|")[0];
            row.name = row._name.split("|")[1];
            row.modelid = modelid;
          } else {
            row.code = row.name;
          }
        }
        if (row.code) {
          map.set(modelid + "^" + row.glid, row);
        }
      }
      state.modelMapDatas_glid2item = map;
    },
    SET_FEATUREDATAMAP: (state, { modelid, array }) => {
      if (!state.featureDataMap) {
        state.featureDataMap = new Map();
      }
      const map = state.featureDataMap;
      const list = map.get(modelid) || [];
      list.push(...array);
      map.set(modelid, Array.from(new Set(list)));
      state.featureDataMap = map;
    },
    SET_ModelDataInitedIds: (state, modelid) => {
      if (!state.modelDataInitedIds.includes(modelid)) {
        state.modelDataInitedIds.push(modelid);
      }
    },
    SET_ModelList: (state, model) => {
      if (!state.modelList.includes(model)) {
        state.modelList.push(model);
      }
    },
  },
  actions: {
    setConfigurationItem({ commit }, data) {
      commit(types.ConfigurationItem, data);
    },
    setLeftClickType({ commit }, { click_type, callback }) {
      commit(types.LEFT_CLICK_TYPE, click_type);
      commit(types.LEFT_CLICK_CALLBACKS, { click_type, callback });
    },
    resetLeftClick({ commit }) {
      commit(types.LEFT_CLICK_TYPE, 1);
    },
    setIsTable({ commit }, info) {
      setcookie("isTable", JSON.stringify({ isTable: info }));
      commit(types.SET_IS_TABLE, info);
    },
    setLeftClick({ commit, state }, $api) {
      $api.Public.Event("LEFT_CLICK", (click) => {
        commit(types.LEFT_CLICK_POSITION, click.position);
        if (typeof state.callbacks[state.left_click_type] === "function") {
          state.callbacks[state.left_click_type](click.position);
        }
      });
    },
    setClipConfig({ commit }, data) {
      commit(types.ClipConfig, data);
    },
    setSunshineTime({ commit }, data) {
      commit(types.SunshineTime, data);
    },
    setModelEffect({ commit }, data) {
      commit(types.ModelEffect, data);
    },
    setCustomViewpointList({ commit }, data) {
      commit(types.CustomViewpointList, data);
    },
    setFeatureOffectList({ commit }, data) {
      commit(types.FeatureOffectList, data);
    },
    setFeatureRotateList({ commit }, data) {
      commit(types.FeatureRotateList, data);
    },
    getStructureItem({ state }, bimCode) {
      return new Promise((resolve) => {
        if (!bimCode) {
          resolve({});
          return;
        }
        if (!state.modelMapDatas) {
          resolve({});
          return;
        }
        const modelItem = state.modelMapDatas;
        let item = {};
        if (modelItem.has(bimCode)) {
          item = modelItem.get(bimCode);
        }
        resolve(item);
      });
    },
    getStructureItemByGlid({ state }, bimCode) {
      return new Promise((resolve) => {
        if (!bimCode) {
          resolve({});
          return;
        }
        if (!state.modelMapDatas_glid2item) {
          resolve({});
          return;
        }
        const modelItem = state.modelMapDatas_glid2item;
        let item = {};
        if (modelItem.has(bimCode)) {
          item = modelItem.get(bimCode);
        }
        resolve(item);
      });
    },
    getFloorStructure({ commit, state }, data) {
      let modelName = data.modelname,
        dataId = data.dataid,
        modelId = data.modelid;
      return new Promise((resolve) => {
        if (!modelName) {
          resolve([]);
          return;
        }
        let query = getQueryParams(dataId, modelName, data.Pid || "RootNode");
        let jsonData = JSON.stringify(query);

        if (state.modelTreeDatas.has(jsonData)) {
          resolve(state.modelTreeDatas.get(jsonData));
        } else {
          getFloorStructureTree(query).then((res) => {
            if (res && res.datas && res.datas.length > 0) {
              let datas = res.datas.sort((a, b) => {
                return a.id - b.id;
              });
              commit("SET_FLOORSTRUCTURETREE", {
                key: jsonData,
                value: datas,
              });

              commit("SET_MODELMAPDATAS", {
                modelid: modelId,
                array: datas,
              });

              commit("SET_MODELMAPDATAS_GLID2ITEM", {
                modelid: modelId,
                array: datas,
              });

              commit("SET_FEATUREDATAMAP", {
                modelid: modelId,
                array: datas,
              });

              for (let i = 0; i < datas.length; i++) {
                let item = datas[i];
                if (item.externalId === "0" && item.glid) {
                  // 父级
                } else {
                  commit("SET_ModelDataInitedIds", modelId);
                }
              }

              resolve(datas);
            } else {
              resolve([]);
            }
          });
        }
      });
    },
    getFloorStructureTree({ dispatch }, data) {
      dispatch("getFloorStructure", data).then((resdata) => {
        if (resdata && resdata.length > 0) {
          for (let i = 0; i < resdata.length; i++) {
            const item = resdata[i];
            let query = { ...data };
            if (item.externalId === "0" && item.glid) {
              query.Pid = item.glid;
              dispatch("getFloorStructureTree", query);
            }
          }
        }
      });
    },
    initModelData({ commit }, { id, isCombineId }) {
      if (isCombineId) {
        getClampById(id).then((res) => {
          if (res.combineDetails.length > 0) {
            for (let i = 0; i < res.combineDetails.length; i++) {
              let model = {
                name: res.combineDetails[i].document.modelName,
                id: res.combineDetails[i].document.id,
                docName: res.combineDetails[i].document.docName,
                suffix: res.combineDetails[i].document.suffix,
                docType: res.combineDetails[i].document.docType,
                matrix: JSON.parse(res.combineDetails[i].matrix),
                checked: true,
              };
              commit("SET_ModelList", model);

              let query = getQueryParams(model.id, model.name, "RootNode");
              getRecursiveFetchModelData(query, commit);
            }
          }
        });
      }
    },
    initTheModelData({ commit }, model) {
      let query = getQueryParams(model.dataid, model.modelname, "RootNode");
      getRecursiveFetchModelData(query, commit);
    },
    getModelIds({ state }) {
      return state.modelDataInitedIds;
    },
    getFeatureDatas({ state }, modelid) {
      return state.featureDataMap.get(modelid);
    },
  },
  modules: {
    leftClick,
    mouseMove,
  },
};

export default bim;
