import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'
const RobotsPage = () => import('@/views/dashboard/RobotsPage.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
    meta: { title: '运营乐高 - 电商运营自动化平台' }
  },
  {
    path: '/pricing',
    name: 'pricing',
    component: () => import('@/views/PricingPage.vue'),
    meta: { title: '套餐定价 - 运营乐高' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { title: '登录 - 运营乐高', guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterPage.vue'),
    meta: { title: '注册 - 运营乐高', guestOnly: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/DashboardPage.vue'),
    meta: { title: '控制台 - 运营乐高', requiresAuth: true }
  },
  {
  path: '/robots',
  name: 'robots',
  component: () => import('@/views/dashboard/RobotsPage.vue'),
  meta: { title: '我的机器人 - 运营乐高', requiresAuth: true }
  },
  {
    path: '/redeem',
    name: 'redeem',
    component: () => import('@/views/RedeemPage.vue'),
    meta: { title: '激活兑换码 - 运营乐高', requiresAuth: true }
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: () => import('@/views/FeedbackPage.vue'),
    meta: { title: '意见反馈 - 运营乐高', requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin/AdminPage.vue'),
    meta: { title: '管理员后台 - 运营乐高', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutPage.vue'),
    meta: { title: '关于我们 - 运营乐高' }
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/views/PrivacyPage.vue'),
    meta: { title: '隐私政策 - 运营乐高' }
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/views/TermsPage.vue'),
    meta: { title: '免责声明 - 运营乐高' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/NotFoundPage.vue'),
    meta: { title: '页面不存在 - 运营乐高' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 如果 Store 未初始化完毕，等待它完成
  if (!authStore.isReady) {
    await authStore.fetchCurrentUser()
  }

  if (to.meta.title) {
    document.title = to.meta.title
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'dashboard' })
    return
  }

  next()
})

export default router
