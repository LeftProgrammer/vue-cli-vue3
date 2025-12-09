import Layout from "@/layout";
const route = {
  path: "/measure",
  component: Layout,
  redirect: "/measure/person-info",
  name: "measure",
  meta: {
    title: "测量管理",
  },
  children: [
    {
      path: "measure-system/person-info",
      component: () =>
        import("@/views/measure/measureSystem/personInfo/index.vue"),
      name: "person-info",
      meta: { title: "人员信息", auth: "index" },
    },
    {
      path: "measure-system/device-info",
      component: () =>
        import("@/views/measure/measureSystem/deviceInfo/index.vue"),
      name: "device-info",
      meta: { title: "设备信息", auth: "index" },
    },
    {
      path: "measure-system/standard-system",
      component: () =>
        import("@/views/measure/measureSystem/standardSystem/index.vue"),
      name: "standard-system",
      meta: { title: "标准体系", auth: "index" },
    },
    {
      path: "measure-result",
      component: () => import("@/views/measure/measureResult/index.vue"),
      name: "measure-result",
      meta: { title: "测量成果", auth: "index" },
    },
  ],
};
export default route;
