import request from "@/utils/request";

let prefix = "/api";

export function getByCodes(codes) {
  return request({
    url: prefix + "/project/pbs/get/codes/" + codes,
    method: "get",
  });
}

export function appBimStat(pbsCodes) {
  return request({
    url: prefix + "/bim/common/appBimStat?pbsCodes=" + pbsCodes,
    method: "get",
  });
}
