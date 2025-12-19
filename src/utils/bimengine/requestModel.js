import axios from 'axios'
import store from '@/store'
import { ElMessage } from 'element-plus'
import { VueAxios as VueAxiosPlugin } from './axios'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: '',
  timeout: 10 * 60 * 1000, // 请求超时时间 
  withCredentials: false
})

// 异常拦截处理器
const errorHandler = (error) => {

  if (error.response) {
    if ([500, 400, 403].some(x => x === error.response.status)) {
      const data = error.response.data

      const msg = data?.message || data?.error?.validationErrors?.[0]?.message || data?.error?.message || data?.error_description
      if (msg) {
        ElMessage.error(msg)
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  config.baseURL = store.state.modelUrl
  const token = store.state.bim.defaults.secretkey
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Token'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install(app) {
    app.use(VueAxiosPlugin, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
