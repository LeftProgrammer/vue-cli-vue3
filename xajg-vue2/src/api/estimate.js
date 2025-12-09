import request from "@/utils/request";

/**
 * 查询树
 * @export axios.request
 */
export function getEstimateCatalogueManagerTree() {
  return request({
    url: `/api/investment/estimate/tree/manager/tree`,
    enableThrottle: true,
  });
}

export function saveEstimateCatalogueTree(data) {
  return request({
    url: `/api/investment/estimate/saveTree/`,
    method: `post`,
    data,
  });
}
export function updateEstimateCatalogueTree(data) {
  return request({
    url: `/api/investment/estimate/saveTree`,
    method: `post`,
    data,
  });
}
export function deleteEstimateCatalogueTree(data) {
  return request({
    url: `/api/investment/estimate/deleteTree/`,
    method: `post`,
    data,
  });
}

export function estimateCatalogueTreeFindList(data) {
  return request({
    url: `api/investment/estimate/tree/findList`,
    method: `post`,
    data,
    enableThrottle: true,
  });
}

export function movedownEstimateCatalogueTable(id) {
  return request({
    url: `/api/investment/estimate/tree/move/down/${id}`,
  });
}
export function moveupEstimateCatalogueTable(id) {
  return request({
    url: `/api/investment/estimate/tree/move/up/${id}`,
  });
}

export function getSelectEstimateFileList(data) {
  return request({
    url: `/api/investment/estimate/item/page`,
    method: `post`,
    data,
    enableThrottle: true,
  });
}

export function getEstimateItemDetail(id) {
  return request({
    url: `/api/investment/estimate/item/${id}`,
    method: `get`,
  });
}

export function saveEstimateItem(data) {
  return request({
    url: `/api/investment/estimate/saveItem`,
    method: `post`,
    data,
  });
}

export function updateEstimateItem(data) {
  return request({
    url: `/api/investment/estimate/updateItem`,
    method: `post`,
    data,
  });
}

export function deleteEstimateItem(id) {
  return request({
    url: `/api/investment/estimate/item/delete/${id}`,
  });
}
export function getEstimateList() {
  return request({
    url: "api/investment/estimate/item/list",
    method: "get",
  });
}

export function deleteInvestmentPlanDetailList(idList) {
  return request({
    url: "api/investment/plan/deleteInvestmentPlanDetailList",
    method: "post",
    data: idList,
  });
}

export function deleteRealDetail(data) {
  return request({
    url: "/api/investment/real/deleteDetail",
    method: "post",
    data: data,
  });
}
