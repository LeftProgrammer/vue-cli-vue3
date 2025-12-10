import { createRouter, createWebHashHistory } from "vue-router";

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
