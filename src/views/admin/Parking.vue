<template>
  <div class="page-container">
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon> 新增车位</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" border stripe style="margin-top: 20px;">
      <el-table-column prop="parkingNumber" label="车位号" />
      <el-table-column prop="typeId" label="车位类型">
        <template #default="scope">
          {{ typeMap[scope.row.typeId] || scope.row.typeId }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="success">空闲</el-tag>
          <el-tag v-else type="danger">已占用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" link @click="handleEdit(scope.row)"><el-icon><Edit /></el-icon></el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)"><el-icon><Delete /></el-icon></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialog.title" v-model="dialog.visible">
      <el-form :model="form" label-width="80px">
        <el-form-item label="车位号">
          <el-input v-model="form.parkingNumber" prefix-icon="Van" />
        </el-form-item>
        <el-form-item label="车位类型">
          <el-select v-model="form.typeId" placeholder="请选择车位类型">
            <el-option v-for="t in typeList" :key="t.id" :label="t.typeName" :value="t.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="空闲" :value="0" />
            <el-option label="已占用" :value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { getParkingPage, saveParking, updateParking, deleteParking } from '@/api/parking'
import { getAllParkingTypes } from '@/api/parkingType'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const typeList = ref([])
const dialog = reactive({ visible: false, title: '' })
const form = reactive({ id: null, parkingNumber: '', typeId: null, status: 0 })

const typeMap = computed(() => {
  const map = {}
  typeList.value.forEach(t => { map[t.id] = t.typeName })
  return map
})

const getList = async () => {
  loading.value = true
  const res = await getParkingPage({ pageNum: 1, pageSize: 20 })
  tableData.value = res.data.records
  loading.value = false
}

const getTypes = async () => {
  const res = await getAllParkingTypes()
  typeList.value = res.data.records
}

const handleAdd = () => {
  Object.assign(form, { id: null, parkingNumber: '', typeId: null, status: 0 })
  dialog.title = '新增车位'
  dialog.visible = true
}

const handleEdit = (row) => {
  Object.assign(form, row)
  dialog.title = '编辑车位'
  dialog.visible = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(async () => {
    await deleteParking(row.id)
    ElMessage.success('删除成功')
    getList()
  })
}

const submitForm = async () => {
  if (form.id) {
    await updateParking(form)
  } else {
    await saveParking(form)
  }
  dialog.visible = false
  getList()
}

onMounted(() => { getList(); getTypes() })
</script>

<style scoped>
.page-container { padding: 20px; background: #fff; }
</style>
