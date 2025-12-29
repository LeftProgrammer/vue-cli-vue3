/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout";

const route = {
    path: "/safetyManagement",
    component: Layout,
    redirect: "/safetyManagement/comprehensiveQuery",
    name: "dashboard",
    meta: {
        title: "安全管理",
        icon: "",
        auth: "safetyManagement",
    },
    children: [{
            path: "waterMonitoring",
            component: () =>
                import ("@/views/safetyManagement/waterMonitoring/index.vue"),
            name: "waterMonitoring",
            meta: { title: "水情监测", auth: "safetyManagement" },
        },
        {
            path: "rainMonitoring",
            component: () =>
                import ("@/views/safetyManagement/rainMonitoring/index.vue"),
            name: "rainMonitoring",
            meta: { title: "雨情监测", auth: "safetyManagement" },
        },
        {
            path: "comprehensiveQuery",
            component: () =>
                import ("@/views/safetyManagement/comprehensiveQuery/index.vue"),
            name: "comprehensiveQuery",
            meta: { title: "综合查询", auth: "safetyManagement" },
        },
        {
            path: "fireproofManagement/equipmentManagement",
            component: () =>
                import (
                    "@/views/safetyManagement/fireproofManagement/equipmentManagement/index.vue"
                ),
            name: "equipmentManagement",
            meta: { title: "设备管理", auth: "equipmentManagement" },
        },
        {
            path: "fireproofManagement/forestFirePreventionMonitor",
            component: () =>
                import (
                    "@/views/safetyManagement/fireproofManagement/forestFirePreventionMonitor/index.vue"
                ),
            name: "forestFirePreventionMonitor",
            meta: { title: "森林防火监控", auth: "forestFirePreventionMonitor" },
        },
        {
            path: "fireproofManagement/closedAreaMonitor",
            component: () =>
                import (
                    "@/views/safetyManagement/fireproofManagement/closedAreaMonitor/index.vue"
                ),
            name: "closedAreaMonitor",
            meta: { title: "封闭区监控", auth: "closedAreaMonitor" },
        },
        {
            path: "warningConfig",
            component: () =>
                import ("@/views/safetyManagement/warningConfig/index.vue"),
            name: "warningConfig",
            meta: { title: "预警指标", auth: "warningConfig" },
        },
        {
            path: "hiddenDanger",
            component: () =>
                import ("@/views/safetyManagement/hiddenDanger/index.vue"),
            name: "hiddenDanger",
            meta: { title: "隐患管理", auth: "hiddenDanger" },
        },
        {
            path: "statistics",
            component: () =>
                import ("@/views/safetyManagement/statistics/index.vue"),
            name: "safeStatistics",
            meta: { title: "隐患管理", auth: "statistics" },
        },
        {
            path: "regime",
            component: () =>
                import ("@/views/safetyManagement/regime/index.vue"),
            name: "regime",
            meta: { title: "安全管理体系", auth: "regime" },
        },
        {
            path: "Organization",
            component: () =>
                import ("@/views/safetyManagement/Organization/index.vue"),
            name: "Organization",
            meta: { title: "安全组织机构", auth: "Organization" },
        },
        {
            path: "staffManagement",
            component: () =>
                import ("@/views/safetyManagement/staffManagement/index.vue"),
            name: "staffManagement",
            meta: { title: "人员管理", auth: "staffManagement" },
        },
        {
            path: "safeStaffEntryExit",
            component: () =>
                import ("@/views/safetyManagement/safeStaffEntryExit/index.vue"),
            name: "safeStaffEntryExit",
            meta: { title: "人员进退场", auth: "safeStaffEntryExit" },
        },
        {
            path: "riskMonitor",
            component: () =>
                import ("@/views/safetyManagement/riskMonitor/index.vue"),
            name: "riskMonitor",
            meta: { title: "危险源监控", auth: "riskMonitor" },
        },
        {
            path: "equipmentManagement",
            component: () =>
                import ("@/views/safetyManagement/equipmentManagement/index.vue"),
            name: "equipmentManagement",
            meta: { title: "设备管理", auth: "equipmentManagement" },
        },
        {
            path: "safeEquipmentEntryExit",
            component: () =>
                import ("@/views/safetyManagement/safeEquipmentEntryExit/index.vue"),
            name: "safeEquipmentEntryExit",
            meta: { title: "设备进退场", auth: "safeEquipmentEntryExit" },
        },
        {
            path: "video",
            component: () =>
                import ("@/views/safetyManagement/video/index.vue"),
            name: "safeVideo",
            meta: { title: "视频监控", auth: "video" },
        },
        {
            path: "entranceGuard",
            component: () =>
                import ("@/views/safetyManagement/entranceGuard/index.vue"),
            name: "entranceGuard",
            meta: { title: "门禁管理", auth: "entranceGuard" },
        },
        {
            path: "entranceRecord",
            component: () =>
                import ("@/views/safetyManagement/entranceRecord/index.vue"),
            name: "entranceRecord",
            meta: { title: "人员通行记录", auth: "entranceRecord" },
        },
        {
            path: "vehicleGate",
            component: () =>
                import ("@/views/safetyManagement/vehicleGate/index.vue"),
            name: "vehicleGate",
            meta: { title: "车辆闸机管理", auth: "vehicleGate" },
        },
        {
            path: "vehicle",
            component: () =>
                import ("@/views/safetyManagement/vehicle/index.vue"),
            name: "vehicle",
            meta: { title: "车辆管理", auth: "vehicle" },
        },
        {
            path: "actionMonitor",
            component: () =>
                import ("@/views/safetyManagement/actionMonitor/index.vue"),
            name: "actionMonitor",
            meta: { title: "行为监控", auth: "actionMonitor" },
        },
        {
            path: "area",
            component: () =>
                import ("@/views/safetyManagement/area/index.vue"),
            name: "safeArea",
            meta: { title: "危险区域维护", auth: "area" },
        },
        {
            path: "dangerJob",
            component: () =>
                import ("@/views/safetyManagement/dangerJob/index.vue"),
            name: "dangerJob",
            meta: { title: "危险作业票", auth: "dangerJob" },
        },
        {
            path: "staffEquipmentLocation",
            component: () =>
                import ("@/views/safetyManagement/staffEquipmentLocation/index.vue"),
            name: "staffEquipmentLocation",
            meta: { title: "人员设备定位", auth: "staffEquipmentLocation" },
        },
        {
            path: "dust",
            component: () =>
                import ("@/views/safetyManagement/dust/index.vue"),
            name: "dust",
            meta: { title: "扬尘监测", auth: "dust" },
        },
        {
            path: "education",
            component: () =>
                import ("@/views/safetyManagement/education/index.vue"),
            name: "education",
            meta: { title: "班前教育会", auth: "education" },
        },
        {
            path: "floodControl",
            component: () =>
                import ("@/views/safetyManagement/floodControl/index.vue"),
            name: "floodControl",
            meta: { title: "防汛值班记录", auth: "floodControl" },
        },
        {
            path: "floodControlDaily",
            component: () =>
                import ("@/views/safetyManagement/floodControlDaily/index.vue"),
            name: "floodControlDaily",
            meta: { title: "防汛日报", auth: "floodControlDaily" },
        },
        {
            path: "emergencyEvent",
            component: () =>
                import ("@/views/safetyManagement/emergencyEvent/index.vue"),
            name: "emergencyEvent",
            meta: { title: "突发事件", auth: "emergencyEvent" },
        },
        {
            path: "notification",
            component: () =>
                import ("@/views/safetyManagement/notification/index.vue"),
            name: "notification",
            meta: { title: "通知公告", auth: "notification" },
        },
    ],
};
export default route;
