import request from "@/utils/request";

const prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/external/service/locator/save",
    method: "post",
    data,
  });
}

export function remove(type, code) {
  return request({
    url: prefix + "/external/service/locator/delete",
    method: "post",
    params: {
      type,
      code
    }
  });
}

export function page(data) {
  return request({
    url: prefix + "/external/service/locator/page",
    method: "post",
    data,
  });
}

export const SafeLocationTypeEnum = {
  PERSON: 1,  // 人员
  EQUIPMENT: 2  // 设备
}
