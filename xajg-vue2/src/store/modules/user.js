import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { loadLoginCurrent } from "@szgc/plt-core";
import base from "@/common/js/base";

const state = {
  loginInfo: {},
  token: getToken(),
  name: "",
  avatar: "",
  introduction: "",
  roles: [],
  permissions: [],
  credentials: null, // 存储账号密码的对象
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_USERINFO: (state, loginInfo) => {
    state.loginInfo = loginInfo;
  },
  SET_AUTH: (state, permissions) => {
    state.permissions = permissions;
  },
  setCredentials(state, credentials) {
    state.credentials = credentials;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, kaptcha } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, kaptcha })
        .then((response) => {
          console.log("login", response);
          // setToken(ACCESS_TOKEN);
          if (response.success) {
            setToken(response.data?.token);
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response;
          if (!data) {
            reject("Verification failed, please Login again.");
          }
          base.setStorage("userInfo", data);
          commit("SET_USERINFO", data);

          commit("SET_AUTH", data.permissions);
          dispatch("permission/generateRoutes", data.permissions, {
            root: true,
          });
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });

      loadLoginCurrent();
    });
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          removeToken();
          dispatch("tagsView/delAllViews", null, { root: true });
          dispatch("permission/clearMenuRoutes");

          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },

  //
  setCredentials({ commit }, credentials) {
    // 调用 mutation 将账号密码信息存储在 Vuex 中
    return new Promise((resolve) => {
      commit("setCredentials", credentials);
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
