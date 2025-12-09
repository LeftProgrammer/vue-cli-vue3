import Layout from "@/layout";
const route = {
  path: "/bimQuery",
  component: Layout,
  redirect: "/bimQuery/index",
  name: "bimQuery",
  meta: {
    title: "BIM+应用",
    affix: true,
  },
  children: [
    {
      path: "index",
      component: () => import("@/views/bimPlus/index.vue"),
      name: "index",
      meta: { title: "BIM+应用", auth: "index"},
    }
  ],
};
export default route;
