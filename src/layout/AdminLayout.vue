<template>
  <div class="admin-layout">
    <el-aside width="220px" class="admin-aside">
      <div class="logo">
        <span>物业信息管理系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="admin-menu"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#165DFF"
        router
      >
        <el-menu-item v-for="menu in filteredMenus" :key="menu.index" :index="menu.index">
          <el-icon><component :is="menu.icon" /></el-icon>
          <span>{{ menu.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="admin-header">
        <div class="header-left">
           <!-- Breadcrumb placeholder -->
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ roleName }} <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/admin/profile')">
                  <el-icon><User /></el-icon> 个人中心
                </el-dropdown-item>
                <el-dropdown-item divided @click="logout">
                  <el-icon><SwitchButton /></el-icon> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const user = JSON.parse(localStorage.getItem('user') || '{}')
const userType = user.userType

const roleNameMap = { 0: '管理员', 1: '客服', 2: '维修人员' }
const roleName = computed(() => roleNameMap[userType] || '工作人员')

const allMenus = [
  { index: '/admin/dashboard', icon: 'Odometer', label: '首页', roles: [0, 1, 2] },
  { index: '/admin/user', icon: 'User', label: '用户管理', roles: [0] },
  { index: '/admin/building', icon: 'OfficeBuilding', label: '楼栋管理', roles: [0] },
  { index: '/admin/house', icon: 'House', label: '房屋管理', roles: [0] },
  { index: '/admin/parking', icon: 'Van', label: '车位管理', roles: [0] },
  { index: '/admin/parking-type', icon: 'Van', label: '车位类型', roles: [0] },
  { index: '/admin/access-card', icon: 'Key', label: '门禁卡管理', roles: [0, 1] },
  { index: '/admin/access-record', icon: 'Timer', label: '进出记录', roles: [0, 1] },
  { index: '/admin/fee', icon: 'Money', label: '费用项目', roles: [0, 1] },
  { index: '/admin/announcement', icon: 'Bell', label: '公告管理', roles: [0, 1] },
  { index: '/admin/facility', icon: 'Basketball', label: '设施管理', roles: [0, 2] },
  { index: '/admin/facility-usage', icon: 'List', label: '设施使用', roles: [0, 2] },
  { index: '/admin/maintenance', icon: 'Tools', label: '维修记录', roles: [0, 2] },
  { index: '/admin/feedback', icon: 'ChatLineSquare', label: '反馈管理', roles: [0, 1] },
]

const filteredMenus = computed(() => allMenus.filter(m => m.roles.includes(userType)))

const activeMenu = computed(() => route.path)

const logout = () => {
  localStorage.clear()
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  display: flex;
}
.admin-aside {
  background-color: #001529;
  height: 100vh;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}
.admin-menu {
  border-right: none;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background-color: #002140;
}
.el-container {
  margin-left: 220px;
  width: calc(100% - 220px);
  min-height: 100vh;
  flex-direction: column;
}
.admin-header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
