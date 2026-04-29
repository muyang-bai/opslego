<template>
  <DefaultLayout>
    <div class="max-w-2xl mx-auto px-4 py-12">
      <div class="text-center mb-10">
        <el-icon :size="64" class="text-primary mb-4"><Key /></el-icon>
        <h1 class="text-3xl font-bold text-text-primary mb-3">激活兑换码</h1>
        <p class="text-text-secondary text-lg">输入你获得的兑换码，激活对应的订阅套餐</p>
      </div>

      <div class="bg-white rounded-2xl shadow-card p-8">
        <div class="flex gap-4">
          <el-input
            v-model="code"
            placeholder="请输入兑换码，如：OPL-ABCD-1234-EFGH"
            size="large"
            clearable
            :disabled="isLoading"
            class="flex-1"
            @keyup.enter="handleActivate"
          >
            <template #prefix>
              <el-icon><Discount /></el-icon>
            </template>
          </el-input>
          <el-button
            type="primary"
            size="large"
            :loading="isLoading"
            :disabled="!code.trim()"
            @click="handleActivate"
          >
            立即激活
          </el-button>
        </div>

        <div class="mt-8">
          <h3 class="text-lg font-semibold text-text-primary mb-4">激活记录</h3>
          <el-table :data="redemptionHistory" style="width: 100%" v-loading="historyLoading" v-if="redemptionHistory.length > 0">
            <el-table-column prop="plan_type" label="套餐" width="120">
              <template #default="{ row }">
                {{ row.plan_type === 'premium' ? '效率进阶版' : '新手启航版' }}
              </template>
            </el-table-column>
            <el-table-column prop="start_date" label="生效时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.start_date) }}
              </template>
            </el-table-column>
            <el-table-column prop="end_date" label="到期时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.end_date) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
                  {{ row.status === 'active' ? '生效中' : '已过期' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-else description="暂无激活记录" />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Discount, Key } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { activateCode } from '@/api/redemption'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import api from '@/utils/api'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const authStore = useAuthStore()
const router = useRouter()

const code = ref('')
const isLoading = ref(false)
const historyLoading = ref(false)
const redemptionHistory = ref([])

const handleActivate = async () => {
  if (!code.value.trim()) {
    ElMessage.warning('请输入兑换码')
    return
  }

  isLoading.value = true
  try {
    const result = await activateCode(code.value.trim())

    if (result.error) {
      switch (result.code) {
        case 'CODE_NOT_FOUND':
          ElMessage.error('兑换码不存在，请检查是否输入正确')
          break
        case 'CODE_ALREADY_USED':
          ElMessage.error('该兑换码已被使用')
          break
        default:
          ElMessage.error(result.message || '激活失败')
      }
      return
    }

    ElMessageBox({
      title: '激活成功！',
      message: `
        <div style="text-align: center; padding: 10px;">
          <div style="font-size: 48px; color: #52c41a; margin-bottom: 20px;">🎉</div>
          <p style="font-size: 16px; color: #333; margin-bottom: 10px;">套餐：<strong>${result.plan || '新手启航版'}</strong></p>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">到期时间：<strong>${formatDate(result.end_date || result.endDate)}</strong></p>
          <p style="color: #666; margin-bottom: 20px;">你可以开始使用套餐内的所有功能了！</p>
        </div>
      `,
      dangerouslyUseHTMLString: true,
      confirmButtonText: '进入控制台',
      cancelButtonText: '关闭',
      showCancelButton: true,
      type: 'success'
    }).then(async () => {
      await authStore.fetchCurrentUser()
      router.push('/dashboard')
    }).catch(() => {})

    code.value = ''
    loadRedemptionHistory()

  } catch (error) {
    console.error('激活兑换码错误:', error)
    ElMessage.error('网络错误，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

const loadRedemptionHistory = async () => {
  historyLoading.value = true
  try {
    const res = await api.get('/subscriptions/history')
    redemptionHistory.value = res?.subscriptions || []
  } catch (e) {
    console.error('获取激活历史失败', e)
    redemptionHistory.value = []
  } finally {
    historyLoading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  loadRedemptionHistory()
})
</script>
