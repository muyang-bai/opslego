<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-text-primary">用户管理</h2>
      <el-button type="primary" @click="showAddUserDialog = true">
        <el-icon class="mr-2"><plus /></el-icon>
        添加用户
      </el-button>
    </div>
    
    <div class="bg-white rounded-xl shadow-card p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">搜索用户</label>
          <el-input v-model="searchQuery" placeholder="邮箱/姓名" clearable @input="handleSearch" />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">角色筛选</label>
          <el-select v-model="roleFilter" placeholder="全部角色" clearable @change="filterUsers">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </div>
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">注册时间</label>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="filterUsers"
          />
        </div>
        <div class="flex items-end">
          <el-button type="default" @click="resetFilters">重置筛选</el-button>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-xl shadow-card overflow-hidden">
      <el-table :data="displayedUsers" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'" size="small">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="editUser(row)">编辑</el-button>
            <el-button type="text" size="small" @click="viewUserDetails(row)">详情</el-button>
            <el-button v-if="row.role !== 'admin'" type="text" size="small" @click="deleteUser(row)" style="color: #f56c56;">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="flex justify-between items-center p-4 border-t">
        <span class="text-text-secondary text-sm">共 {{ totalUsers }} 条记录</span>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, prev, pager, next, jumper"
          :total="totalUsers"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    
    <el-dialog v-model="showAddUserDialog" title="添加用户" width="500px">
      <el-form :model="newUserForm" label-width="100px">
        <el-form-item label="邮箱" required>
          <el-input v-model="newUserForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="newUserForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input v-model="newUserForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="newUserForm.role" placeholder="请选择角色">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddUserDialog = false">取消</el-button>
          <el-button type="primary" @click="addUser">确认添加</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUsers } from '@/api/admin'
import api from '@/utils/api'

const searchQuery = ref('')
const roleFilter = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const users = ref([])

const showAddUserDialog = ref(false)
const newUserForm = ref({
  email: '',
  name: '',
  password: '',
  role: 'user'
})

const totalUsers = computed(() => {
  let filtered = users.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.email.toLowerCase().includes(query) || 
      user.name.toLowerCase().includes(query)
    )
  }
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }
  return filtered.length
})

const displayedUsers = computed(() => {
  let filtered = users.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.email.toLowerCase().includes(query) || 
      user.name.toLowerCase().includes(query)
    )
  }
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }
  if (dateRange.value && dateRange.value.length === 2) {
    const [start, end] = dateRange.value
    filtered = filtered.filter(user => {
      const userDate = new Date(user.created_at)
      return userDate >= new Date(start) && userDate <= new Date(end)
    })
  }
  const startIndex = (currentPage.value - 1) * pageSize.value
  return filtered.slice(startIndex, startIndex + pageSize.value)
})

function formatDate(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleString('zh-CN')
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await getUsers()
    if (res && res.users) {
      users.value = Array.isArray(res.users) ? res.users : [res.users]
    }
  } catch (err) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { currentPage.value = 1 }
const filterUsers = () => { currentPage.value = 1 }
const resetFilters = () => {
  searchQuery.value = ''
  roleFilter.value = ''
  dateRange.value = []
  currentPage.value = 1
}
const handleSizeChange = (val) => { pageSize.value = val; currentPage.value = 1 }
const handleCurrentChange = (val) => { currentPage.value = val }

const editUser = (user) => { ElMessage.info(`编辑用户: ${user.name}`) }
const viewUserDetails = (user) => { ElMessage.info(`查看用户详情: ${user.name}`) }

const deleteUser = (user) => {
  ElMessageBox.confirm(`确定删除用户 "${user.name}" 吗？此操作不可恢复。`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await api.delete(`/admin/users/${user.id}`)
      users.value = users.value.filter(u => u.id !== user.id)
      ElMessage.success('用户删除成功')
    } catch (e) {
      ElMessage.error('删除失败，请稍后重试')
    }
  }).catch(() => {})
}

const addUser = () => {
  if (!newUserForm.value.email || !newUserForm.value.name || !newUserForm.value.password) {
    ElMessage.warning('请填写完整信息')
    return
  }
  ElMessage.info('添加用户功能需后端接口支持')
  showAddUserDialog.value = false
  newUserForm.value = { email: '', name: '', password: '', role: 'user' }
}

onMounted(() => { fetchUsers() })
</script>
