<template>
  <DefaultLayout>
    <!-- Hero区域 -->
    <section class="py-12 md:py-20 text-center">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold text-text-primary mb-6">
          选择适合你的自动化套餐
        </h1>
        <p class="text-xl text-text-secondary mb-10">
          按需订阅，灵活升级。所有套餐均通过兑换码激活，全程不接入在线支付接口。
        </p>
      </div>
    </section>

    <!-- 定价卡片 -->
    <section class="py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <PricingCard 
          v-for="plan in pricingPlans"
          :key="plan.id"
          :plan="plan"
        />
      </div>
    </section>

    <!-- 功能对比表 -->
    <section class="py-12 md:py-20">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-text-primary mb-4">详细功能对比</h2>
          <p class="text-text-secondary">了解不同套餐的功能差异</p>
        </div>
        
        <div class="bg-white rounded-2xl shadow-card overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50">
                <th class="text-left p-6 font-semibold text-text-primary">功能模块</th>
                <th class="text-center p-6 font-semibold text-text-primary">新手启航版</th>
                <th class="text-center p-6 font-semibold text-text-primary">效率进阶版</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="feature in featureComparison" :key="feature.name" class="border-t border-gray-100">
                <td class="p-6 font-medium text-text-primary">{{ feature.name }}</td>
                <td class="p-6 text-center">
                  <span v-if="feature.basic === true" class="text-green-600">✓</span>
                  <span v-else-if="feature.basic === false" class="text-gray-400">✗</span>
                  <span v-else class="text-text-secondary">{{ feature.basic }}</span>
                </td>
                <td class="p-6 text-center">
                  <span v-if="feature.premium === true" class="text-green-600">✓</span>
                  <span v-else-if="feature.premium === false" class="text-gray-400">✗</span>
                  <span v-else class="text-text-secondary">{{ feature.premium }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-12 md:py-20">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-text-primary mb-4">常见问题</h2>
          <p class="text-text-secondary">关于订阅的疑问，都在这里</p>
        </div>
        
        <div class="space-y-6">
          <div v-for="faq in faqs" :key="faq.question" class="bg-white rounded-xl shadow-card p-6">
            <h3 class="text-lg font-semibold text-text-primary mb-3">{{ faq.question }}</h3>
            <p class="text-text-secondary">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-12 md:py-20 text-center">
      <div class="max-w-3xl mx-auto bg-gradient-to-r from-primary-light to-secondary-light rounded-2xl p-8 md:p-12">
        <h2 class="text-3xl font-bold text-text-primary mb-6">还没找到合适的套餐？</h2>
        <p class="text-text-secondary text-lg mb-8">
          我们有专业的客服团队为你解答疑问，帮你选择最适合的方案。
        </p>
        <router-link 
          to="/feedback"
          class="inline-block bg-white text-text-primary px-8 py-4 rounded-xl hover:bg-gray-50 transition-all hover:-translate-y-1 hover:shadow-button-hover text-lg font-medium"
        >
          联系我们
        </router-link>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PricingCard from '@/components/home/PricingCard.vue'

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
      '即梦AI图片（10张/月）',
      '基础技术支持'
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
      '专属客服支持',
      '优先功能体验'
    ],
    buttonText: '扫码加群订阅',
    popular: true
  }
]

// 功能对比
const featureComparison = [
  { name: '智能客服', basic: true, premium: true },
  { name: '客服响应速度', basic: '标准', premium: '优先' },
  { name: '商品管理', basic: '单店铺', premium: '多店铺' },
  { name: '自动化上架', basic: '10个/天', premium: '无限制' },
  { name: '数据监控', basic: '基础监控', premium: '深度雷达' },
  { name: '竞品分析', basic: '3个竞品', premium: '10个竞品' },
  { name: '评价维护', basic: false, premium: true },
  { name: '自动邀评', basic: false, premium: '50次/月' },
  { name: 'AI内容生成', basic: '50次/月', premium: '无限制' },
  { name: '标题优化', basic: true, premium: true },
  { name: '即梦AI图片', basic: '10张/月', premium: '20张/月' },
  { name: '专属客服', basic: false, premium: true },
  { name: '技术支持', basic: '工作日', premium: '7×24小时' }
]

// 常见问题
const faqs = [
  {
    question: '如何激活套餐？',
    answer: '选择套餐后扫码加群，联系管理员转账获取兑换码，然后在网站兑换码页面输入激活即可。'
  },
  {
    question: '兑换码有效期是多久？',
    answer: '兑换码有效期为30天，从生成之日起计算。激活后套餐服务期从激活日开始计算。'
  },
  {
    question: '可以升级套餐吗？',
    answer: '可以随时升级套餐。升级时我们会计算剩余价值，只需补差价即可。'
  },
  {
    question: '支持退款吗？',
    answer: '兑换码一旦激活即视为使用，不支持退款。请确认需求后再激活。'
  },
  {
    question: '一个兑换码可以激活多次吗？',
    answer: '每个兑换码只能激活一次，激活后即失效。'
  },
  {
    question: '可以多人共用账号吗？',
    answer: '一个账号仅限一人使用。如有多人需求，请分别注册账号。'
  }
]
</script>

<style scoped>
/* 定价页样式 */
</style>