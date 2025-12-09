import request from "@/utils/request";

let prefix = "/api";

export function manager_flat(params) {
  return request({
    url: prefix + "/investment/estimate/tree/manager/flat",
    method: "get",
    params,
  });
}
export function getRecordIdBySub(subId) {
  return request({
    url: prefix + `/contract/investGeneralPay/getRecordIdBySub/${subId}`,
    method: "get",
  });
}
