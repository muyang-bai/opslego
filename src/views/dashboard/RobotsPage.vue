<template>
  <DefaultLayout>
    <div class="dashboard-page">
      <h1 class="page-title">我的机器人</h1>

      <!-- 启动机器人卡片 -->
      <el-card shadow="hover" class="section-card" v-if="!runningRobot">
        <div class="start-area">
          <div class="text-center">
            <el-icon :size="64" class="text-primary mb-4"><Cpu /></el-icon>
            <h3 class="text-xl font-semibold text-text-primary mb-2">还没有运行中的机器人</h3>
            <p class="text-text-secondary mb-6">一键启动闲鱼自动化运营，自动擦亮、智能客服、数据监控</p>
            <el-button type="primary" size="large" @click="startRobot" :loading="starting">
              启动闲鱼机器人
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 运行中的机器人状态 -->
      <el-card shadow="hover" class="section-card" v-else>
        <template #header>
          <div class="flex justify-between items-center">
            <span class="section-title">
              <el-tag type="success" size="small">运行中</el-tag>
              <span class="ml-2">闲鱼机器人 {{ runningRobot.id.slice(-8) }}</span>
            </span>
            <el-button type="danger" size="small" @click="stopRobot" :loading="stopping">
              停止运行
            </el-button>
          </div>
        </template>
        <div class="robot-info">
          <p class="text-text-secondary mb-2">
            启动时间：{{ formatDate(runningRobot.startTime) }}
          </p>
          <p class="text-text-secondary mb-4">
            运行状态：<span class="text-green-600 font-medium">正常</span>
          </p>
        </div>
        <!-- 日志区域 -->
        <div class="logs-area">
          <h4 class="font-semibold text-text-primary mb-3">运行日志</h4>
          <div class="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
            <div v-for="(log, idx) in runningRobot.logs" :key="idx" class="text-sm text-text-secondary py-1 border-b border-gray-100 last:border-0">
              {{ log }}
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Cpu } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import api from '@/utils/api'

const robots = ref([])
const runningRobot = computed(() => robots.value.find(r => r.status === 'running') || null)
const starting = ref(false)
const stopping = ref(false)

// 获取我的机器人列表
const fetchRobots = async () => {
  try {
    const res = await api.get('/robots')
    if (res && res.robots) {
      robots.value = res.robots
    }
  } catch (e) {
    console.error('获取机器人列表失败', e)
  }
}

// 启动机器人
const startRobot = async () => {
  starting.value = true
  try {
    const res = await api.post('/robots/start', { platform: 'xianyu', interval: 30 })
    if (res.error) {
      ElMessage.error(res.message || '启动失败')
      return
    }
    ElMessage.success('机器人已启动！')
    fetchRobots()
  } catch (e) {
    ElMessage.error('启动失败，请稍后重试')
  } finally {
    starting.value = false
  }
}

// 停止机器人
const stopRobot = async () => {
  if (!runningRobot.value) return
  stopping.value = true
  try {
    const res = await api.post('/robots/stop', { taskId: runningRobot.value.id })
    if (res.error) {
      ElMessage.error(res.message || '停止失败')
      return
    }
    ElMessage.success('机器人已停止')
    fetchRobots()
  } catch (e) {
    ElMessage.error('停止失败，请稍后重试')
  } finally {
    stopping.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchRobots()
})
</script>

<style scoped>
.dashboard-page { padding: 20px; max-width: 800px; margin: 0 auto; }
.page-title { margin-bottom: 24px; font-size: 24px; font-weight: 600; }
.section-card { margin-bottom: 24px; border-radius: 12px; }
.section-title { display: flex; align-items: center; }
.start-area { padding: 40px 0; }
.logs-area { margin-top: 16px; }
</style>