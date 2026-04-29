<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-text-primary">反馈管理</h2>
      <el-button type="default" @click="markAllAsProcessed">
        <el-icon class="mr-2"><check /></el-icon>
        全部标记为已处理
      </el-button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-text-secondary text-sm mb-1">总反馈数</p>
            <p class="text-2xl font-bold text-text-primary">{{ stats.totalFeedback }}</p>
          </div>
          <el-icon :size="32" class="text-blue-500"><chat-line-round /></el-icon>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-text-secondary text-sm mb-1">待处理</p>
            <p class="text-2xl font-bold text-text-primary">{{ stats.pendingFeedback }}</p>
          </div>
          <el-icon :size="32" class="text-yellow-500"><clock /></el-icon>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-text-secondary text-sm mb-1">已处理</p>
            <p class="text-2xl font-bold text-text-primary">{{ stats.processedFeedback }}</p>
          </div>
          <el-icon :size="32" class="text-green-500"><circle-check /></el-icon>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-text-secondary text-sm mb-1">平均响应</p>
            <p class="text-2xl font-bold text-text-primary">{{ stats.avgResponseTime }}h</p>
          </div>
          <el-icon :size="32" class="text-purple-500"><timer /></el-icon>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-xl shadow-card p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">状态筛选</label>
          <el-select v-model="statusFilter" placeholder="全部状态" clearable @change="filterFeedback">
            <el-option label="待处理" value="pending" />
            <el-option label="已处理" value="processed" />
          </el-select>
        </div>
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">反馈分类</label>
          <el-select v-model="categoryFilter" placeholder="全部分类" clearable @change="filterFeedback">
            <el-option label="功能建议" value="功能建议" />
            <el-option label="Bug反馈" value="Bug反馈" />
            <el-option label="其他" value="其他" />
          </el-select>
        </div>
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">搜索用户</label>
          <el-input v-model="userSearch" placeholder="邮箱/姓名" clearable @input="filterFeedback" />
        </div>
        <div class="flex items-end">
          <el-button type="default" @click="resetFilters">重置筛选</el-button>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-xl shadow-card overflow-hidden">
      <el-table :data="filteredFeedback" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="user_id" label="用户ID" width="100" />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            <el-tag :type="getCategoryTagType(row.category)" size="small">
              {{ row.category }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="反馈内容" min-width="300">
          <template #default="{ row }">
            <div class="max-w-xs truncate">{{ row.message }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="contact" label="联系方式" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'processed' ? 'success' : 'warning'" size="small">
              {{ row.status === 'processed' ? '已处理' : '待处理' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="提交时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="viewFeedbackDetails(row)">查看</el-button>
            <el-button v-if="row.status === 'pending'" type="text" size="small" @click="markAsProcessed(row)" style="color: #67c23a;">标记处理</el-button>
            <el-button type="text" size="small" @click="replyFeedback(row)" style="color: #409eff;">回复</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="flex justify-between items-center p-4 border-t">
        <span class="text-text-secondary text-sm">共 {{ totalFeedback }} 条记录</span>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, prev, pager, next, jumper"
          :total="totalFeedback"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    
    <el-dialog v-model="showFeedbackDetail" title="反馈详情" width="600px">
      <div v-if="selectedFeedback" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">用户ID</label>
            <p class="text-text-primary">{{ selectedFeedback.user_id }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">分类</label>
            <el-tag :type="getCategoryTagType(selectedFeedback.category)" size="small">
              {{ selectedFeedback.category }}
            </el-tag>
          </div>
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">状态</label>
            <el-tag :type="selectedFeedback.status === 'processed' ? 'success' : 'warning'" size="small">
              {{ selectedFeedback.status === 'processed' ? '已处理' : '待处理' }}
            </el-tag>
          </div>
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">提交时间</label>
            <p class="text-text-primary">{{ formatDate(selectedFeedback.created_at) }}</p>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">反馈内容</label>
          <div class="bg-gray-50 rounded-lg p-4 text-text-primary">
            {{ selectedFeedback.message }}
          </div>
        </div>
        
        <div v-if="selectedFeedback.contact">
          <label class="block text-sm font-medium text-text-secondary mb-1">联系方式</label>
          <p class="text-text-primary">{{ selectedFeedback.contact }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">回复反馈</label>
          <el-input v-model="replyMessage" type="textarea" :rows="4" placeholder="请输入回复内容..." />
          <div class="mt-2 flex justify-end">
            <el-button type="primary" @click="sendReply">发送回复</el-button>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showFeedbackDetail = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Check, ChatLineRound, Clock, CircleCheck, Timer } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/utils/api'

const loading = ref(false)
const statusFilter = ref('')
const categoryFilter = ref('')
const userSearch = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const stats = ref({
  totalFeedback: 0,
  pendingFeedback: 0,
  processedFeedback: 0,
  avgResponseTime: '0'
})

const feedbackList = ref([])

const showFeedbackDetail = ref(false)
const selectedFeedback = ref(null)
const replyMessage = ref('')

const fetchFeedback = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/feedback')
    if (res && res.feedbacks) {
      feedbackList.value = res.feedbacks
      stats.value.totalFeedback = res.feedbacks.length
      stats.value.pendingFeedback = res.feedbacks.filter(f => f.status === 'pending').length
      stats.value.processedFeedback = res.feedbacks.filter(f => f.status === 'processed').length
    } else {
      feedbackList.value = []
    }
  } catch (e) {
    ElMessage.error('获取反馈失败')
  } finally {
    loading.value = false
  }
}

const filteredFeedback = computed(() => {
  let filtered = feedbackList.value
  if (statusFilter.value) {
    filtered = filtered.filter(f => f.status === statusFilter.value)
  }
  if (categoryFilter.value) {
    filtered = filtered.filter(f => f.category === categoryFilter.value)
  }
  if (userSearch.value) {
    const q = userSearch.value.toLowerCase()
    filtered = filtered.filter(f => f.email?.toLowerCase().includes(q) || f.user_id?.toString().includes(q))
  }
  const start = (currentPage.value - 1) * pageSize.value
  return filtered.slice(start, start + pageSize.value)
})

const totalFeedback = computed(() => {
  let filtered = feedbackList.value
  if (statusFilter.value) filtered = filtered.filter(f => f.status === statusFilter.value)
  if (categoryFilter.value) filtered = filtered.filter(f => f.category === categoryFilter.value)
  return filtered.length
})

const formatDate = (dateStr) => {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleString('zh-CN')
}

const getCategoryTagType = (category) => {
  switch (category) {
    case '功能建议': return 'primary'
    case 'Bug反馈': return 'danger'
    case '其他': return 'info'
    default: return ''
  }
}

const markAsProcessed = async (feedback) => {
  try {
    await api.put(`/admin/feedback/${feedback.id}`, { status: 'processed' })
    feedback.status = 'processed'
    stats.value.pendingFeedback -= 1
    stats.value.processedFeedback += 1
    ElMessage.success('已标记为已处理')
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

const markAllAsProcessed = async () => {
  const pending = feedbackList.value.filter(f => f.status === 'pending')
  if (pending.length === 0) {
    ElMessage.info('没有待处理的反馈')
    return
  }
  ElMessageBox.confirm(`确定将 ${pending.length} 条待处理反馈全部标记为已处理吗？`, '批量处理', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    for (const f of pending) {
      try {
        await api.put(`/admin/feedback/${f.id}`, { status: 'processed' })
        f.status = 'processed'
      } catch (e) {
        // 继续处理下一条
      }
    }
    stats.value.pendingFeedback = feedbackList.value.filter(f => f.status === 'pending').length
    stats.value.processedFeedback = feedbackList.value.filter(f => f.status === 'processed').length
    ElMessage.success('批量标记完成')
  }).catch(() => {})
}

const replyFeedback = (feedback) => {
  selectedFeedback.value = feedback
  replyMessage.value = ''
  showFeedbackDetail.value = true
}

const sendReply = async () => {
  if (!replyMessage.value.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }
  // 后端暂无回复接口，提示用户
  ElMessage.info('回复功能尚未支持后端')
  showFeedbackDetail.value = false
}

const viewFeedbackDetails = (feedback) => {
  selectedFeedback.value = feedback
  replyMessage.value = ''
  showFeedbackDetail.value = true
}

const filterFeedback = () => { currentPage.value = 1 }
const resetFilters = () => {
  statusFilter.value = ''
  categoryFilter.value = ''
  userSearch.value = ''
  currentPage.value = 1
}
const handleSizeChange = (val) => { pageSize.value = val; currentPage.value = 1 }
const handleCurrentChange = (val) => { currentPage.value = val }

onMounted(() => {
  fetchFeedback()
})
</script>
