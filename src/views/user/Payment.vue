<template>
  <div class="payment-page">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="待缴费" name="unpaid">
        <el-table :data="unpaidList" v-loading="loading" stripe>
          <el-table-column label="收费项目">
             <template #default="scope">
                 {{ getFeeName(scope.row.feeItemId) }}
             </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额(元)" />
          <el-table-column prop="billingCycle" label="账单周期" />
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handlePay(scope.row)">立即缴费</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已缴费" name="paid">
        <el-table :data="paidList" v-loading="loading" stripe>
          <el-table-column label="收费项目">
             <template #default="scope">
                 {{ getFeeName(scope.row.feeItemId) }}
             </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额(元)" />
          <el-table-column prop="billingCycle" label="账单周期" />
          <el-table-column prop="payTime" label="缴费时间">
              <template #default="scope">
                  {{ formatDate(scope.row.payTime) }}
              </template>
          </el-table-column>
          <el-table-column label="状态">
            <template #default>
              <el-tag type="success">已缴费</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBillPage, updateBill } from '@/api/bill'
import { getFeeItemPage } from '@/api/fee'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('unpaid')
const loading = ref(false)
const unpaidList = ref([])
const paidList = ref([])
const feeItems = ref({})

const getList = async () => {
  loading.value = true
  const user = JSON.parse(localStorage.getItem('user'))
  const userId = user ? user.id : null

  if (!userId) {
      ElMessage.warning('未登录或获取不到用户信息')
      loading.value = false
      return
  }
  
  // Fetch Fee Items for mapping
  const feeRes = await getFeeItemPage({ pageNum: 1, pageSize: 1000 })
  feeRes.data.records.forEach(item => {
      feeItems.value[item.id] = item.itemName
  })

  // Fetch Unpaid
  const resUnpaid = await getBillPage({ pageNum: 1, pageSize: 100, userId, status: 0 })
  unpaidList.value = resUnpaid.data.records

  // Fetch Paid
  const resPaid = await getBillPage({ pageNum: 1, pageSize: 100, userId, status: 1 })
  paidList.value = resPaid.data.records
  
  loading.value = false
}

const getFeeName = (id) => {
    return feeItems.value[id] || '未知项目'
}

const formatDate = (dateStr) => {
    if(!dateStr) return ''
    return new Date(dateStr).toLocaleString()
}

const handleTabClick = () => {
    // 
}

const handlePay = (row) => {
    ElMessageBox.confirm(`确认支付 ${row.amount} 元?`, '支付确认', {
        confirmButtonText: '支付',
        cancelButtonText: '取消',
        type: 'success'
    }).then(async () => {
        const newData = { ...row, status: 1, payTime: new Date().toISOString() }
        await updateBill(newData)
        ElMessage.success('支付成功')
        getList()
    })
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.payment-page {
    background-color: #fff;
    padding: 20px;
}
</style>
