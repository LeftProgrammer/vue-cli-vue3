/** When your routing table is too long, you can split it into small modules **/

/**专项监测 */
import Layout from "@/layout";

const route = {
  path: "/monitor",
  component: Layout,
  redirect: "/monitor/device",
  name: "monitor",
  meta: {
    title: "专项监测",
    icon: "",
    auth: "monitor",
  },
  children: [
    {
      path: "device",
      component: () => import("@/views/monitor/device/index.vue"),
      name: "monitorDevice",
      meta: { title: "监测点管理", auth: "monitorDevice" },
    },
    {
      path: "data",
      component: () => import("@/views/monitor/data/index.vue"),
      name: "monitorData",
      meta: { title: "监测记录", auth: "monitorDevice" },
    },
    {
      path: "query",
      component: () => import("@/views/monitor/query/index.vue"),
      name: "monitorQuery",
      meta: { title: "监测一张图", auth: "monitorQuery" },
    },
  ],
};
export default route;
