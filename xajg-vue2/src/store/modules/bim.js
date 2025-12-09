import leftClick from "./bim/leftClick";
import mouseMove from "./bim/mouseMove";
import { getcookie, setcookie } from "@/utils/bimengine/util";
import { getFloorStructureTree } from "@/components/BimEngine/api/document";
import { getClampById } from "@/components/BimEngine/api/combine";
import { set } from "nprogress";
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

  // console.log("getRecursiveFetchModelDataQuery start", modelId, query)

  // {
  //   modelid: modelid,
  //   modelname: data.modelname,
  //   Pid: data.Pid || "RootNode",
  //   LightweightName: data.LightweightName,
  // };
  let jsonData = JSON.stringify(query);

  if (typeof query.modelid !== "number" && query.modelid.indexOf("-") >= 0) {
    console.log("getFloorStructureTree 111", query.modelid, query, data)
  }

  let res = await getFloorStructureTree(query);
  if (res && res.datas && res.datas.length > 0) {
    let datas = res.datas.sort((a, b) => {
      return a.id - b.id;
    });
    // state.modelTreeDatas.set(data, res.datas);

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
    })

    // console.log("SET_FEATUREDATAMAP modelId 1", modelId, data)
    commit("SET_FEATUREDATAMAP", {
      modelid: modelId,
      array: datas,
    });

    for (let i = 0; i < datas.length; i++) {
      let item = datas[i];
      item.modelname = query.modelname;
      item.modelid = query.modelid;
      //有子级
      if (item.externalId === "0" && item.glid) {
        query.Pid = item.glid;
        // console.log("getRecursiveFetchModelDataQuery 3", data, JSON.stringify(query));
        await getRecursiveFetchModelData(query, commit);
      } else {
        if (!_modelids.includes(modelId)) {
          // console.log("_modelids", _modelids);
          _modelids.push(modelId);
        }
        commit("SET_ModelDataInitedIds", modelId);
      }
    }
  } else {
    // console.log("获取数据为空", query, res);
  }
}

const bim = {
  namespaced: true,
  state: {
    defaults: {
      //模型默认设置
      container: undefined,
      showfps: false,
      openterrain: false, //地形
      openearth: false, //gis
      imageryprovider: "tianditu_image", //[可选]gis底图
      maxspaceerror: 2000,
      loading: false, //[可选]gis模式加载动画
      navigation: false,
      editmode: true,
      searchbox: false, //[可选]gis场景生效，gis场景下影像搜索显示
      mapbox: false, //[可选]gis场景生效，gis场景下影像切换显示
      // imageryprovider: "arcgis_image",
      // webglAlpha: true,
      bgcolor: "#87CEFA",
      sitepath: "/static/Cesium/",
      loadAnimation: false, //启用模型加载动画
      secretkey: getGetValue(sessionStorage.getItem("BIM_SECRETKEY")) || "",
      //secretkey: process.env.VUE_APP_BIM_SECRETKEY,
      throughwall: true, //[可选]相机是否穿墙
      isRequestWebgl2: true, //[可选]是否使用webgl2进行渲染
      colorBlendMode: 2, //0:HIGHLIGHT 1:REPLACE 2:MIX
    },
    isTable: getcookie("isTable")
      ? JSON.parse(getcookie("isTable")).isTable
      : true, //图模列表样式
    modelTree: [], //模型树
    left_click_type: 1, //1设备详情 2漫游 3巡检 4测量体积 5隐藏构件 6透明构件 7透明模型 8隐藏模型 9添加巡检点 10构件尺寸 11构件表面积
    left_click_position: undefined, //点击事件位置
    callbacks: {}, //回调事件
    clipSet: undefined,
    sunshineTime: 780, //日照时间，根据业务调整
    modelEffect: {
      contrastRatio: 0.0, //对比度
      saturationValue: 0.0, //饱和度
      exposureValue: 0.0, //曝光度
    },
    customViewpointList: [],
    featureOffectList: [], //构件偏移数组
    featureRotateList: [], //构件旋转数组

    /**模型的树形构件Map数据 */
    modelTreeDatas: new Map(),
    /**模型的构件Map数据：modelid^code->item */
    modelMapDatas: new Map(),
    /**模型的构件Map数据：modelid^glid->item */
    modelMapDatas_glid2item: new Map(),
    /**模型加载的id列表 */
    modelDataInitedIds: [],
    /**模型的构件数据Map，key：modelid，value：feature列表 */
    featureDataMap: new Map(),
    /**模型加载的列表 */
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
      if (typeof callback === "function")
        state.callbacks[click_type] = callback;
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
    // //模型加载参数时进行初始化
    // SET_MODELDATAINIT: (state, { id, isCombineId }) => {
    //   arguments[1].default.actions.initModelData()
    // },
    SET_FLOORSTRUCTURETREE: (state, { key, value }) => {
      if (!state.modelTreeDatas) {
        state.modelTreeDatas = new Map();
      }

      if (!state.modelTreeDatas.has(key)) {
        state.modelTreeDatas.set(key, value);
      }
      // //设置属性
      // Object.defineProperty(value, "parent", { enumerable: false })
      // Object.defineProperty(value, "children", { enumerable: false }) 

      // let exist = false; //判断是否存在
      // state.modelTreeDatas.forEach((itemValue, itemKey) => {
      //   try {
      //     if (JSON.stringify(itemValue) === JSON.stringify(value)) {
      //       exist = true;
      //     }
      //   } catch (error) {
      //     console.error("JSON.stringify error", error, itemValue, value)
      //   }
      // });
      // if (!exist) {
      //   state.modelTreeDatas.set(key, valueJson);
      // }
    },
    /**设置模型的构件map,modelid:{id:item} */
    SET_MODELMAPDATAS: (state, { modelid, array }) => {
      let map;
      if (!state.modelMapDatas) {
        state.modelMapDatas = new Map();
      }
      map = state.modelMapDatas;
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
          // let value = {
          //   code: row.code,
          //   dataid: row.dataid,
          //   externalId: row.externalId,
          //   glid: row.glid,
          //   groupname: row.groupname,
          //   id: row.id,
          //   level: row.level,
          //   modelid: row.modelid,
          //   name: row.name,
          //   pGlid: row.pGlid,
          //   _name: row._name
          // }
          /**不同的model中，code可以相同，需要加上modelid */
          map.set(modelid + "^" + row.code, row);
        }
      }
      state.modelMapDatas = map;
    },
    /**设置模型的构件map,modelid:{id:item} */
    SET_MODELMAPDATAS_GLID2ITEM: (state, { modelid, array }) => {
      let map;
      if (!state.modelMapDatas_glid2item) {
        state.modelMapDatas_glid2item = new Map();
      }
      map = state.modelMapDatas_glid2item;
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
          // let value = {
          //   code: row.code,
          //   dataid: row.dataid,
          //   externalId: row.externalId,
          //   glid: row.glid,
          //   groupname: row.groupname,
          //   id: row.id,
          //   level: row.level,
          //   modelid: row.modelid,
          //   name: row.name,
          //   pGlid: row.pGlid,
          //   _name: row._name
          // }
          /**不同的model中，code可以相同，需要加上modelid */
          map.set(modelid + "^" + row.glid, row);
        }
      }
      state.modelMapDatas_glid2item = map;
    },
    /**设置构件map,modelid:[item] */
    SET_FEATUREDATAMAP: (state, { modelid, array }) => {
      let map;
      if (!state.featureDataMap) {
        state.featureDataMap = new Map();
      }
      map = state.featureDataMap;

      let list = map.get(modelid) || []
      list.push(...array);

      map.set(modelid, Array.from(new Set(list)));

      state.featureDataMap = map; //.set(modelid, map);
      // }
    },
    SET_ModelDataInitedIds: (state, modelid) => {
      if (!state.modelDataInitedIds.includes(modelid)) {
        state.modelDataInitedIds.push(modelid);
        // console.log(" state.modelDataInitedIds", state.modelDataInitedIds);
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
    resetLeftClick({ commit, state }) {
      commit(types.LEFT_CLICK_TYPE, 1);
    },
    setIsTable({ commit, state }, info) {
      setcookie("isTable", JSON.stringify({ isTable: info }));
      commit(types.SET_IS_TABLE, info);
    },
    setLeftClick({ commit, state }, $api) {
      $api.Public.Event("LEFT_CLICK", (click) => {
        commit(types.LEFT_CLICK_POSITION, click.position);
        if (typeof state.callbacks[state.left_click_type] === "function")
          state.callbacks[state.left_click_type](click.position);
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
    getStructureItem({ commit, state, dispatch }, bimCode) {
      // let modelName = data.name,
      //   modelId = data.id;
      // if (!modelName) {
      //   return {};
      // }
      // console.log("getStructureItem", bimCode)
      return new Promise((resolve) => {
        if (!bimCode) {
          resolve({});
        }
        if (!state.modelMapDatas) {
          resolve({});
        }
        let modelItem = state.modelMapDatas;
        let item = {};
        if (modelItem.has(bimCode)) {
          item = modelItem.get(bimCode)
        }
        resolve(item);
      });
    },
    getStructureItemByGlid({ commit, state, dispatch }, bimCode) {
      // let modelName = data.name,
      //   modelId = data.id;
      // if (!modelName) {
      //   return {};
      // }
      // console.log("getStructureItem", bimCode)
      return new Promise((resolve) => {
        if (!bimCode) {
          resolve({});
        }
        if (!state.modelMapDatas_glid2item) {
          resolve({});
        }
        let modelItem = state.modelMapDatas_glid2item;
        let item = {};
        if (modelItem.has(bimCode)) {
          item = modelItem.get(bimCode)
        }
        resolve(item);
      });
    },
    //一级一级加载
    getFloorStructure({ commit, state, dispatch }, data) {
      let modelName = data.modelname,
        dataId = data.dataid,
        modelId = data.modelid;
      return new Promise((resolve) => {
        // console.log("getFloorStructure", modelName, data)
        if (!modelName) {
          resolve([]);
        }
        let query = getQueryParams(dataId, modelName, data.Pid || "RootNode");
        // {
        //   modelid: modelId,
        //   modelname: modelName,
        //   Pid: data.Pid || "RootNode",
        //   LightweightName: modelName,
        // };
        let jsonData = JSON.stringify(query);

        // console.log("getFloorStructureTree", jsonData);

        if (state.modelTreeDatas.has(jsonData)) {
          let datas = state.modelTreeDatas.get(jsonData);

          resolve(datas);
        } else {

          // if (typeof query.modelid !== "number" && query.modelid.indexOf("-") >= 0) {
          //   console.log("getFloorStructureTree 222",query.modelid,query)
          // }

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
              })

              // console.log("SET_FEATUREDATAMAP modelId 2", modelId)
              commit("SET_FEATUREDATAMAP", {
                modelid: modelId,
                array: datas,
              });

              // state.modelTreeDatas.set(data, res.datas);

              for (let i = 0; i < datas.length; i++) {
                let item = datas[i];
                // item.modelname = query.modelname;
                // item.modelid = query.modelid;
                if (item.externalId === "0" && item.glid) {
                  //当前为父级节点，有子级
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
    //加载模型数据，递归实现层级
    getFloorStructureTree({ commit, state, dispatch }, data) {
      this.dispatch("bim/getFloorStructure", data).then((resdata) => {
        if (resdata && resdata.length > 0) {
          for (let i = 0; i < resdata.length; i++) {
            const item = resdata[i];
            let query = { ...data };
            //有子级
            if (item.externalId === "0" && item.glid) {
              query.Pid = item.glid;
              this.dispatch("bim/getFloorStructureTree", query);
            } else {
              // commit("SET_ModelDataInitedIds", data.id)
            }
          }
        }
      });
    },
    //加载模型的数据，做缓存
    initModelData({ commit, state, dispatch }, { id, isCombineId }) {
      if (isCombineId) {
        getClampById(id).then((res) => {
          if (res.combineDetails.length > 0) {
            let reqArr = [];
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
              // {
              //   modelid: model.id,
              //   modelname: model.name,
              //   Pid: "RootNode",
              //   LightweightName: model.name,
              // };
              // console.log("getRecursiveFetchModelDataQuery 1", JSON.stringify(query), model);
              getRecursiveFetchModelData(query, commit);
              // this.dispatch("bim/getFloorStructureTree", model);
              // {
              //   model: model, cd: () => {

              //   }
              // })
              // reqArr.push(this.dispatch("bim/getFloorStructureTree", model));
            }
            // Promise.all(reqArr).then(ress => {

            // })
          }
        });
      }
    },
    //加载模型的数据，做缓存
    initTheModelData({ commit, state, dispatch }, model) {
      let query = getQueryParams(model.dataid, model.modelname, "RootNode");
      // console.log("getRecursiveFetchModelDataQuery 2", model, JSON.stringify(query));
      getRecursiveFetchModelData(query, commit);
    },
    getModelIds({ commit, state, dispatch }) {
      return state.modelDataInitedIds;
    },
    /**通过模型id获取数据 */
    getFeatureDatas({ commit, state, dispatch }, modelid) {
      // console.log("getFeatureDatas", modelid)
      // if (state.featureDataMap.has(modelid)) {
      return state.featureDataMap.get(modelid);
      // }
      // return null;
    }
  },
  modules: {
    leftClick,
    mouseMove,
  },
};

export default bim;
