import request from "@/utils/request";

// ==================== 档案项目管理 ====================

/**
 * 分页查询档案项目
 * @param {Object} data - 查询参数
 */
export function getProjectPage(data) {
  return request({
    url: "/api/archives/project/page",
    method: "post",
    data,
    enableThrottle: true,
  });
}

/**
 * 获取项目列表(下拉选择用)
 */
export function getProjectList() {
  return request({
    url: "/api/archives/project/list",
    method: "get",
    enableThrottle: true,
  });
}

/**
 * 获取项目详情
 * @param {Number} id - 项目ID
 */
export function getProjectDetail(id) {
  return request({
    url: "/api/archives/project/get",
    method: "get",
    params: { id },
    enableThrottle: true,
  });
}

/**
 * 保存项目
 * @param {Object} data - 项目数据
 */
export function saveProject(data) {
  return request({
    url: "/api/archives/project/save",
    method: "post",
    data,
    enableThrottle: true,
  });
}

/**
 * 更新项目
 * @param {Object} data - 项目数据
 */
export function updateProject(data) {
  return request({
    url: "/api/archives/project/update",
    method: "post",
    data,
    enableThrottle: true,
  });
}

/**
 * 删除项目
 * @param {Number} id - 项目ID
 */
export function deleteProject(id) {
  return request({
    url: `/api/archives/project/delete/${id}`,
    method: "get",
    enableThrottle: true,
  });
}

// ==================== 案卷管理 ====================

/**
 * 分页查询案卷
 * @param {Object} data - 查询参数
 */
export function getVolumePage(data) {
  return request({
    url: "/api/archives/volume/page",
    method: "post",
    data,
    enableThrottle: true,
  });
}

/**
 * 根据项目ID获取案卷列表
 * @param {Number} projectId - 项目ID
 */
export function getVolumeListByProject(projectId) {
  return request({
    url: `/api/archives/volume/list/${projectId}`,
    method: "get",
    enableThrottle: true,
  });
}

/**
 * 获取案卷详情
 * @param {Number} id - 案卷ID
 */
export function getVolumeDetail(id) {
  return request({
    url: "/api/archives/volume/get",
    method: "get",
    params: { id },
    enableThrottle: true,
  });
}

/**
 * 统计项目下案卷数量
 * @param {Number} projectId - 项目ID
 */
export function getVolumeCount(projectId) {
  return request({
    url: `/api/archives/volume/count/${projectId}`,
    method: "get",
    enableThrottle: true,
  });
}

/**
 * 保存案卷
 * @param {Object} data - 案卷数据
 */
export function saveVolume(data) {
  return request({
    url: "/api/archives/volume/save",
    method: "post",
    data,
    enableThrottle: true,
  });
}

/**
 * 更新案卷
 * @param {Object} data - 案卷数据
 */
export function updateVolume(data) {
  return request({
    url: "/api/archives/volume/update",
    method: "post",
    data,
    enableThrottle: true,
  });
}

/**
 * 删除案卷
 * @param {Number} id - 案卷ID
 */
export function deleteVolume(id) {
  return request({
    url: `/api/archives/volume/delete/${id}`,
    method: "get",
    enableThrottle: true,
  });
}

// ==================== 文件管理 ====================

/**
 * 分页查询文件
 * @param {Object} data - 查询参数
 */
export function getDocumentPage(data) {
  return request({
    url: "/api/archives/document/page",
    method: "post",
    data,
    enableThrottle: true,
  });
}

/**
 * 根据案卷ID获取文件列表
 * @param {Number} volumeId - 案卷ID
 */
export function getDocumentListByVolume(volumeId) {
  return request({
    url: `/api/archives/document/list/${volumeId}`,
    method: "get",
    enableThrottle: true,
  });
}

/**
 * 获取文件详情
 * @param {Number} id - 文件ID
 */
export function getDocumentDetail(id) {
  return request({
    url: "/api/archives/document/get",
    method: "get",
    params: { id },
    enableThrottle: true,
  });
}

/**
 * 统计案卷下文件数量
 * @param {Number} volumeId - 案卷ID
 */
export function getDocumentCount(volumeId) {
  return request({
    url: `/api/archives/document/count/${volumeId}`,
    method: "get",
    enableThrottle: true,
  });
}

/**
 * 保存文件
 * @param {Object} data - 文件数据
 */
export function saveDocument(data) {
  return request({
    url: "/api/archives/document/save",
    method: "post",
    data,
    enableThrottle: true,
  });
}

/**
 * 更新文件
 * @param {Object} data - 文件数据
 */
export function updateDocument(data) {
  return request({
    url: "/api/archives/document/update",
    method: "post",
    data,
    enableThrottle: true,
  });
}

/**
 * 删除文件
 * @param {Number} id - 文件ID
 */
export function deleteDocument(id) {
  return request({
    url: `/api/archives/document/delete/${id}`,
    method: "get",
    enableThrottle: true,
  });
}

// ==================== 综合检索 ====================

/**
 * 案卷检索
 * @param {Object} data - 查询参数
 */
export function searchVolume(data) {
  return request({
    url: "/api/archives/search/volume",
    method: "post",
    data,
    enableThrottle: true,
  });
}

/**
 * 文件检索
 * @param {Object} data - 查询参数
 */
export function searchDocument(data) {
  return request({
    url: "/api/archives/search/document",
    method: "post",
    data,
    enableThrottle: true,
  });
}
