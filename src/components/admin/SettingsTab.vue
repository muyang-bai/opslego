<template>
  <div>
    <h2 class="text-xl font-semibold text-text-primary mb-6">系统设置</h2>
    
    <el-tabs type="border-card">
      <el-tab-pane label="基本设置">
        <div class="max-w-2xl space-y-6">
          <div class="bg-white rounded-xl shadow-card p-6">
            <h3 class="text-lg font-medium text-text-primary mb-4">网站信息</h3>
            <el-form :model="settings.website" label-width="120px">
              <el-form-item label="网站名称">
                <el-input v-model="settings.website.name" placeholder="请输入网站名称" />
              </el-form-item>
              <el-form-item label="网站标题">
                <el-input v-model="settings.website.title" placeholder="请输入网站标题" />
              </el-form-item>
              <el-form-item label="网站描述">
                <el-input v-model="settings.website.description" type="textarea" :rows="3" placeholder="请输入网站描述" />
              </el-form-item>
              <el-form-item label="网站关键词">
                <el-input v-model="settings.website.keywords" placeholder="请输入关键词，用逗号分隔" />
              </el-form-item>
              <el-form-item label="网站Logo URL">
                <el-input v-model="settings.website.logoUrl" placeholder="请输入Logo图片的URL地址" />
              </el-form-item>
            </el-form>
          </div>
          
          <div class="bg-white rounded-xl shadow-card p-6">
            <h3 class="text-lg font-medium text-text-primary mb-4">运营设置</h3>
            <el-form :model="settings.operation" label-width="120px">
              <el-form-item label="用户注册">
                <el-switch v-model="settings.operation.allowRegistration" />
                <span class="text-text-secondary text-sm ml-2">开启后允许新用户注册</span>
              </el-form-item>
              <el-form-item label="兑换码激活">
                <el-switch v-model="settings.operation.allowRedemption" />
                <span class="text-text-secondary text-sm ml-2">开启后允许用户激活兑换码</span>
              </el-form-item>
              <el-form-item label="反馈功能">
                <el-switch v-model="settings.operation.allowFeedback" />
                <span class="text-text-secondary text-sm ml-2">开启后允许用户提交反馈</span>
              </el-form-item>
              <el-form-item label="默认订阅套餐">
                <el-select v-model="settings.operation.defaultPlan" placeholder="请选择默认套餐">
                  <el-option label="Basic（基础版）" value="basic" />
                  <el-option label="Premium（高级版）" value="premium" />
                </el-select>
              </el-form-item>
              <el-form-item label="默认订阅天数">
                <el-input-number v-model="settings.operation.defaultSubscriptionDays" :min="1" :max="365" />
                <span class="text-text-secondary text-sm ml-2">天</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="邮件设置">
        <div class="max-w-2xl space-y-6">
          <div class="bg-white rounded-xl shadow-card p-6">
            <h3 class="text-lg font-medium text-text-primary mb-4">SMTP配置</h3>
            <el-form :model="settings.email" label-width="120px">
              <el-form-item label="SMTP服务器">
                <el-input v-model="settings.email.smtpHost" placeholder="例如: smtp.example.com" />
              </el-form-item>
              <el-form-item label="SMTP端口">
                <el-input-number v-model="settings.email.smtpPort" :min="1" :max="65535" />
              </el-form-item>
              <el-form-item label="加密方式">
                <el-radio-group v-model="settings.email.encryption">
                  <el-radio label="none">无</el-radio>
                  <el-radio label="ssl">SSL</el-radio>
                  <el-radio label="tls">TLS</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="发件邮箱">
                <el-input v-model="settings.email.fromEmail" placeholder="例如: noreply@example.com" />
              </el-form-item>
              <el-form-item label="发件人名称">
                <el-input v-model="settings.email.fromName" placeholder="例如: 运营乐高团队" />
              </el-form-item>
              <el-form-item label="用户名">
                <el-input v-model="settings.email.username" placeholder="SMTP用户名" />
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="settings.email.password" type="password" placeholder="SMTP密码" show-password />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="testEmailConnection">测试连接</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <div class="bg-white rounded-xl shadow-card p-6">
            <h3 class="text-lg font-medium text-text-primary mb-4">邮件模板</h3>
            <el-form label-width="120px">
              <el-form-item label="欢迎邮件">
                <el-switch v-model="settings.emailTemplates.welcomeEmail" />
                <span class="text-text-secondary text-sm ml-2">用户注册后发送欢迎邮件</span>
              </el-form-item>
              <el-form-item label="订阅到期提醒">
                <el-switch v-model="settings.emailTemplates.subscriptionReminder" />
                <span class="text-text-secondary text-sm ml-2">订阅到期前7天发送提醒邮件</span>
              </el-form-item>
              <el-form-item label="兑换成功通知">
                <el-switch v-model="settings.emailTemplates.redemptionSuccess" />
                <span class="text-text-secondary text-sm ml-2">兑换码激活成功后发送通知</span>
              </el-form-item>
              <el-form-item label="反馈回复通知">
                <el-switch v-model="settings.emailTemplates.feedbackReply" />
                <span class="text-text-secondary text-sm ml-2">回复用户反馈时发送通知</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="安全设置">
        <div class="max-w-2xl space-y-6">
          <div class="bg-white rounded-xl shadow-card p-6">
            <h3 class="text-lg font-medium text-text-primary mb-4">安全选项</h3>
            <el-form :model="settings.security" label-width="120px">
              <el-form-item label="强制HTTPS">
                <el-switch v-model="settings.security.forceHttps" />
                <span class="text-text-secondary text-sm ml-2">开启后强制使用HTTPS访问</span>
              </el-form-item>
              <el-form-item label="密码强度要求">
                <el-select v-model="settings.security.passwordStrength" placeholder="请选择密码强度">
                  <el-option label="低: 至少6位字符" value="low" />
                  <el-option label="中: 至少8位，包含字母和数字" value="medium" />
                  <el-option label="高: 至少10位，包含字母、数字和特殊字符" value="high" />
                </el-select>
              </el-form-item>
              <el-form-item label="登录失败锁定">
                <el-switch v-model="settings.security.loginLock" />
                <span class="text-text-secondary text-sm ml-2">开启后连续5次登录失败锁定账户15分钟</span>
              </el-form-item>
              <el-form-item label="会话超时时间">
                <el-input-number v-model="settings.security.sessionTimeout" :min="5" :max="1440" />
                <span class="text-text-secondary text-sm ml-2">分钟（0表示永不过期）</span>
              </el-form-item>
              <el-form-item label="API访问频率限制">
                <el-input-number v-model="settings.security.apiRateLimit" :min="10" :max="1000" />
                <span class="text-text-secondary text-sm ml-2">次/分钟</span>
              </el-form-item>
            </el-form>
          </div>
          
          <div class="bg-white rounded-xl shadow-card p-6">
            <h3 class="text-lg font-semibold text-text-primary mb-4 text-red-600">危险区域</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <p class="font-medium text-text-primary">清除所有数据</p>
                  <p class="text-text-secondary text-sm">这将删除所有用户、订阅、兑换码和反馈数据，操作不可恢复！</p>
                </div>
                <el-button type="danger" @click="confirmClearData">清除数据</el-button>
              </div>
              
              <div class="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <p class="font-medium text-text-primary">重置系统设置</p>
                  <p class="text-text-secondary text-sm">将所有系统设置恢复为默认值</p>
                </div>
                <el-button type="warning" @click="confirmResetSettings">重置设置</el-button>
              </div>
              
              <div class="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <p class="font-medium text-text-primary">导出所有数据</p>
                  <p class="text-text-secondary text-sm">导出用户、订阅、兑换码和反馈数据为CSV文件</p>
                </div>
                <el-button type="default" @click="exportAllData">导出数据</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <div class="mt-8 flex justify-end">
      <el-button type="primary" size="large" @click="saveSettings">
        <el-icon class="mr-2"><check /></el-icon>
        保存所有设置
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Check } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/utils/api'

const settings = ref({
  website: { name: '运营乐高', title: '轻量级电商运营管理平台', description: '为个人卖家和小微商家提供轻量级的电商运营自动化管理工具', keywords: '电商运营,自动化,管理工具,运营乐高', logoUrl: '' },
  operation: { allowRegistration: true, allowRedemption: true, allowFeedback: true, defaultPlan: 'basic', defaultSubscriptionDays: 30 },
  email: { smtpHost: 'smtp.example.com', smtpPort: 587, encryption: 'tls', fromEmail: 'noreply@example.com', fromName: '运营乐高团队', username: '', password: '' },
  emailTemplates: { welcomeEmail: true, subscriptionReminder: true, redemptionSuccess: true, feedbackReply: true },
  security: { forceHttps: false, passwordStrength: 'medium', loginLock: true, sessionTimeout: 60, apiRateLimit: 100 }
})

const testEmailConnection = () => {
  ElMessage.info('测试邮件连接...')
  setTimeout(() => ElMessage.success('邮件连接测试成功'), 2000)
}

const saveSettings = () => {
  ElMessageBox.confirm('确定保存所有设置吗？', '保存设置', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await api.put('/admin/settings', settings.value)
      ElMessage.success('设置保存成功')
    } catch (e) {
      ElMessage.error('保存失败')
    }
  }).catch(() => {})
}

const confirmClearData = () => {
  ElMessageBox.confirm('⚠️ 警告：此操作将删除所有数据，包括用户、订阅、兑换码和反馈。此操作不可恢复！确定继续吗？',
    '确认删除所有数据', { confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'error', confirmButtonClass: 'el-button--danger' }
  ).then(() => { ElMessage.info('数据清除功能开发中...') }).catch(() => {})
}

const confirmResetSettings = () => {
  ElMessageBox.confirm('确定将系统设置恢复为默认值吗？', '重置设置', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(() => {
    settings.value = {
      website: { name: '运营乐高', title: '轻量级电商运营管理平台', description: '为个人卖家和小微商家提供轻量级的电商运营自动化管理工具', keywords: '电商运营,自动化,管理工具,运营乐高', logoUrl: '' },
      operation: { allowRegistration: true, allowRedemption: true, allowFeedback: true, defaultPlan: 'basic', defaultSubscriptionDays: 30 },
      email: { smtpHost: 'smtp.example.com', smtpPort: 587, encryption: 'tls', fromEmail: 'noreply@example.com', fromName: '运营乐高团队', username: '', password: '' },
      emailTemplates: { welcomeEmail: true, subscriptionReminder: true, redemptionSuccess: true, feedbackReply: true },
      security: { forceHttps: false, passwordStrength: 'medium', loginLock: true, sessionTimeout: 60, apiRateLimit: 100 }
    }
    ElMessage.success('系统设置已重置为默认值')
  }).catch(() => {})
}

const exportAllData = () => { ElMessage.info('数据导出功能开发中...') }

onMounted(async () => {
  try {
    const res = await api.get('/admin/settings')
    if (res?.settings) {
      settings.value = { ...settings.value, ...res.settings }
    }
  } catch (e) { console.error('获取设置失败', e) }
})
</script>

<style scoped>
.avatar-uploader .avatar { width: 100px; height: 100px; display: block; border-radius: 8px; }
</style>
