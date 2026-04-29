import api from '@/utils/api'

/**
 * 获取当前用户的订阅信息
 * @returns {Promise<Object>} 订阅信息
 */
export async function getSubscriptions() {
  return await api.get('/subscriptions')
}

/**
 * 获取所有用户的订阅（管理员）
 * @param {Object} params - 查询参数
 * @param {string} params.status - 状态筛选
 * @param {string} params.plan_type - 套餐类型筛选
 * @returns {Promise<Object>} 订阅列表
 */
export async function getAllSubscriptions(params = {}) {
  return await api.get('/subscriptions/all', { params })
}