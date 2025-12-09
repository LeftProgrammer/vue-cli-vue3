import Layout from "@/layout";
const route = {
  path: "/homeIndex",
  component: Layout,
  redirect: "/homeIndex/index",
  name: "homeIndex",
  meta: {
    title: "工作中心",
    affix: true,
  },
  children: [
    {
      path: "index",
      component: () => import("@/views/home/index.vue"),
      // component: () => import("@/views/inDevelopment/index.vue"),
      name: "home",
      meta: { title: "首页", auth: "home", affix: true, ishome: true },
    },
    {
      path: "inDevelopment",
      component: () => import("@/views/inDevelopment/index.vue"),
      name: "inDevelopment",
      meta: { title: "", auth: "inDevelopment", affix: true },
    },
  ],
};
export default route;
