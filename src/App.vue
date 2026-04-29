<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import api from '@/utils/api'

const authStore = useAuthStore()

onMounted(async () => {
  if (authStore.token) {
    await authStore.fetchCurrentUser()
  }
  
  // 动态设置网站标题
  try {
    const res = await api.get('/admin/public/settings')
    if (res?.settings?.website?.name) {
      document.title = res.settings.website.name
    }
  } catch (e) {
    // 获取失败则保持默认
  }
})
</script>

<style scoped>
</style>
