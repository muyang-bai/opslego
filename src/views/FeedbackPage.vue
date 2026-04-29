<template>
  <DefaultLayout>
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-12">
        <div class="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <el-icon :size="40" class="text-white"><chat-line-round /></el-icon>
        </div>
        <h1 class="text-3xl font-bold text-text-primary mb-3">意见反馈</h1>
        <p class="text-text-secondary text-lg">你的建议是我们进步的动力</p>
      </div>
      
      <div class="bg-white rounded-2xl shadow-card p-8 mb-8">
        <el-form 
          ref="feedbackForm" 
          :model="form" 
          :rules="rules" 
          @submit.prevent="handleSubmit"
          class="space-y-6"
        >
          <el-form-item label="反馈类型" prop="category">
            <el-select 
              v-model="form.category" 
              placeholder="请选择反馈类型"
              size="large"
              class="w-full"
            >
              <el-option label="功能建议" value="功能建议" />
              <el-option label="Bug反馈" value="Bug反馈" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="详细描述" prop="message">
            <el-input
              v-model="form.message"
              type="textarea"
              :rows="6"
              placeholder="请详细描述你的建议或遇到的问题。如果是Bug反馈，请说明具体操作步骤和现象。"
              maxlength="1000"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="联系方式（选填）">
            <el-input
              v-model="form.contact"
              placeholder="如需回复请留邮箱或微信号"
              size="large"
              :prefix-icon="Message"
            />
            <p class="text-text-secondary text-xs mt-2">
              我们承诺不会泄露你的联系方式，仅用于回复反馈
            </p>
          </el-form-item>
          
          <el-button 
            type="primary" 
            size="large" 
            :loading="isLoading"
            class="w-full"
            @click="handleSubmit"
          >
            提交反馈
          </el-button>
        </el-form>
        
        <div class="mt-10 pt-8 border-t border-gray-100">
          <h3 class="text-lg font-semibold text-text-primary mb-4">反馈处理承诺</h3>
          <ul class="text-text-secondary space-y-3">
            <li class="flex items-start">
              <el-icon class="text-green-500 mr-3 mt-0.5"><check /></el-icon>
              <span>我们会在3个工作日内阅读每一条反馈</span>
            </li>
            <li class="flex items-start">
              <el-icon class="text-green-500 mr-3 mt-0.5"><check /></el-icon>
              <span>有价值的建议会纳入产品开发计划</span>
            </li>
            <li class="flex items-start">
              <el-icon class="text-green-500 mr-3 mt-0.5"><check /></el-icon>
              <span>Bug反馈会优先处理，尽快修复</span>
            </li>
            <li class="flex items-start">
              <el-icon class="text-green-500 mr-3 mt-0.5"><check /></el-icon>
              <span>如需回复，会通过你留下的联系方式与你联系</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="text-center text-text-secondary text-sm">
        <p>也可以通过以下方式联系我们：</p>
        <p class="mt-2 font-medium">[此处替换为你的真实邮箱]</p>
        <p class="mt-4">
          <router-link to="/terms" class="text-secondary hover:text-secondary-dark">免责声明</router-link>
          · 
          <router-link to="/privacy" class="text-secondary hover:text-secondary-dark">隐私政策</router-link>
        </p>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ChatLineRound, Message, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { submitFeedback } from '@/api/feedback'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const feedbackForm = ref(null)
const isLoading = ref(false)

const form = reactive({
  category: '',
  message: '',
  contact: ''
})

const rules = {
  category: [
    { required: true, message: '请选择反馈类型', trigger: 'blur' }
  ],
  message: [
    { required: true, message: '请输入详细描述', trigger: 'blur' },
    { min: 10, message: '描述至少10个字符', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!feedbackForm.value) return
  
  try {
    await feedbackForm.value.validate()
    isLoading.value = true
    
    const result = await submitFeedback({
      category: form.category,
      message: form.message,
      contact: form.contact || null
    })
    
    if (result.error) {
      ElMessage.error(result.message || '提交失败')
      return
    }
    
    ElMessage.success('感谢你的反馈！我们会认真对待每一条建议。')
    
    // 重置表单
    form.category = ''
    form.message = ''
    form.contact = ''
    
    // 重置表单验证状态
    feedbackForm.value.resetFields()
    
  } catch (error) {
    if (error.error) {
      ElMessage.error(error.message || '提交失败')
    }
    // 表单验证错误，不显示额外消息
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 反馈页样式 */
</style>