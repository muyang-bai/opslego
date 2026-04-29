<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto">
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-text-primary">管理员后台</h1>
          <p class="text-text-secondary mt-2">管理用户、兑换码和系统设置</p>
        </div>
        <div class="flex items-center space-x-4">
          <el-button type="primary" @click="refreshData" :loading="loading">
            <el-icon class="mr-2"><refresh /></el-icon>
            刷新数据
          </el-button>
          <el-button @click="exportData">
            <el-icon class="mr-2"><download /></el-icon>
            导出数据
          </el-button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-secondary text-sm mb-1">总用户数</p>
              <p class="text-2xl font-bold text-text-primary">{{ stats.total_users }}</p>
            </div>
            <el-icon :size="32" class="text-blue-500"><user /></el-icon>
          </div>
          <p class="text-green-600 text-xs mt-2">+{{ stats.new_users_this_month }} 本月新增</p>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-secondary text-sm mb-1">活跃订阅</p>
              <p class="text-2xl font-bold text-text-primary">{{ stats.active_subscriptions }}</p>
            </div>
            <el-icon :size="32" class="text-green-500"><tickets /></el-icon>
          </div>
          <p class="text-text-secondary text-xs mt-2">{{ subscriptionRate }}% 订阅率</p>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-secondary text-sm mb-1">兑换码使用</p>
              <p class="text-2xl font-bold text-text-primary">{{ redemptionStats.used || 0 }}</p>
            </div>
            <el-icon :size="32" class="text-purple-500"><discount /></el-icon>
          </div>
          <p class="text-text-secondary text-xs mt-2">{{ redemptionRate }}% 使用率</p>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-secondary text-sm mb-1">待处理反馈</p>
              <p class="text-2xl font-bold text-text-primary">{{ stats.pending_feedback }}</p>
            </div>
            <el-icon :size="32" class="text-yellow-500"><chat-line-round /></el-icon>
          </div>
          <p class="text-text-secondary text-xs mt-2">及时处理用户反馈</p>
        </div>
      </div>

      <div class="mb-8">
        <el-tabs v-model="activeTab" type="border-card">
          <el-tab-pane label="仪表盘" name="dashboard">
            <DashboardTab :trend="registrationTrend" :plans="planDistribution" :logs="recentLogs" />
          </el-tab-pane>
          <el-tab-pane label="用户管理" name="users">
            <UsersTab />
          </el-tab-pane>
          <el-tab-pane label="兑换码管理" name="redemption">
            <RedemptionTab />
          </el-tab-pane>
          <el-tab-pane label="反馈管理" name="feedback">
            <FeedbackTab />
          </el-tab-pane>
          <el-tab-pane label="系统设置" name="settings">
            <SettingsTab />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Refresh, Download, User, Tickets, Discount, ChatLineRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import api from '@/utils/api'
import DashboardTab from '@/components/admin/DashboardTab.vue'
import UsersTab from '@/components/admin/UsersTab.vue'
import RedemptionTab from '@/components/admin/RedemptionTab.vue'
import FeedbackTab from '@/components/admin/FeedbackTab.vue'
import SettingsTab from '@/components/admin/SettingsTab.vue'

const activeTab = ref('dashboard')
const loading = ref(false)

const stats = ref({
  total_users: 0,
  new_users_this_month: 0,
  active_subscriptions: 0,
  pending_feedback: 0
})

const redemptionStats = ref({ total: 0, used: 0 })
const registrationTrend = ref([])
const planDistribution = ref([])
const recentLogs = ref([])

const subscriptionRate = computed(() => {
  if (stats.value.total_users === 0) return 0
  return Math.round((stats.value.active_subscriptions / stats.value.total_users) * 100)
})

const redemptionRate = computed(() => {
  if (redemptionStats.value.total === 0) return 0
  return Math.round((redemptionStats.value.used / redemptionStats.value.total) * 100)
})

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/dashboard')
    if (res && res.stats) {
      stats.value = {
        total_users: res.stats.total_users || 0,
        new_users_this_month: res.stats.new_users_this_month || 0,
        active_subscriptions: res.stats.active_subscriptions || 0,
        pending_feedback: res.stats.pending_feedback || 0
      }
      registrationTrend.value = res.stats.registration_trend || []
      planDistribution.value = res.stats.plan_distribution || []
      recentLogs.value = res.recent_logs || []
    }
  } catch (e) {
    console.error('获取仪表盘数据失败', e)
  }

  // 单独获取兑换码统计，确保与兑换码管理页一致
  try {
    const redemptionRes = await api.get('/admin/redemption')
    if (redemptionRes && redemptionRes.codes) {
      const codes = redemptionRes.codes
      redemptionStats.value.total = codes.length
      redemptionStats.value.used = codes.filter(c => c.status === 'used').length
    }
  } catch (e) {
    console.error('获取兑换码数据失败', e)
  }

  loading.value = false
}

const refreshData = () => {
  fetchDashboardData()
  ElMessage.success('数据已刷新')
}

const exportData = () => {
  ElMessage.info('导出功能开发中...')
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
</style>
