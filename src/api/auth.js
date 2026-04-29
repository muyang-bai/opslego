import api from '@/utils/api'

/**
 * 用户注册
 * @param {Object} userData - 用户注册数据
 * @param {string} userData.email - 邮箱
 * @param {string} userData.password - 密码
 * @param {string} userData.name - 姓名
 * @returns {Promise<Object>} 注册结果
 */
export async function register(userData) {
  return await api.post('/auth/register', userData)
}

/**
 * 用户登录
 * @param {Object} credentials - 登录凭证
 * @param {string} credentials.email - 邮箱
 * @param {string} credentials.password - 密码
 * @returns {Promise<Object>} 登录结果
 */
export async function login(credentials) {
  return await api.post('/auth/login', credentials)
}

/**
 * 获取当前用户信息
 * @returns {Promise<Object>} 用户信息
 */
export async function getCurrentUser() {
  return await api.get('/auth/me')
}

/**
 * 登出（客户端本地操作）
 * @returns {Promise<Object>} 登出结果
 */
export async function logout() {
  // 后端可能不需要专门的登出接口，因为JWT是无状态的
  // 这里只返回成功状态
  return { error: false, message: '登出成功' }
}