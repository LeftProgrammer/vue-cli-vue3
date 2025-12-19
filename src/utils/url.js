import { getToken, getSid } from "@/utils/auth";
import store from "@/store";

/**
 * 将 URL 中的占位符替换为真实值，例如 {token}、{sid}
 */
export function convertUrl(url) {
  if (!url) return url;
  let result = url;

  const token = getToken && getToken();
  const sid = getSid && getSid();

  let userInfo = null;
  try {
    const raw = window.localStorage.getItem("userInfo");
    userInfo = raw ? JSON.parse(raw) : null;
  } catch (e) {
    userInfo = null;
  }
  if (!userInfo) {
    userInfo = (store.getters && store.getters.loginInfo) || null;
  }
  const mobile = (userInfo && userInfo.mobile) || "";
  const realName = (userInfo && userInfo.realName) || "";
  const username = (userInfo && userInfo.username) || "";

  if (typeof result !== "string") {
    result = String(result || "");
  }

  if (token) {
    result = result.replaceAll("{token}", token);
  }

  if (sid) {
    result = result.replaceAll("{sid}", sid);
  }

  if (result.includes("{userInfo.mobile}")) {
    result = result.replaceAll("{userInfo.mobile}", mobile);
  }

  if (result.includes("{userInfo.realName}")) {
    result = result.replaceAll("{userInfo.realName}", realName);
  }

  if (result.includes("{userInfo.username}")) {
    result = result.replaceAll("{userInfo.username}", username);
  }

  return result;
}

/**
 * 计算最终跳转用的 URL，目前只是做占位符替换，后续如需兼容 {userInfo.xxx} 再扩展
 */
export function computeUrl(url) {
  return convertUrl(url);
}
