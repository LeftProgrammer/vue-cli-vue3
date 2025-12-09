import Layout from "@/layout";

const route = {
  path: "/investment",
  component: Layout,
  redirect: "/investment/plan",
  name: "investment",
  meta: {
    title: "投资管理",
    icon: "icon-design",
    auth: "investment",
  },
  children: [
    {
      path: "plan",
      component: () => import("@/views/investment/plan/index.vue"),
      name: "investmentPlan",
      meta: { title: "计划投资", auth: "investment" },
    },
    {
      path: "schedule",
      component: () => import("@/views/investment/schedule/index.vue"),
      name: "investmentSchedule",
      meta: { title: "投资计划", auth: "investment" },
    },
    {
      path: "estimate",
      component: () => import("@/views/investment/estimate/index.vue"),
      name: "estimate",
      meta: { title: "概算分类", auth: "investment" },
    },
    {
      path: "execute",
      component: () => import("@/views/investment/execute/index.vue"),
      name: "execute",
      meta: { title: "概算执行", auth: "investment" },
    },
    {
      path: "category",
      component: () => import("@/views/investment/category/index.vue"),
      name: "category",
      meta: { title: "投资分类", auth: "investment" },
    },
    {
      path: "real",
      component: () => import("@/views/investment/real/index.vue"),
      name: "investmentReal",
      meta: { title: "实际投资", auth: "investment" },
    },
    {
      path: "actual",
      component: () => import("@/views/investment/actual/index.vue"),
      name: "investmentActual",
      meta: { title: "投资申报", auth: "investment" },
    },
    {
      path: "summary",
      component: () => import("@/views/investment/summary/index.vue"),
      name: "investmentSummary",
      meta: { title: "投资汇总", auth: "investment" },
    },
    {
      path: "compare",
      component: () => import("@/views/investment/compare/index.vue"),
      name: "investmentCompare",
      meta: { title: "投资对比", auth: "investment" },
    },
  ],
};
export default route;
