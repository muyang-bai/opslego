// Token管理工具

const TOKEN_KEY = 'opslego_token'

// 获取token
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

// 设置token
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

// 移除token
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// 检查token是否存在
export function hasToken() {
  return !!getToken()
}

// 获取请求头（包含token）
export function getAuthHeader() {
  const token = getToken()
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

// 从URL获取token参数（用于可能的第三方登录）
export function getTokenFromURL() {
  const params = new URLSearchParams(window.location.search)
  return params.get('token')
}