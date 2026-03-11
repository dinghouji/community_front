<template>
  <div class="page-container" style="padding: 20px;">
    <h3 style="margin-bottom: 20px;">我的设施申请</h3>
    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="facilityName" label="设施名称" />
      <el-table-column prop="startTime" label="开始时间" width="180" />
      <el-table-column prop="endTime" label="结束时间" width="180" />
      <el-table-column prop="reason" label="申请理由" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="warning">待审核</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="success">已批准</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="danger">已拒绝</el-tag>
          <el-tag v-else type="info">已完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间" width="180" />
    </el-table>
    <el-empty v-if="!loading && list.length === 0" description="暂无申请记录" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMyFacilityUsages } from '@/api/facilityUsage'

const list = ref([])
const loading = ref(false)

const getList = async () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) return
  loading.value = true
  const res = await getMyFacilityUsages(user.id)
  list.value = res.data || []
  loading.value = false
}

onMounted(() => getList())
</script>
