import qs from "qs";
import request from "@/utils/request";
import {
  transformAbpListQuery,
  buildPagingQueryResult,
} from "@/utils/bimengine/abpParamsTransform";
import requestModel from "@/utils/bimengine/requestModel";
import store from "@/store";

const api = {
  // 文档
  doc: `/api/app/document`,
  addFile: `/api/app/document/file`,
  children: `/api/app/document/children`,
  getCount: `/api/app/document/count`,
  //文档版本
  docVer: `/api/app/document-ver`,
  //文档日志
  docLog: `/api/app/document-log`,
  docMerge: `/api/app/document-merge`, //合模
  documentHandle: "/api/app/document-handle",
  documentConfig: "/api/app/document-config",
};

/**
 * 保存项目信息
 * @param {*} parameter
 * @returns
 */
export function saveDocument(parameter) {
  const url = parameter.id ? `${api.doc}/${parameter.id}` : api.doc;
  return request({
    url: url,
    method: parameter.id ? "put" : "post",
    data: parameter,
  });
}

/**添加文档结构 */
export function addDoc(parameter) {
  return request({
    url: api.doc,
    method: "post",
    data: parameter,
  });
}

/**添加文件 */
export function addFile(parameter) {
  return request({
    url: url,
    method: "post",
    data: parameter,
  });
}
/**移动文档文件 */
export function moveDoc({ moveId, documentIds }) {
  return request({
    url: `${api.doc}/move/${moveId}`,
    method: "put",
    data: documentIds,
  });
}
/**公开文档文件 */
export function openStatusDoc({ openStatus, documentIds }) {
  return request({
    url: `${api.doc}/openstatus?openStatus=${openStatus}`,
    method: "put",
    data: documentIds,
  });
}
/**修改文档 */
export function updateDoc(parameter) {
  return request({
    url: `${api.doc}/${parameter.id}`,
    method: "put",
    data: parameter,
  });
}
/**删除文档 */
export function delDoc(id) {
  return request({
    url: `${api.doc}/${id}`,
    method: "delete",
  });
}
/**根据Id获取文档信息 */
export function getDocById(id) {
  return request({
    url: `${api.doc}/` + id,
    method: "get",
  });
}

/**查询文档列表 */
export function getDocList(parameter) {
  return request({
    url: api.doc,
    method: "get",
    params: parameter,
    paramsSerializer: (params) => {
      return qs.stringify(params, { indices: false });
    },
  });
}

/**
 * 查询子集
 * @param {*} projectId
 * @param {*} parentId
 * @param {*} structureType 0:项目，1：子项目，2：设计院，3：部门，4：文件夹，5：文件
 * @param {*} isModel
 * @returns
 */
export function getDocChild(parameter) {
  return request({
    url: `${api.children}/${parameter.parentId}`,
    method: "get",
    params: parameter,
    paramsSerializer: (params) => {
      return qs.stringify(params, { indices: false });
    },
  });
}

/**
 * 查询文档树结构
 * @param {*} projectId 项目Id
 * @param {*} docType 空：查所有文件和文件；-1:所有文件夹，其他：查本级和所有父级
 * @returns
 */
export function getDocTree(docType) {
  return request({
    url: `${api.doc}/tree`,
    method: "get",
    params: { docType: docType },
  });
}

/**
 * 查询多个
 */
export function getArray(parameter) {
  return request({
    url: `${api.doc}/array`,
    method: "get",
    params: { ids: parameter },
    paramsSerializer: function (parameter) {
      return qs.stringify(parameter, { indices: false });
    },
  });
}

/**
 * 上传文件
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function uploadDocumentFiles(projectId, parentId, formData) {
  return await request({
    url: `${api.documentHandle}/${parentId}/upload-files?projectId=${projectId}`,
    method: "post",
    data: formData,
  });
}
/**
 * 下载文件
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function downloadFile(documentId) {
  return await request({
    url: `${api.documentHandle}/${documentId}/download-files`,
    method: "post",
    responseType: "arraybuffer",
  });
}
/**
 * 上传资料文件
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function uploadDocumentFileList(projectId, parentId, formData) {
  return await request({
    url: `${api.documentHandle}/${parentId}/upload-file-list?projectId=${projectId}`,
    method: "post",
    data: formData,
  });
}

/**
 * 获取文档用户
 * @param {*} documentId
 * @returns
 */
export function getDocUsers(documentId) {
  return request({
    url: `${api.doc}/${documentId}/users`,
    method: "get",
  });
}
/**
 * 获取模型数量轻量化成功数量:a/b
 * @returns
 */
export function getDocCount() {
  return request({
    url: api.getCount,
    method: "get",
  });
}

/**根据Id获取文档信息操作记录 */
export function getDocLog(id) {
  return request({
    url: `${api.docLog}/by-docid/${id}`,
    method: "get",
  });
}
/**根据Id获取Word Html */
export function getWordHtml(fileName, page) {
  return request({
    url: `${api.doc}/word-html?blobName=${fileName}&page=${page}`,
    method: "get",
  });
}
/**根据Id获取Excel Html */
export function getExcelHtml(fileName) {
  return request({
    url: `${api.doc}/excel-html?fileName=${fileName}`,
    method: "get",
  });
}
/**获取帮助文档 */
export function getHelpHtml() {
  return request({
    url: `${api.doc}/help-html`,
    method: "get",
  });
}
/**获取用户协议文档 */
export function getAgreementHtml() {
  return request({
    url: `${api.doc}/agreement-html`,
    method: "get",
  });
}

/**
 * 获取视频地址
 */
export function getVideoPath(id) {
  return request({
    url: `${api.doc}/${id}/video-path`,
    method: "get",
  });
}

/**移动文件 */
export function moveFile(id, parameter) {
  return request({
    url: `${api.doc}/${id}/move-file`,
    method: "post",
    data: parameter,
  });
}
/**
 * 获取文档合模
 * @param {*} documentId
 * @returns
 */
export function getDocMerges(documentId) {
  return request({
    url: `${api.doc}/${documentId}/merge`,
    method: "get",
  });
}

export function breakpointContinuation(params) {
  return request({
    url: `${api.documentHandle}/breakpoint-continuation/${params.parentId}`,
    method: "post",
    data: params,
  });
}

export function merge(params) {
  return request({
    url: `${api.documentHandle}/${params.id}/merge`,
    method: "post",
    params: params,
  });
}
/**
 * 获取所有子对象
 */
export function getAllChildrens(id) {
  return request({
    url: `/api/app/document/${id}/child-tree`,
    method: "get",
  });
}

/**
 * 获取文件大小
 */
export function getDownloadFileSize(fileName) {
  return request({
    url: `${api.documentHandle}/download-file-size`,
    method: "get",
    params: { fileName: fileName },
  });
}

export function downloadFileSlice(params) {
  return request({
    url: `${api.documentHandle}/download-files`,
    method: "post",
    params: params,
    responseType: "arraybuffer",
  });
}

export function splitUploadFile(params) {
  return requestModel({
    url: `/api/app/model/SplitUploadFile`,
    method: "post",
    data: params,
    headers: { Accept: "application/octet-stream" },
  });
}

/**
 * 模型文件上传接口
 * @returns {Promise<AxiosResponse<T>>}
 */
export function uploadModelFile(params) {
  const formData = new FormData();
  formData.append("file", params.file, params.input.Name);
  formData.append("chunk", params.chunk);
  formData.append("chunks", params.chunks);
  let input = store.state.modelInput;
  if (params.fileName.toLowerCase().indexOf(".fbx") >= 0) {
    input.ConfigJson.unitRatio = 1;
  }
  input = { ...input, ...params.input };
  formData.append("input", JSON.stringify(input));
  return requestModel({
    url: `/api/app/model/SplitUploadFile`,
    method: "post",
    data: formData,
  });
}
/**
 * CAD文件上传接口
 * @returns {Promise<AxiosResponse<T>>}
 */
export function uploadCADFile(params) {
  const formData = new FormData();
  formData.append("file", params.file, params.fileName);
  formData.append("chunk", params.chunk);
  formData.append("chunks", params.chunks);
  let input = store.state.cadInput;
  input = { ...input, ...params.input };
  formData.append("input", JSON.stringify(input));
  return requestModel({
    url: `/api/app/model/SplitUploadFile`,
    method: "post",
    data: formData,
  });
}

/**
 * Osgb文件上传接口
 * @returns {Promise<AxiosResponse<T>>}
 */
export function uploadOsgbFile(params) {
  const formData = new FormData();
  formData.append("file", params.file, params.input.Name); //此处name值一直保持一致，因此不能用params.fileName
  formData.append("chunk", params.chunk);
  formData.append("chunks", params.chunks);
  let input = {
    Name: "",
    LightweightName: "",
    InitiatingUser: "",
    UniqueCode: "",
    Priority: "202",
    ModelUploadUrl: "",
    OtherInfo: "",
  };
  input = { ...input, ...params.input };
  formData.append("input", JSON.stringify(input));
  return requestModel({
    url: `/api/app/gismodel/OSGBSplitUploadFile`,
    method: "post",
    data: formData,
  });
}

/**
 * Osgb文件上传接口
 * file 要上传的文件
 * chunk 分段索引
 * modelname 接口返回的模型名称
 * blockSize 分块后每块的大小
 * UploadSend 方法执行中的回调，返回执行进度
 * UploadOver 方法执行完成后的回调
 */
export function uploadOsgbSplitFile(
  file,
  chunk,
  modelname,
  blockSize,
  UploadSend,
  UploadOver
) {
  var chunkCont = Math.ceil(file.size / blockSize);
  var nextSize = Math.min((chunk + 1) * blockSize, file.size); //读取到结束位置
  var fileData = file.slice(chunk * blockSize, nextSize); //截取 部分文件 块
  var filename = encodeURIComponent(file.name);

  const formData = new FormData();
  formData.append("file", fileData, filename); //将 部分文件 塞入FormData
  formData.append("chunk", chunk);
  formData.append("chunks", chunkCont);

  var index1 = filename.lastIndexOf(".");
  var index2 = filename.length;
  var postf = filename.substring(index1 + 1, index2).toLowerCase(); //后缀名

  //模型文件上传接口传递的参数
  var params = {
    Name: file.name,
    LightweightName: modelname,
    Priority: "203",
  };

  let input = store.state.gisInput;
  input = { ...input, ...params };

  formData.append("input", JSON.stringify(input));
  return requestModel({
    url: `/api/app/gismodel/OSGBSplitUploadFile`,
    method: "post",
    data: formData,
  }).then((retdata) => {
    if (chunk + 1 == chunkCont) {
      //如果上传完成，则跳出继续上传
      if (UploadOver) {
        UploadOver(retdata, file.name);
      }
    } else {
      if (UploadSend) {
        var sendint = ((nextSize / file.size) * 100).toFixed(2);
        UploadSend(parseFloat(sendint));
      }
      uploadOsgbSplitFile(
        file,
        ++chunk,
        retdata.datas.lightweightName,
        blockSize,
        UploadSend,
        UploadOver
      ); //递归调用
    }
  });
}

/**
 * 点云文件上传
 */
export function uploadPointCloudFile(params) {
  const formData = new FormData();
  formData.append("file", params.file, params.input.Name);
  formData.append("chunk", params.chunk);
  formData.append("chunks", params.chunks);
  let input = {
    Name: "",
    LightweightName: "",
    InitiatingUser: "",
    UniqueCode: "",
    Priority: "202",
    ModelUploadUrl: "",
    OtherInfo: "",
  };
  input = { ...input, ...params.input };
  formData.append("input", JSON.stringify(input));
  return requestModel({
    url: `/api/app/gismodel/PointCloudSplitUploadFile`,
    method: "post",
    data: formData,
  });
}

/**
 * 模型上传时保存轻量化配置参数
 * @param {*} parameter
 * @returns
 */
export function addDocumentConfig(params) {
  return request({
    url: api.documentConfig,
    method: "post",
    data: params,
  });
}

/**
 * 根据id获取模型轻量化参数
 * @param {*} id 模型id
 * @returns
 */
export function getDocumentConfig(params) {
  return request({
    url: api.documentConfig,
    method: "get",
    params: params,
  });
}

/**
 * shp文件上传接口
 */
export function uploadShpFile(params) {
  const formData = new FormData();
  formData.append("file", params.file, params.input.Name);
  formData.append("chunk", params.chunk);
  formData.append("chunks", params.chunks);
  let input = {
    Name: "",
    LightweightName: "",
    InitiatingUser: "",
    UniqueCode: "",
    Priority: "202",
    ModelUploadUrl: "",
    OtherInfo: "",
  };
  input = { ...input, ...params.input };
  formData.append("input", JSON.stringify(input));
  return requestModel({
    url: `/api/app/gismodel/ShpSplitUploadFile`,
    method: "post",
    data: formData,
  });
}

/**
 * 模型专业结构树获取接口
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getProfessionalStructureTree(params) {
  return requestModel({
    url: `api/app/model/GetProfessionalStructureData`,
    method: "get",
    params: params,
  });
}

/**
 * 模型专业结构树节点构件id获取接口
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getProfessionalStructureIdList(params) {
  return requestModel({
    url: `api/app/model/GetModelTypeFeatureIdByPid`,
    method: "get",
    params: params,
  });
}

/**
 * 模型楼层结构树获取接口
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getFloorStructureTree(params) {
  return requestModel({
    url: `api/app/model/GetFloorStructureData`,
    method: "get",
    params: params,
  });
}

/**
 * 模型楼层结构树节点构件id获取接口
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getModelTypeTreeIdList(params) {
  return requestModel({
    url: `api/app/model/GetModelTreeFeatureIdByPid`,
    method: "get",
    params: params,
  });
}

/**
 * 模型空间结构树获取接口
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getSpatialStructureTree(params) {
  return requestModel({
    url: `api/app/model/GetSpatialStructureData`,
    method: "get",
    params: params,
  });
}

/**
 * 模型空间结构树节点构件id获取接口
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getSpatialStructureIdList(params) {
  return requestModel({
    url: `api/app/model/GetModelSpaceFeatureIdByPid`,
    method: "get",
    params: params,
  });
}

/**
 * 模型视图获取接口
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getModelView(params) {
  return requestModel({
    url: `api/app/model/model3DViews`,
    method: "get",
    params: params,
  });
}

/**
 * 模型图纸获取接口
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getModelDrawing(params) {
  return requestModel({
    url: `api/app/model/GetModelDrawing`,
    method: "get",
    params: params,
  });
}

/**
 * 构件属性获取接口
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getFeatureProperty(params) {
  return requestModel({
    url: `api/app/model/property-data-by-externalid`,
    method: "get",
    params: params,
  });
}

/**
 * 坐标校正
 * @returns {Promise<AxiosResponse<T>>}
 */
export function uploadCoordinate(params) {
  return requestModel({
    url: `/api/app/model/coordinate-correction-service?LightweightName=${params.LightweightName}&lon=${params.lon}&lat=${params.lat}&height=${params.height}`,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=utf8",
      Token: store.state.bim.defaults.secretkey,
    },
  });
}

/**
 * 模型下载
 */
export function downloadModel(params) {
  return requestModel({
    url: `/api/app/model/down-load-model-source-file?LightweightName=${params}`,
    method: "get",
    responseType: "blob",
  });
}

/**
 * cad下载
 */
export function downloadCAD(params) {
  return requestModel({
    //url:`/api/app/cad-drawing/down-load-drawing-source-file?LightweightName=${params}`,
    url: `/api/app/model/down-load-model-source-file?LightweightName=${params}`,
    method: "get",
    responseType: "blob",
  });
}

/**
 * Osgb下载
 */
export function downloadOsgb(params) {
  return requestModel({
    url: `/api/app/gismodel/DownLoadSourceFile?LightweightName=${params}`,
    method: "get",
    responseType: "blob",
  });
}

/**
 * shp下载
 */
export function downloadShp(params) {
  return requestModel({
    url: `/api/app/gismodel/DownLoadSourceFile?LightweightName=${params}`,
    method: "get",
    responseType: "blob",
  });
}

/**
 * PointClond下载
 */
export function downloadPointCloud(params) {
  return requestModel({
    url: `/api/app/gismodel/DownLoadSourceFile?LightweightName=${params}`,
    method: "get",
    responseType: "blob",
  });
}

/**
 * 上传模型（document表数据）
 */
export function uploadModel(params) {
  return request({
    url: `${api.documentHandle}/${params.id}/upload-model`,
    method: "post",
    params: params,
  });
}
