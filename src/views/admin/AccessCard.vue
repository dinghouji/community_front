<template>
  <div class="page-container">
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon> 新增门禁卡</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" border stripe style="margin-top: 20px;">
      <el-table-column prop="cardNumber" label="卡号" />
      <el-table-column prop="ownerName" label="业主名称">
        <template #default="scope">
          {{ scope.row.ownerName || scope.row.ownerId }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 0">门禁</el-tag>
          <el-tag v-else type="success">电梯</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
          <el-tag v-else type="danger">挂失</el-tag>
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
        <el-form-item label="卡号">
          <el-input v-model="form.cardNumber" />
        </el-form-item>
        <el-form-item label="业主">
          <el-select v-model="form.ownerId" placeholder="请选择业主" filterable style="width: 100%">
            <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type">
            <el-option label="门禁" :value="0" />
            <el-option label="电梯" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="正常" :value="1" />
            <el-option label="挂失" :value="0" />
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
import { ref, reactive, onMounted } from 'vue'
import { getAccessCardPage, saveAccessCard, updateAccessCard, deleteAccessCard } from '@/api/accessCard'
import { getUserPage } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const userList = ref([])
const dialog = reactive({ visible: false, title: '' })
const form = reactive({ id: null, cardNumber: '', ownerId: null, type: 0, status: 1 })

const fetchUsers = async () => {
    if (userList.value.length > 0) return
    const res = await getUserPage({ pageNum: 1, pageSize: 1000 })
    userList.value = res.data.records
}

const getList = async () => {
  loading.value = true
  const res = await getAccessCardPage({ pageNum: 1, pageSize: 20 })
  const records = res.data.records
  
  // Frontend Fallback for ownerName
  let needFetch = false
  for (const item of records) {
      if (!item.ownerName && item.ownerId) {
          needFetch = true
          break
      }
  }
  
  if (needFetch) {
      await fetchUsers()
      records.forEach(item => {
          if (!item.ownerName && item.ownerId) {
              const user = userList.value.find(u => u.id === item.ownerId)
              if (user) {
                  item.ownerName = user.realName
              }
          }
      })
  }

  tableData.value = records
  loading.value = false
}

const handleAdd = async () => {
  Object.assign(form, { id: null, cardNumber: '', ownerId: null, type: 0, status: 1 })
  await fetchUsers()
  dialog.title = '新增门禁卡'
  dialog.visible = true
}

const handleEdit = async (row) => {
  Object.assign(form, row)
  await fetchUsers()
  dialog.title = '编辑门禁卡'
  dialog.visible = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(async () => {
    await deleteAccessCard(row.id)
    ElMessage.success('删除成功')
    getList()
  })
}

const submitForm = async () => {
  if (form.id) {
    await updateAccessCard(form)
  } else {
    await saveAccessCard(form)
  }
  dialog.visible = false
  getList()
}

onMounted(() => getList())
</script>

<style scoped>
.page-container { padding: 20px; background: #fff; }
</style>
