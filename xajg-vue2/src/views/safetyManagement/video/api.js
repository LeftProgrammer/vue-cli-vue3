import request from "@/utils/request";

export function getLink(params) {
  return request({
    url: "/api/safe/protection-device/device/link",
    method: "get",
    params,
  });
}
