<template>
  <div class="page-container">
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon> 新增楼栋</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" border stripe style="margin-top: 20px;">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="楼栋名称" />
      <el-table-column prop="totalFloors" label="总层数" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" link @click="handleEdit(scope.row)"><el-icon><Edit /></el-icon></el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)"><el-icon><Delete /></el-icon></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialog.title" v-model="dialog.visible">
      <el-form :model="form" label-width="80px">
        <el-form-item label="楼栋名称">
          <el-input v-model="form.name" prefix-icon="OfficeBuilding" />
        </el-form-item>
        <el-form-item label="总层数">
          <el-input-number v-model="form.totalFloors" :min="1" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="form.description" />
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
import { ref, reactive, onMounted } from 'vue'
import { getBuildingPage, saveBuilding, updateBuilding, deleteBuilding } from '@/api/building'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const dialog = reactive({ visible: false, title: '' })
const form = reactive({ id: null, name: '', totalFloors: 1, description: '' })

const getList = async () => {
  loading.value = true
  const res = await getBuildingPage({ pageNum: 1, pageSize: 100 })
  tableData.value = res.data.records
  loading.value = false
}

const handleAdd = () => {
  form.id = null
  form.name = ''
  form.totalFloors = 1
  form.description = ''
  dialog.title = '新增楼栋'
  dialog.visible = true
}

const handleEdit = (row) => {
  Object.assign(form, row)
  dialog.title = '编辑楼栋'
  dialog.visible = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(async () => {
    await deleteBuilding(row.id)
    ElMessage.success('删除成功')
    getList()
  })
}

const submitForm = async () => {
  if (form.id) {
    await updateBuilding(form)
  } else {
    await saveBuilding(form)
  }
  dialog.visible = false
  getList()
}

onMounted(() => getList())
</script>

<style scoped>
.page-container { padding: 20px; background: #fff; }
</style>
