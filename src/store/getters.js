const getters = {
  loginInfo: (state) => state.user && state.user.loginInfo,
  permissions: (state) => state.user && state.user.permissions,
  menuRoutes: (state) => state.permission && state.permission.menuRoutes,
  dictOptions: (state) => state.dict || {},
  hasLarge: (state) => state.permission && state.permission.hasLarge,
  visitedViews: (state) => state.tagsView && state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView && state.tagsView.cachedViews,
  permission_routes: (state) => state.permission && state.permission.routes,

  baseUrl: (state) => state.baseUrl,
  modelUrl: (state) => state.modelUrl,
  getCredentials: (state) => state.user && state.user.credentials,
};

export default getters;
