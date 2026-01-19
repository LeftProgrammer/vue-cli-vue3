/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout";
// import Empty from "@/layout/empty.vue";
// import Temp from '@/views/bussiness/temp.vue'
// import Customtable from '@/views/customtable/index.vue'
// import CustomtableUnity from '@/views/customtable/index.vue'

const route = {
  path: "/project",
  component: Layout,
  redirect: "/project/section",
  name: "project",
  meta: {
    title: "项目基础功能",
    icon: "icon-eng",
    auth: "project",
  },
  children: [
    {
      path: "section",
      name: "project-section",
      component: () => import("@/views/project/section/index.vue"),
      meta: { title: "标段管理", auth: "project" },
    },
    {
      path: "pbs",
      name: "project-pbs",
      component: () => import("@/views/project/pbs/index.vue"),
      meta: { title: "工程部位", auth: "project" },
    },
    {
      path: "modelConfig",
      name: "project-modelConfig",
      component: () => import("@/views/project/modelConfig/index.vue"),
      meta: { title: "模型配置", auth: "project" },
    },
    {
      path: "video",
      name: "project-video",
      component: () => import("@/views/project/video/index.vue"),
      meta: { title: "影像资料", auth: "project" },
    },
    {
      path: "userSign",
      name: "project-userSign",
      component: () => import("@/views/project/userSign/index.vue"),
      meta: { title: "用户签名", auth: "project" },
    },
    // {
    //   path: "monitorManagement",
    //   component: () => import("@/views/project/monitorManagement/index.vue"),
    //   name: "monitorManagement",
    //   meta: { title: "监控设备管理", auth: "video" },
    // },
  ],
};
export default route;
