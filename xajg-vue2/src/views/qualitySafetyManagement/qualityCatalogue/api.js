import request from "@/utils/request";

/**
 * 查询树
 * @export axios.request
 */
export function getArchiveFileCatalogueTree() {
  return request({
    url: `/api/quality/catalogue/tree`,
  });
}
/**
 * 查询树(节点配置用)
 * @returns
 */
export function getArchiveFileCatalogueManagerTree(params) {
  console.log("paramsparamsparamsparams", params);
  return request({
    method: "get",
    url: `/api/quality/catalogue/tree/manager`,
    params,
    enableThrottle: true,
  });
}
//获取所有标段
export function sectionAllList(data) {
  return request({
    url: prefix + "/project/section/getAll",
    method: "post",
    data,
  });
}
/**
 * 查询树-档案
 * @returns
 */
export function getArchiveCatalogueTree() {
  return request({
    url: `/api/archiveCatalogueTree/tree`,
  });
}
/**
 * 查询树(节点配置用)-档案
 * @returns
 */
export function getArchiveCatalogueManagerTree() {
  return request({
    url: `/api/archiveCatalogueTree/manager/tree`,
  });
}
/**
 * 根据父节点查询子节点
 * @export axios.request
 */
export function getarchiveFileCatalogueTreeDetailed(data) {
  return request({
    url: `/api/quality/catalogue/tree/findList`,
    method: "post",
    data,
    enableThrottle: true,
  });
}
/**
 * 根据父节点查询子节点-档案
 * @export axios.request
 */
export function getArchiveCatalogueTreeDetailed(id) {
  return request({
    url: `/api/archiveCatalogueTree/tree/${id}`,
    method: "post",
  });
}
/**
 * 查询列表
 * @param {*} data
 * @returns
 */
export function archiveFileCatalogueTreeFindList(data) {
  return request({
    url: `/api/quality/catalogue/tree/findList`,
    method: "post",
    data,
    enableThrottle: true,
  });
}
/**
 * 查询列表-档案
 * @param {*} data
 * @returns
 */
export function archiveCatalogueTreeFindList(data) {
  return request({
    url: `/api/archiveCatalogueTree/findList`,
    method: "post",
    data,
  });
}

/**
 * 创建目录分类数据
 * @export axios.request
 */
export function saveArchiveFileCatalogueTree(data) {
  return request({
    url: `/api/quality/catalogue/tree/save`,
    method: "post",
    data,
  });
}
/**
 * 创建目录分类数据-预归档
 * @export axios.request
 */
export function saveArchiveCatalogueTree(data) {
  return request({
    url: `/api/archiveCatalogueTree/save`,
    method: "post",
    data,
  });
}
/**
 * 删除
 * @export axios.request
 */
export function deleteArchiveFileCatalogueTree(data) {
  return request({
    url: `/api/quality/catalogue/tree/delete`,
    method: "post",
    data,
  });
}
/**
 * 删除目录分类数据
 * @export axios.request-预归档
 */
export function deleteArchiveCatalogueTree(data) {
  return request({
    url: `/api/archiveCatalogueTree/delete`,
    method: "post",
    data,
  });
}
/**
 * 编辑目录分类数据
 * @export axios.request
 */
export function updateArchiveFileCatalogueTree(data) {
  return request({
    url: `/api/quality/catalogue/tree/update`,
    method: "post",
    data,
  });
}
/**
 * 编辑目录分类数据-预归档
 * @export axios.request
 */
export function updateArchiveCatalogueTree(data) {
  return request({
    url: `/api/archiveCatalogueTree/update`,
    method: "post",
    data,
  });
}
/**
 * 向下移动目录分类数据节点(同节点移动, 调整顺序)
 * @export axios.request
 */
export function movedownArchiveFileCatalogueTree(id) {
  return request({
    url: `/api/quality/catalogue/tree/move/down/${id}`,
  });
}
/**
 * 向下移动目录分类数据节点(同节点移动, 调整顺序)-预归档
 * @export axios.request
 */
export function movedownPreArchivingTable(id) {
  return request({
    url: `/api/archiveCatalogueTree/move/down/${id}`,
  });
}
/**
 * 向上移动目录分类数据节点(同节点移动, 调整顺序)
 * @export axios.request
 */
export function moveupArchiveFileCatalogueTree(id) {
  return request({
    url: `/api/quality/catalogue/tree/move/up/${id}`,
  });
}
/**
 * 向上移动目录分类数据节点(同节点移动, 调整顺序)-预归档
 * @export axios.request
 */
export function moveupPreArchivingTable(id) {
  return request({
    url: `/api/archiveCatalogueTree/move/up/${id}`,
  });
}
/**
 * 通过工程标识和目录ID查询文档分页数据
 * @export axios.request
 */
export function getSelectArchiveFileList(data) {
  return request({
    url: `/api/archiveFileStore/selectArchiveFileList`,
    method: "post",
    data,
  });
}
/**
 * 通过工程标识和目录ID查询文档分页数据-预归档
 * @export axios.request
 */
export function getPreArchivingDocList(data) {
  return request({
    url: `/authc-api/synthetic/doc-page-${data.engineerId}/ygd`,
    method: "post",
    data,
  });
}
// //////////////////////////////////// 文档库
/**
 * 文档库 上传文档
 * @export axios.request
 */
export function addDocs(data) {
  return request({
    url: `/authc-api/synthetic/docs`,
    method: "post",
    data,
  });
}
/**
 * 预归档文档
 * @param {*} data
 * @returns
 */
export function preArchivingDocs(data) {
  return request({
    url: `/authc-api/synthetic/docs/ygd`,
    method: "post",
    data,
  });
}
/**
 * 文档库 上传文档
 * @export axios.request
 */
export function deleteArchiveFile(params) {
  return request({
    url: `/api/archiveFileStore/deleteArchiveFile`,
    method: "delete",
    params,
  });
}
/**
 * 预归档删除
 * @param {*} id
 * @returns
 */
export function delPreArchivingDocs(id) {
  return request({
    url: `/authc-api/synthetic/docs/${id}/ygd`,
    method: "delete",
  });
}
/**
 * 修改预归档状态
 * @param {*} params
 * @returns
 */
export function changePreArchivingDocsStatus(data) {
  return request({
    url: `/authc-api/synthetic/docs/status/ygd`,
    method: "post",
    data,
  });
}

/**
 * 文档库 修改文件基本信息
 * @export axios.request
 */
export function updateArchiveFile(data) {
  return request({
    url: `/api/archiveFileStore/updateArchiveFile`,
    method: "post",
    data,
  });
}
/**
 * 文档库 修改文件基本信息
 * @export axios.request
 */
export function fileSubmit(params) {
  return request({
    url: `/api/archiveFileStore/fileSubmit`,
    params,
  });
}
/**
 * 查询文件详情
 * @export axios.request
 */
export function getArchiveFileDetail(params) {
  return request({
    url: `/api/archiveFileStore/getArchiveFileDetail`,
    params,
  });
}
/**
 * 更新三方四审签章
 * @export axios.request
 */
export function updateSfssForm(data) {
  return request({
    url: `/api/progressConfig/updateSfssForm`,
    method: "post",
    data,
  });
}
/**
 * 根据关联文件查询文件
 * @export axios.request
 */
export function getArchiveFileByBusinessId(params) {
  return request({
    url: `/api/archiveFileStore/getByBusinessId`,
    params,
  });
}

/**
 * 查询附件列表
 * @param {*} params
 * @returns
 */
export function getArchiveFileAttDetail(params) {
  return request({
    url: `/api/archiveFileStore/getArchiveFileAttDetail`,
    params,
  });
}
/**
 * 新增附件
 * @param {*} data
 * @returns
 */
export function addFileAttachment(id, data) {
  return request({
    url: `/api/archiveFileStore/addFileAttachmen/${id}`,
    method: "post",
    data,
  });
}
/**
 * 删除附件
 * @param {*} params
 * @returns
 */
export function deleteFileAttachment(params) {
  return request({
    url: `/api/archiveFileStore/deleteFileAttachmen`,
    method: "delete",
    params,
  });
}
/**
 * 文件下移
 * @param {*} params
 * @returns
 */
export function moveDownFileAttachment(params) {
  return request({
    url: `/api/archiveFileStore/moveDownFileAttachmen`,
    params,
  });
}
/**
 * 文件上移
 * @param {*} params
 * @returns
 */
export function moveUpFileAttachment(params) {
  return request({
    url: `/api/archiveFileStore/moveUpFileAttachmen`,
    params,
  });
}
/**
 * 文件鉴定
 * @param {*} data
 * @returns
 */
export function fileAuthenticate(data) {
  return request({
    url: `/api/archiveFileStore/fileAuthenticate`,
    method: "post",
    data,
  });
}
/**
 * 导出鉴定记录
 * @param {*} data
 * @returns
 */
export function archiveAuthenticateRecordDownload(params) {
  return request({
    url: `/api/archiveAuthenticateRecord/download`,
    params,
  });
}

// 预归档
/**
 * 组卷
 * @param {*} data
 * @returns
 */
export function addArchiveAdvance(data) {
  return request({
    url: `/api/archiveAdvanceStore/addArchiveAdvance`,
    method: "post",
    data,
  });
}
/**
 * 案卷删除
 * @param {*} params
 * @returns
 */
export function deleteAdvance(params) {
  return request({
    url: `/api/archiveAdvanceStore/deleteAdvance`,
    method: "delete",
    params,
  });
}
/**
 * 案卷详情查询
 * @param {*} id
 * @returns
 */
export function getArchiveAdvanceStoreDetail(id) {
  return request({
    url: `/api/archiveAdvanceStore/detail/${id}`,
  });
}
/**
 * 导出案卷
 * @param {*} data
 * @returns
 */
export function archiveAdvanceStoreDownload(data) {
  return request({
    url: `/api/archiveAdvanceStore/download`,
    method: "post",
    data,
  });
}
/**
 * 案卷下载
 * @returns
 */
export function archiveAdvanceStoreDownloadFile(params) {
  return request({
    url: `/api/archiveAdvanceStore/downloadFile`,
    params,
  });
}
/**
 * 卷内文件下移
 * @param {*} params
 * @returns
 */
export function moveDownAdvanceFile(params) {
  return request({
    url: `/api/archiveAdvanceStore/moveDownAdvanceFile`,
    params,
  });
}
/**
 * 卷内文件上移
 * @param {*} params
 * @returns
 */
export function moveUpAdvanceFile(params) {
  return request({
    url: `/api/archiveAdvanceStore/moveUpAdvanceFile`,
    params,
  });
}
/**
 * 卷内列表查询
 * @param {*} id
 * @param {*} params
 * @returns
 */
export function archiveAdvanceStoreFileList(id) {
  return request({
    url: `/api/archiveAdvanceStore/storeFileList/${id}`,
  });
}
/**
 * 案卷修改
 * @param {*} data
 * @returns
 */
export function updateArchiveAdvance(data) {
  return request({
    url: `/api/archiveAdvanceStore/updateArchiveAdvance`,
    method: "post",
    data,
  });
}
/**
 * 文件鉴定日期目录树
 * @returns
 */
export function getArchiveAuthenticateRecordRecordList() {
  return request({
    url: `/api/archiveAuthenticateRecord/getRecordList`,
  });
}
/**
 * 查询文件鉴定记录
 * @param {*} data
 * @returns
 */
export function getRecordList(data) {
  return request({
    url: `/api/archiveAuthenticateRecord/getRecordList`,
    method: "post",
    data,
  });
}
/**
 * 文件预归档列表
 * @param {*} data
 * @returns
 */
export function archiveAdvanceStorePageList(data) {
  return request({
    url: `/api/archiveAdvanceStore/pageList`,
    method: "post",
    data,
  });
}
/**
 * 归档记录查询列表
 * @param {*} data
 * @returns
 */
export function archiveFileRecordPageList(data) {
  return request({
    url: `/api/archiveFileRecord/pageList`,
    method: "post",
    data,
  });
}
/**
 * 获取流程配置
 * @param {*} packageId
 * @returns
 */
export function getFlowConfigs(params) {
  return request({
    url: `/api/progressConfig/getConfigList`,
    params,
  });
}
/**
 * 获取待办信息
 * @param {*} data
 * @returns
 */
export function getTodoReadBusiness(data) {
  return request({
    url: `/api/process/read/business/todo-read`,
    method: "post",
    data,
  });
}
/**
 * 获取流程信息
 * @param {*} data
 * @returns
 */
export function getSentReadBusiness(data) {
  return request({
    url: `/api/process/read/business/sent-read`,
    method: "post",
    data,
  });
}
/**
 * 获取待发流程信息
 * @param {*} data
 * @returns
 */
export function getWaitReadBusiness(data) {
  return request({
    url: `/api/process/read/business/wait-read`,
    method: "post",
    data,
  });
}
/**
 * 获取文件页数
 * @param {*} data
 * @returns
 */
export function getPageInfo(data) {
  return request({
    url: `/api/archiveFileStore/getPageInfo`,
    method: "post",
    data,
  });
}
/**
 * 获取当前登录人单位
 * @returns
 */
export function findUserBelongToList() {
  return request({
    url: `/api/archiveFileStore/findUserBelongToList`,
  });
}
/**
 * 获取已办信息
 * @param {*} data
 * @returns
 */
export function getFinishedReadBusiness(data) {
  return request({
    url: `/api/process/read/business/finished-read`,
    method: "post",
    data,
  });
}
/**
 * 查询字典列表
 * @param {*} params
 * @returns
 */
export function getDictList(params) {
  return request({
    url: `/api/dict/getDictList`,
    params,
  });
}
/**
 * 获取三方四审文件
 * @param {*} data
 * @returns
 */
export function getAdvanceData(data) {
  return request({
    url: `/api/archiveAdvanceStore/getAdvanceData`,
    method: "post",
    data,
  });
}
/**
 * 查询用户角色：三方四审流程中档案系统监理单位
 * @param {*} data
 * @returns
 */
export function getSfssRole(params) {
  return request({
    url: `/api/progressConfig/getSfssRole`,
    params,
  });
}
/**
 * 获取登录用户指定节点的文件库权限
 * @param {*} data
 * @returns
 */
export function getFileStorePermissionByLoginUser(params) {
  return request({
    url: `/api/archivePermission/getFileStorePermissionByLoginUser`,
    params,
  });
}
/**
 * 查询文件库目录树权限列表
 * @param {*} data
 * @returns
 */
export function getSelectFileStorePermission(data) {
  return request({
    url: `/api/archivePermission/selectFileStorePermission`,
    method: "post",
    data,
  });
}
/**
 * 查询文件库权限下拉列表
 * @param {*} data
 * @returns
 */
export function getFilePermissionList() {
  return request({
    url: `/api/archivePermission/getFilePermissionList`,
  });
}
/**
 * 新增文件库目录树权限
 * @param {*} data
 * @returns
 */
export function addFileStorePermission(data) {
  return request({
    url: `/api/archivePermission/addFileStorePermission`,
    method: "post",
    data,
  });
}
/**
 * 更新文件库目录树权限
 * @param {*} data
 * @returns
 */
export function updateFileStorePermission(data) {
  return request({
    url: `/api/archivePermission/updateFileStorePermission`,
    method: "post",
    data,
  });
}
/**
 * 删除文件库目录树权限
 * @param {*} data
 * @returns
 */
export function deleteFileStorePermission(params) {
  return request({
    url: `/api/archivePermission/deleteFileStorePermission`,
    method: "delete",
    params,
  });
}

/**
 * 查询预归档库目录树权限列表
 * @param {*} data
 * @returns
 */
export function getSelectAdvanceStorePermission(data) {
  return request({
    url: `/api/archivePermission/selectAdvanceStorePermission`,
    method: "post",
    data,
  });
}
/**
 * 查询预归档库权限下拉列表
 * @param {*} data
 * @returns
 */
export function getAdvancePermissionList() {
  return request({
    url: `/api/archivePermission/getAdvancePermissionList`,
  });
}
/**
 * 新增预归档库目录树列表
 * @param {*} data
 * @returns
 */
export function addAdvanceStorePermission(data) {
  return request({
    url: `/api/archivePermission/addAdvanceStorePermission`,
    method: "post",
    data,
  });
}
/**
 * 更新预归档库目录树权限
 * @param {*} data
 * @returns
 */
export function updateAdvanceStorePermission(data) {
  return request({
    url: `/api/archivePermission/updateAdvanceStorePermission`,
    method: "post",
    data,
  });
}
/**
 * 批量修改文件节点
 * @param {*} data
 * @returns
 */
export function batchUpdateNode(nodeId, data) {
  return request({
    url: `/api/archiveFileStore/batchUpdateNode/${nodeId}`,
    method: "post",
    data,
  });
}

/**
 * 删除预归档库目录树权限
 * @param {*} data
 * @returns
 */
export function deleteAdvanceStorePermission(params) {
  return request({
    url: `/api/archivePermission/deleteAdvanceStorePermission`,
    method: "delete",
    params,
  });
}
/**
 * 获取文件下载路径
 * @param {*} data
 * @returns
 */
export function getFilePath(data) {
  return request({
    url: `/api/file/getFilePath`,
    method: "post",
    data,
  }).then((res) => {
    if (res.data) {
      // 处理文件返回路径, 使用相对路径
      const url = new URL(res.data);
      res.data = `${url.pathname}${url.search}`;
      if (res.data.includes(".xml")) {
        // 处理xml文件特殊访问
        res.data = `/api/file/getFileForApp?fileInfoId=${data.fileInfoId}`;
      }
    }
    return res;
  });
}
/**
 * 生成表单数据
 * @param {*} data
 * @returns
 */
export function makePdfByForm(data) {
  return request({
    url: `/api/archiveMaintenance/makePdfByForm`,
    method: "post",
    data,
  });
}
/**
 * 获取文件业务id
 * @param {*} data
 * @returns
 */
export function getBusinessList(params) {
  return request({
    url: `/api/archiveMaintenance/getBusinessList`,
    params,
  });
}
/**
 * 获取文件业务是否需要附件
 * @param {*} params
 * @returns
 */
export function getBusinessType(params) {
  return request({
    url: `/api/archiveMaintenance/getBusinessType`,
    params,
  });
}
