import { getDictItemList } from "@/api/dict";
import { ElMessage } from "element-plus";

const state = {};

const mutations = {
  SET_DICT(state, { dictCode, data }) {
    state[dictCode] = data;
  },
};

const actions = {
  // 获取并缓存某个字典类型
  get({ commit, state }, dictCode) {
    return new Promise((resolve, reject) => {
      const dictData = state[dictCode];
      if (dictData) {
        resolve(dictData);
      } else {
        getDictItemList(dictCode)
          .then((response) => {
            const { data, success, message } = response || {};
            if (success) {
              commit("SET_DICT", { dictCode, data });
              resolve(data || []);
            } else {
              if (message) {
                ElMessage.warning(message);
              }
              resolve([]);
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
