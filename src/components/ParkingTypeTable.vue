<template>
  <div class="parking-type-table">
    <!-- 添加新增车位类型的按钮 -->
    <el-button type="primary" @click="addParkingType">
      <el-icon><Plus /></el-icon>
      新增车位类型
    </el-button>

    <!-- 表格部分 -->
    <el-table :data="parkingTypes" border stripe style="margin-top: 20px;">
      <el-table-column prop="typeName" label="类型名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" link @click="editParkingType(scope.$index)">
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button type="danger" link @click="deleteParkingType(scope.$index)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllParkingTypes } from '@/api/parkingType'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

// 响应式数据
const parkingTypes = ref([])

// 获取车位类型数据
const fetchParkingTypes = async () => {
  try {
    const response = await getAllParkingTypes()
    parkingTypes.value = response.data.records || []
  } catch (error) {
    console.error('获取车位类型数据失败:', error)
  }
}

// 方法定义
const addParkingType = () => {
  // 添加车位类型逻辑
  console.log('添加车位类型')
}

const editParkingType = (index) => {
  // 编辑车位类型逻辑
  console.log('编辑车位类型:', index)
}

const deleteParkingType = (index) => {
  // 删除车位类型逻辑
  console.log('删除车位类型:', index)
}

// 组件挂载时获取数据
onMounted(() => {
  fetchParkingTypes()
})
</script>

<style scoped>
.parking-type-table {
  padding: 20px;
  background: #fff;
}
</style>