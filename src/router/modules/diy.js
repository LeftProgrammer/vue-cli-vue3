/**
 * DIY路由模块 - 用于流程配置系统加载表单页面
 * 流程配置的web路径如: /#/diy/design/plan/dataform
 * 对应加载: @/views/design/center/plan/dataform.vue
 */
import Empty from "@/layout/empty.vue";

const route = {
  path: "/diy",
  component: Empty,
  redirect: "/diy/index",
  name: "diy",
  meta: {
    title: "流程表单",
    hidden: true,
  },
  children: [
    // 设计管理 - 计划
    {
      path: "design/plan/dataform",
      component: () => import("@/views/design/center/plan/dataform.vue"),
      name: "diy-design-plan",
      meta: { title: "供应计划列表", auth: "plan" },
    },
    // 设计管理 - 计划修改
    // {
    //   path: "design/planEdit/dataform",
    //   component: () => import("@/views/design/center/planEdit/dataform.vue"),
    //   name: "diy-design-planEdit",
    //   meta: { title: "供应计划修改", auth: "planEdit" },
    // },
    // // 设计管理 - 图纸供应
    // {
    //   path: "design/drawingSupply/dataform",
    //   component: () => import("@/views/design/center/drawingSupply/dataform.vue"),
    //   name: "diy-design-drawingSupply",
    //   meta: { title: "图纸供应", auth: "drawingSupply" },
    // },
    // // 设计管理 - 设计报告
    // {
    //   path: "design/report2/dataform",
    //   component: () => import("@/views/design/center/report2/dataform.vue"),
    //   name: "diy-design-report2",
    //   meta: { title: "设计报告供应", auth: "report" },
    // },
    // // 设计管理 - 图纸分发
    // {
    //   path: "design/drawingSend/dataform",
    //   component: () => import("@/views/design/center/drawingSend/dataform.vue"),
    //   name: "diy-design-drawingSend",
    //   meta: { title: "图纸分发", auth: "drawingSend" },
    // },
    // // 设计交底
    // {
    //   path: "design/DesignDisclosure/dataform",
    //   component: () => import("@/views/design/DesignDisclosure/dataform.vue"),
    //   name: "diy-design-DesignDisclosure",
    //   meta: { title: "设计交底", auth: "DesignDisclosure" },
    // },
    // // 设计变更
    // {
    //   path: "designChanges/changeApply/dataform",
    //   component: () => import("@/views/designChanges/changeApply/dataform.vue"),
    //   name: "diy-designChanges-changeApply",
    //   meta: { title: "设计变更申请", auth: "changeApply" },
    // },
    // {
    //   path: "designChanges/projectChange/dataform",
    //   component: () => import("@/views/designChanges/projectChange/dataform.vue"),
    //   name: "diy-designChanges-projectChange",
    //   meta: { title: "工程变更申请", auth: "projectChange" },
    // },
    
    // 可根据需要继续添加其他模块...
  ],
};

export default route;
