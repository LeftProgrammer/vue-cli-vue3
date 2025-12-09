/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout";

const route = {
  path: "/office",
  component: Layout,
  redirect: "/office/designSendDoc",
  name: "dashboard",
  meta: {
    title: "综合办公",
    icon: "",
    auth: "office",
  },
  children: [
    {
      path: "ownerSendDoc",
      component: () => import("@/views/office/ownerSendDocument/index.vue"),
      name: "ownerSendDoc",
      meta: {
        title: "业主单位发文", auth: "ownerSendDoc", unitType: 4,
        documentType: 2,
      },
    },
    {
      path: "ownerReceiveDoc",
      component: () => import("@/views/office/ownerReceiveDocument/index.vue"),
      name: "ownerReceiveDoc",
      meta: {
        title: "业主单位收文", auth: "ownerReceiveDoc", unitType: 4,
        documentType: 1,
      },
    },

    // let unitType = 2 // 监理 设计 施工 业主 第三方  type 1 2 3 4 5
    // let documentType = 2 //1收文2发文
    {
      // third-party
      path: "designSendDoc",
      component: () => import("@/views/office/SendDocument/index.vue"),
      name: "designSendDoc",
      meta: {
        title: "设计单位发文",
        auth: "designSendDoc",
        unitType: 2,
        documentType: 2,
      },
    },
    {
      path: "designReceiveDoc",
      component: () => import("@/views/office/ReceiveDocument/index.vue"),
      name: "designReceiveDoc",
      meta: {
        title: "设计单位收文",
        auth: "designReceiveDoc",
        unitType: 2,
        documentType: 1,
      },
    },
    {
      path: "constructionSendDoc",
      component: () => import("@/views/office/SendDocument/index.vue"),
      name: "constructionSendDoc",
      meta: {
        title: "施工单位发文",
        auth: "constructionSendDoc",
        unitType: 3,
        documentType: 2,
      },
    },
    {
      path: "constructionReceiveDoc",
      component: () => import("@/views/office/ReceiveDocument/index.vue"),
      name: "constructionReceiveDoc",
      meta: {
        title: "施工单位收文",
        auth: "constructionReceiveDoc",
        unitType: 3,
        documentType: 1,
      },
    },
    {
      path: "supervisionSendDoc",
      component: () => import("@/views/office/SendDocument/index.vue"),
      name: "supervisionSendDoc",
      meta: {
        title: "监理单位发文",
        auth: "supervisionSendDoc",
        unitType: 1,
        documentType: 2,
      },
    },
    {
      path: "supervisionReceiveDoc",
      component: () => import("@/views/office/ReceiveDocument/index.vue"),
      name: "supervisionReceiveDoc",
      meta: {
        title: "监理单位收文",
        auth: "supervisionReceiveDoc",
        unitType: 1,
        documentType: 1,
      },
    },
    {
      path: "thirdPartySendDoc",
      component: () => import("@/views/office/SendDocument/index.vue"),
      name: "thirdPartySendDoc",
      meta: {
        title: "第三方发文",
        auth: "thirdPartySendDoc",
        unitType: 5,
        documentType: 2,
      },
    },
    {
      path: "thirdPartyReceiveDoc",
      component: () => import("@/views/office/ReceiveDocument/index.vue"),
      name: "thirdPartyReceiveDoc",
      meta: {
        title: "第三方收文",
        auth: "thirdPartyReceiveDoc",
        unitType: 5,
        documentType: 1,
      },
    },
    {
      path: "educationalTraining/dataManagement",
      component: () =>
        import("@/views/office/educationalTraining/dataManagement/index.vue"),
      name: "dataManagement",
      meta: { title: "资料管理", auth: "dataManagement" },
    },
    {
      path: "educationalTraining/trainingProgram",
      component: () =>
        import("@/views/office/educationalTraining/trainingProgram/index.vue"),
      name: "trainingProgram",
      meta: { title: "培训计划", auth: "trainingProgram" },
    },
    {
      path: "educationalTraining/trainingRecord",
      component: () =>
        import("@/views/office/educationalTraining/trainingRecord/index.vue"),
      name: "trainingRecord",
      meta: { title: "培训台账", auth: "trainingRecord" },
    },
    {
      path: "comprehensiveOfficeQuery",
      component: () =>
        import("@/views/office/comprehensiveOfficeQuery/index.vue"),
      name: "comprehensiveOfficeQuery",
      meta: { title: "综合办公查询", auth: "comprehensiveOfficeQuery" },
    },
    {
      path: "fundAllocation",
      component: () => import("@/views/office/fundAllocation/index.vue"),
      name: "fundAllocation",
      meta: { title: "资金调拨", auth: "fundAllocation" },
    },
    {
      path: "todoStat",
      component: () => import("@/views/office/todoStat/index.vue"),
      name: "todoStat",
      meta: { title: "待办统计", auth: "todoStat" },
    },
  ],
};

export default route
