import request from "@/utils/request";

export function getSectionByCorpId(params) {
  return request({
    url: `/api/project/section/getSectionByCorpId`,
    method: "get",
    params,
  });
}
