import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { login as apiLogin, register as apiRegister, getCurrentUser } from '@/api/auth'
import { removeToken, setToken, getToken } from '@/utils/token'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(getToken())
  const isLoading = ref(false)
  const isReady = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(credentials) {
    isLoading.value = true
    try {
      const response = await apiLogin(credentials)
      if (!response.error) {
        user.value = response.user
        token.value = response.token
        setToken(response.token)
      }
      return response
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function register(userData) {
    isLoading.value = true
    try {
      const response = await apiRegister(userData)
      if (!response.error) {
        user.value = response.user
        token.value = response.token
        setToken(response.token)
      }
      return response
    } catch (error) {
      console.error('注册失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    removeToken()
    localStorage.removeItem('auth')
  }

  async function fetchCurrentUser() {
    if (!token.value) {
      isReady.value = true
      return null
    }
    isLoading.value = true
    try {
      const response = await getCurrentUser()
      if (!response.error) {
        user.value = response.user
      } else {
        if (response.code === 'TOKEN_EXPIRED' || response.code === 'INVALID_TOKEN') {
          logout()
        }
      }
      return response
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    } finally {
      isLoading.value = false
      isReady.value = true
    }
  }

  return {
    user,
    token,
    isLoading,
    isReady,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchCurrentUser
  }
})
