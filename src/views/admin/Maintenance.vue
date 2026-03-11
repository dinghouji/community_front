<template>
  <div class="page-container">
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon> 新增维修记录</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" border stripe style="margin-top: 20px;">
      <el-table-column prop="facilityName" label="设施名称">
        <template #default="scope">
            {{ scope.row.facilityName || scope.row.facilityId }}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="维修描述" />
      <el-table-column prop="repairerName" label="维修人员" />
      <el-table-column prop="cost" label="维修费用" />
      <el-table-column prop="repairTime" label="维修时间" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" link @click="handleEdit(scope.row)"><el-icon><Edit /></el-icon></el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)"><el-icon><Delete /></el-icon></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialog.title" v-model="dialog.visible">
      <el-form :model="form" label-width="100px">
        <el-form-item label="设施">
          <el-select v-model="form.facilityId" placeholder="请选择设施" filterable style="width: 100%">
            <el-option v-for="item in facilityList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="维修描述">
          <el-input type="textarea" v-model="form.description" />
        </el-form-item>
        <el-form-item label="维修人员">
          <el-input v-model="form.repairerName" />
        </el-form-item>
        <el-form-item label="费用">
          <el-input-number v-model="form.cost" :precision="2" :step="10" />
        </el-form-item>
        <el-form-item label="维修时间">
          <el-date-picker v-model="form.repairTime" type="datetime" placeholder="选择时间" value-format="YYYY-MM-DD HH:mm:ss" />
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
import { getMaintenanceRecordPage, saveMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord } from '@/api/maintenance'
import { getFacilityPage } from '@/api/facility'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const facilityList = ref([])
const dialog = reactive({ visible: false, title: '' })
const form = reactive({ id: null, facilityId: null, description: '', repairerName: '', cost: 0, repairTime: '' })

const fetchFacilities = async () => {
    if (facilityList.value.length > 0) return
    const res = await getFacilityPage({ pageNum: 1, pageSize: 1000 })
    facilityList.value = res.data.records
}

const getList = async () => {
  loading.value = true
  const res = await getMaintenanceRecordPage({ pageNum: 1, pageSize: 20 })
  const records = res.data.records

  // Frontend Fallback for facilityName
  let needFetch = false
  for (const item of records) {
      if (!item.facilityName && item.facilityId) {
          needFetch = true
          break
      }
  }

  if (needFetch) {
      await fetchFacilities()
      records.forEach(item => {
          if (!item.facilityName && item.facilityId) {
              const facility = facilityList.value.find(f => f.id === item.facilityId)
              if (facility) {
                  item.facilityName = facility.name
              }
          }
      })
  }

  tableData.value = records
  loading.value = false
}

const handleAdd = async () => {
  Object.assign(form, { id: null, facilityId: null, description: '', repairerName: '', cost: 0, repairTime: '' })
  await fetchFacilities()
  dialog.title = '新增维修记录'
  dialog.visible = true
}

const handleEdit = async (row) => {
  Object.assign(form, row)
  await fetchFacilities()
  dialog.title = '编辑维修记录'
  dialog.visible = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(async () => {
    await deleteMaintenanceRecord(row.id)
    ElMessage.success('删除成功')
    getList()
  })
}

const submitForm = async () => {
  if (form.id) {
    await updateMaintenanceRecord(form)
  } else {
    await saveMaintenanceRecord(form)
  }
  dialog.visible = false
  getList()
}

onMounted(() => getList())
</script>

<style scoped>
.page-container { padding: 20px; background: #fff; }
</style>
