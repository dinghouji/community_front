<template>
  <div class="page-container" style="padding: 20px;">
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in list" :key="item.id" style="margin-bottom: 20px;">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <img v-if="item.imageUrl" :src="getImageUrl(item.imageUrl)" class="image" />
          <div v-else class="image-placeholder">暂无图片</div>
          <div style="padding: 14px;">
            <div class="facility-name">{{ item.name }}</div>
            <div class="facility-desc">{{ item.description || '暂无描述' }}</div>
            <div class="bottom">
              <el-tag v-if="item.status === 1" type="success">正常</el-tag>
              <el-tag v-else-if="item.status === 0" type="danger">损坏</el-tag>
              <el-tag v-else type="warning">维修中</el-tag>
            </div>
            <div class="actions" style="margin-top: 10px; text-align: right;">
                <el-button type="primary" size="small" :disabled="item.status !== 1" @click="handleBorrow(item)">申请使用</el-button>
                <el-button type="warning" size="small" @click="handleRepair(item)">报修</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Borrow Dialog -->
    <el-dialog title="申请使用设施" v-model="borrowDialog.visible" width="600px">
        <!-- 已有使用时间段展示 -->
        <div v-if="existingUsages.length > 0" style="margin-bottom: 16px;">
          <el-alert title="以下时间段已被占用，请避开选择" type="warning" :closable="false" style="margin-bottom: 10px;" />
          <el-table :data="existingUsages" size="small" border style="width: 100%">
            <el-table-column prop="userName" label="使用人" width="100" />
            <el-table-column prop="startTime" label="开始时间" />
            <el-table-column prop="endTime" label="结束时间" />
            <el-table-column label="状态" width="80">
              <template #default="{ row }">
                <el-tag v-if="row.status === 0" type="warning" size="small">待审核</el-tag>
                <el-tag v-else-if="row.status === 1" type="success" size="small">已批准</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else style="margin-bottom: 16px;">
          <el-alert title="当前暂无占用时间段，可自由选择时间" type="success" :closable="false" />
        </div>
        <el-form :model="borrowForm" label-width="80px">
            <el-form-item label="开始时间">
                <el-date-picker v-model="borrowForm.startTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker v-model="borrowForm.endTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item label="申请理由">
                <el-input type="textarea" v-model="borrowForm.reason" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="borrowDialog.visible = false">取消</el-button>
            <el-button type="primary" :loading="submitting" @click="submitBorrow">提交申请</el-button>
        </template>
    </el-dialog>

    <!-- Repair Dialog -->
    <el-dialog title="设施报修" v-model="repairDialog.visible">
        <el-form :model="repairForm" label-width="80px">
            <el-form-item label="问题描述">
                <el-input type="textarea" v-model="repairForm.description" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="repairDialog.visible = false">取消</el-button>
            <el-button type="primary" @click="submitRepair">提交报修</el-button>
        </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getFacilityPage } from '@/api/facility'
import { saveFacilityUsage, checkFacilityConflict, getFacilitySchedule } from '@/api/facilityUsage'
import { saveMaintenanceRecord } from '@/api/maintenance'
import { ElMessage } from 'element-plus'

const list = ref([])
const borrowDialog = reactive({ visible: false })
const borrowForm = reactive({ facilityId: null, startTime: '', endTime: '', reason: '' })
const submitting = ref(false)
const existingUsages = ref([])

const repairDialog = reactive({ visible: false })
const repairForm = reactive({ facilityId: null, description: '' })

const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `/api${path}`
}

const getList = async () => {
  const res = await getFacilityPage({ pageNum: 1, pageSize: 100 })
  list.value = res.data.records
}

const handleBorrow = async (item) => {
    borrowForm.facilityId = item.id
    borrowForm.startTime = ''
    borrowForm.endTime = ''
    borrowForm.reason = ''
    // 加载该设施已有的使用时间段
    try {
        const res = await getFacilitySchedule(item.id)
        existingUsages.value = res.data || []
    } catch (e) {
        existingUsages.value = []
    }
    borrowDialog.visible = true
}

const submitBorrow = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) return ElMessage.warning('请先登录')
    
    if (!borrowForm.startTime || !borrowForm.endTime) {
        return ElMessage.warning('请选择开始和结束时间')
    }
    if (borrowForm.startTime >= borrowForm.endTime) {
        return ElMessage.warning('结束时间必须大于开始时间')
    }

    submitting.value = true
    try {
        // 检查时间冲突
        const conflictRes = await checkFacilityConflict(borrowForm.facilityId, borrowForm.startTime, borrowForm.endTime)
        if (conflictRes.data) {
            ElMessage.error('该时间段与已有申请冲突，请参考上方占用时间段重新选择')
            return
        }

        const data = { ...borrowForm, userId: user.id, status: 0 }
        const res = await saveFacilityUsage(data)
        if (res.code === 200) {
            ElMessage.success('申请提交成功，可在"我的申请"中查看进度')
            borrowDialog.visible = false
        } else {
            ElMessage.error(res.msg || '申请失败')
        }
    } finally {
        submitting.value = false
    }
}

const handleRepair = (item) => {
    repairForm.facilityId = item.id
    repairForm.description = ''
    repairDialog.visible = true
}

const submitRepair = async () => {
    if (!repairForm.description) {
        return ElMessage.warning('请填写问题描述')
    }
    const now = new Date()
    const repairTime = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0')
    const data = { ...repairForm, repairTime }
    await saveMaintenanceRecord(data)
    ElMessage.success('报修提交成功')
    repairDialog.visible = false
}

onMounted(() => getList())
</script>

<style scoped>
.image { width: 100%; height: 200px; object-fit: cover; }
.image-placeholder { width: 100%; height: 200px; background: #f0f2f5; display: flex; align-items: center; justify-content: center; color: #999; }
.facility-name { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
.facility-desc { font-size: 13px; color: #666; margin-bottom: 10px; height: 40px; overflow: hidden; }
.bottom { display: flex; justify-content: space-between; align-items: center; }
</style>
