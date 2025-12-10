// 自定义 socket 封装，用于替代 @szgc/plt-core 提供的 socket 功能
// 基于 SockJS + STOMP 1.1，对接后端 /ws 端点
// 依赖：sockjs-client、@stomp/stompjs

import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

// 事件监听表，例如：NOTICE、TODO 等
const listeners = {};

let stompClient = null;
let connected = false;
let connecting = false;

function ensureListeners(event) {
  if (!listeners[event]) {
    listeners[event] = new Set();
  }
}

function emit(event, payload) {
  const set = listeners[event];
  if (!set || !set.size) return;
  set.forEach((cb) => {
    try {
      cb(payload);
    } catch (e) {
      // 单个监听异常不影响其它监听
      console.error("socket listener error", e);
    }
  });
}

function createClient() {
  if (stompClient) return stompClient;

  const client = new Client({
    // SockJS 工厂：对接后端 /ws 端点（与 Vue2 项目保持一致）
    webSocketFactory: () => new SockJS("/ws"),
    // 断线重连间隔（毫秒）
    reconnectDelay: 5000,
    // 心跳与后端配置保持相近（见抓包：heart-beat:10000,10000）
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    // 关闭默认 debug 日志，避免控制台太多输出
    debug: () => {},
  });

  client.onConnect = () => {
    connected = true;
    connecting = false;

    // 订阅后端公开的两个目的地：/topic 和 /user/queue
    // 具体业务事件再根据 message.body 内容分发
    client.subscribe("/topic", handleMessage);
    client.subscribe("/user/queue", handleMessage);
  };

  client.onStompError = (frame) => {
    console.error("STOMP error", frame.body || frame);
  };

  client.onWebSocketClose = () => {
    connected = false;
    connecting = false;
  };

  stompClient = client;
  return client;
}

function handleMessage(message) {
  const { body } = message;
  if (!body) return;

  let data = null;
  try {
    data = JSON.parse(body);
  } catch (e) {
    // 如果不是 JSON，就直接忽略
    return;
  }

  // 目前我们只关心通知类消息：旧项目里 TodoBar/NoticeBar 都是监听 "NOTICE"
  // 这里约定：如果消息体中包含 noticeType 字段，就认为是一条通知
  if (Object.prototype.hasOwnProperty.call(data, "noticeType")) {
    emit("NOTICE", data);
  }

  // 如果后续还有其他类型事件，可以在这里添加分发逻辑
}

export const socket = {
  /** 建立连接（幂等，多次调用只会在未连接时真正发起） */
  connect() {
    if (connected || connecting) return;
    const client = createClient();
    connecting = true;
    if (!client.active) {
      client.activate();
    }
  },

  /** 断开连接（可选） */
  disconnect() {
    if (stompClient && stompClient.active) {
      stompClient.deactivate();
    }
    connected = false;
    connecting = false;
  },

  /** 注册事件监听，例如 socket.on('NOTICE', handler) */
  on(event, callback) {
    if (typeof callback !== "function") return;
    ensureListeners(event);
    listeners[event].add(callback);
  },

  /** 取消事件监听：
   *  - off('NOTICE', handler) 只移除某个回调
   *  - off('NOTICE') 移除该事件的所有监听
   */
  off(event, callback) {
    const set = listeners[event];
    if (!set) return;
    if (callback) {
      set.delete(callback);
    } else {
      set.clear();
    }
  },
};
