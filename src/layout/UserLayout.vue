<template>
  <div class="user-layout">
    <el-header class="user-header">
      <div class="container">
        <div class="logo">小区物业服务平台</div>
        <div class="nav">
          <router-link to="/user/home">
            <el-icon style="margin-right: 4px; vertical-align: middle;"><HomeFilled /></el-icon>
            <span style="vertical-align: middle;">首页</span>
          </router-link>
          <router-link to="/user/building">
            <el-icon style="margin-right: 4px; vertical-align: middle;"><OfficeBuilding /></el-icon>
            <span style="vertical-align: middle;">楼盘查看</span>
          </router-link>
          <router-link to="/user/parking">
            <el-icon style="margin-right: 4px; vertical-align: middle;"><Van /></el-icon>
            <span style="vertical-align: middle;">车位购买</span>
          </router-link>
          <router-link to="/user/payment">
            <el-icon style="margin-right: 4px; vertical-align: middle;"><Money /></el-icon>
            <span style="vertical-align: middle;">在线缴费</span>
          </router-link>
          <router-link to="/user/facility">
            <el-icon style="margin-right: 4px; vertical-align: middle;"><Basketball /></el-icon>
            <span style="vertical-align: middle;">设施查看</span>
          </router-link>
          <router-link to="/user/my-facility-usage">
            <el-icon style="margin-right: 4px; vertical-align: middle;"><List /></el-icon>
            <span style="vertical-align: middle;">我的申请</span>
          </router-link>
          <router-link to="/user/feedback">
            <el-icon style="margin-right: 4px; vertical-align: middle;"><ChatLineSquare /></el-icon>
            <span style="vertical-align: middle;">留言反馈</span>
          </router-link>
        </div>
        <div class="user-info">
          <el-dropdown>
            <span class="el-dropdown-link">
              业主 <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/user/profile')">
                    <el-icon><User /></el-icon> 个人中心
                </el-dropdown-item>
                <el-dropdown-item divided @click="logout">
                    <el-icon><SwitchButton /></el-icon> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-main class="user-main">
      <div class="container">
        <el-breadcrumb separator="/" class="breadcrumb" v-if="route.meta.title">
          <el-breadcrumb-item :to="{ path: '/user/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
        <RouterView />
      </div>
    </el-main>
    <el-footer class="user-footer">
      <div class="container">
        &copy; 2026 小区物业管理系统
      </div>
    </el-footer>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const logout = () => {
  localStorage.clear()
  router.push('/login')
}
</script>

<style scoped>
.user-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.user-header {
  background-color: #165DFF;
  color: #fff;
  height: 60px;
}
.user-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
}
.logo {
  font-size: 20px;
  font-weight: bold;
}
.nav a {
  color: #fff;
  margin: 0 15px;
  text-decoration: none;
}
.nav a:hover, .nav a.router-link-active {
  color: #36CFC9;
}
.user-main {
  flex: 1;
  background-color: #f5f7fa;
  padding: 20px 0;
}
.user-main .container {
  max-width: 1200px;
  margin: 0 auto;
}
.breadcrumb {
  margin-bottom: 20px;
}
.user-footer {
  background-color: #fff;
  text-align: center;
  line-height: 60px;
  color: #999;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
