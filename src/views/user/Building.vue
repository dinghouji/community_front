<template>
  <div class="page-container" style="padding: 20px;">
    <el-table :data="tableData" v-loading="loading" border stripe>
      <el-table-column prop="name" label="楼栋名称" />
      <el-table-column prop="totalFloors" label="总楼层" />
      <el-table-column prop="description" label="描述" />
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBuildingPage } from '@/api/building'

const loading = ref(false)
const tableData = ref([])

const getList = async () => {
  loading.value = true
  const res = await getBuildingPage({ pageNum: 1, pageSize: 100 })
  tableData.value = res.data.records
  loading.value = false
}

onMounted(() => getList())
</script>

<style scoped>
.page-container { background: #fff; min-height: 100vh; }
</style>
