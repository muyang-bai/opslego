<template>
  <DefaultLayout>
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-text-primary mb-4">关于运营乐高</h1>
        <p class="text-text-secondary text-lg">用技术填平"预算"与"专业运营"之间的鸿沟</p>
      </div>
      
      <div class="bg-white rounded-2xl shadow-card p-8 mb-8">
        <div class="prose max-w-none">
          <p class="text-lg text-text-secondary mb-6">
            运营乐高是一个为个人及小微商家打造的轻量级电商运营工具箱。我们致力于用技术填平"预算"与"专业运营"之间的鸿沟，让再小的生意，也能享受到自动化带来的效率提升。
          </p>
          
          <h2 class="text-2xl font-semibold text-text-primary mb-4">我们的使命</h2>
          <p class="text-text-secondary mb-6">
            在电商竞争日益激烈的今天，个人卖家和小微商家往往面临两大难题：一是缺乏专业的运营团队，二是有限的预算无法承担高昂的代运营费用。运营乐高正是为解决这些痛点而生。
          </p>
          
          <h2 class="text-2xl font-semibold text-text-primary mb-4">为什么叫"乐高"？</h2>
          <p class="text-text-secondary mb-6">
            就像乐高积木一样，我们将复杂的电商运营拆解成一个个标准化的功能模块：智能客服、商品管理、数据监控、评价维护、内容制作、AI设计。你可以像搭积木一样，根据需要组合使用这些模块，构建适合自己业务的自动化运营体系。
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
            <div class="text-center p-6 border border-gray-200 rounded-xl">
              <div class="text-4xl mb-4">🚀</div>
              <h3 class="font-semibold text-text-primary mb-2">快速启动</h3>
              <p class="text-text-secondary text-sm">注册即用，无需复杂配置</p>
            </div>
            <div class="text-center p-6 border border-gray-200 rounded-xl">
              <div class="text-4xl mb-4">🛡️</div>
              <h3 class="font-semibold text-text-primary mb-2">合规安全</h3>
              <p class="text-text-secondary text-sm">全程不接触支付接口，规避资质风险</p>
            </div>
            <div class="text-center p-6 border border-gray-200 rounded-xl">
              <div class="text-4xl mb-4">🤖</div>
              <h3 class="font-semibold text-text-primary mb-2">AI驱动</h3>
              <p class="text-text-secondary text-sm">智能自动化，7×24小时运转</p>
            </div>
          </div>
          
          <h2 class="text-2xl font-semibold text-text-primary mb-4">我们的价值观</h2>
          <ul class="text-text-secondary mb-6 list-disc pl-5 space-y-2">
            <li><strong>简单至上</strong>：复杂的事情简单做，简单的事情自动化做</li>
            <li><strong>用户第一</strong>：站在用户的角度思考，解决真实痛点</li>
            <li><strong>技术向善</strong>：用技术提升效率，绝不用于违规操作</li>
            <li><strong>持续进化</strong>：紧跟电商平台规则变化，持续优化服务</li>
          </ul>
          
          <h2 class="text-2xl font-semibold text-text-primary mb-4">团队</h2>
          <p class="text-text-secondary mb-6">
            我们是一支由电商老兵、技术开发者和AI专家组成的团队。团队成员曾服务过多家知名电商平台和品牌，深刻理解小微商家的运营痛点和技术需求。
          </p>
          
          <div class="mt-10 p-6 bg-primary-light rounded-xl">
            <p class="text-text-primary text-center font-medium">
              "让再小的生意，也能享受到自动化带来的效率提升"
            </p>
          </div>
        </div>
      </div>
      
      <div class="text-center text-text-secondary text-sm">
        <p>© {{ currentYear }} 运营乐高. 保留所有权利.</p>
        <p><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">蜀ICP备2026011042号</a></p>
        <p class="mt-2">
          <router-link to="/terms" class="text-secondary hover:text-secondary-dark">免责声明</router-link>
          · 
          <router-link to="/privacy" class="text-secondary hover:text-secondary-dark">隐私政策</router-link>
        </p>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { computed } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.prose {
  line-height: 1.7;
}
</style>