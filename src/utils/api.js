import axios from 'axios'
import { getToken } from './token'

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  (response) => {
    // 统一处理API响应格式
    if (response.data && typeof response.data.error !== 'undefined') {
      return response.data
    }
    return response
  },
  (error) => {
    // 网络错误或服务器错误
    if (!error.response) {
      return {
        error: true,
        code: 'NETWORK_ERROR',
        message: '网络连接错误，请检查网络设置'
      }
    }
    
    const { status, data } = error.response
    
    // 根据HTTP状态码处理错误
    let errorMessage = '请求失败'
    let errorCode = 'REQUEST_FAILED'
    
    switch (status) {
      case 400:
        errorMessage = data?.message || '请求参数错误'
        errorCode = data?.code || 'BAD_REQUEST'
        break
      case 401:
        errorMessage = data?.message || '登录已过期，请重新登录'
        errorCode = data?.code || 'UNAUTHORIZED'
        // token过期，清除本地存储
        if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'INVALID_TOKEN') {
          localStorage.removeItem('opslego_token')
        }
        break
      case 403:
        errorMessage = data?.message || '没有权限访问此资源'
        errorCode = data?.code || 'FORBIDDEN'
        break
      case 404:
        errorMessage = data?.message || '请求的资源不存在'
        errorCode = data?.code || 'NOT_FOUND'
        break
      case 500:
        errorMessage = data?.message || '服务器内部错误'
        errorCode = data?.code || 'INTERNAL_SERVER_ERROR'
        break
      default:
        errorMessage = `请求失败 (${status})`
        errorCode = `HTTP_${status}`
    }
    
    return {
      error: true,
      code: errorCode,
      message: errorMessage,
      status
    }
  }
)

// 通用请求方法
export async function request(config) {
  try {
    const response = await api(config)
    
    // 如果响应包含error字段，直接返回
    if (response.error !== undefined) {
      return response
    }
    
    // 否则包装成标准格式
    return {
      error: false,
      data: response.data,
      status: response.status
    }
  } catch (error) {
    // axios抛出的错误已经被拦截器处理过，这里直接返回
    return error
  }
}

// 导出axios实例
export default api