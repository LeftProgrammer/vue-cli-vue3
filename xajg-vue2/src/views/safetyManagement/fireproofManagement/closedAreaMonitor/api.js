import request from "@/utils/request";

let prefix = "/api";

export function list(data) {
  return request({
    url: prefix + "/safe/protection-device/list",
    method: "post",
    data,
  });
}
export function getArtmis(data) {
  return request({
    url: prefix + "/safe/monitor/getArtmis",
    method: "post",
    data,
  });
}
export function getRtspUrl(channelId) {
  return request({
    url: prefix + `/dahua/video/currentRtspVideoUrl?channelId=${channelId}`,
    method: "get",
  });
}

// export function operateDirect(param) {
//   return request({
//     url: prefix + "/dahua/video/operateDirect",
//     method: "get",
//     param
//   });
// }

export function operateDirect(param) {
  const { channelId, direct, stepX, command, extend, stepY } = param
  return request({
    url: prefix + `/dahua/video/operateDirect?channelId=${channelId}&direct=${direct}&stepX=${stepX}&command=${command}&extend=${extend}&stepY=${stepY}`,
    method: "get",
  });
}

export function operateCamera(param) {
  const { channelId, operateType, step, direct, command, extend, } = param
  return request({
    url: prefix + `/dahua/video/operateCamera?channelId=${channelId}&direct=${direct}&operateType=${operateType}&command=${command}&extend=${extend}&step=${step}`,
    method: "get",
  });
}

export function rtspOnline(channelCode) {
  return request({
    url: prefix + `/dahua/video/page?current=1&pageSize=100&channelCode=${channelCode}`,
    method: "get",
  });
}
