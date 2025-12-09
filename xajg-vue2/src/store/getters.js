const getters = {
  loginInfo: (state) => state.user.loginInfo,
  permissions: (state) => state.user.permissions,
  selectedStation: (state) => state.station.selectedStation,
  menuRoutes: (state) => state.permission.menuRoutes,
  dictOptions: (state) => state.dict,
  hasLarge: (state) => state.permission.hasLarge,

  baseUrl: state => state.baseUrl,
  modelUrl: state => state.modelUrl,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routes: state => state.permission.routes,
  getCredentials: (state) =>state.user.credentials
};
export default getters;
