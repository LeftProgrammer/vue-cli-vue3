import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/drawing/issue/save",
    method: "post",
    data
  });
}

export function update(data) {
  return request({
    url: prefix + "/design/supply/update",
    method: "put",
    data,
  });
}

export function page(data) {
  return request({
    url: prefix + "/drawing/issue/page",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/drawing/issue/delete",
    method: "post",
    data,
  });
}

export function pageNotSelect(data, page) {
  return request({
    url: prefix + "/design/supply/detail/pageNotSelect",

    method: "post",
    data: {
      ...page,
      entity: {
        designSupply: {
          type: 1,
          ...data
        }
      }
    },
  });
}
