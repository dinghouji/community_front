<template>
  <div class="page-container">
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon> 新增公告</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" border stripe style="margin-top: 20px;">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="publishTime" label="发布时间" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" link @click="handleEdit(scope.row)"><el-icon><Edit /></el-icon></el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)"><el-icon><Delete /></el-icon></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialog.title" v-model="dialog.visible">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" prefix-icon="Bell" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="form.content" rows="5" />
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
import { getAnnouncementPage, saveAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/api/announcement'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const dialog = reactive({ visible: false, title: '' })
const form = reactive({ id: null, title: '', content: '' })

const getList = async () => {
  loading.value = true
  const res = await getAnnouncementPage({ pageNum: 1, pageSize: 20 })
  tableData.value = res.data.records
  loading.value = false
}

const handleAdd = () => {
  form.id = null
  form.title = ''
  form.content = ''
  dialog.title = '新增公告'
  dialog.visible = true
}

const handleEdit = (row) => {
  Object.assign(form, row)
  dialog.title = '编辑公告'
  dialog.visible = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(async () => {
    await deleteAnnouncement(row.id)
    ElMessage.success('删除成功')
    getList()
  })
}

const submitForm = async () => {
  if (form.id) {
    await updateAnnouncement(form)
  } else {
    await saveAnnouncement(form)
  }
  dialog.visible = false
  getList()
}

onMounted(() => getList())
</script>

<style scoped>
.page-container { padding: 20px; background: #fff; }
</style>
