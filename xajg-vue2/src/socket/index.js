export default class Socket {
  /**
   *Creates an instance of Chidithis.socket.
   * @param {string} [host='localhost'] ip
   * @param {string} [port='80'] 端口
   * @param {string} [context='/'] 工程路径
   * @param {string} [userId=''] 用户id
   * @memberof Chidithis.socket
   */

  //  ws://localhost:8092/ws/341/p0ge0cgh/websocket
  constructor(host = 'localhost', port = '8092', context = 'PROC_MATTER_RUN', userId = '1155880008443494400') {
    if (window.WebSocket) {
      try {
        this.socket = new WebSocket(
          `ws://${host}:${port}/${context}/ws/${userId}`
        )
        this.businessCallbacks = {}
        this.start()
      } catch (e) {
        throw new Error('Create this.socket Error:' + e)
      }
    } else {
      throw new Error('Your browser dose not support this.socket!')
    }
  }

  /**
   * 初始化WebSocket各类事件
   * @memberof Socket
   */
  start() {
    /**
     * 监听this.socket连接成功事件
     */
    this.socket.onopen = function (event) {
      console.log("this.socket onopen! ");
    }

    /**
     * 监听this.socket接收消息事件
     */
    this.socket.onmessage = event => {
      const msg = JSON.parse(event.data)
      if (msg) {
        for (const key in this.businessCallbacks) {
          const callback = this.businessCallbacks[key]
          if (callback) {
            callback(msg)
          }
        }
        // const callbacks = this.businessCallbacks[msg.businessId]
        // callbacks && callbacks.map(d => d(msg.data))
      }
      // console.log("this.socket onmessage: " + event.data + "! ");
    }

    /**
     * 监听this.socket错误事件
     */
    this.socket.onerror = function (event) {
      console.log('监听this.socket错误事件', JSON.stringify(event));
    }

    /**
     * 监听this.socket关闭事件
     */
    this.socket.onclose = function (event) {
      // console.log(JSON.stringify(event));
    }
  }

  /**
   * 根据业务ID注册监听事件
   * @param {string} [businessId='']
   * @param {*} [callback=function () {}]
   * @memberof Socket
   */
  install(businessId = '', callback = function () { }) {
    // let callbacks = this.businessCallbacks[businessId]
    this.businessCallbacks[businessId] = callback
    // if (!callbacks) {
    //   callbacks = this.businessCallbacks[businessId] = []
    // }
    // callbacks.push(callback)
  }

  /**
   * 根据业务ID卸载监听事件
   * @param {string} [businessId='']
   * @memberof Socket
   */
  uninstall(businessId = '') {
    this.businessCallbacks[businessId] = null
    // const callbacks = this.businessCallbacks[businessId]
    // if (callbacks) {
    //   // this.businessCallbacks[businessId] = null;
    //   for (let i = 0; i < callbacks.length; i++) {
    //     const func = callbacks[i]
    //     if (func === callback) {
    //       callbacks.splice(i, 1)
    //       break
    //     }
    //   }
    // }
  }
}
