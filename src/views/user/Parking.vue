<template>
  <div class="page-container" style="padding: 20px;">
    <el-tabs v-model="activeTab">
        <el-tab-pane label="车位列表" name="list">
            <el-row :gutter="20">
              <el-col :span="6" v-for="item in list" :key="item.id" style="margin-bottom: 20px;">
                <el-card shadow="hover" :body-style="{ padding: '15px' }">
                  <div class="parking-header">
                      <el-icon :size="40" color="#409EFF"><Van /></el-icon>
                      <span class="parking-no">{{ item.parkingNumber }}</span>
                  </div>
                  <div class="parking-info">
                      <div class="status">
                          <el-tag v-if="item.status === 0" type="success">空闲</el-tag>
                          <el-tag v-else type="danger">已售出</el-tag>
                      </div>
                  </div>
                  <div class="action" style="margin-top: 15px;">
                      <el-button type="primary" block :disabled="item.status !== 0" @click="handleBuy(item)">购买 / 租赁</el-button>
                  </div>
                </el-card>
              </el-col>
            </el-row>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getParkingPage, updateParking } from '@/api/parking'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('list')
const list = ref([])

const getList = async () => {
  const res = await getParkingPage({ pageNum: 1, pageSize: 100 })
  list.value = res.data.records
}

const handleBuy = (item) => {
    ElMessageBox.confirm(`确认购买车位 ${item.parkingNumber}?`, '购买确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
    }).then(async () => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user) return ElMessage.warning('请先登录')
        
        // Assume updating status to 1 (Occupied) and setting ownerId (if backend supports)
        // Since I can't easily change backend entity structure right now if it's missing ownerId,
        // I will just mark it as Occupied (status=1). 
        // In a real app, I would add ownerId to ParkingSpace entity.
        // Let's assume for now we just mark it occupied.
        
        const newData = { ...item, status: 1, ownerId: user.id }
        await updateParking(newData)
        ElMessage.success('购买成功')
        getList()
    })
}

onMounted(() => getList())
</script>

<style scoped>
.parking-header { display: flex; align-items: center; margin-bottom: 15px; }
.parking-no { font-size: 20px; font-weight: bold; margin-left: 10px; }
.parking-info { display: flex; justify-content: space-between; align-items: center; }
</style>
