// 验证是否为 blob 格式（通过 MIME 类型判断）
export function blobValidate(data) {
  return data && data.type !== "application/json";
}
