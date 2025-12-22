import request from "@/utils/request";

export function getTypeCorp() {
  return request({
    url: "/api/system/corporates/tree",
    method: "GET",
  });
}

export function getTypeDepart(corpId) {
  return request({
    url: `/api/system/departments/tree/${corpId}/corp`,
    method: "GET",
  });
}
