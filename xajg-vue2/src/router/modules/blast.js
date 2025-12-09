import Layout from "@/layout";
const route = {
  path: "/blast",
  component: Layout,
  redirect: "/blast/customtable",
  name: "blast",
  meta: {
    title: "爆破管理",
  },
  children: [
    {
      path: "customtable/:viewid",
      component: () =>
        import("@/views/blast/collect/customtable/index.vue"),
      name: "customtable",
      meta: { title: "爆破汇总单", auth: "index" },
    },

  ],
};
export default route;
