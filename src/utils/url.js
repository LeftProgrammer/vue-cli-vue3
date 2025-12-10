import { getToken, getSid } from "@/utils/auth";

/**
 * 将 URL 中的占位符替换为真实值，例如 {token}、{sid}
 */
export function convertUrl(url) {
  if (!url) return url;
  let result = url;

  const token = getToken && getToken();
  const sid = getSid && getSid();

  if (typeof result !== "string") {
    result = String(result || "");
  }

  if (token) {
    result = result.replaceAll("{token}", token);
  }

  if (sid) {
    result = result.replaceAll("{sid}", sid);
  }

  return result;
}

/**
 * 计算最终跳转用的 URL，目前只是做占位符替换，后续如需兼容 {userInfo.xxx} 再扩展
 */
export function computeUrl(url) {
  return convertUrl(url);
}
