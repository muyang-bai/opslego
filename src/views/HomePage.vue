<template>
  <DefaultLayout>
    <!-- Hero区域 -->
    <section class="py-12 md:py-20">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-text-primary mb-6">
          像玩乐高一样，<br/>搭建你的自动化电商运营
        </h1>
        <p class="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
          专为小微商家打造的轻量级、低风险代运营工具，帮你节省多平台店铺的日常操作时间。
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/pricing"
            class="bg-primary text-white px-8 py-4 rounded-xl hover:bg-primary-dark transition-all hover:-translate-y-1 hover:shadow-button-hover text-lg font-medium"
          >
            免费试用
          </router-link>
          <button 
            @click="scrollToServices"
            class="bg-white border border-secondary text-secondary px-8 py-4 rounded-xl hover:bg-secondary hover:text-white transition-all hover:-translate-y-1 hover:shadow-button-hover text-lg font-medium"
          >
            了解服务
          </button>
        </div>
      </div>
    </section>

    <!-- 服务模块卡片区 -->
    <section ref="servicesSection" class="py-12 md:py-20">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          六大核心服务模块
        </h2>
        <p class="text-text-secondary text-lg">
          覆盖电商运营全流程，让你的店铺自动化运转
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard 
          v-for="service in services"
          :key="service.id"
          :service="service"
        />
      </div>
    </section>

    <!-- 核心优势模块 -->
    <section class="py-12 md:py-20 bg-white rounded-2xl shadow-card p-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-6">
            为什么选择运营乐高？
          </h2>
          <div class="space-y-6">
            <AdvantageItem 
              v-for="advantage in advantages"
              :key="advantage.id"
              :advantage="advantage"
            />
          </div>
        </div>
        <div class="flex justify-center">
          <div class="w-full max-w-md h-64 bg-gradient-to-br from-primary-light to-secondary-light rounded-2xl flex items-center justify-center">
            <div class="text-center p-8">
              <div class="text-5xl mb-4">🤖</div>
              <p class="text-text-primary font-medium">AI智能驱动</p>
              <p class="text-text-secondary text-sm mt-2">每月免费10-20张商品图</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 定价套餐区 -->
    <section class="py-12 md:py-20">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          选择适合你的套餐
        </h2>
        <p class="text-text-secondary text-lg">
          按需订阅，灵活升级
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <PricingCard 
          v-for="plan in pricingPlans"
          :key="plan.id"
          :plan="plan"
        />
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ServiceCard from '@/components/home/ServiceCard.vue'
import AdvantageItem from '@/components/home/AdvantageItem.vue'
import PricingCard from '@/components/home/PricingCard.vue'

const servicesSection = ref(null)

// 服务列表
const services = [
  {
    id: 1,
    title: '智能客服',
    description: '7×24小时自动回复，懂你的商品',
    icon: 'ChatDotRound',
    color: 'text-blue-500'
  },
  {
    id: 2,
    title: '商品管理',
    description: '自动擦亮、批量上架、多店铺货',
    icon: 'Goods',
    color: 'text-green-500'
  },
  {
    id: 3,
    title: '数据雷达',
    description: '竞品监控，知彼知己',
    icon: 'TrendCharts',
    color: 'text-purple-500'
  },
  {
    id: 4,
    title: '评价维护',
    description: '自动邀请好评，负面预警',
    icon: 'Star',
    color: 'text-yellow-500'
  },
  {
    id: 5,
    title: '内容制作',
    description: 'AI批量生成标题与文案',
    icon: 'Document',
    color: 'text-pink-500'
  },
  {
    id: 6,
    title: '即梦AI设计',
    description: '每月免费10-20张商品图',
    icon: 'Picture',
    color: 'text-indigo-500'
  }
]

// 优势列表
const advantages = [
  {
    id: 1,
    title: '轻量级部署',
    description: '无需复杂配置，注册即用，快速上手',
    icon: 'Lightning'
  },
  {
    id: 2,
    title: '合规安全',
    description: '全程不接触支付接口，规避资质要求，降低运营风险',
    icon: 'Lock'
  },
  {
    id: 3,
    title: '多平台支持',
    description: '覆盖主流电商平台，一站式管理所有店铺',
    icon: 'Platform'
  }
]

// 定价计划
const pricingPlans = [
  {
    id: 'basic',
    name: '新手启航版',
    price: '¥99',
    period: '/月',
    features: [
      '基础智能客服',
      '商品管理（单店）',
      '数据监控',
      'AI内容生成（50次/月）',
      '即梦AI图片（10张/月）'
    ],
    buttonText: '扫码加群订阅',
    popular: false
  },
  {
    id: 'premium',
    name: '效率进阶版',
    price: '¥299',
    period: '/月',
    features: [
      '高级智能客服',
      '商品管理（多店）',
      '深度数据雷达',
      '评价自动维护',
      'AI内容生成（无限次）',
      '即梦AI图片（20张/月）',
      '专属客服支持'
    ],
    buttonText: '扫码加群订阅',
    popular: true
  }
]

// 滚动到服务区域
const scrollToServices = () => {
  if (servicesSection.value) {
    servicesSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* 自定义样式 */
</style>