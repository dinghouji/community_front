<template>
  <div class="page-container">
    <el-table :data="tableData" v-loading="loading" border stripe>
      <el-table-column prop="facilityName" label="设施名称" />
      <el-table-column prop="userName" label="申请人" />
      <el-table-column prop="startTime" label="开始时间" />
      <el-table-column prop="endTime" label="结束时间" />
      <el-table-column prop="reason" label="申请理由" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="warning">待审核</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="success">已批准</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="danger">已拒绝</el-tag>
          <el-tag v-else type="info">已完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button v-if="scope.row.status === 0" type="success" size="small" @click="handleApprove(scope.row)">批准</el-button>
          <el-button v-if="scope.row.status === 0" type="danger" size="small" @click="handleReject(scope.row)">拒绝</el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)"><el-icon><Delete /></el-icon></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFacilityUsagePage, updateFacilityUsage, deleteFacilityUsage } from '@/api/facilityUsage'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])

const getList = async () => {
  loading.value = true
  const res = await getFacilityUsagePage({ pageNum: 1, pageSize: 20 })
  tableData.value = res.data.records
  loading.value = false
}

const handleApprove = async (row) => {
    const newData = { ...row, status: 1 }
    await updateFacilityUsage(newData)
    ElMessage.success('已批准')
    getList()
}

const handleReject = async (row) => {
    const newData = { ...row, status: 2 }
    await updateFacilityUsage(newData)
    ElMessage.success('已拒绝')
    getList()
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(async () => {
    await deleteFacilityUsage(row.id)
    ElMessage.success('删除成功')
    getList()
  })
}

onMounted(() => getList())
</script>

<style scoped>
.page-container { padding: 20px; background: #fff; }
</style>
