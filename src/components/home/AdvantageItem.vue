<template>
  <div class="flex items-start space-x-4">
    <div class="flex-shrink-0">
      <div class="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center">
        <el-icon :size="24" class="text-primary">
          <component :is="getIconComponent(advantage.icon)" />
        </el-icon>
      </div>
    </div>
    
    <div class="flex-1">
      <h3 class="text-lg font-semibold text-text-primary mb-2">
        {{ advantage.title }}
      </h3>
      <p class="text-text-secondary">
        {{ advantage.description }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { Lightning, Lock, Platform } from '@element-plus/icons-vue'

const props = defineProps({
  advantage: {
    type: Object,
    required: true
  }
})

// 获取图标组件
const getIconComponent = (iconName) => {
  const iconMap = {
    'Lightning': Lightning,
    'Lock': Lock,
    'Platform': Platform
  }
  return iconMap[iconName] || Lightning
}
</script>

<style scoped>
/* 组件样式 */
</style>