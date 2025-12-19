import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import heatbeat from "@/utils/heatbeat";
import { socket } from "@/utils/socket";

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
        .then(response => {
          if (response.success) {
            const token = response.data && response.data.token;
            if (token) {
              setToken(token);
              commit("SET_TOKEN", token);
              try {
                socket.connect && socket.connect();
              } catch (e) {
                void e;
              }
              try {
                heatbeat.start();
              } catch (e) {
                void e;
              }
            }
          }
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response;
          if (!data) {
            reject("Verification failed, please login again.");
            return;
          }
          commit("SET_USERINFO", data);
          try {
            window.localStorage.setItem("userInfo", JSON.stringify(data || {}));
          } catch (e) {
            void e;
          }
          const permissions = data.permissions || [];
          commit("SET_AUTH", permissions);

          dispatch("permission/generateRoutes", permissions, { root: true })
            .then(() => {
              try {
                return dispatch("permission/injectDynamicRoutes", null, { root: true });
              } catch (e) {
                void e;
                return null;
              }
            })
            .catch(() => {
              try {
                return dispatch("permission/injectDynamicRoutes", null, { root: true });
              } catch (e) {
                void e;
                return null;
              }
            })
            .finally(() => {
              resolve(data);
            });
        })
        .catch(error => {
          reject(error);
        });
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
          try {
            window.localStorage.removeItem("userInfo");
          } catch (e) {
            void e;
          }
          try {
            dispatch("tagsView/delAllViews", null, { root: true });
          } catch (e) {
            void e;
          }
          try {
            dispatch("permission/clearMenuRoutes", null, { root: true });
          } catch (e) {
            void e;
          }
          resolve();
        })
        .catch(error => {
          reject(error);
        })
        .finally(() => {
          try {
            heatbeat.clear();
          } catch (e) {
            void e;
          }
          try {
            socket.disconnect && socket.disconnect();
          } catch (e) {
            void e;
          }
        });
    });
  },

  // remove token
  resetToken({ commit, dispatch }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      try {
        window.localStorage.removeItem("userInfo");
      } catch (e) {
        void e;
      }
      try {
        dispatch("tagsView/delAllViews", null, { root: true });
      } catch (e) {
        void e;
      }
      try {
        dispatch("permission/clearMenuRoutes", null, { root: true });
      } catch (e) {
        void e;
      }
      try {
        heatbeat.clear();
      } catch (e) {
        void e;
      }
      try {
        socket.disconnect && socket.disconnect();
      } catch (e) {
        void e;
      }
      resolve();
    });
  },

  setCredentials({ commit }, credentials) {
    return new Promise(resolve => {
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
