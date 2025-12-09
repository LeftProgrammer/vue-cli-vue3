import Layout from "@/layout";
const route = {
  path: "/constract",
  component: Layout,
  redirect: "/constract/technology-control",
  name: "constract",
  meta: {
    title: "施工管理",
  },
  children: [
    {
      path: "technology-control",
      component: () => import("@/views/constract/technologyControl/index.vue"),
      name: "technology-control",
      meta: { title: "技术管理", auth: "index" },
    },
    {
      path: "subpackage-contorl",
      component: () => import("@/views/constract/subpackageContorl/index.vue"),
      name: "subpackage-contorl",
      meta: { title: "分包管理", auth: "index" },
    },
  ],
};
export default route;
