import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/safe/hiddenArea/save",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/safe/hiddenArea/update",
    method: "post",
    data,
  });
}

export function page(data) {
  data.orderProperties = [
    {
      property: "createDate",
      asc: false,
    },
  ];
  return request({
    url: prefix + "/safe/hiddenArea/page",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/safe/hiddenArea/delete",
    method: "post",
    data,
  });
}
export function BelongTo(params) {
  return request({
    method: "get",
    url: prefix + "/plt/corporate/getBelongTo",
    params,
  });
}

export function getSection(params) {
  return request({
    url: `/api/project/section/getSectionByUser`,
    method: 'get',
    params
  });
}

