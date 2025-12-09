import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/safe/regime/save",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/safe/regime/update",
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
    url: prefix + "/safe/regime/page",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/safe/regime/delete",
    method: "post",
    data,
  });
}

// 获取机构
export function unitAllList(params) {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
    params,
  });
}


// 获取整体单位列表
export function unitList() {
  return request({
    method: "get",
    url: "/api/custom/system/corporates/list",
  });
}

export function BelongTo(params) {
  return request({
    method: "get",
    url: prefix + "/plt/corporate/getBelongTo",
    params,
  });
}

