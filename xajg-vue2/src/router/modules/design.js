import Layout from "@/layout";
import Empty from "@/layout/empty.vue";
const route = {
  path: "/design",
  component: Layout,
  redirect: "/design/center/plan",
  name: "design",
  meta: {
    title: "设计中心",
    icon: "icon-design",
    auth: "design",
  },
  children: [
    {
      path: "center/plan",
      component: () => import("@/views/design/center/plan/index.vue"),
      name: "designPlan",
      meta: { title: "供应计划", auth: "design", },
    },
    {
      path: "planEdit",
      component: () => import("@/views/design/center/planEdit/index.vue"),
      name: "planEdit",
      meta: { title: '供应计划修改', auth: 'design' }
    },
    {
      path: "center/drawingSupply",
      component: () => import("@/views/design/center/drawingSupply/index.vue"),
      name: "drawingSupply",
      meta: { title: "图纸供应", auth: "design" },
    },
    {
      path: "center/report2",
      component: () => import("@/views/design/center/report2/index.vue"),
      name: "report",
      meta: { title: "设计报告供应", auth: "design" },
    },
    {
      path: "ComprehensiveQuery",
      component: () => import("@/views/design/ComprehensiveQuery/index.vue"),
      name: "ComprehensiveQuery",
      meta: { title: "综合查询", auth: "design" },
    },
    {
      path: "center/ledger",
      component: () => import("@/views/design/center/ledger/index.vue"),
      name: "ledger",
      meta: { title: "供应台账", auth: "design" },
    },
    {
      path: "center/supplyPlanLedger",
      component: () => import("@/views/design/center/supplyPlanLedger/index.vue"),
      name: "supplyPlanLedger",
      meta: { title: "供应计划台账", auth: "design" },
    },
    {
      path: "center/drawingSend",
      component: () => import("@/views/design/center/drawingSend/index.vue"),
      name: "drawingSend",
      meta: { title: "图纸分发", auth: "design" },
    },
    {
      path: "DesignDisclosure",
      component: () => import("@/views/design/DesignDisclosure/index.vue"),
      name: "DesignDisclosure",
      meta: { title: '设计交底', auth: 'design' }
    },
    {
      path: "DesignApplication",
      component: () => import("@/views/design/DesignApplication/index.vue"),
      name: "DesignApplication",
      meta: { title: '设计应用', auth: 'design' }
    },
    {
      path: "hydroStandard",
      component: () => import("@/views/design/availabilityofResults/index.vue"),
      name: "hydroStandard",
      meta: { title: '成果供应-水电标', auth: 'design', pageType: '1', permCode: 'design-hydroStandard' }
    },
    {
      path: "campsiteMarker",
      component: () => import("@/views/design/availabilityofResults/index.vue"),
      name: "campsiteMarker",
      meta: { title: '成果供应-营地标', auth: 'design', pageType: '2', permCode: 'design-campsiteMarker' }
    },
    {
      path: "epcResult",
      component: () => import("@/views/design/epcResult/index.vue"),
      name: "epcResult",
      meta: { title: '成果供应-总包', auth: 'design', pageType: '3', permCode: 'design-epcResult' }
    },
    {
      path: "attachmentApply",
      component: () => import("@/views/design/attachmentApply/index.vue"),
      name: "attachmentApply",
      meta: { title: '相关批件办理', auth: 'design', pageType: '3', permCode: 'design-apply' }
    },
    {
      path: "result",
      component: () => import("@/views/design/result/index.vue"),
      name: "result",
      meta: { title: '', auth: 'design', pageType: '3', permCode: 'design-result' }
    },
    {
      path: "plan",
      component: () => import("@/views/design/plan/index.vue"),
      name: "plan",
      meta: { title: '', auth: 'design', pageType: '3', permCode: 'design-plan' }
    },
  ],
}
export default route;
