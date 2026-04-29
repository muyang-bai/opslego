<template>
  <DefaultLayout>
    <div class="dashboard-page">
      <h1 class="page-title">控制台</h1>

      <el-row :gutter="20" class="status-cards">
        <el-col :xs="12" :sm="6" v-for="card in statusCards" :key="card.label">
          <el-card shadow="hover" class="status-card">
            <div class="card-inner">
              <div class="card-icon" :style="{ background: card.color }">
                <el-icon :size="24"><component :is="card.icon" /></el-icon>
              </div>
              <div class="card-info">
                <p class="card-label">{{ card.label }}</p>
                <p class="card-value">{{ card.value }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-card shadow="hover" class="section-card">
        <template #header>
          <span class="section-title"><el-icon><List /></el-icon> 当前订阅</span>
        </template>
        <div v-if="subscription" class="subscription-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="套餐类型">
              <el-tag :type="subscription.plan_type === 'premium' ? 'warning' : ''" size="large">
                {{ subscription.plan_type === 'premium' ? '效率进阶版' : '新手启航版' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="到期时间">{{ formatDate(subscription.end_date) }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <span :class="subscription.status === 'active' ? 'text-success' : 'text-danger'">
                {{ subscription.status === 'active' ? '生效中' : '已过期' }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="剩余天数">
              <span class="days-left">{{ remainingDays > 0 ? remainingDays + ' 天' : '已过期' }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <el-empty v-else description="暂无订阅，快去激活兑换码吧" />
        <div v-if="subscription && remainingDays <= 7 && remainingDays > 0" class="renew-hint">
          <el-alert title="订阅即将到期" type="warning" :closable="false" show-icon>
            <template #default>您的订阅将在 {{ remainingDays }} 天后到期，请及时续费。</template>
          </el-alert>
        </div>
      </el-card>

      <el-card shadow="hover" class="section-card" v-if="benefits">
        <template #header>
          <span class="section-title"><el-icon><Tickets /></el-icon> 套餐权益</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="智能客服"><el-tag type="success" size="small">✔</el-tag></el-descriptions-item>
          <el-descriptions-item label="客服响应速度">{{ benefits.customer_service }}</el-descriptions-item>
          <el-descriptions-item label="商品管理">{{ benefits.store_management }}</el-descriptions-item>
          <el-descriptions-item label="自动化上架">{{ benefits.auto_listing }}</el-descriptions-item>
          <el-descriptions-item label="数据监控">{{ benefits.data_monitor }}</el-descriptions-item>
          <el-descriptions-item label="竞品分析">{{ benefits.competitor_analysis }}</el-descriptions-item>
          <el-descriptions-item label="评价维护">
            <el-tag :type="benefits.review_management ? 'success' : 'info'" size="small">
              {{ benefits.review_management ? '✔' : '✗' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="自动邀评">{{ benefits.auto_review || '✗' }}</el-descriptions-item>
          <el-descriptions-item label="AI内容生成">{{ benefits.ai_content }}</el-descriptions-item>
          <el-descriptions-item label="标题优化"><el-tag type="success" size="small">✔</el-tag></el-descriptions-item>
          <el-descriptions-item label="即梦AI图片">{{ benefits.image_quota }}张/月</el-descriptions-item>
          <el-descriptions-item label="专属客服">
            <el-tag :type="benefits.dedicated_support ? 'success' : 'info'" size="small">
              {{ benefits.dedicated_support ? '✔' : '✗' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="技术支持">{{ benefits.tech_support }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card shadow="hover" class="section-card">
        <template #header>
          <span class="section-title"><el-icon><DataLine /></el-icon> 最近日志</span>
        </template>
        <el-timeline v-if="logs.length > 0">
          <el-timeline-item v-for="log in logs" :key="log.id" :timestamp="formatDate(log.created_at)" placement="top">
            {{ log.action || log.details || '系统操作' }}
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无操作日志" />
      </el-card>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { getSubscriptions } from '@/api/subscription'
import { getSystemLogs } from '@/api/admin'
import api from '@/utils/api'
import { List, DataLine, Tickets, Timer, Picture, Cpu } from '@element-plus/icons-vue'

const statusCards = ref([
  { label: '当前套餐', value: '--', icon: Tickets, color: '#409EFF' },
  { label: '剩余天数', value: '--', icon: Timer, color: '#67C23A' },
  { label: '今日运行', value: '--', icon: Cpu, color: '#E6A23C' },
  { label: '图片额度', value: '--', icon: Picture, color: '#F56C6C' }
])

const subscription = ref(null)
const benefits = ref(null)
const logs = ref([])

const remainingDays = computed(() => {
  if (!subscription.value || !subscription.value.end_date) return 0
  const end = new Date(subscription.value.end_date)
  const now = new Date()
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24))
})

function formatDate(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

async function fetchData() {
  try {
    const res = await getSubscriptions()
    const sub = res?.active_subscription || res?.subscriptions?.[0] || null
    if (sub) {
      subscription.value = sub
      statusCards.value[0].value = sub.plan_type === 'premium' ? '效率进阶版' : '新手启航版'
      statusCards.value[1].value = remainingDays.value + ' 天'
    } else {
      subscription.value = null
      statusCards.value[0].value = '未订阅'
      statusCards.value[1].value = '0 天'
    }
  } catch (e) {
    console.error('获取订阅失败', e)
  }

  try {
    const quotaRes = await api.get('/subscriptions/quota')
    const quota = quotaRes?.quota || 0
    statusCards.value[3].value = quota > 0 ? quota + ' 张' : '无额度'
  } catch (e) {
    statusCards.value[3].value = '无额度'
  }

  try {
    const benefitsRes = await api.get('/subscriptions/benefits')
    if (benefitsRes?.benefits) {
      benefits.value = benefitsRes.benefits
    } else {
      benefits.value = null
    }
  } catch (e) {
    benefits.value = null
  }

  try {
    const logRes = await getSystemLogs({ limit: 5 })
    const fetchedLogs = logRes?.logs || logRes?.data || []
    logs.value = Array.isArray(fetchedLogs) ? fetchedLogs : []
    statusCards.value[2].value = logs.value.length + ' 条'
  } catch (e) {
    console.error('获取日志失败', e)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.dashboard-page { padding: 20px; max-width: 1200px; margin: 0 auto; }
.page-title { margin-bottom: 24px; font-size: 24px; font-weight: 600; }
.status-cards { margin-bottom: 24px; }
.status-card { border-radius: 12px; cursor: default; }
.card-inner { display: flex; align-items: center; gap: 16px; }
.card-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; }
.card-label { font-size: 14px; color: #909399; margin-bottom: 4px; }
.card-value { font-size: 22px; font-weight: 700; color: #303133; }
.section-card { margin-bottom: 24px; border-radius: 12px; }
.section-title { display: flex; align-items: center; gap: 8px; font-weight: 600; }
.text-success { color: #67C23A; font-weight: 600; }
.text-danger { color: #F56C6C; font-weight: 600; }
.days-left { font-weight: 700; font-size: 18px; color: #409EFF; }
.renew-hint { margin-top: 16px; }
</style>
