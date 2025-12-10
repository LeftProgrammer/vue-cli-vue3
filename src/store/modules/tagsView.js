const state = {
  visitedViews: [],
  cachedViews: [],
};

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    let hasview = state.visitedViews.some((v) => v.path === view.path);
    if (view.path === "/customTable") {
      // 针对 customTable 页面不同的传参将被标识为不同的页面, 采用 fullPath 做判断
      hasview = state.visitedViews.some((v) => v.fullPath === view.fullPath);
    }
    if (hasview) return;
    const _view = Object.assign({}, view, {
      title: view.query?.name || view.meta?.title || "no-name",
    });
    // 不是首页
    if (!view?.meta?.ishome) {
      _view.ishome = false;
      state.visitedViews.push(_view);
    } else {
      _view.ishome = true;
      state.visitedViews.splice(0, 0, _view);
    }
  },
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view.name)) return;
    if (!view.meta || !view.meta.noCache) {
      state.cachedViews.push(view.name);
    }
  },

  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.fullPath === view.fullPath) {
        state.visitedViews.splice(i, 1);
        break;
      }
    }
  },
  DEL_CACHED_VIEW: (state, view) => {
    const index = state.cachedViews.indexOf(view.name);
    if (index > -1) {
      state.cachedViews.splice(index, 1);
    }
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter((v) => {
      return v.meta?.affix || v.fullPath === view.fullPath;
    });
  },
  DEL_OTHERS_CACHED_VIEWS: (state, view) => {
    const index = state.cachedViews.indexOf(view.name);
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1);
    } else {
      state.cachedViews = [];
    }
  },

  DEL_ALL_VISITED_VIEWS: (state) => {
    // 保留 affix 标签
    const affixTags = state.visitedViews.filter((tag) => tag.meta && tag.meta.affix);
    state.visitedViews = affixTags;
  },
  DEL_ALL_CACHED_VIEWS: (state) => {
    state.cachedViews = [];
  },

  UPDATE_VISITED_VIEW: (state, view) => {
    for (let i = 0; i < state.visitedViews.length; i += 1) {
      const v = state.visitedViews[i];
      if (v.fullPath === view.fullPath) {
        state.visitedViews.splice(i, 1, Object.assign({}, v, view));
        break;
      }
    }
  },
};

const actions = {
  addView({ dispatch }, view) {
    dispatch("addVisitedView", view);
    dispatch("addCachedView", view);
  },
  addVisitedView({ commit }, view) {
    commit("ADD_VISITED_VIEW", view);
  },
  addCachedView({ commit }, view) {
    commit("ADD_CACHED_VIEW", view);
  },

  delView({ dispatch, state }, view) {
    return new Promise((resolve) => {
      dispatch("delVisitedView", view);
      dispatch("delCachedView", view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews],
      });
    });
  },
  delVisitedView({ commit, state }, view) {
    return new Promise((resolve) => {
      commit("DEL_VISITED_VIEW", view);
      resolve([...state.visitedViews]);
    });
  },
  delCachedView({ commit, state }, view) {
    return new Promise((resolve) => {
      commit("DEL_CACHED_VIEW", view);
      resolve([...state.cachedViews]);
    });
  },

  delOthersViews({ dispatch, state }, view) {
    return new Promise((resolve) => {
      dispatch("delOthersVisitedViews", view);
      dispatch("delOthersCachedViews", view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews],
      });
    });
  },
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise((resolve) => {
      commit("DEL_OTHERS_VISITED_VIEWS", view);
      resolve([...state.visitedViews]);
    });
  },
  delOthersCachedViews({ commit, state }, view) {
    return new Promise((resolve) => {
      commit("DEL_OTHERS_CACHED_VIEWS", view);
      resolve([...state.cachedViews]);
    });
  },

  delAllViews({ dispatch, state }, view) {
    return new Promise((resolve) => {
      dispatch("delAllVisitedViews", view);
      dispatch("delAllCachedViews", view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews],
      });
    });
  },
  delAllVisitedViews({ commit, state }) {
    return new Promise((resolve) => {
      commit("DEL_ALL_VISITED_VIEWS");
      resolve([...state.visitedViews]);
    });
  },
  delAllCachedViews({ commit, state }) {
    return new Promise((resolve) => {
      commit("DEL_ALL_CACHED_VIEWS");
      resolve([...state.cachedViews]);
    });
  },

  updateVisitedView({ commit }, view) {
    commit("UPDATE_VISITED_VIEW", view);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
