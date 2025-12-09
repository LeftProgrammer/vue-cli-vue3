import Layout from "@/layout";
const route = {
  path: "/construction",
  component: Layout,
  redirect: "/construction/plan",
  name: "construction",
  meta: {
    title: "进度管理",
    icon: "icon-design",
    auth: "construction",
  },
  children: [
    {
      path: "plan",
      component: () => import("@/views/construction/plan/index.vue"),
      name: "plan",
      meta: { title: "进度计划", auth: "plan" },
    },
    {
      path: "report",
      component: () => import("@/views/construction/report/index.vue"),
      name: "report",
      meta: { title: "进度填报", auth: "report" },
    },
    {
      path: "bim",
      component: () => import("@/views/construction/bim/index.vue"),
      name: "bim",
      meta: { title: "进度展示", auth: "bim" },
    },
  ],
};
export default route;
