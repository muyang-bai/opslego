<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- 导航栏 -->
    <nav class="bg-white shadow-sm border-b border-gray-100">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">L</span>
            </div>
            <span class="text-xl font-bold text-text-primary">运营乐高</span>
          </router-link>

          <!-- 桌面端导航菜单 -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link 
              v-for="item in navItems" 
              :key="item.path"
              :to="item.path"
              class="text-text-secondary hover:text-primary transition-colors"
              active-class="text-primary font-medium"
            >
              {{ item.name }}
            </router-link>
            
            <!-- 用户相关菜单 -->
            <div v-if="!isAuthenticated" class="flex items-center space-x-4">
              <router-link to="/login" class="text-text-secondary hover:text-primary transition-colors">
                登录
              </router-link>
              <router-link 
                to="/register" 
                class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                注册
              </router-link>
            </div>
            
            <div v-else class="flex items-center space-x-4">
              <el-dropdown @command="handleUserCommand">
                <span class="flex items-center space-x-2 cursor-pointer">
                  <el-avatar :size="32" :src="userAvatar">
                    {{ userInitials }}
                  </el-avatar>
                  <span class="text-text-secondary hidden sm:inline">{{ user?.name }}</span>
                  <el-icon><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="dashboard">
                      <el-icon><Monitor /></el-icon>
                      控制台
                    </el-dropdown-item>
                    <el-dropdown-item command="robots">
                      <el-icon><Cpu /></el-icon>
                      我的机器人
                    </el-dropdown-item>
                    <el-dropdown-item v-if="isAdmin" command="admin">
                      <el-icon><setting /></el-icon>
                      管理后台
                    </el-dropdown-item>
                    <el-dropdown-item divided command="logout">
                      <el-icon><switch-button /></el-icon>
                      退出登录
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>

          <!-- 移动端菜单按钮 -->
          <button 
            class="md:hidden p-2 rounded-lg hover:bg-gray-100"
            @click="showMobileMenu = !showMobileMenu"
          >
            <el-icon :size="24">
              <Menu v-if="!showMobileMenu" />
              <Close v-else />
            </el-icon>
          </button>
        </div>

        <!-- 移动端菜单 -->
        <div v-show="showMobileMenu" class="md:hidden py-4 border-t border-gray-100">
          <div class="flex flex-col space-y-4">
            <router-link 
              v-for="item in navItems" 
              :key="item.path"
              :to="item.path"
              class="text-text-secondary hover:text-primary transition-colors py-2"
              active-class="text-primary font-medium"
              @click="showMobileMenu = false"
            >
              {{ item.name }}
            </router-link>
            
            <div v-if="!isAuthenticated" class="flex flex-col space-y-3 pt-4 border-t border-gray-100">
              <router-link 
                to="/login"
                class="text-text-secondary hover:text-primary transition-colors py-2"
                @click="showMobileMenu = false"
              >
                登录
              </router-link>
              <router-link 
                to="/register"
                class="bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-dark transition-colors text-center"
                @click="showMobileMenu = false"
              >
                注册
              </router-link>
            </div>
            
            <div v-else class="pt-4 border-t border-gray-100">
              <div class="flex items-center space-x-3 mb-4">
                <el-avatar :size="40" :src="userAvatar">
                  {{ userInitials }}
                </el-avatar>
                <div>
                  <p class="font-medium">{{ user?.name }}</p>
                  <p class="text-sm text-text-secondary">{{ user?.email }}</p>
                </div>
              </div>
              <div class="flex flex-col space-y-3">
                <router-link 
                  to="/dashboard"
                  class="text-text-secondary hover:text-primary transition-colors py-2 flex items-center space-x-2"
                  @click="showMobileMenu = false"
                >
                  <el-icon><Monitor /></el-icon>
                  <span>控制台</span>
                </router-link>
                <router-link 
                  to="/robots"
                  class="text-text-secondary hover:text-primary transition-colors py-2 flex items-center space-x-2"
                  @click="showMobileMenu = false"
                >
                  <el-icon><Cpu /></el-icon>
                  <span>我的机器人</span>
                </router-link>
                <router-link 
                  v-if="isAdmin"
                  to="/admin"
                  class="text-text-secondary hover:text-primary transition-colors py-2 flex items-center space-x-2"
                  @click="showMobileMenu = false"
                >
                  <el-icon><setting /></el-icon>
                  <span>管理后台</span>
                </router-link>
                <button 
                  @click="handleLogout"
                  class="text-text-secondary hover:text-primary transition-colors py-2 flex items-center space-x-2 text-left"
                >
                  <el-icon><switch-button /></el-icon>
                  <span>退出登录</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容 -->
    <main class="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="bg-white border-t border-gray-100 py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">L</span>
              </div>
              <span class="text-xl font-bold text-text-primary">运营乐高</span>
            </div>
            <p class="text-text-secondary text-sm">
              专为小微商家打造的轻量级、低风险代运营工具
            </p>
          </div>
          
          <div>
            <h3 class="font-medium text-text-primary mb-4">产品</h3>
            <ul class="space-y-2">
              <li><router-link to="/pricing" class="text-text-secondary hover:text-primary text-sm">套餐定价</router-link></li>
              <li><router-link to="/about" class="text-text-secondary hover:text-primary text-sm">关于我们</router-link></li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-medium text-text-primary mb-4">支持</h3>
            <ul class="space-y-2">
              <li><router-link to="/feedback" class="text-text-secondary hover:text-primary text-sm">意见反馈</router-link></li>
              <li><router-link to="/terms" class="text-text-secondary hover:text-primary text-sm">免责声明</router-link></li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-medium text-text-primary mb-4">法律</h3>
            <ul class="space-y-2">
              <li><router-link to="/privacy" class="text-text-secondary hover:text-primary text-sm">隐私政策</router-link></li>
              <li><router-link to="/terms" class="text-text-secondary hover:text-primary text-sm">用户协议</router-link></li>
            </ul>
          </div>
        </div>
        
        <div class="mt-8 pt-8 border-t border-gray-100 text-center text-text-secondary text-sm">
          <p>© {{ currentYear }} 运营乐高. 保留所有权利.</p>
          <p><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">蜀ICP备2026011042号</a></p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { 
  Menu, 
  Close, 
  Monitor, 
  Cpu,
  Setting, 
  SwitchButton,
  ArrowDown 
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const showMobileMenu = ref(false)

// 计算属性
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const user = computed(() => authStore.user)
const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name.charAt(0).toUpperCase()
})
const userAvatar = computed(() => null)

const currentYear = computed(() => new Date().getFullYear())

// 导航菜单项
const navItems = computed(() => {
  const items = [
    { path: '/', name: '首页' },
    { path: '/pricing', name: '套餐定价' },
    { path: '/about', name: '关于我们' }
  ]
  
  if (isAuthenticated.value) {
    items.push({ path: '/dashboard', name: '控制台' })
    items.push({ path: '/robots', name: '我的机器人' })
  }
  
  return items
})

// 用户命令处理
const handleUserCommand = (command) => {
  switch (command) {
    case 'dashboard':
      router.push('/dashboard')
      break
    case 'robots':
      router.push('/robots')
      break
    case 'admin':
      router.push('/admin')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '确认退出',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    authStore.logout()
    ElMessage.success('已退出登录')
    router.push('/')
  } catch (error) {
    // 用户取消
  }
}

// 页面加载时关闭移动端菜单
onMounted(() => {
  router.afterEach(() => {
    showMobileMenu.value = false
  })
})
</script>

<style scoped>
.router-link-active {
  @apply text-primary font-medium;
}
</style>