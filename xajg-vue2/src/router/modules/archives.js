/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout";

const route = {
  path: "/archives",
  component: Layout,
  redirect: "/archives/file-directory",
  name: "archives",
  meta: {
    title: "档案管理",
    icon: "",
    auth: "archivesManagement",
  },
  children: [
    {
      path: "file-directory-permission",
      component: () => import("@/views/archives/file_lib_permission/file_directory_permission/index.vue"),
      name: "file-directory-permission",
      meta: { title: "文件库权限", auth: "archivesManagement" },
    },
    {
      path: "archival-catalogue-permission",
      component: () => import("@/views/archives/file_lib_permission/archival_catalogue_permission/index.vue"),
      name: "archival-catalogue-permission",
      meta: { title: "预归档库权限", auth: "archivesManagement" },
    },
    {
      path: "file-directory",
      component: () => import("@/views/archives/file_directory/index.vue"),
      name: "file-directory",
      meta: { title: "文件目录树配置", auth: "archivesManagement" },
    },
    {
      path: "archival-catalogue",
      component: () => import("@/views/archives/archival_catalogue/index.vue"),
      name: "archival-catalogue",
      meta: { title: "档案目录树配置", auth: "archivesManagement" },
    },
    {
      path: "catalogue",
      component: () => import("@/views/archives/catalogue/index.vue"),
      name: "catalogue",
      meta: { title: "文件库", auth: "archivesManagement" },
    },
    {
      path: "verificationLog",
      component: () => import("@/views/archives/verification_log/index.vue"),
      name: "verificationLog",
      meta: { title: "鉴定记录", auth: "archivesManagement" },
    },
    {
      path: "preArchiveLibrary",
      component: () => import("@/views/archives/pre_archive_library/index.vue"),
      name: "preArchiveLibrary",
      meta: { title: "预归档库", auth: "archivesManagement" },
    },
    {
      path: "archiveRecord",
      component: () => import("@/views/archives/archive_record/index.vue"),
      name: "archiveRecord",
      meta: { title: "归档记录", auth: "archivesManagement" },
    },
    {
      path: "dataMaintenanceRequest",
      component: () => import("@/views/archives/data_maintenance_request/index.vue"),
      name: "dataMaintenanceRequest",
      meta: { title: "数据维护申请", auth: "archivesManagement" },
    },
    // 新增档案管理模块
    {
      path: "archive-project",
      component: () => import("@/views/archives/archive_project/index.vue"),
      name: "archive-project",
      meta: { title: "档案项目管理", auth: "archivesManagement" },
    },
    {
      path: "archive-volume",
      component: () => import("@/views/archives/archive_volume/index.vue"),
      name: "archive-volume",
      meta: { title: "案卷管理", auth: "archivesManagement" },
    },
    {
      path: "archive-document",
      component: () => import("@/views/archives/archive_document/index.vue"),
      name: "archive-document",
      meta: { title: "文件管理", auth: "archivesManagement" },
    },
    {
      path: "archive-volume-search",
      component: () => import("@/views/archives/archive_volume_search/index.vue"),
      name: "archive-volume-search",
      meta: { title: "案卷检索", auth: "archivesManagement" },
    },
    {
      path: "archive-document-search",
      component: () => import("@/views/archives/archive_document_search/index.vue"),
      name: "archive-document-search",
      meta: { title: "文件检索", auth: "archivesManagement" },
    },
  ],
};
export default route;
