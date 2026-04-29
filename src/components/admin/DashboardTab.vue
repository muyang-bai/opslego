<template>
  <div>
    <h2 class="text-xl font-semibold text-text-primary mb-6">仪表盘概览</h2>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-card p-6">
        <h3 class="text-lg font-medium text-text-primary mb-4">用户增长趋势</h3>
        <div ref="trendChartRef" style="height: 300px;"></div>
      </div>
      <div class="bg-white rounded-xl shadow-card p-6">
        <h3 class="text-lg font-medium text-text-primary mb-4">订阅类型分布</h3>
        <div ref="planChartRef" style="height: 300px;"></div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-card p-6">
      <h3 class="text-lg font-medium text-text-primary mb-4">近期活动</h3>
      <el-table :data="logs" stripe style="width: 100%" v-loading="!logs.length">
        <el-table-column prop="created_at" label="时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作" width="150">
          <template #default="{ row }">
            <el-tag size="small">{{ getActionLabel(row.action) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="actor" label="用户" width="200" />
        <el-table-column prop="details" label="详情" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  trend: { type: Array, default: () => [] },
  plans: { type: Array, default: () => [] },
  logs: { type: Array, default: () => [] }
})

const trendChartRef = ref(null)
const planChartRef = ref(null)

let trendChart = null
let planChart = null

function formatDate(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleString('zh-CN')
}

function getActionLabel(action) {
  const map = {
    user_registered: '用户注册',
    user_login: '用户登录',
    redemption_activated: '兑换激活',
    feedback_submitted: '提交反馈',
    subscription_created: '订阅创建',
    admin_created: '管理员创建'
  }
  return map[action] || action
}

function initTrendChart() {
  if (!trendChartRef.value) return
  trendChart = echarts.init(trendChartRef.value)

  const dates = props.trend.map(t => {
    const d = new Date(t.date)
    return `${d.getMonth() + 1}/${d.getDate()}`
  })
  const counts = props.trend.map(t => t.count)

  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{
      data: counts,
      type: 'line',
      smooth: true,
      lineStyle: { color: '#409EFF', width: 2 },
      areaStyle: { color: 'rgba(64,158,255,0.15)' }
    }]
  })
}

function initPlanChart() {
  if (!planChartRef.value) return
  planChart = echarts.init(planChartRef.value)

  const data = props.plans.map(p => ({
    name: p.plan_type === 'premium' ? '效率进阶版' : '新手启航版',
    value: p.count
  }))

  planChart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      data,
      label: { formatter: '{b}: {c}' }
    }]
  })
}

onMounted(() => {
  nextTick(() => {
    initTrendChart()
    initPlanChart()
  })
})

watch(() => [props.trend, props.plans], () => {
  nextTick(() => {
    if (trendChart) {
      initTrendChart()
    }
    if (planChart) {
      initPlanChart()
    }
  })
}, { deep: true })
</script>

<style scoped>
</style>
