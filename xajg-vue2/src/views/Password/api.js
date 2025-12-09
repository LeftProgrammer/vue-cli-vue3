import request from "@/utils/request";

let prefix = "/api";
export function getUser(data) {
  return request({
    url: prefix + "/design/plan/page",
    method: "post",
    data,
  });
}
