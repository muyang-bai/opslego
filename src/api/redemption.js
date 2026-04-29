import api from '@/utils/api'

/**
 * 激活兑换码
 * @param {string} code - 兑换码
 * @returns {Promise<Object>} 激活结果
 */
export async function activateCode(code) {
  return await api.post('/redemption/activate', { code })
}

/**
 * 生成兑换码（管理员）
 * @param {Object} data - 生成参数
 * @param {string} data.plan_type - 套餐类型（basic/premium）
 * @param {number} data.duration_days - 有效天数
 * @param {number} data.quantity - 生成数量
 * @returns {Promise<Object>} 生成结果
 */
export async function generateCodes(data) {
  return await api.post('/redemption/generate', data)
}

/**
 * 获取兑换码列表（管理员）
 * @param {Object} params - 查询参数
 * @param {string} params.status - 状态筛选（unused/used）
 * @param {string} params.plan_type - 套餐类型筛选
 * @returns {Promise<Object>} 兑换码列表
 */
export async function getCodes(params = {}) {
  return await api.get('/redemption', { params })
}

/**
 * 导出兑换码为CSV（管理员）
 * @param {Object} params - 查询参数
 * @param {string} params.status - 状态筛选
 * @returns {Promise<Blob>} CSV文件
 */
export async function exportCodes(params = {}) {
  return await api.get('/admin/export/codes', { 
    params,
    responseType: 'blob'
  })
}