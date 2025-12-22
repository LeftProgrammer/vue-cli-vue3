import request from "@/utils/request";

let prefix = "/api";

export function page(data) {
  return request({
    method: "post",
    url: prefix + "/synthesis/manage/page",
    data,
  });
}
