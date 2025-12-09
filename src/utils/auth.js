import Cookie from "js-cookie";
import { ACCESS_TOKEN } from "@/store/mutation-types";

const TokenKey = ACCESS_TOKEN;

export function setToken(token) {
  Cookie.set(TokenKey, token, {
    domain: window.location.hostname,
  });
  localStorage.setItem(TokenKey, token);
  return token;
}

export function getToken() {
  const token = localStorage.getItem(TokenKey);
  return token;
}

export function removeToken() {
  Cookie.remove(TokenKey);
  localStorage.removeItem(TokenKey);
}

export function getSid() {
  const key = "szgc-mdg-sid";
  const str = document.cookie || "";
  const obj = {};
  const parts = str.split("; ");
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    const index = part.indexOf("=");
    if (index > -1) {
      const k = part.substring(0, index);
      const v = part.substring(index + 1);
      obj[k] = v;
    }
  }
  return obj[key];
}

export function verifyPermission(path) {
  const noPermissionPaths = [
    "/common/flow",
    "/common/message",
    "/homeIndex/index",
    "/diy/",
  ];
  for (let i = 0; i < noPermissionPaths.length; i += 1) {
    const pathitem = noPermissionPaths[i];
    if (path.indexOf(pathitem) > -1) {
      return true;
    }
  }
  return false;
}
