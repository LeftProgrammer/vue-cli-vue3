import base from "@/common/js/base.js";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { login, logout, getInfo } from "@/api/user";
import Cookie from 'js-cookie';
import config from '@/config/config';

const TokenKey = ACCESS_TOKEN;

export function setToken(token) {
  Cookie.set(`${config.$prefix}_${TokenKey}`, token, {
    domain: window.location.hostname
  })
  return base.setStorage(TokenKey, token);
}

export function getToken() {
  // return Cookies.get(TokenKey)
  let token = base.getStorage(TokenKey);
  if (token && token != TokenKey) {
    // console.log("getInfo", getInfo)
    try {
      getInfo(token)
        .then((res) => {
          if (!res.success) {
            this.removeToken();
            router.push(`/login?redirect=${router.history.current.fullPath}`)
              .then(() => {
                location.reload();
              });
          }
        })
    } catch (error) {

    }
  }
  return token;
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  return base.clearStorage(TokenKey);
}

export function getSid() {
  let key = "szgc-mdg-sid";
  let str = document.cookie;
  const obj = {};
  const parts = str.split("; ");
  for (let part of parts) {
    const [key, value] = part.split("=");
    obj[key] = value;
  }
  return obj[key];
}

export function verifyPermission(path) {
  //忽略越权验证的路径白名单列表
  let noPermissionPaths = [
    "/common/flow",
    "/common/message",
    "/homeIndex/index",
    "/diy/",
  ];
  for (let i = 0; i < noPermissionPaths.length; i++) {
    const pathitem = noPermissionPaths[i];
    if (path.indexOf(pathitem) > -1) {
      return true;
    }
  }
  return false;
}
