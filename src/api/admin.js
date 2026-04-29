import api from '@/utils/api'

/**
 * 获取管理后台仪表盘数据
 * @returns {Promise<Object>} 仪表盘数据
 */
export async function getDashboardStats() {
  return await api.get('/admin/dashboard')
}

/**
 * 获取系统日志
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @param {string} params.action - 操作类型筛选
 * @param {string} params.actor - 操作者筛选
 * @returns {Promise<Object>} 系统日志
 */
export async function getSystemLogs(params = {}) {
  return await api.get('/admin/logs', { params })
}
/**
 * 获取所有用户列表（管理员）
 * @returns {Promise<Object>} 用户列表
 */
export async function getUsers() {
  return await api.get('/admin/users')
}
