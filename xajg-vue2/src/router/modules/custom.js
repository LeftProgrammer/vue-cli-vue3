import Layout from "@/layout";

const route = {
    path: "/custom",
    component: () => import("@/layout"),  // 使用 layout 作为根组件
    redirect: "/custom",
    name: "custom",
    meta: {
        title: "综合办公",
        icon: "",
        auth: "office",
    },
    children: [
        {
            path: "custom",
            component: () => import("@/views/custom/index.vue"),
            name: "custom",
            meta: {
                title: "综合办公",
                icon: "",
                auth: "office",
            },
        },
    ],
};

export default route;