import { createRouter, createWebHashHistory } from "vue-router";
import diyRoute from "./modules/diy";

const Login = () => import("@/views/login/index.vue");
const Layout = () => import("@/layout/index.vue");
const HomeIndex = () => import("@/views/homeIndex/index.vue");
const Password = () => import("@/views/password/index.vue");
const NotFound = () => import("@/views/error-page/404.vue");

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { hidden: true },
  },
  {
    path: "/homeIndex",
    component: Layout,
    redirect: "/homeIndex/index",
    children: [
      {
        path: "index",
        name: "homeIndex",
        component: HomeIndex,
        meta: { title: "首页" },
      },
    ],
  },
  {
    path: "/common",
    component: Layout,
    redirect: "/common/message",
    children: [
      {
        path: "message",
        name: "common-message",
        component: () => import("@/views/common/message/index.vue"),
        meta: { title: "我的消息" },
      },
      {
        path: "flow",
        name: "common-flow",
        component: () => import("@/views/common/flow/index.vue"),
        meta: { title: "待办事项" },
      },
      {
        path: "bim",
        name: "common-bim",
        component: () => import("@/views/common/bim/index.vue"),
        meta: { title: "BIM" },
      },
    ],
  },
  // {
  //   path: "/safetyManagement",
  //   component: Layout,
  //   redirect: "/safetyManagement/area",
  //   children: [
  //     {
  //       path: "area",
  //       name: "safety-area",
  //       component: () => import("@/views/safetyManagement/area/index.vue"),
  //       meta: { title: "危险区域维护" },
  //     },
  //   ],
  // },
  {
    path: "/common/view",
    name: "common-view",
    component: () => import("@/views/common/view/index.vue"),
    meta: { hidden: true },
  },
  {
    path: "/password",
    name: "password",
    component: Password,
    meta: { hidden: true },
  },
  {
    path: "/404",
    name: "404",
    component: NotFound,
    meta: { hidden: true },
  },
  {
    path: "/",
    redirect: "/homeIndex/index",
  },
  // DIY路由 - 流程配置系统加载表单页面
  diyRoute,
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
