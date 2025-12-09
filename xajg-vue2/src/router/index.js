import Vue from "vue";
import VueRouter from "vue-router";
import synth from "./modules/synth";
import dashboard from "./modules/dashboard";
import project from "./modules/project";
import system from "./modules/system";
import diy from "./modules/diy";
import design from "./modules/design";
import common from "./modules/common";
import progressImage from "./modules/progressImage";
import progressManagement from "./modules/progress";
import projectManagement from "./modules/projectManagement";
import ComprehensiveOffice from "./modules/ComprehensiveOffice";
import safetyManagement from "./modules/safetyManagement";
import qualitySafetyManagement from "./modules/qualitySafetyManagement";
import designChanges from "./modules/designChanges";
import indx from "./modules/index";
import monitor from "./modules/monitor";
import custom from "./modules/custom";
import bimQuery from "./modules/bimQuery";
import constract from "./modules/constract";
import measure from "./modules/measure";
import archives from "./modules/archives";
import construction from "./modules/construction";
import blast from "./modules/blast";
import appbim from "./modules/appbim";
import apph5 from "./modules/apph5";
import contract from "@/router/modules/contract";
import investment from "@/router/modules/investment";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
    // 加载
  },

  {
    path: "/workbench",
    component: () => import("@/views/workbench/index.vue"),
    hidden: true,
    // 加载
  },

  {
    path: "/mdgHome",
    name: "mdgHome",
    component: () => import("@/views/mdgHome/index.vue"),
    hidden: true,
    meta: { title: "雄安门户", auth: "build", icon: "icon-juece" },
  },
  {
    path: "/largeScreen",
    name: "largeScreen",
    component: () => import("@/views/largeScreen/index.vue"),
    hidden: true,
    meta: { title: "雄安门户", auth: "build", icon: "icon-juece" },
  },

  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true,
  },
  {
    path: "/bimView",
    component: () => import("@/views/bimView/index"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true,
  },
  {
    path: "/",
    redirect: "/homeIndex/index",
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/screen/home.vue"),
    hidden: true,
    meta: { title: "门户", auth: "build", icon: "icon-juece" },
  },
  {
    path: "/password",
    name: "password",
    component: () => import("@/views/Password/index.vue"),
    hidden: true,
    meta: { title: "修改密码", auth: "build" },
  },
  {
    path: "/common/view",
    name: "common-view",
    component: () => import("@/views/common/view/index.vue"),
    hidden: true,
    meta: { title: "预览", auth: "build" },
  },
  // {
  //   path: "/ntko",
  //   name: "ntko",
  //   component: () => import("@/views/common/ntko/index.vue"),
  //   hidden: true,
  // },
];

export const asyncRoutes = [
  bimQuery,
  dashboard,
  synth,
  project,
  projectManagement,
  system,
  design,
  diy,
  common,
  progressImage,
  progressManagement,
  ComprehensiveOffice,
  safetyManagement,
  qualitySafetyManagement,
  indx,
  designChanges,
  monitor,
  custom,
  constract,
  measure,
  archives,
  blast,
  appbim,
  apph5,
  contract,
  investment,
  construction,
];

// 解决重复点击导航路由报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const router = new VueRouter({
  routes: [...routes, ...asyncRoutes],
});
export default router;
