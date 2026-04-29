<template>
  <DefaultLayout>
    <div class="max-w-md mx-auto">
      <div class="bg-white rounded-2xl shadow-card p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <el-icon :size="32" class="text-white"><user /></el-icon>
          </div>
          <h1 class="text-2xl font-bold text-text-primary">欢迎回来</h1>
          <p class="text-text-secondary mt-2">登录你的运营乐高账号</p>
        </div>
        
        <el-form 
          ref="loginForm" 
          :model="form" 
          :rules="rules" 
          @submit.prevent="handleLogin"
          class="space-y-6"
        >
          <el-form-item prop="email">
            <el-input 
              v-model="form.email" 
              placeholder="请输入邮箱"
              size="large"
              :prefix-icon="Message"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input 
              v-model="form.password" 
              type="password" 
              placeholder="请输入密码"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <div class="flex items-center justify-between">
            <el-checkbox v-model="rememberMe">记住我</el-checkbox>
            <router-link to="#" class="text-secondary hover:text-secondary-dark text-sm">
              忘记密码？
            </router-link>
          </div>
          
          <el-button 
            type="primary" 
            size="large" 
            :loading="isLoading"
            class="w-full"
            @click="handleLogin"
          >
            登录
          </el-button>
          
          <div class="text-center">
            <span class="text-text-secondary">还没有账号？</span>
            <router-link to="/register" class="text-secondary hover:text-secondary-dark font-medium ml-2">
              立即注册
            </router-link>
          </div>
        </el-form>
        
        <div class="mt-8 pt-8 border-t border-gray-100">
          <p class="text-text-secondary text-sm text-center">
            登录即表示你同意我们的
            <router-link to="/terms" class="text-secondary hover:text-secondary-dark">服务条款</router-link>
            和
            <router-link to="/privacy" class="text-secondary hover:text-secondary-dark">隐私政策</router-link>
          </p>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message, Lock, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loginForm = ref(null)
const rememberMe = ref(false)
const isLoading = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginForm.value) return
  
  try {
    await loginForm.value.validate()
    isLoading.value = true
    
    const result = await authStore.login({
      email: form.email,
      password: form.password
    })
    
    if (result.error) {
      ElMessage.error(result.message || '登录失败')
      return
    }
    
    ElMessage.success('登录成功')
    
    // 跳转到目标页面或控制台
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
    
  } catch (error) {
    if (error.error) {
      ElMessage.error(error.message || '登录失败')
    }
    // 表单验证错误，不显示额外消息
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 登录页样式 */
</style>