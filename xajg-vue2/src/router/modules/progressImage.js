import Layout from "@/layout";
const route = {
  path: "/progressImage",
  component: Layout,
  redirect: "/progressImage",
  name: "progressImage",
  meta: {
    title: "进度形象",
    icon: "icon-design",
    auth: "progressImage",
  },
  children: [
    {
      path: "designQuantities",
      component: () => import("@/views/progressImage/designQuantities/index.vue"),
      name: "designQuantities",
      meta: { title: "设计工程量", auth: "designQuantities" },
    },
    {
      path: "actualQuantities",
      component: () => import("@/views/progressImage/actualQuantities/index.vue"),
      name: "actualQuantities",
      meta: { title: "实际工程量", auth: "actualQuantities" },
    },
    {
      path: "synthesisQuery",
      component: () => import("@/views/progressImage/synthesisQuery/index.vue"),
      name: "synthesisQuery",
      meta: { title: "综合查询", auth: "synthesisQuery" },
    },
  ],
}
export default route;
