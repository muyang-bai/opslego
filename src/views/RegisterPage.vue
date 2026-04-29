<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-card p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-text-primary mb-2">注册账号</h1>
        <p class="text-text-secondary">已有账号？<router-link to="/login" class="text-primary hover:text-primary-dark font-medium">去登录</router-link></p>
      </div>

      <el-form
        ref="registerForm"
        :model="formData"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleRegister"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱地址"
            :prefix-icon="Message"
            size="large"
            clearable
          />
        </el-form-item>

        <!-- 邮箱验证码（SMTP已配置时显示） -->
        <el-form-item v-if="showEmailCode" label="邮箱验证码" prop="emailCode">
          <div class="flex gap-2">
            <el-input
              v-model="formData.emailCode"
              placeholder="请输入验证码"
              size="large"
              class="flex-1"
            />
            <el-button
              type="primary"
              size="large"
              :loading="sendingCode"
              :disabled="codeCountdown > 0 || !formData.email"
              @click="sendEmailCode"
            >
              {{ codeCountdown > 0 ? `${codeCountdown}秒后重发` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入姓名"
            :prefix-icon="User"
            size="large"
            clearable
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="至少6位密码"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="再次输入密码"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <!-- 人机验证 -->
        <el-form-item label="人机验证" prop="captchaAnswer">
          <div class="flex items-center gap-4">
            <div class="flex-1 bg-gray-100 rounded-lg px-4 py-2 flex items-center justify-between">
              <span class="text-lg font-mono font-bold text-text-primary">{{ captchaQuestion }}</span>
              <el-button
                type="text"
                :icon="Refresh"
                @click="refreshCaptcha"
                :loading="captchaLoading"
                size="small"
              />
            </div>
            <el-input
              v-model="formData.captchaAnswer"
              placeholder="答案"
              size="large"
              class="w-24"
              :disabled="!captchaId"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="w-full"
            :loading="isSubmitting"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Message, User, Lock, Refresh } from '@element-plus/icons-vue'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const registerForm = ref(null)
const isSubmitting = ref(false)
const captchaId = ref('')
const captchaQuestion = ref('加载中...')
const captchaLoading = ref(false)

// 邮箱验证码相关
const showEmailCode = ref(false)
const sendingCode = ref(false)
const codeCountdown = ref(0)

const formData = reactive({
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
  captchaAnswer: '',
  emailCode: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  captchaAnswer: [
    { required: true, message: '请输入验证码答案', trigger: 'blur' }
  ]
}

// 获取数学题验证码
const fetchCaptcha = async () => {
  captchaLoading.value = true
  try {
    const res = await fetch('/api/auth/captcha')
    const data = await res.json()
    if (data.error) {
      ElMessage.error(data.message || '获取验证码失败')
      return
    }
    captchaId.value = data.captchaId
    captchaQuestion.value = data.question
  } catch (e) {
    ElMessage.error('网络错误')
  } finally {
    captchaLoading.value = false
  }
}

const refreshCaptcha = () => fetchCaptcha()

// 发送邮箱验证码
const sendEmailCode = async () => {
  if (!formData.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }
  sendingCode.value = true
  try {
    const res = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email })
    })
    const data = await res.json()
    if (data.error) {
      ElMessage.error(data.message || '发送失败')
      return
    }
    ElMessage.success('验证码已发送')
    codeCountdown.value = 60
    const timer = setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (e) {
    ElMessage.error('网络错误')
  } finally {
    sendingCode.value = false
  }
}

// 检测 SMTP 是否已配置
const checkSmtpStatus = async () => {
  try {
    const res = await fetch('/api/auth/smtp-status')
    const data = await res.json()
    showEmailCode.value = data.configured
    // 如果显示邮箱验证码，则增加验证规则
    if (showEmailCode.value) {
      rules.emailCode = [
        { required: true, message: '请输入邮箱验证码', trigger: 'blur' }
      ]
    }
  } catch (e) {
    showEmailCode.value = false
  }
}

const handleRegister = async () => {
  if (!registerForm.value) return
  try {
    await registerForm.value.validate()
  } catch (e) {
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      captchaId: captchaId.value,
      captchaAnswer: parseInt(formData.captchaAnswer)
    }
    // 如果开启了邮箱验证码，附加 code
    if (showEmailCode.value) {
      payload.code = formData.emailCode
    }
    const result = await authStore.register(payload)

    if (result.error) {
      ElMessage.error(result.message || '注册失败')
      return
    }

    ElMessage.success('注册成功！')
    router.push('/dashboard')
  } catch (e) {
    ElMessage.error('注册失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchCaptcha()
  checkSmtpStatus()
})
</script>
