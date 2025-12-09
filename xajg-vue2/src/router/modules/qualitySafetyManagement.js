import Layout from "@/layout";
const route = {
    path: "/qualitySafetyManagement",
    component: Layout,
    redirect: "/qualitySafetyManagement/EvaluationLedger",
    name: "ProgressManagement",
    meta: {
        title: "质量管理",
        icon: "icon-design",
        auth: "ProgressManagement",
    },
    children: [{
            path: "acceptanceEvaluation",
            component: () =>
                import (
                    "@/views/qualitySafetyManagement/acceptanceEvaluation/index.vue"
                ),
            name: "acceptanceEvaluation",
            meta: { title: "评定台账", auth: "acceptanceEvaluation" },
        },
        {
            path: "comprehensiveQualityAnalysis",
            component: () =>
                import (
                    "@/views/qualitySafetyManagement/comprehensiveQualityAnalysis/index.vue"
                ),
            name: "comprehensiveQualityAnalysis",
            meta: { title: "质量综合分析", auth: "comprehensiveQualityAnalysis" },
        },
        {
            path: "testDetection",
            component: () =>
                import ("@/views/qualitySafetyManagement/testDetection/index.vue"),
            name: "testDetection",
            meta: { title: "材料报检", auth: "testDetection" },
        },
        {
            path: "reagentTesting",
            component: () =>
                import ("@/views/qualitySafetyManagement/reagentTesting/index.vue"),
            name: "reagentTesting",
            meta: { title: "试验中心检测", auth: "reagentTesting" },
        },
        {
            path: "supervisionTesting",
            component: () =>
                import ("@/views/qualitySafetyManagement/supervisionTesting/index.vue"),
            name: "supervisionTesting",
            meta: { title: "监理单位抽检", auth: "supervisionTesting" },
        },
        {
            path: "constructionTesting",
            component: () =>
                import ("@/views/qualitySafetyManagement/constructionTesting/index.vue"),
            name: "constructionTesting",
            meta: { title: "施工单位自检", auth: "constructionTesting" },
        },
        {
            path: "qualitySystem",
            component: () =>
                import ("@/views/qualitySafetyManagement/QualitySystem/index.vue"),
            name: "qualitySystem",
            meta: { title: "质量体系", auth: "qualitySystem" },
        },
        {
            path: "Inspect",
            component: () =>
                import ("@/views/qualitySafetyManagement/Inspect/index.vue"),
            name: "Inspect",
            meta: { title: "质量检查", auth: "Inspect" },
        },
        {
            path: "dissmission",
            component: () =>
                import ("@/views/qualitySafetyManagement/dissmission/index.vue"),
            name: "dissmission",
            meta: { title: "质量消缺", auth: "dissmission" },
        },
        {
            path: "ingressCheck",
            component: () =>
                import ("@/views/qualitySafetyManagement/ingressCheck/index.vue"),
            name: "ingressCheck",
            meta: { title: "进场报验", auth: "ingressCheck" },
        },
        {
            path: "QualityRegulation",
            component: () =>
                import ("@/views/qualitySafetyManagement/QualityRegulation/index.vue"),
            name: "QualityRegulation",
            meta: { title: "质量管理体系", auth: "QualityRegulation" },
        },
        {
            path: "Organization",
            component: () =>
                import ("@/views/qualitySafetyManagement/Organization/index.vue"),
            name: "Organization",
            meta: { title: "质量组织机构", auth: "Organization" },
        },
        {
            path: "acceptance",
            component: () =>
                import ("@/views/qualitySafetyManagement/acceptance/index.vue"),
            name: "QualityRegacceptanceulation",
            meta: { title: "质量验收", auth: "acceptance" },
        },
        {
            path: "statistics",
            component: () =>
                import ("@/views/qualitySafetyManagement/statistics/index.vue"),
            name: "statistics",
            meta: { title: "质量统计分析", auth: "statistics" },
        },
        {
            path: "qualityCatalogue",
            component: () =>
                import ("@/views/qualitySafetyManagement/qualityCatalogue/index.vue"),
            name: "qualityCatalogue",
            meta: { title: "质量验评目录", auth: "qualityCatalogue" },
        },
    ],
};
export default route;
