import Empty from "@/layout/empty.vue";

const route = {
  path: "/diy",
  component: Empty,
  redirect: "/diy/leave",
  name: "diy",
  meta: {
    title: "测试模块",
    icon: "icon-demo",
    auth: "demo",
  },
  children: [
    {
      path: "app-ownerSendDoc",
      component: () => import("@/views/office/ownerSendDocument/newForm.vue"),
      name: "app-ownerSendDoc",
      meta: { title: "app-业主发文", auth: "app-ownerSendDoc", type: "APP" },
    },
    {
      path: "app-ownerReceiveDoc",
      component: () =>
        import("@/views/office/ownerReceiveDocument/dataform.vue"),
      name: "app-ownerReceiveDoc",
      meta: { title: "app-业主收文", auth: "app-ownerReceiveDoc", type: "APP" },
    },
    {
      path: "app-testDetection",
      component: () =>
        import("@/views/qualitySafetyManagement/testDetection/dataform.vue"),
      name: "app-testDetection",
      meta: { title: "app-材料检测", auth: "app-testDetection", type: "APP" },
    },
    {
      path: "designChanges/changeApply/dataform",
      component: () => import("@/views/designChanges/changeApply/dataform.vue"),
      name: "changeApply",
      meta: { title: "设计变更申请", auth: "changeApply" },
    },
    {
      path: "designChanges/projectChange/dataform",
      component: () =>
        import("@/views/designChanges/projectChange/dataform.vue"),
      name: "projectChange",
      meta: { title: "工程变更申请", auth: "projectChange" },
    },

    {
      path: "design/plan/dataform",
      component: () => import("@/views/design/center/plan/dataform.vue"),
      name: "plan",
      meta: { title: "供应计划列表", auth: "plan" },
    },
    {
      path: "design/planEdit/dataform",
      component: () => import("@/views/design/center/planEdit/dataform.vue"),
      name: "planEdit",
      meta: { title: "供应计划修改", auth: "planEdit" },
    },

    {
      path: "design/drawingSupply/dataform",
      component: () =>
        import("@/views/design/center/drawingSupply/dataform.vue"),
      name: "drawingSupply",
      meta: { title: "图纸供应", auth: "drawingSupply" },
    },
    {
      path: "design/report2/dataform",
      component: () => import("@/views/design/center/report2/dataform.vue"),
      name: "report",
      meta: { title: "设计报告供应", auth: "report" },
    },
    {
      path: "design/drawingSend/dataform",
      component: () => import("@/views/design/center/drawingSend/dataform.vue"),
      name: "drawingSend",
      meta: { title: "图纸分发", auth: "drawingSend" },
    },
    {
      path: "design/DesignDisclosure/dataform",
      name: "DesignDisclosure",
      component: () => import("@/views/design/DesignDisclosure/dataform.vue"),
      hidden: true,
      meta: { title: "设计交底", auth: "DesignDisclosure" },
    },
    // 进度与施工
    {
      path: "progress/ConstructionLog/dataform",
      name: "ConstructionLog",
      component: () => import("@/views/progress/ConstructionLog/dataform.vue"),
      hidden: true,
      meta: { title: "施工日志", auth: "ConstructionLog" },
    },
    {
      path: "progress/ConstructionLogV3/dataform",
      name: "ConstructionLogV3",
      component: () =>
        import("@/views/progress/ConstructionLog/dataform-v3.vue"),
      hidden: true,
      meta: { title: "施工日志V3", auth: "ConstructionLogV3" },
    },
    {
      path: "progress/SupervisionLog/dataform",
      name: "SupervisionLog",
      component: () => import("@/views/progress/SupervisionLog/dataform.vue"),
      hidden: true,
      meta: { title: "监理日志", auth: "SupervisionLog" },
    },
    {
      path: "progress/ProgressPlan/dataform",
      name: "ProgressPlan",
      component: () => import("@/views/progress/ProgressPlan/dataform.vue"),
      hidden: true,
      meta: { title: "年度计划", auth: "ProgressPlan", planType: 1 },
    },
    {
      path: "progress/MonthPlan/dataform",
      name: "ProgressPlan",
      component: () => import("@/views/progress/ProgressPlan/dataform.vue"),
      hidden: true,
      meta: { title: "月度计划", auth: "MonthPlan", planType: 2 },
    },
    {
      path: "progress/TotalPlan/dataform",
      name: "ProgressPlan",
      component: () => import("@/views/progress/ProgressPlan/dataform.vue"),
      hidden: true,
      meta: { title: "总计划", auth: "TotalPlan", planType: 3 },
    },

    // let unitType = 2 // 监理 设计 施工 业主  第三方 type 1 2 3 4 5
    // let documentType = 2 //1收文2发文
    {
      path: "office/supervisionReceiveDoc/dataform",
      name: "supervisionReceiveDoc",
      component: () => import("@/views/office/SendDocument/dataform.vue"),
      hidden: true,
      meta: {
        title: "监理单位收文",
        auth: "supervisionReceiveDoc",
        unitType: 1,
        documentType: 1,
      },
    },
    {
      path: "office/designReceiveDoc/dataform",
      name: "designReceiveDoc",
      component: () => import("@/views/office/SendDocument/dataform.vue"),
      hidden: true,
      meta: {
        title: "设计单位收文",
        auth: "designReceiveDoc",
        unitType: 2,
        documentType: 1,
      },
    },
    {
      path: "office/constructionReceiveDoc/dataform",
      name: "constructionReceiveDoc",
      component: () => import("@/views/office/SendDocument/dataform.vue"),
      hidden: true,
      meta: {
        title: "施工单位收文",
        auth: "constructionReceiveDoc",
        unitType: 3,
        documentType: 1,
      },
    },
    {
      path: "office/supervisionSendDoc/dataform",
      name: "supervisionSendDoc",
      component: () => import("@/views/office/SendDocument/dataform.vue"),
      hidden: true,
      meta: {
        title: "监理单位发文",
        auth: "supervisionSendDoc",
        unitType: 1,
        documentType: 2,
      },
    },
    {
      path: "office/designSendDoc/dataform",
      name: "designSendDoc",
      component: () => import("@/views/office/SendDocument/dataform.vue"),
      hidden: true,
      meta: {
        title: "设计单位发文",
        auth: "designSendDoc",
        unitType: 2,
        documentType: 2,
      },
    },

    {
      path: "office/constructionSendDoc/dataform",
      name: "constructionSendDoc",
      component: () => import("@/views/office/SendDocument/dataform.vue"),
      hidden: true,
      meta: {
        title: "施工单位发文",
        auth: "constructionSendDoc",
        unitType: 3,
        documentType: 2,
      },
    },
    {
      path: "office/ownerReceiveDoc/dataform",
      name: "ownerReceiveDoc",
      component: () =>
        import("@/views/office/ownerReceiveDocument/dataform.vue"),
      hidden: true,
      meta: {
        title: "业主单位收文",
        auth: "ownerReceiveDoc",
        unitType: 4,
        documentType: 1,
      },
    },

    {
      path: "office/thirdPartySendDoc/dataform",
      name: "thirdPartySendDoc",
      component: () => import("@/views/office/SendDocument/dataform.vue"),
      hidden: true,
      meta: {
        title: "第三方发文",
        auth: "thirdPartySendDoc",
        unitType: 5,
        documentType: 2,
      },
    },
    {
      path: "office/thirdPartyReceiveDoc/dataform",
      name: "thirdPartyReceiveDoc",
      component: () => import("@/views/office/SendDocument/dataform.vue"),
      hidden: true,
      meta: {
        title: "第三方收文",
        auth: "thirdPartyReceiveDoc",
        unitType: 5,
        documentType: 1,
      },
    },

    {
      path: "materialInspece/dataform",
      component: () =>
        import("@/views/qualitySafetyManagement/materialInspece/dataform.vue"),
      name: "materialInspece",
      meta: { title: "材料报检", auth: "materialInspece" },
    },

    {
      path: "office/fundAllocation/dataForm",
      component: () => import("@/views/office/fundAllocation/dataForm.vue"),
      name: "fundAllocation",
      meta: { title: "资金调拨", auth: "fundAllocation" },
    },

    {
      path: "reagentTesting/reagents/dataform",
      component: () =>
        import(
          "@/views/qualitySafetyManagement/reagentTesting/reagents/dataform.vue"
        ),
      name: "reagentTesting",
      meta: { title: "试验中心抽检", auth: "reagentTesting" },
    },

    {
      path: "appForestFireMonitoring",
      component: () => import("@/views/h5App/ForestFireMonitoring/index.vue"),
      name: "appForestFireMonitoring",
      meta: { title: "深林防火监控", auth: "appForestFireMonitoring" },
    },

    {
      path: "appClosedAreaMonitor",
      component: () => import("@/views/h5App/closedAreaMonitor/index.vue"),
      name: "appClosedAreaMonitor",
      meta: { title: "封闭区监控", auth: "appClosedAreaMonitor" },
    },
    {
      path: "appPlan",
      component: () => import("@/views/design/center/plan/dataform.vue"),
      name: "plan",
      meta: { title: "计划报审", auth: "design" },
    },
    {
      path: "design/hydroStandard",
      component: () =>
        import("@/views/design/availabilityofResults/dataform.vue"),
      name: "hydroStandard",
      meta: {
        title: "成果供应-水电标段",
        auth: "hydroStandard",
        pageType: "1",
      },
    },
    {
      path: "design/campsiteMarker",
      component: () =>
        import("@/views/design/availabilityofResults/dataform.vue"),
      name: "campsiteMarker",
      meta: {
        title: "成果供应-营地标段",
        auth: "campsiteMarker",
        pageType: "2",
      },
    },
    {
      path: "design/constructionSection",
      component: () =>
        import("@/views/design/availabilityofResults/dataform.vue"),
      name: "",
      meta: { title: "成果供应-施工标段", auth: "constructionSection" },
    },
    {
      path: "design/epcResult",
      component: () => import("@/views/design/epcResult/dataform.vue"),
      name: "epcResult",
      meta: { title: "成果供应-总包", auth: "epcResult", pageType: "3" },
    },
    {
      path: "archives/catalogue/addCatalogue",
      name: "AddCatalogue",
      component: () =>
        import("@/views/archives/catalogue/components/add_catalogue_frame.vue"),
      hidden: true,
      meta: {
        title: "新增文件",
        auth: "AddCatalogue",
        unitType: 2,
        documentType: 2,
      },
    },
    {
      path: "archives/preArchiveLibrary/preArchiveFrame",
      name: "PreArchiveFrame",
      component: () =>
        import(
          "@/views/archives/pre_archive_library/components/pre_archive_frame.vue"
        ),
      hidden: true,
      meta: {
        title: "预审",
        auth: "PreArchiveFrame",
        unitType: 2,
        documentType: 2,
      },
    },
    {
      path: "archives/preArchiveLibrary/multiArchiveFrame",
      name: "MultiArchiveFrame",
      component: () =>
        import(
          "@/views/archives/pre_archive_library/components/multi_archive_frame.vue"
        ),
      hidden: true,
      meta: {
        title: "三方四审",
        auth: "MultiArchiveFrame",
        unitType: 2,
        documentType: 2,
      },
    },
    {
      path: "archives/dataMaintenanceRequest",
      name: "DataMaintenanceRequestFrame",
      component: () =>
        import(
          "@/views/archives/data_maintenance_request/components/data_maintenance_request_frame.vue"
        ),
      hidden: true,
      meta: {
        title: "数据维护申请单",
        auth: "DataMaintenanceRequestFrame",
        unitType: 2,
        documentType: 2,
      },
    },
    {
      path: "archives/catalogue_maintenance",
      name: "CatalogueMaintenanceFrame",
      component: () =>
        import(
          "@/views/archives/data_maintenance_request/components/catalogue_maintenance.vue"
        ),
      hidden: true,
      meta: {
        title: "流程表单",
        auth: "CatalogueMaintenanceFrame",
        unitType: 2,
        documentType: 2,
      },
    },
    {
      path: "archives/MimicryProcess",
      name: "MimicryProcess",
      component: () =>
        import(
          "@/views/archives/data_maintenance_request/components/mimicry_process.vue"
        ),
      hidden: true,
      meta: {
        title: "流程表单",
        auth: "MimicryProcess",
        unitType: 2,
        documentType: 2,
      },
    },
    {
      path: "blast/addCollectFrame",
      name: "AddCollectFrame",
      component: () =>
        import("@/views/blast/collect/components/add_collect_frame.vue"),
      hidden: true,
      meta: {
        title: "爆破汇总",
        auth: "AddCollectFrame",
        unitType: 2,
        documentType: 2,
      },
    },
    {
      path: "safetyManagement/hiddenDanger/dataform",
      name: "hiddenDanger",
      component: () =>
        import("@/views/safetyManagement/hiddenDanger/dataform.vue"),
      hidden: true,
      meta: {
        title: "隐患排查",
        // auth: "hiddenDanger",
      },
    },
    {
      path: "safetyManagement/riskMonitor/dataform",
      name: "riskMonitor",
      component: () =>
        import("@/views/safetyManagement/riskMonitor/dataform.vue"),
      hidden: true,
      meta: {
        title: "危险源监控",
        // auth: "riskMonitor",
      },
    },
    {
      path: "qualitySafetyManagement/Inspect/dataform",
      name: "Inspect",
      component: () =>
        import("@/views/qualitySafetyManagement/Inspect/dataform.vue"),
      hidden: true,
      meta: {
        title: "质量检查",
        // auth: "Inspect",
      },
    },
    {
      path: "qualitySafetyManagement/acceptanceEvaluation/dataform",
      name: "acceptanceEvaluation",
      component: () =>
        import(
          "@/views/qualitySafetyManagement/acceptanceEvaluation/dataform.vue"
        ),
      hidden: true,
      meta: {
        title: "质量验收",
      },
    },
    {
      path: "qualitySafetyManagement/dissmission/dataform",
      name: "dissmission",
      component: () =>
        import("@/views/qualitySafetyManagement/dissmission/dataform.vue"),
      hidden: true,
      meta: {
        title: "质量消缺",
        // auth: "QualityDissmission",
      },
    },
    {
      path: "design/attachmentApply",
      name: "hiddenDanger",
      component: () => import("@/views/design/attachmentApply/dataform.vue"),
      hidden: true,
      meta: {
        title: "相关批件办理",
        auth: "attachmentApply",
      },
    },
    {
      path: "qualitySafetyManagement/ingressCheck",
      name: "ingressCheck",
      component: () =>
        import("@/views/qualitySafetyManagement/ingressCheck/dataform.vue"),
      hidden: true,
      meta: {
        title: "进场报验",
        auth: "ingressCheck",
      },
    },
    {
      path: "investment/plan/dataform",
      name: "plan",
      component: () => import("@/views/investment/plan/dataform.vue"),
      hidden: true,
      meta: {
        title: "投资计划",
        auth: "plan",
      },
    },
    {
      path: "investment/real/dataform",
      name: "real",
      component: () => import("@/views/investment/real/dataform.vue"),
      hidden: true,
      meta: {
        title: "实际投资",
        auth: "real",
      },
    },
    {
      path: "construction/plan/dataform",
      name: "plan",
      component: () => import("@/views/construction/plan/dataform.vue"),
      hidden: true,
      meta: {
        title: "进度计划",
        auth: "plan",
      },
    },
    {
      path: "safetyManagement/safeStaffEntryExit/dataform",
      name: "safeStaffEntryExit",
      component: () =>
        import("@/views/safetyManagement/safeStaffEntryExit/dataform.vue"),
      hidden: true,
      meta: {
        title: "人员进退场",
        auth: "safeStaffEntryExit",
      },
    },
    {
      path: "safetyManagement/safeEquipmentEntryExit/dataform",
      name: "safeEquipmentEntryExit",
      component: () =>
        import("@/views/safetyManagement/safeEquipmentEntryExit/dataform.vue"),
      hidden: true,
      meta: {
        title: "设备进退场",
        auth: "safeEquipmentEntryExit",
      },
    },
    {
      path: "safetyManagement/dangerJob/dataform",
      name: "dangerJob",
      component: () =>
        import("@/views/safetyManagement/dangerJob/dataform.vue"),
      hidden: true,
      meta: {
        title: "危险作业票",
        auth: "dangerJob",
      },
    },
    {
      path: "safetyManagement/education/dataform",
      name: "education",
      component: () =>
        import("@/views/safetyManagement/education/dataform.vue"),
      hidden: true,
      meta: {
        title: "班前教育会",
        auth: "education",
      },
    },
    {
      path: "safetyManagement/floodControl/dataform",
      name: "floodControl",
      component: () =>
        import("@/views/safetyManagement/floodControl/dataform.vue"),
      hidden: true,
      meta: {
        title: "防汛值班记录",
        auth: "floodControl",
      },
    },
    {
      path: "safetyManagement/floodControlDaily/dataform",
      name: "floodControlDaily",
      component: () =>
        import("@/views/safetyManagement/floodControlDaily/dataform.vue"),
      hidden: true,
      meta: {
        title: "防汛值班记录",
        auth: "floodControlDaily",
      },
    },
    {
      path: "safetyManagement/emergencyEvent/dataform",
      name: "emergencyEvent",
      component: () =>
        import("@/views/safetyManagement/emergencyEvent/dataform.vue"),
      hidden: true,
      meta: {
        title: "突发事件",
        auth: "emergencyEvent",
      },
    },
    {
      path: "safetyManagement/notification/dataform",
      name: "notification",
      component: () =>
        import("@/views/safetyManagement/notification/dataform.vue"),
      hidden: true,
      meta: {
        title: "通知公告",
        auth: "notification",
      },
    },
    {
      path: "contract/investGeneralPay/dataform",
      name: "investGeneralPay",
      component: () => import("@/views/contract/investGeneralPay/dataform.vue"),
      hidden: true,
      meta: {
        title: "工程合同结算",
        auth: "investGeneralPay",
      },
    },
    {
      path: "contract/investGeneralPay1/dataform",
      name: "investGeneralPay1",
      component: () =>
        import("@/views/contract/investGeneralPay1/dataform.vue"),
      hidden: true,
      meta: {
        title: "非工程合同结算",
        auth: "investGeneralPay1",
      },
    },
  ],
};
export default route;
