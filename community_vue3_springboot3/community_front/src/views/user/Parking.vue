<template>
  <div class="page-container" style="padding: 20px;">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="车位列表" name="list">
        <el-row :gutter="20">
          <!-- 添加加载状态提示 -->
          <div v-if="loading" class="loading-text">正在加载车位信息...</div>
          
          <!-- 添加无数据提示 -->
          <div v-else-if="list.length === 0" class="no-data-text">暂无可用车位</div>
          
          <!-- 正常显示车位列表 -->
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
                <!-- 显示车位描述 -->
                <div v-if="item.description" class="description">
                  {{ item.description }}
                </div>
              </div>
              <div class="action" style="margin-top: 15px;">
                <el-button 
                  type="primary" 
                  block 
                  :disabled="item.status !== 0" 
                  @click="showPurchaseDialog(item)"
                >
                  购买 / 租赁
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

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
        <el-form-item label="车位描述">
          <el-input type="textarea" v-model="form.description" disabled></el-input>
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
        <el-form-item label="支付方式">
          <el-radio-group v-model="form.paymentMethod">
            <el-radio label="wechat">微信支付</el-radio>
            <el-radio label="alipay">支付宝</el-radio>
            <el-radio label="bank">银行卡</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleConfirm"
          :disabled="!form.paymentMethod"
        >
          确认支付
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getParkingPage, updateParking } from '@/api/parking'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('list')
const list = ref([])
const loading = ref(false) // 添加加载状态

// 对话框相关
const dialog = ref({ visible: false, title: '' })
const form = ref({
  id: null,
  parkingNumber: '',
  type: 'purchase',
  purchasePrice: 0,
  rentPrice: 0,
  paymentMethod: '',
  description: '' // 添加 description 字段
})

const getList = async () => {
  try {
    loading.value = true // 开始加载
    const res = await getParkingPage({ pageNum: 1, pageSize: 100 })
    list.value = res.data.records || []
  } catch (error) {
    console.error('获取车位列表失败:', error)
    ElMessage.error('获取车位列表失败，请重试')
  } finally {
    loading.value = false // 加载完成
  }
}

const showPurchaseDialog = (item) => {
  Object.assign(form.value, {
    id: item.id,
    parkingNumber: item.parkingNumber,
    purchasePrice: item.purchasePrice || 0,
    rentPrice: item.rentPrice || 0,
    description: item.description || '', // 确保从后端获取 description 字段
    type: 'purchase', // 默认选择购买
    paymentMethod: '' // 清空支付方式
  })
  dialog.value.title = `购买/租赁车位 ${item.parkingNumber}`
  dialog.value.visible = true
}

const resetForm = () => {
  Object.assign(form.value, {
    id: null,
    parkingNumber: '',
    type: 'purchase',
    purchasePrice: 0,
    rentPrice: 0,
    paymentMethod: '',
    description: '' // 重置 description 字段
  })
}

const handleConfirm = async () => {
  if (!form.value.paymentMethod) {
    ElMessage.warning('请选择支付方式')
    return
  }

  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      ElMessage.warning('请先登录')
      return
    }

    const newData = {
      ...form.value,
      status: 1,
      ownerId: user.id
    }

    await updateParking(newData)
    ElMessage.success('支付成功！')
    dialog.value.visible = false
    getList()
  } catch (error) {
    console.error(error)
    ElMessage.error('支付失败')
  }
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.parking-header { display: flex; align-items: center; margin-bottom: 15px; }
.parking-no { font-size: 20px; font-weight: bold; margin-left: 10px; }
.parking-info { display: flex; justify-content: space-between; align-items: center; }
.description { margin-top: 8px; color: #666; font-size: 14px; }
.loading-text { text-align: center; color: #999; margin: 20px 0; }
.no-data-text { text-align: center; color: #999; margin: 20px 0; }
</style>