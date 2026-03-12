<template>
  <div class="parking-buy-container">
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>车位购买</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="parking-list">
      <div v-for="parking in parkingList" :key="parking.id" class="parking-card">
        <div class="parking-info">
          <div class="parking-number">
            <el-icon><Van /></el-icon>
            {{ parking.parkingNumber }}
          </div>
          <div class="parking-status">
            <el-tag v-if="parking.status === 0" type="success">空闲</el-tag>
            <el-tag v-else type="danger">已售出</el-tag>
          </div>
          <div class="parking-price">
            <span v-if="parking.purchasePrice">购买: ¥{{ parking.purchasePrice.toFixed(2) }}</span>
            <span v-if="parking.rentPrice">租赁: ¥{{ parking.rentPrice.toFixed(2) }}/月</span>
          </div>
        </div>
        <div class="parking-actions">
          <el-button 
            v-if="parking.status === 0" 
            type="primary" 
            @click="showPurchaseDialog(parking)"
            size="small"
          >
            购买 / 租赁
          </el-button>
          <el-button 
            v-else 
            type="info" 
            disabled 
            size="small"
          >
            已售出
          </el-button>
        </div>
      </div>
    </div>

    <!-- 购买/租赁对话框 -->
    <el-dialog 
      :title="dialog.title" 
      v-model="dialog.visible" 
      width="500px"
      @close="resetForm"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="车位号">
          <el-input v-model="form.parkingNumber" disabled />
        </el-form-item>
        <el-form-item label="选择方式">
          <el-radio-group v-model="form.type">
            <el-radio label="purchase">购买</el-radio>
            <el-radio label="rent">租赁</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="价格">
          <div v-if="form.type === 'purchase'">
            ¥{{ form.purchasePrice.toFixed(2) }}
          </div>
          <div v-else>
            ¥{{ form.rentPrice.toFixed(2) }}/月
          </div>
        </el-form-item>
        <!-- 添加车位描述字段 -->
        <!-- <el-form-item label="车位描述">
          <el-input type="textarea" v-model="form.description" :rows="3" readonly></el-input>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认支付</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getParkingPage } from '@/api/parking'
import { ElMessage, ElMessageBox } from 'element-plus'

const parkingList = ref([])
const dialog = reactive({ visible: false, title: '' })
const form = reactive({
  id: null,
  parkingNumber: '',
  type: 'purchase', // 默认选择购买
  purchasePrice: 0,
  rentPrice: 0,
  /* description: ' /* */
}) 

const loadParkingList = async () => {
  const res = await getParkingPage({ pageNum: 1, pageSize: 100 })
  parkingList.value = res.data.records.filter(parking => parking.status === 0)
}

const showPurchaseDialog = (parking) => {
  form.id = parking.id
  form.parkingNumber = parking.parkingNumber
  form.purchasePrice = parking.purchasePrice || 0
  form.rentPrice = parking.rentPrice || 0
  form.type = 'purchase'
  dialog.title = `购买/租赁车位 ${parking.parkingNumber}`
  dialog.visible = true
}

const resetForm = () => {
  Object.assign(form, {
    id: null,
    parkingNumber: '',
    type: 'purchase',
    purchasePrice: 0,
    rentPrice: 0,
    description: '' // 重置 description 字段
  })
}

const handleConfirm = async () => {
  try {
    // 模拟支付过程
    ElMessage.success('支付成功！')
    
    // 更新车位状态为已占用
    const updatedParking = {
      id: form.id,
      status: 1
    }
    
    // 这里应该调用后端接口更新车位状态
    // await updateParking(updatedParking)
    
    // 关闭对话框
    dialog.visible = false
    
    // 刷新车位列表
    loadParkingList()
    
  } catch (error) {
    console.error(error)
    ElMessage.error('支付失败')
  }
}

onMounted(() => {
  loadParkingList()
})
</script>

<style scoped>
.parking-buy-container {
  padding: 20px;
  background: #f5f7fa;
}
.page-header {
  margin-bottom: 20px;
}
.parking-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}
.parking-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s;
}
.parking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.parking-info {
  text-align: center;
  margin-bottom: 15px;
}
.parking-number {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.parking-status {
  margin-bottom: 10px;
}
.parking-price {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
}
.parking-actions {
  text-align: center;
}
</style>