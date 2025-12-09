import Layout from "@/layout";
const route = {
  path: "/ProgressManagement",
  component: Layout,
  redirect: "/ProgressManagement/ConstructionLog",
  name: "ProgressManagement",
  meta: {
    title: "进度与施工",
    icon: "icon-design",
    auth: "ProgressManagement",
  },
  children: [
    {
      path: "ConstructionLog",
      component: () => import("@/views/ProgressManagement/ConstructionLog/index.vue"),
      name: "ConstructionLog",
      meta: { title: "施工日志", auth: "ProgressManagement" },
    },
    {
      path: "SupervisionLog",
      component: () => import("@/views/ProgressManagement/SupervisionLog/index.vue"),
      name: "SupervisionLog",
      meta: { title: "监理日志", auth: "SupervisionLog" },
    },
    {
      path: "ProgressPlan",
      component: () => import("@/views/ProgressManagement/ProgressPlan/index.vue"),
      name: "ProgressPlan",
      meta: { title: "进度计划", auth: "SupervisionLog" },
    },
  ],
}
export default route;
