import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";

const state = {
  loginInfo: {},
  token: getToken(),
  name: "",
  avatar: "",
  introduction: "",
  roles: [],
  permissions: [],
  credentials: null,
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_INTRODUCTION(state, introduction) {
    state.introduction = introduction;
  },
  SET_NAME(state, name) {
    state.name = name;
  },
  SET_AVATAR(state, avatar) {
    state.avatar = avatar;
  },
  SET_ROLES(state, roles) {
    state.roles = roles;
  },
  SET_USERINFO(state, loginInfo) {
    state.loginInfo = loginInfo;
  },
  SET_AUTH(state, permissions) {
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
      login({ username: username.trim(), password, kaptcha })
        .then((response) => {
          if (response.success) {
            const token = response.data && response.data.token;
            if (token) {
              setToken(token);
              commit("SET_TOKEN", token);
            }
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
            reject("Verification failed, please login again.");
            return;
          }
          commit("SET_USERINFO", data);
          const permissions = data.permissions || [];
          commit("SET_AUTH", permissions);
          dispatch("permission/generateRoutes", permissions, { root: true });
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          removeToken();
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

  setCredentials({ commit }, credentials) {
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
