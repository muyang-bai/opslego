<template>
  <div class="bg-white rounded-2xl shadow-card p-8 border-2 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-2"
       :class="plan.popular ? 'border-primary border-opacity-50 relative' : 'border-transparent'">
    
    <!-- 热门标签 -->
    <div v-if="plan.popular" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
      <span class="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
        最受欢迎
      </span>
    </div>
    
    <!-- 套餐信息 -->
    <div class="text-center mb-6">
      <h3 class="text-2xl font-bold text-text-primary mb-2">
        {{ plan.name }}
      </h3>
      <div class="flex items-baseline justify-center mb-4">
        <span class="text-4xl font-bold text-text-primary">{{ plan.price }}</span>
        <span class="text-text-secondary ml-1">{{ plan.period }}</span>
      </div>
    </div>
    
    <!-- 功能列表 -->
    <ul class="space-y-3 mb-8">
      <li v-for="(feature, index) in plan.features" :key="index" class="flex items-center">
        <el-icon class="text-green-500 mr-3"><check /></el-icon>
        <span class="text-text-secondary">{{ feature }}</span>
      </li>
    </ul>
    
    <!-- 订阅按钮 -->
    <button 
      @click="handleSubscribe(plan.id)"
      class="w-full py-3 rounded-xl font-medium transition-all duration-200 hover:-translate-y-0.5"
      :class="plan.popular 
        ? 'bg-primary text-white hover:bg-primary-dark hover:shadow-button-hover' 
        : 'bg-gray-100 text-text-primary hover:bg-gray-200'"
    >
      {{ plan.buttonText }}
    </button>
  </div>
</template>

<script setup>
import { Check } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { ElMessageBox, ElMessage } from 'element-plus'

const props = defineProps({
  plan: {
    type: Object,
    required: true
  }
})
const router = useRouter()
const authStore = useAuthStore()

// 处理订阅
const handleSubscribe = (planId) => {
  if (!authStore.isAuthenticated) {
    // 未登录，跳转到登录页
    ElMessageBox.confirm(
      '订阅套餐需要先登录，是否立即登录？',
      '提示',
      {
        confirmButtonText: '去登录',
        cancelButtonText: '取消',
        type: 'info'
      }
    ).then(() => {
      // 跳转到登录页
        router.push(`/login?redirect=/pricing&plan=${planId}`)
    })
    return
  }
  
  // 已登录，显示加群二维码
  showQRModal(planId)
}

// 显示二维码模态框
const showQRModal = (planId) => {
  ElMessageBox({
    title: '加入交流群，获取专属兑换码',
    message: `
      <div style="text-align: center; padding: 20px;">
        <div style="background: #f5f5f5; padding: 30px; border-radius: 12px; margin: 20px 0;">
          <p style="color: #666; margin-bottom: 20px;">（此处放置QQ/微信群二维码）</p>
          <div style="width: 200px; height: 200px; background: #ddd; margin: 0 auto; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
            <span style="color: #999;">二维码占位图</span>
          </div>
        </div>
        <p style="color: #666; margin-bottom: 10px; text-align: left;">
          <strong>操作流程：</strong>
        </p>
        <ol style="color: #666; text-align: left; margin-bottom: 20px; padding-left: 20px;">
          <li>扫码加群后，联系管理员转账并获取兑换码</li>
          <li>管理员在线时间：每天9:00-23:00，通常5分钟内回复</li>
        </ol>
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
          <button id="goRedeem" style="flex: 1; margin-right: 10px; padding: 10px; background: #00B4D8; color: white; border: none; border-radius: 6px; cursor: pointer;">
            已加群，去激活
          </button>
          <button id="closeModal" style="flex: 1; padding: 10px; background: #f0f0f0; color: #666; border: none; border-radius: 6px; cursor: pointer;">
            关闭
          </button>
        </div>
      </div>
    `,
    dangerouslyUseHTMLString: true,
    showCancelButton: false,
    showConfirmButton: false,
    closeOnClickModal: false,
    beforeClose: (action, instance, done) => {
      // 处理按钮点击
      if (action === 'confirm') {
        done()
      }
    }
  }).then(() => {
    // 模态框关闭后的处理
  }).catch(() => {
    // 取消
  })
  
  // 添加按钮事件监听器（在下一个tick）
  setTimeout(() => {
    const goRedeemBtn = document.getElementById('goRedeem')
    const closeBtn = document.getElementById('closeModal')
    
    if (goRedeemBtn) {
      goRedeemBtn.addEventListener('click', () => {
        ElMessageBox.close()
        router.push('/redeem')
      })
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        ElMessageBox.close()
      })
    }
  }, 100)
}
</script>

<style scoped>
/* 组件样式 */
</style>