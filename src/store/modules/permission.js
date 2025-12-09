import { getSystemMenu } from "@/api/user";
import { MENU_INDEX } from "@/store/mutation-types";

function hasPermission(permissions, menu) {
  if (!permissions || !permissions.length || !menu) return false;
  return permissions.includes(menu.permCode);
}

export function filterAsyncRoutes(routes, permissions) {
  const res = [];
  if (routes && routes.length) {
    routes.forEach((route) => {
      const tmp = { ...route };
      if (hasPermission(permissions, tmp)) {
        if (tmp.children && tmp.children.length) {
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
  SET_MENU_ROUTES(state, routes) {
    state.menuRoutes = routes || [];
  },
  CLEAR_MENU_ROUTES(state) {
    state.menuRoutes = [];
  },
  SET_HAS_LARGE(state, hasLarge) {
    state.hasLarge = hasLarge;
  },
};

const actions = {
  async generateRoutes({ commit, state }, permissions) {
    if (state.menuRoutes.length > 0) {
      return;
    }
    const { data: menus, success } = await getSystemMenu();
    if (!success || !menus || !menus.length) {
      return;
    }
    const root = menus[MENU_INDEX] || menus[0];
    const children = (root && root.children) || [];
    const accessedRoutes = filterAsyncRoutes(children, permissions || []);
    const hasLarge = (permissions || []).includes("large");
    commit("SET_HAS_LARGE", hasLarge);
    commit("SET_MENU_ROUTES", accessedRoutes);
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
