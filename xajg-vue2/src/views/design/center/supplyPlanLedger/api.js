import request from "@/utils/request";

let prefix = "/api";

export function save(data) {
  return request({
    url: prefix + "/quality/assess/info/save",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: prefix + "/quality/assess/info/save",
    method: "post",
    data,
  });
}

// export function page(data) {
//   return request({
//     url: prefix + "/quality/assess/info/page",
//     method: "post",
//     data,
//   });
// }
export function page(data) {
  return request({
    url: prefix + "/quality/assess/info/page",
    method: "post",
    data,
  });
}

export function tree(data) {
  return request({
    url: prefix + "/design/ledgert/tree",
    method: "get",
    data,
  });
}

export function remove(data) {
  return request({
    url: prefix + "/quality/assess/info/delete",
    method: "post",
    data,
  });
}

// 查询文件
export function fileList(params) {
  return request({
    url: prefix + "/quality/assess/info/file",
    method: "get",
    params,
  });
}
// 请求文件
export function getFile(params) {
  return request({
    url: prefix + "/quality/assess/info/getFileById",
    method: "get",
    params,
    responseType: 'arraybuffer'
  });
}
