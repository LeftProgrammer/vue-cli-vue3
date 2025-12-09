import Layout from "@/layout";
const route = {
    path: "/designChanges",
    component: Layout,
    redirect: "/designChanges/changeApply",
    name: "designChanges",
    meta: {
        title: "设计变更",
        icon: "icon-environmentAndWater",
        auth: "designChanges",
    },
    children: [
        {
            path: "changeApply",
            component: () => import("@/views/designChanges/changeApply/index.vue"),
            name: "changeApply",
            meta: { title: "设计变更申请", auth: "designChanges" },
        },
        {
            path: "projectChange",
            component: () => import("@/views/designChanges/projectChange/index.vue"),
            name: "projectChange",
            meta: { title: "工程变更申请", auth: "designChanges" },
        },
    ],
}
export default route;
