<template>
  <div class="bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1 border border-gray-100">
    <div class="flex items-start space-x-4">
      <!-- 图标 -->
      <div class="flex-shrink-0">
        <div class="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center" :class="iconBgColor">
          <el-icon :size="24" :class="service.color">
            <component :is="service.icon" />
          </el-icon>
        </div>
      </div>
      
      <!-- 内容 -->
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-text-primary mb-2">
          {{ service.title }}
        </h3>
        <p class="text-text-secondary text-sm">
          {{ service.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  service: {
    type: Object,
    required: true
  }
})

// 根据图标颜色生成背景色
const iconBgColor = computed(() => {
  const colorMap = {
    'text-blue-500': 'bg-blue-50',
    'text-green-500': 'bg-green-50',
    'text-purple-500': 'bg-purple-50',
    'text-yellow-500': 'bg-yellow-50',
    'text-pink-500': 'bg-pink-50',
    'text-indigo-500': 'bg-indigo-50'
  }
  return colorMap[props.service.color] || 'bg-gray-50'
})
</script>

<style scoped>
/* 组件样式 */
</style>