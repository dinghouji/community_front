import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: () => import('@/views/Login.vue'), meta: { title: '登录' } },
    { path: '/register', name: 'register', component: () => import('@/views/Register.vue'), meta: { title: '注册' } },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/layout/AdminLayout.vue'),
      children: [
        { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/views/admin/Dashboard.vue'), meta: { title: '首页', roles: [0, 1, 2] } },
        { path: 'user', name: 'admin-user', component: () => import('@/views/admin/User.vue'), meta: { title: '用户管理', roles: [0] } },
        { path: 'profile', name: 'admin-profile', component: () => import('@/views/admin/Profile.vue'), meta: { title: '个人中心', roles: [0, 1, 2] } },
        { path: 'building', name: 'admin-building', component: () => import('@/views/admin/Building.vue'), meta: { title: '楼栋管理', roles: [0] } },
        { path: 'house', name: 'admin-house', component: () => import('@/views/admin/House.vue'), meta: { title: '房屋管理', roles: [0] } },
        { path: 'parking', name: 'admin-parking', component: () => import('@/views/admin/Parking.vue'), meta: { title: '车位管理', roles: [0] } },
        { path: 'fee', name: 'admin-fee', component: () => import('@/views/admin/Fee.vue'), meta: { title: '费用项目', roles: [0, 1] } },
        { path: 'announcement', name: 'admin-announcement', component: () => import('@/views/admin/Announcement.vue'), meta: { title: '公告管理', roles: [0, 1] } },
        { path: 'facility', name: 'admin-facility', component: () => import('@/views/admin/Facility.vue'), meta: { title: '设施管理', roles: [0, 2] } },
        { path: 'feedback', name: 'admin-feedback', component: () => import('@/views/admin/Feedback.vue'), meta: { title: '反馈管理', roles: [0, 1] } },
        { path: 'access-card', name: 'admin-access-card', component: () => import('@/views/admin/AccessCard.vue'), meta: { title: '门禁卡管理', roles: [0, 1] } },
        { path: 'access-record', name: 'admin-access-record', component: () => import('@/views/admin/AccessRecord.vue'), meta: { title: '进出记录', roles: [0, 1] } },
        { path: 'maintenance', name: 'admin-maintenance', component: () => import('@/views/admin/Maintenance.vue'), meta: { title: '维修记录', roles: [0, 2] } },
        { path: 'facility-usage', name: 'admin-facility-usage', component: () => import('@/views/admin/FacilityUsage.vue'), meta: { title: '设施使用', roles: [0, 2] } },
        { path: 'parking-type', name: 'admin-parking-type', component: () => import('@/views/admin/ParkingType.vue'), meta: { title: '车位类型', roles: [0] } }
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/layout/UserLayout.vue'),
      children: [
        { path: 'home', name: 'user-home', component: () => import('@/views/user/Home.vue'), meta: { title: '首页', roles: [3] } },
        { path: 'profile', name: 'user-profile', component: () => import('@/views/user/Profile.vue'), meta: { title: '个人中心', roles: [3] } },
        { path: 'payment', name: 'user-payment', component: () => import('@/views/user/Payment.vue'), meta: { title: '在线缴费', roles: [3] } },
        { path: 'feedback', name: 'user-feedback', component: () => import('@/views/user/Feedback.vue'), meta: { title: '留言反馈', roles: [3] } },
        { path: 'facility', name: 'user-facility', component: () => import('@/views/user/Facility.vue'), meta: { title: '设施查看', roles: [3] } },
        { path: 'my-facility-usage', name: 'user-my-facility-usage', component: () => import('@/views/user/MyFacilityUsage.vue'), meta: { title: '我的申请', roles: [3] } },
        { path: 'parking', name: 'user-parking', component: () => import('@/views/user/Parking.vue'), meta: { title: '车位购买', roles: [3] } },
        { path: 'building', name: 'user-building', component: () => import('@/views/user/Building.vue'), meta: { title: '楼盘查看', roles: [3] } }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register') {
    next()
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    next('/login')
    return
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userType = user.userType

  if (userType === undefined || userType === null || userType < 0 || userType > 3) {
    localStorage.clear()
    next('/login')
    return
  }

  const roles = to.meta.roles
  if (roles && !roles.includes(userType)) {
    ElMessage.error('无权访问该页面')
    if (userType <= 2) {
      next('/admin/dashboard')
    } else {
      next('/user/home')
    }
    return
  }

  next()
})

export default router
