// const menulist = require('./menu.json')
import { getSystemMenu } from "@/api/user";
import { todoStat } from "@/api/flow";
import { MENU_INDEX } from "@/store/mutation-types";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(permissions, menu) {
  return permissions.includes(menu.permCode);
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, permissions) {
  const res = [];
  if (routes) {
    routes.forEach((route) => {
      const tmp = { ...route };
      if (hasPermission(permissions, tmp)) {
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, permissions);
        } else {
          tmp.meta = {
            title: tmp.name,
          };
        }
        tmp.todoCount = 0;
        res.push(tmp);
      }
    });
  }
  return res;
}

const state = {
  menuRoutes: [],
  hasLarge: false,
};

const mutations = {
  SET_MENU_ROUTES: (state, routes) => {
    state.menuRoutes = routes;
  },
  CLEAR_MENU_ROUTES: (state) => {
    state.menuRoutes = [];
  },
  SET_HAS_LARGE: (state, hasLarge) => {
    state.hasLarge = hasLarge;
  },
};

const actions = {
  async generateRoutes({ commit }, permissions) {
    if (state.menuRoutes.length === 0) {
      // 获取系统资源树
      const { data: menus, success } = await getSystemMenu();
      if (success) {
        const accessedRoutes = filterAsyncRoutes(
          menus[MENU_INDEX].children,
          permissions
        );
        // 判断是否有大屏权限
        const hasLarge = permissions.includes("large");
        commit("SET_HAS_LARGE", hasLarge);
        console.log("todoStat generateRoutes 1");
        todoStat(accessedRoutes);
        commit("SET_MENU_ROUTES", accessedRoutes);
      }
    }
  },
  clearMenuRoutes({ commit }) {
    commit("CLEAR_MENU_ROUTES");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
