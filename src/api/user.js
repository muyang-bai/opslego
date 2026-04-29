import api from '@/utils/api'

/**
 * 获取所有用户列表（管理员）
 * @param {Object} params - 查询参数
 * @param {string} params.role - 角色筛选
 * @param {string} params.search - 搜索关键词
 * @returns {Promise<Object>} 用户列表
 */
export async function getUsers(params = {}) {
  return await api.get('/users', { params })
}

/**
 * 更新用户信息（管理员）
 * @param {number|string} id - 用户ID
 * @param {Object} data - 更新数据
 * @returns {Promise<Object>} 更新结果
 */
export async function updateUser(id, data) {
  return await api.put(`/users/${id}`, data)
}

/**
 * 删除用户（管理员）
 * @param {number|string} id - 用户ID
 * @returns {Promise<Object>} 删除结果
 */
export async function deleteUser(id) {
  return await api.delete(`/users/${id}`)
}