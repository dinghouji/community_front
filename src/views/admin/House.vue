<template>
  <div class="page-container">
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon> 新增房屋</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" border stripe style="margin-top: 20px;">
      <el-table-column prop="buildingName" label="楼栋" />
      <el-table-column prop="unitName" label="单元" />
      <el-table-column prop="houseNumber" label="门牌号" />
      <el-table-column prop="floor" label="楼层" />
      <el-table-column prop="area" label="面积(㎡)" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="info">空置</el-tag>
          <el-tag v-else type="success">已入住</el-tag>
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
        <el-form-item label="楼栋" required>
          <el-select v-model="form.buildingId" placeholder="请选择楼栋" @change="handleBuildingChange" style="width: 100%">
            <el-option v-for="item in buildingList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="单元" required>
          <el-select v-model="form.unitId" placeholder="请先选择楼栋" style="width: 100%">
            <el-option v-for="item in filteredUnitList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="门牌号">
          <el-input v-model="form.houseNumber" prefix-icon="House" />
        </el-form-item>
        <el-form-item label="楼层">
          <el-input-number v-model="form.floor" />
        </el-form-item>
        <el-form-item label="面积">
          <el-input-number v-model="form.area" :precision="2" :step="0.1" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="空置" :value="0" />
            <el-option label="已入住" :value="1" />
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
import { getHousePage, saveHouse, updateHouse, deleteHouse } from '@/api/house'
import { getBuildingPage } from '@/api/building'
import { getUnitPage } from '@/api/unit'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const buildingList = ref([])
const unitList = ref([])
const dialog = reactive({ visible: false, title: '' })
const form = reactive({ id: null, buildingId: null, unitId: null, houseNumber: '', floor: 1, area: 0, status: 0 })

// 根据选择的楼栋过滤单元
const filteredUnitList = computed(() => {
  if (!form.buildingId) return []
  return unitList.value.filter(u => u.buildingId === form.buildingId)
})

const fetchDropdowns = async () => {
  const buildingRes = await getBuildingPage({ pageNum: 1, pageSize: 100 })
  buildingList.value = buildingRes.data.records || []
  const unitRes = await getUnitPage({ pageNum: 1, pageSize: 100 })
  unitList.value = unitRes.data.records || []
}

const getList = async () => {
  loading.value = true
  const res = await getHousePage({ pageNum: 1, pageSize: 100 })
  tableData.value = res.data.records || []
  loading.value = false
}

const handleBuildingChange = () => {
  form.unitId = null // 切换楼栋时清空单元选择
}

const handleAdd = () => {
  Object.assign(form, { id: null, buildingId: null, unitId: null, houseNumber: '', floor: 1, area: 0, status: 0 })
  dialog.title = '新增房屋'
  dialog.visible = true
}

const handleEdit = (row) => {
  // 根据unitId找到对应的buildingId
  const unit = unitList.value.find(u => u.id === row.unitId)
  Object.assign(form, { ...row, buildingId: unit ? unit.buildingId : null })
  dialog.title = '编辑房屋'
  dialog.visible = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(async () => {
    await deleteHouse(row.id)
    ElMessage.success('删除成功')
    getList()
  })
}

const submitForm = async () => {
  if (!form.unitId) {
    return ElMessage.warning('请选择单元')
  }
  if (form.id) {
    await updateHouse(form)
  } else {
    await saveHouse(form)
  }
  dialog.visible = false
  getList()
}

onMounted(async () => {
  await fetchDropdowns()
  await getList()
})
</script>

<style scoped>
.page-container { padding: 20px; background: #fff; }
</style>
