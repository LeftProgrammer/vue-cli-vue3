import Empty from "@/layout/empty.vue";

const route = {
  path: "/apph5",
  component: Empty,
  name: "apph5",
  meta: {
    title: "apph5模块",
    icon: "icon-demo",
    auth: "apph5",
  },
  children: [
    {
      path: "office/fundAllocation/dataForm",
      component: () => import("@/views/office/fundAllocation/dataFormH5.vue"),
      name: "apph5-dataFormH5",
      meta: {
        title: "资金调拨页面",
        auth: "fundAllocation",
        type: "APP",
        formpath: "/diy/office/fundAllocation/dataForm"
      },
    },
    {
      path: "design/plan/dataform",
      component: () => import("@/views/design/center/plan/dataformH5.vue"),
      name: "apph5-dataFormH5-appPlan",
      meta: {
        title: "计划报审页面",
        auth: "design",
        type: "APP",
        formpath: "/diy/appPlan"
      },
    },
    {
      path: "design/DesignDisclosure/dataform",
      component: () => import("@/views/design/DesignDisclosure/dataformH5.vue"),
      name: "apph5-dataFormH5-explain",
      meta: {
        title: "设计交底页面",
        auth: "DesignDisclosure",
        type: "APP",
        formpath: "/diy/design/DesignDisclosure/dataform"
      },
    },
    {
      path: "design/planEdit/dataform",
      component: () => import("@/views/design/center/planEdit/dataformH5.vue"),
      name: "apph5-dataFormH5-planChange",
      meta: {
        title: "计划修改页面",
        auth: "planEdit",
        type: "APP",
        formpath: "/diy/design/planEdit/dataform"
      },
    },
    {
      path: "designChanges/changeApply/dataform",
      component: () => import("@/views/designChanges/changeApply/dataformH5.vue"),
      name: "apph5-dataFormH5-change",
      meta: {
        title: "设计变更页面",
        auth: "changeApply",
        type: "APP",
        formpath: "/diy/designChanges/changeApply/dataform"
      },
    },
    {
      path: "design/hydroStandard",
      component: () =>
        import("@/views/design/availabilityofResults/dataformH5.vue"),
      name: "hydroStandard",
      meta: {
        title: "成果供应-水电标段",
        auth: "hydroStandard",
        type: "APP",
        pageType: "1",
        formpath: "/diy/design/hydroStandard"
      },
    },
    {
      path: "design/campsiteMarker",
      component: () =>
        import("@/views/design/availabilityofResults/dataformH5.vue"),
      name: "campsiteMarker",
      meta: {
        title: "成果供应-营地标段",
        auth: "campsiteMarker",
        type: "APP",
        pageType: "2",
        formpath: "/diy/design/campsiteMarker"
      },
    },
    // 设计单位
    {
      path: "office/designSendDoc/dataForm",
      component: () => import("@/views/office/SendDocument/dataFormH5.vue"),
      name: "apph5-designSendDoc",
      meta: {
        title: "设计单位发文",
        auth: "designSendDoc",
        type: "APP",
        formpath: "/diy/office/designSendDoc/dataform",
        unitType: 2,
        documentType: 2,
      },
    },
    {
      path: "office/designReceiveDoc/dataForm",
      component: () => import("@/views/office/SendDocument/dataFormH5.vue"),
      name: "apph5-designSendDoc",
      meta: {
        title: "设计单位收文",
        auth: "designReceiveDoc",
        type: "APP",
        formpath: "/diy/office/designReceiveDoc/dataform",
        unitType: 2,
        documentType: 1,
      },
    },
     // 施工单位
    {
      path: "office/constructionSendDoc/dataForm",
      component: () => import("@/views/office/SendDocument/dataFormH5.vue"),
      name: "apph5-constructionSendDoc",
      meta: {
        title: "施工单位发文",
        auth: "designReceiveDoc",
        type: "APP",
        formpath: "/diy/office/constructionSendDoc/dataform",
        unitType: 3,
        documentType: 2,
      },
    },
    {
      path: "office/constructionReceiveDoc/dataForm",
      component: () => import("@/views/office/SendDocument/dataFormH5.vue"),
      name: "apph5-constructionReceiveDoc",
      meta: {
        title: "施工单位收文",
        auth: "constructionReceiveDoc",
        type: "APP",
        formpath: "/diy/office/constructionReceiveDoc/dataform",
        unitType: 3,
        documentType: 1,
      },
    },
     // 监理单位
     {
      path: "office/supervisionSendDoc/dataForm",
      component: () => import("@/views/office/SendDocument/dataFormH5.vue"),
      name: "apph5-supervisionSendDoc",
      meta: {
        title: "监理单位发文",
        auth: "supervisionSendDoc",
        type: "APP",
        formpath: "/diy/office/supervisionSendDoc/dataform",
        unitType: 1,
        documentType: 2,
      },
    },
    {
      path: "office/supervisionReceiveDoc/dataForm",
      component: () => import("@/views/office/SendDocument/dataFormH5.vue"),
      name: "apph5-supervisionReceiveDoc",
      meta: {
        title: "监理单位收文",
        auth: "supervisionReceiveDoc",
        type: "APP",
        formpath: "/diy/office/supervisionReceiveDoc/dataform",
        unitType: 1,
        documentType: 1,
      },
    },
     // 第三方单位
     {
      path: "office/thirdPartySendDoc/dataForm",
      component: () => import("@/views/office/SendDocument/dataFormH5.vue"),
      name: "apph5-thirdPartySendDoc",
      meta: {
        title: "第三方单位发文",
        auth: "thirdPartySendDoc",
        type: "APP",
        formpath: "/diy/office/thirdPartySendDoc/dataform",
        unitType: 5,
        documentType: 2,
      },
    },
    {
      path: "office/thirdPartyReceiveDoc/dataForm",
      component: () => import("@/views/office/SendDocument/dataFormH5.vue"),
      name: "apph5-thirdPartyReceiveDoc",
      meta: {
        title: "第三方单位收文",
        auth: "thirdPartyReceiveDoc",
        type: "APP",
        formpath: "/diy/office/thirdPartyReceiveDoc/dataform",
        unitType: 5,
        documentType: 1,
      },
    },
    // 业主单位
    {
      path: "office/ownerSendDoc/dataForm",
      component: () => import("@/views/office/SendDocument/dataFormH5.vue"),
      name: "apph5-ownerReceiveDoc",
      meta: {
        title: "业主单位发文",
        auth: "ownerSendDoc",
        type: "APP",
        formpath: ""
      },
    },
    {
      path: "office/ownerReceiveDoc/dataForm",
      component: () => import("@/views/office/SendDocument/dataFormH5.vue"),
      name: "apph5-ownerReceive",
      meta: {
        title: "业主单位收文",
        auth: "ownerReceive",
        type: "APP",
        formpath: ""
      },
    },
    {
      path: "progress/SupervisionLog/dataform",
      component: () => import("@/views/progress/SupervisionLog/dataformH5.vue"),
      name: "apph5-supervisionLog",
      meta: {
        title: "监理日志",
        auth: "SupervisionLog",
        type: "APP",
        formpath: "/diy/progress/SupervisionLog/dataform"
      },
    },
    {
      path: "progress/ConstructionLogV3/dataform",
      component: () => import("@/views/progress/ConstructionLog/dataform-v3H5.vue"),
      name: "apph5-constructionLog",
      meta: {
        title: "施工日志",
        auth: "ConstructionLogV3",
        type: "APP",
        formpath: "/diy/progress/ConstructionLogV3/dataform"
      },
    },
    {
      path: 'app-testDetection',
      component: () =>
        import('@/views/qualitySafetyManagement/testDetection/dataformH5.vue'),
      name: 'app-testDetection',
      meta: {
        title: 'app-材料检测',
        auth: 'app-testDetection',
        type: 'APP',
        formpath: '/diy/app-testDetection'
      }
    }
  ],
};
export default route;
