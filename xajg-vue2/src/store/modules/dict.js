import { getDictItemList } from "@/api/dict";
import { Message } from "element-ui";
const state = {};

const mutations = {
  SET_DICT: (state, { dictCode, data }) => {
    state[dictCode] = data;
  },
};

const actions = {
  // user login
  get({ commit, state, dispatch }, dictCode) {
    // console.log("get dictCode", dictCode);
    return new Promise((resolve, reject) => {
      let dictData = state[dictCode];
      if (dictData) {
        resolve(dictData);
      } else {
        getDictItemList(dictCode)
          .then((response) => {
            let { data, success, message } = response;
            if (success) {
              commit("SET_DICT", { dictCode, data });
              resolve(data);
            }
            else {
              Message.warning(message);
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
