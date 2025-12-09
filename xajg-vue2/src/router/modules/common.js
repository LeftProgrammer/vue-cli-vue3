/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout";
import Empty from "@/layout/empty.vue";
const route = {
  path: "/common",
  component: Layout,
  redirect: "/common/message",
  name: "common",
  meta: {
    title: "通用模块",
    icon: "icon-common",
    auth: "common",
  },
  children: [
    {
      path: "message",
      component: () => import("@/views/common/message/index.vue"),
      name: "common-message",
      meta: { title: "我的消息", auth: "common-message" },
    },
    {
      path: "flow",
      component: () => import("@/views/common/flow/index.vue"),
      name: "common-flow",
      meta: { title: "待办事项", auth: "common-flow" },
    },
  ],
};
export default route;
