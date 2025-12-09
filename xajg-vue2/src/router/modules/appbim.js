import Empty from "@/layout/empty.vue";

const route = {
    path: "/appbim",
    component: Empty,
    redirect: "/appbim/index",
    name: "appbim",
    meta: {
        title: "BIM模块",
        icon: "icon-demo",
        auth: "appbim",
    },
    children: [
        {
            path: "index",
            component: () => import("@/views/h5App/bim/index.vue"),
            name: "appbim-index",
            meta: { title: "模型展示", auth: "appbim-index", type: "APP" },
        },
    ],
};
export default route;
