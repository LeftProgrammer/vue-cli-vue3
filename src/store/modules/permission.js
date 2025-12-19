import { getSystemMenu } from "@/api/user";
import { todoStat } from "@/api/flow";
import { MENU_INDEX } from "@/store/mutation-types";
import router from "@/router";

const Layout = () => import("@/layout/index.vue");
const NotFoundView = () => import("@/views/error-page/404.vue");

const viewModules = require.context("@/views", true, /\.vue$/);

function normalizeInternalPath(p) {
  if (!p || typeof p !== "string") return "";
  const clean = p.split("?")[0].split("#")[0];
  if (!clean.startsWith("/")) return "";
  return clean;
}

function resolveViewByPath(routePath) {
  const p = String(routePath || "").replace(/^\//, "");
  const candidates = [`./${p}.vue`, `./${p}/index.vue`];
  for (let i = 0; i < candidates.length; i += 1) {
    const key = candidates[i];
    if (viewModules.keys().includes(key)) {
      return () => Promise.resolve(viewModules(key));
    }
  }
  return NotFoundView;
}

function walkMenuTree(nodes, visitor) {
  const list = nodes || [];
  for (let i = 0; i < list.length; i += 1) {
    const node = list[i];
    visitor && visitor(node);
    if (node && node.children && node.children.length) {
      walkMenuTree(node.children, visitor);
    }
  }
}

function hasPermission(permissions, menu) {
  if (!permissions || !permissions.length || !menu) return false;
  return permissions.includes(menu.permCode);
}

export function filterAsyncRoutes(routes, permissions) {
  const res = [];
  if (!routes || !routes.length) return res;

  routes.forEach((route) => {
    const tmp = { ...route };

    // 先递归过滤子节点
    if (tmp.children && tmp.children.length) {
      tmp.children = filterAsyncRoutes(tmp.children, permissions);
    }

    const hasChildren = tmp.children && tmp.children.length > 0;
    const allowedSelf = hasPermission(permissions, tmp);

    // 规则：父节点本身有权限，或者存在任一有权限的子节点，则保留父节点
    if (allowedSelf || hasChildren) {
      if (!hasChildren) {
        tmp.meta = {
          title: tmp.name,
        };
      }
      tmp.todoCount = 0;
      res.push(tmp);
    }
  });

  return res;
}

const state = {
  menuRoutes: [],
  routes: [],
  rawMenuRoutes: [],
  hasLarge: false,
  dynamicRoutesInjected: false,
};

const mutations = {
  SET_MENU_ROUTES(state, routes) {
    state.menuRoutes = routes || [];
    state.routes = routes || [];
  },
  SET_RAW_MENU_ROUTES(state, routes) {
    state.rawMenuRoutes = routes || [];
  },
  CLEAR_MENU_ROUTES(state) {
    state.menuRoutes = [];
    state.routes = [];
  },
  CLEAR_RAW_MENU_ROUTES(state) {
    state.rawMenuRoutes = [];
  },
  SET_HAS_LARGE(state, hasLarge) {
    state.hasLarge = hasLarge;
  },
  SET_DYNAMIC_ROUTES_INJECTED(state, injected) {
    state.dynamicRoutesInjected = !!injected;
  },
};

const actions = {
  async generateRoutes({ commit, state }, permissions) {
    if (state.menuRoutes.length > 0 && state.rawMenuRoutes.length > 0) {
      return;
    }
    const { data: menus, success } = await getSystemMenu();
    if (!success || !menus || !menus.length) {
      return;
    }
    const root = menus[MENU_INDEX] || menus[0];
    const children = (root && root.children) || [];
    commit("SET_RAW_MENU_ROUTES", children);
    const accessedRoutes = filterAsyncRoutes(children, permissions || []);
    const hasLarge = (permissions || []).includes("large");
    commit("SET_HAS_LARGE", hasLarge);
    commit("SET_MENU_ROUTES", accessedRoutes);

    try {
      await todoStat(accessedRoutes);
    } catch (e) {
      void e;
    }
  },
  async refreshTodoCount({ state }) {
    try {
      await todoStat(state.menuRoutes);
    } catch (e) {
      void e;
    }
  },
  injectDynamicRoutes({ state, commit }) {
    if (state.dynamicRoutesInjected) return;

    const existingPaths = new Set(
      (router.getRoutes() || []).map((r) => String(r.path || ""))
    );
    const injected = new Set();

    walkMenuTree(state.rawMenuRoutes, (node) => {
      if (!node) return;
      const permType = node.permType;
      if (!(permType === 0 || permType === 4)) return;
      const routePath = normalizeInternalPath(node.dataViewConfId);
      if (!routePath) return;
      if (existingPaths.has(routePath) || injected.has(routePath)) return;

      const viewComponent = resolveViewByPath(routePath);
      const permCode = node.permCode || node.value || node.id || routePath;
      const name = `dyn-${String(permCode)}`;
      const wrapperName = `dyn-wrapper-${String(permCode)}`;

      router.addRoute({
        path: routePath,
        name: wrapperName,
        component: Layout,
        children: [
          {
            path: "",
            name,
            component: viewComponent,
          },
        ],
      });

      injected.add(routePath);
    });

    commit("SET_DYNAMIC_ROUTES_INJECTED", true);
  },
  clearMenuRoutes({ commit }) {
    commit("CLEAR_MENU_ROUTES");
    commit("CLEAR_RAW_MENU_ROUTES");
    commit("SET_DYNAMIC_ROUTES_INJECTED", false);
    commit("SET_HAS_LARGE", false);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
