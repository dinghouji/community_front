<template>
  <div>
    <h2>欢迎回来，管理员</h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>用户总数</template>
          <div class="card-content">{{ stats.totalUsers }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>待办报修</template>
          <div class="card-content">{{ stats.pendingRepairs }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>房屋总数</template>
          <div class="card-content">{{ stats.totalHouses }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>空闲车位</template>
          <div class="card-content">{{ stats.freeParkingSpaces }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Charts Section -->
    <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
            <el-card shadow="hover">
                <template #header>缴费状态统计</template>
                <div ref="paymentChartRef" style="height: 300px;"></div>
            </el-card>
        </el-col>
        <el-col :span="12">
            <el-card shadow="hover">
                <template #header>房屋入住统计</template>
                <div ref="houseChartRef" style="height: 300px;"></div>
            </el-card>
        </el-col>
    </el-row>

    <!-- Quick Actions Section -->
    <el-card shadow="hover" style="margin-top: 20px;">
        <template #header>快捷操作</template>
        <div class="quick-actions-grid">
            <div class="action-item" @click="$router.push('/admin/user')">
                <el-icon :size="40" color="#165DFF"><User /></el-icon>
                <span>用户管理</span>
            </div>
             <div class="action-item" @click="$router.push('/admin/building')">
                <el-icon :size="40" color="#165DFF"><OfficeBuilding /></el-icon>
                <span>楼栋管理</span>
            </div>
             <div class="action-item" @click="$router.push('/admin/house')">
                <el-icon :size="40" color="#165DFF"><House /></el-icon>
                <span>房屋管理</span>
            </div>
             <div class="action-item" @click="$router.push('/admin/parking')">
                <el-icon :size="40" color="#165DFF"><Van /></el-icon>
                <span>车位管理</span>
            </div>
             <div class="action-item" @click="$router.push('/admin/fee')">
                <el-icon :size="40" color="#165DFF"><Money /></el-icon>
                <span>费用项目</span>
            </div>
             <div class="action-item" @click="$router.push('/admin/announcement')">
                <el-icon :size="40" color="#165DFF"><Bell /></el-icon>
                <span>公告管理</span>
            </div>
             <div class="action-item" @click="$router.push('/admin/facility')">
                <el-icon :size="40" color="#165DFF"><Basketball /></el-icon>
                <span>设施管理</span>
            </div>
             <div class="action-item" @click="$router.push('/admin/feedback')">
                <el-icon :size="40" color="#165DFF"><ChatLineSquare /></el-icon>
                <span>反馈管理</span>
            </div>
        </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDashboardStatistics } from '@/api/statistics'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'

const router = useRouter()
const stats = ref({
    totalUsers: 0,
    pendingRepairs: 0,
    totalHouses: 0,
    freeParkingSpaces: 0
})
const paymentChartRef = ref(null)
const houseChartRef = ref(null)

onMounted(async () => {
    try {
        const res = await getDashboardStatistics()
        if (res.code === 200) {
            stats.value = res.data
            initPaymentChart(res.data.paymentStats)
            initHouseChart(res.data.houseStats)
        }
    } catch (error) {
        console.error('Failed to fetch dashboard statistics', error)
    }
})

const initPaymentChart = (paymentStats) => {
    if (!paymentChartRef.value) return
    const chart = echarts.init(paymentChartRef.value)
    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: '缴费状态',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 20,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: paymentStats.paid, name: '已缴费' },
                    { value: paymentStats.unpaid, name: '未缴费' }
                ]
            }
        ]
    }
    chart.setOption(option)
    
    window.addEventListener('resize', () => {
        chart.resize()
    })
}

const initHouseChart = (houseStats) => {
    if (!houseChartRef.value) return
    const chart = echarts.init(houseChartRef.value)
    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: '房屋入住',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: houseStats.occupied, name: '已入住' },
                    { value: houseStats.empty, name: '空置' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
    chart.setOption(option)
    
    window.addEventListener('resize', () => {
        chart.resize()
    })
}
</script>

<style scoped>
.card-content {
  font-size: 24px;
  font-weight: bold;
  color: #165DFF;
}
.quick-actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 20px;
    padding: 20px;
}
.action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    gap: 10px;
    transition: all 0.3s;
    padding: 15px;
    border-radius: 8px;
}
.action-item:hover {
    transform: translateY(-5px);
    background-color: #f0f2f5;
}
.action-item span {
    font-size: 14px;
    color: #333;
    text-align: center;
}
</style>
