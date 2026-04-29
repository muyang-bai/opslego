import api from '@/utils/api'

/**
 * 提交反馈
 * @param {Object} data - 反馈数据
 * @param {string} data.category - 反馈类型（功能建议/Bug反馈/其他）
 * @param {string} data.message - 详细描述
 * @param {string} data.contact - 联系方式（可选）
 * @returns {Promise<Object>} 提交结果
 */
export async function submitFeedback(data) {
  return await api.post('/feedback', data)
}

/**
 * 获取反馈列表（管理员）
 * @param {Object} params - 查询参数
 * @param {string} params.status - 状态筛选（pending/processed）
 * @param {string} params.category - 类型筛选
 * @returns {Promise<Object>} 反馈列表
 */
export async function getFeedbackList(params = {}) {
  return await api.get('/feedback', { params })
}

/**
 * 更新反馈状态（管理员）
 * @param {number|string} id - 反馈ID
 * @param {Object} data - 更新数据
 * @param {string} data.status - 新状态（pending/processed）
 * @returns {Promise<Object>} 更新结果
 */
export async function updateFeedbackStatus(id, data) {
  return await api.put(`/feedback/${id}`, data)
}