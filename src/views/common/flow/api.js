import request from "@/utils/request";

const prefix = "/api";

// 催办
export function sendMessage(data) {
  return request({
    url: `${prefix}/plt/flow/urge`,
    method: "post",
    data,
  });
}
