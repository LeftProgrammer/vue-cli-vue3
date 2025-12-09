import Layout from "@/layout";
const route = {
  path: "/progress",
  component: Layout,
  redirect: "/progress/ConstructionLog",
  name: "progress",
  meta: {
    title: "进度与施工",
    icon: "icon-design",
    auth: "progress",
  },
  children: [
    {
      path: "ConstructionLog",
      component: () => import("@/views/progress/ConstructionLog/index.vue"),
      name: "ConstructionLog",
      meta: { title: "施工日志", auth: "progress" },
    },
    {
      path: "ConstructionLogV3",
      component: () => import("@/views/progress/ConstructionLog/index-v3.vue"),
      name: "ConstructionLogV3",
      meta: { title: "施工日志V3", auth: "progress" },
    },
    {
      path: "SupervisionLog",
      component: () => import("@/views/progress/SupervisionLog/index.vue"),
      name: "SupervisionLog",
      meta: { title: "监理日志", auth: "SupervisionLog" },
    },
    {
      path: 'PlanRecord',
      component: () => import('@/views/progress/PlanRecord/index.vue'),
      name: 'PlanRecord',
      meta: { title: '计划台账', auth: 'PlanRecord' }
    },
    {
      path: 'ProgressPlan',
      component: () => import('@/views/progress/ProgressPlan/index.vue'),
      name: 'ProgressPlan',
      meta: { title: '进度计划', auth: 'ProgressPlan', planType: 1 }
    },
    {
      path: 'MonthPlan',
      component: () => import('@/views/progress/ProgressPlan/index.vue'),
      name: 'MonthPlan',
      meta: { title: '月度计划', auth: 'MonthPlan', planType: 2 }
    },
    {
      path: 'TotalPlan',
      component: () => import('@/views/progress/ProgressPlan/index.vue'),
      name: 'TotalPlan',
      meta: { title: '总计划', auth: 'TotalPlan', planType: 3 }
    },
    {
      path: 'quarter',
      component: () => import('@/views/progress/quarter/index.vue'),
      name: 'quarter',
      meta: { title: '季度进度计划', auth: 'quarter', planType: 4 }
    },
    {
      path: "mock",
      component: () => import("@/views/progress/mock/index.vue"),
      name: "mock",
      meta: { title: "进度计划分析", auth: "mock" },
    },
    {
      path: "compare",
      component: () => import("@/views/progress/compare/index.vue"),
      name: "compare",
      meta: { title: "进度对比", auth: "compare" },
    },
  ],
};
export default route;
