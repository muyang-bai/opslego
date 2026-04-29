<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-text-primary">兑换码管理</h2>
      <div class="space-x-4">
        <el-button type="default" @click="exportCodes">
          <el-icon class="mr-2"><download /></el-icon>
          导出兑换码
        </el-button>
        <el-button type="primary" @click="showGenerateDialog = true">
          <el-icon class="mr-2"><plus /></el-icon>
          生成兑换码
        </el-button>
      </div>
    </div>
    
    <!-- 统计信息 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-text-secondary text-sm mb-1">总兑换码</p>
            <p class="text-2xl font-bold text-text-primary">{{ stats.totalCodes }}</p>
          </div>
          <el-icon :size="32" class="text-blue-500"><tickets /></el-icon>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-text-secondary text-sm mb-1">已使用</p>
            <p class="text-2xl font-bold text-text-primary">{{ stats.usedCodes }}</p>
          </div>
          <el-icon :size="32" class="text-green-500"><circle-check /></el-icon>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-text-secondary text-sm mb-1">未使用</p>
            <p class="text-2xl font-bold text-text-primary">{{ stats.unusedCodes }}</p>
          </div>
          <el-icon :size="32" class="text-yellow-500"><clock /></el-icon>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-text-secondary text-sm mb-1">使用率</p>
            <p class="text-2xl font-bold text-text-primary">{{ stats.usageRate }}%</p>
          </div>
          <el-icon :size="32" class="text-purple-500"><trend-charts /></el-icon>
        </div>
      </div>
    </div>
    
    <!-- 筛选和搜索 -->
    <div class="bg-white rounded-xl shadow-card p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">状态筛选</label>
          <el-select v-model="statusFilter" placeholder="全部状态" clearable @change="filterCodes">
            <el-option label="未使用" value="unused" />
            <el-option label="已使用" value="used" />
          </el-select>
        </div>
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">套餐类型</label>
          <el-select v-model="planFilter" placeholder="全部类型" clearable @change="filterCodes">
            <el-option label="Basic" value="basic" />
            <el-option label="Premium" value="premium" />
          </el-select>
        </div>
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">搜索兑换码</label>
          <el-input v-model="codeSearch" placeholder="输入兑换码" clearable @input="filterCodes" />
        </div>
        <div class="flex items-end">
          <el-button type="default" @click="resetFilters">重置筛选</el-button>
        </div>
      </div>
    </div>
    
    <!-- 兑换码表格 -->
    <div class="bg-white rounded-xl shadow-card overflow-hidden">
      <el-table :data="filteredCodes" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="code" label="兑换码" min-width="220">
          <template #default="{ row }">
            <el-tag type="info" size="small">{{ row.code }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="plan_type" label="套餐类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.plan_type === 'premium' ? 'success' : ''" size="small">
              {{ row.plan_type === 'premium' ? 'Premium' : 'Basic' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration_days" label="有效期（天）" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'used' ? 'success' : 'warning'" size="small">
              {{ row.status === 'used' ? '已使用' : '未使用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="user_id" label="激活用户ID" width="120" />
        <el-table-column prop="activated_at" label="激活时间" width="180" />
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'unused'" type="text" size="small" @click="deleteCode(row)">删除</el-button>
            <span v-else class="text-text-secondary text-sm">已使用</span>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="flex justify-between items-center p-4 border-t">
        <span class="text-text-secondary text-sm">共 {{ totalCodes }} 条记录</span>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, prev, pager, next, jumper"
          :total="totalCodes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    
    <!-- 生成兑换码对话框 -->
    <el-dialog v-model="showGenerateDialog" title="生成兑换码" width="500px">
      <el-form :model="generateForm" label-width="120px">
        <el-form-item label="套餐类型" required>
          <el-select v-model="generateForm.plan_type" placeholder="请选择套餐类型">
            <el-option label="Basic（基础版）" value="basic" />
            <el-option label="Premium（高级版）" value="premium" />
          </el-select>
        </el-form-item>
        <el-form-item label="有效期（天）" required>
          <el-input-number v-model="generateForm.duration_days" :min="1" :max="365" placeholder="请输入天数" style="width: 100%" />
        </el-form-item>
        <el-form-item label="生成数量" required>
          <el-input-number v-model="generateForm.count" :min="1" :max="1000" placeholder="请输入数量" style="width: 100%" />
        </el-form-item>
        <el-form-item label="前缀（可选）">
          <el-input v-model="generateForm.prefix" placeholder="例如: VIP" maxlength="10" />
        </el-form-item>
        <el-form-item label="备注（可选）">
          <el-input v-model="generateForm.note" type="textarea" :rows="3" placeholder="可备注这批兑换码的用途" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showGenerateDialog = false">取消</el-button>
          <el-button type="primary" @click="generateCodes" :loading="generating">确认生成</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Download, Plus, Tickets, CircleCheck, Clock, TrendCharts } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/utils/api'

const loading = ref(false)
const generating = ref(false)
const statusFilter = ref('')
const planFilter = ref('')
const codeSearch = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const stats = ref({
  totalCodes: 0,
  usedCodes: 0,
  unusedCodes: 0,
  usageRate: 0
})

const codes = ref([])

const showGenerateDialog = ref(false)
const generateForm = ref({
  plan_type: 'basic',
  duration_days: 30,
  count: 1,
  prefix: '',
  note: ''
})

const filteredCodes = computed(() => {
  let filtered = codes.value
  if (statusFilter.value) {
    filtered = filtered.filter(c => c.status === statusFilter.value)
  }
  if (planFilter.value) {
    filtered = filtered.filter(c => c.plan_type === planFilter.value)
  }
  if (codeSearch.value) {
    const q = codeSearch.value.toLowerCase()
    filtered = filtered.filter(c => c.code.toLowerCase().includes(q))
  }
  const start = (currentPage.value - 1) * pageSize.value
  return filtered.slice(start, start + pageSize.value)
})

const totalCodes = computed(() => {
  let filtered = codes.value
  if (statusFilter.value) filtered = filtered.filter(c => c.status === statusFilter.value)
  if (planFilter.value) filtered = filtered.filter(c => c.plan_type === planFilter.value)
  if (codeSearch.value) filtered = filtered.filter(c => c.code.toLowerCase().includes(codeSearch.value.toLowerCase()))
  return filtered.length
})

const fetchCodes = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/redemption')
    if (res && res.codes) {
      codes.value = res.codes
      stats.value.totalCodes = res.codes.length
      stats.value.usedCodes = res.codes.filter(c => c.status === 'used').length
      stats.value.unusedCodes = res.codes.filter(c => c.status === 'unused').length
      stats.value.usageRate = stats.value.totalCodes > 0 ? Math.round((stats.value.usedCodes / stats.value.totalCodes) * 100) : 0
    } else {
      codes.value = []
    }
  } catch (e) {
    ElMessage.error('获取兑换码失败')
  } finally {
    loading.value = false
  }
}

const generateCodes = async () => {
  if (!generateForm.value.plan_type || !generateForm.value.duration_days || !generateForm.value.count) {
    ElMessage.warning('请填写完整信息')
    return
  }
  generating.value = true
  try {
    await api.post('/admin/redemption/generate', {
      planType: generateForm.value.plan_type,
      duration: generateForm.value.duration_days,
      count: generateForm.value.count
    })
    ElMessage.success(`成功生成 ${generateForm.value.count} 个兑换码`)
    showGenerateDialog.value = false
    generateForm.value = { plan_type: 'basic', duration_days: 30, count: 1, prefix: '', note: '' }
    fetchCodes()
  } catch (e) {
    ElMessage.error('生成失败')
  } finally {
    generating.value = false
  }
}

const deleteCode = (code) => {
  ElMessageBox.confirm(`确定删除兑换码 "${code.code}" 吗？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 后端暂未实现删除接口，先提醒
      ElMessage.warning('删除功能后端尚未支持')
    } catch (e) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const exportCodes = () => {
  if (codes.value.length === 0) return
  const header = '兑换码,套餐,天数,状态,激活时间\n'
  const rows = codes.value.map(c => {
    const plan = c.plan_type === 'premium' ? 'Premium' : 'Basic'
    const status = c.status === 'used' ? '已使用' : '未使用'
    const time = c.activated_at ? new Date(c.activated_at).toLocaleString() : ''
    return `${c.code},${plan},${c.duration_days},${status},${time}`
  }).join('\n')
  const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `兑换码_${new Date().toISOString().slice(0,10)}.csv`
  link.click()
  ElMessage.success('导出成功')
}

const filterCodes = () => { currentPage.value = 1 }
const resetFilters = () => {
  statusFilter.value = ''
  planFilter.value = ''
  codeSearch.value = ''
  currentPage.value = 1
}
const handleSizeChange = (val) => { pageSize.value = val; currentPage.value = 1 }
const handleCurrentChange = (val) => { currentPage.value = val }

onMounted(() => {
  fetchCodes()
})
</script>
