<template>
  <div class="login-container">
    <div class="login-wrapper">
      <!-- Left Side: Branding -->
      <div class="login-left">
        <div class="brand-content">
          <div class="logo-area">
             <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L2 12H5V20H10V14H14V20H19V12H22L12 3Z" fill="white" fill-opacity="0.9"/>
                <path d="M7 16H9V18H7V16Z" fill="#165DFF"/>
                <path d="M15 16H17V18H15V16Z" fill="#165DFF"/>
                <path d="M7 12H9V14H7V12Z" fill="#165DFF"/>
                <path d="M15 12H17V14H15V12Z" fill="#165DFF"/>
             </svg>
          </div>
          <h1>加入我们</h1>
          <p class="subtitle">Join Our Smart Community</p>
          <p class="desc">注册成为业主，享受便捷生活服务</p>
        </div>
        <!-- Decorative Shapes -->
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      
      <!-- Right Side: Form -->
      <div class="login-right">
        <div class="form-content">
            <div class="form-header">
                <h2>创建账号</h2>
                <p>Create your account</p>
            </div>
            
            <el-form :model="form" :rules="rules" ref="formRef" size="large" class="login-form">
                <el-form-item prop="username">
                  <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="User" />
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
                </el-form-item>
                <el-form-item prop="realName">
                  <el-input v-model="form.realName" placeholder="请输入真实姓名" prefix-icon="Postcard" />
                </el-form-item>
                <el-form-item prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入电话号码" prefix-icon="Phone" />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" class="login-btn" @click="handleRegister" :loading="loading">
                    立即注册
                  </el-button>
                </el-form-item>
                
                <div class="login-footer">
                  <div class="register-link" @click="router.push('/login')">
                    <span>已有账号？</span>
                    <span class="link-text">立即登录</span>
                  </div>
                </div>
            </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const formRef = ref(null)

onMounted(() => {
  // Clear token on enter
  localStorage.removeItem('token')
  localStorage.removeItem('user')
})

const form = reactive({
  username: '',
  password: '',
  realName: '',
  phone: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }]
}

const handleRegister = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await axios.post('/api/auth/register', form)
        if (res.data.code === 200) {
            ElMessage.success('注册成功，请登录')
            router.push('/login')
        } else {
            ElMessage.error(res.data.message || '注册失败')
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('注册请求失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
  background-image: 
    radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
    radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
    radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%);
  background-size: cover;
}

.login-wrapper {
  width: 1000px;
  height: 600px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  overflow: hidden;
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #165DFF 0%, #36CFC9 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 40px;
  overflow: hidden;
}

.brand-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.logo-area {
  margin-bottom: 20px;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

.brand-content h1 {
  font-size: 36px;
  margin: 0;
  font-weight: 600;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 16px;
  opacity: 0.8;
  margin: 10px 0 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.desc {
  font-size: 14px;
  opacity: 0.7;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  z-index: 1;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  left: -50px;
}

.shape-2 {
  width: 300px;
  height: 300px;
  bottom: -100px;
  right: -50px;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 50%;
  left: 20%;
  background: rgba(255, 255, 255, 0.05);
}

.login-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 40px;
}

.form-content {
  width: 100%;
  max-width: 360px;
}

.form-header {
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 28px;
  color: #333;
  margin: 0 0 10px;
  font-weight: 600;
}

.form-header p {
  color: #999;
  margin: 0;
  font-size: 14px;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  padding: 8px 15px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #165DFF inset;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 8px;
  margin-top: 10px;
  background: linear-gradient(90deg, #165DFF 0%, #36CFC9 100%);
  border: none;
  transition: all 0.3s;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
}

.login-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.register-link {
  cursor: pointer;
}

.link-text {
  color: #165DFF;
  font-weight: 500;
}

.link-text:hover {
  text-decoration: underline;
}
</style>
