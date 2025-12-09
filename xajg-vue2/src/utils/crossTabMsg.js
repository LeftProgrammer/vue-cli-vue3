const channel = new BroadcastChannel("szgc-mdg-web");

export function sendMsg(type, content) {
  console.log("sendMsg", type, content);
  channel.postMessage({ type, content });
}

export function listenMsg(callback) {
  channel.addEventListener("message", (e) => {
    if (callback && typeof callback === "function") {
      callback(e);
    }
  });
}

export function listenMsg_LoginOut() {
  listenMsg((msg) => {
    if (msg && msg.data && msg.data.type === "loginOut") {
      //关闭当前标签页
      window.opener = null;
      window.open("", "_self");
      window.close();
    }
  });
}
