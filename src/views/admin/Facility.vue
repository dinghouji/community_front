<template>
  <div class="page-container">
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon> 新增设施</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" border stripe style="margin-top: 20px;">
      <el-table-column prop="imageUrl" label="图片" width="100">
        <template #default="scope">
          <el-image 
            v-if="scope.row.imageUrl" 
            :src="getImageUrl(scope.row.imageUrl)" 
            style="width: 50px; height: 50px; border-radius: 4px;" 
            fit="cover"
            :preview-src-list="[getImageUrl(scope.row.imageUrl)]"
            preview-teleported
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="设施名称" />
      <el-table-column prop="location" label="位置" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.status === 0" type="danger">损坏</el-tag>
          <el-tag v-else type="warning">维修中</el-tag>
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
        <el-form-item label="图片">
            <el-upload
                class="avatar-uploader"
                action="/api/file/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :headers="headers"
            >
                <img v-if="form.imageUrl" :src="getImageUrl(form.imageUrl)" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name" prefix-icon="Basketball" />
        </el-form-item>
        <el-form-item label="位置">
          <el-input v-model="form.location" prefix-icon="Location" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="正常" :value="1" />
            <el-option label="损坏" :value="0" />
            <el-option label="维修中" :value="2" />
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
import { ref, reactive, onMounted, computed } from 'vue'
import { getFacilityPage, saveFacility, updateFacility, deleteFacility } from '@/api/facility'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const dialog = reactive({ visible: false, title: '' })
const form = reactive({ id: null, name: '', location: '', status: 1, imageUrl: '' })

const headers = computed(() => {
  return {
    Authorization: localStorage.getItem('token')
  }
})

const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `/api${path}`
}

const handleAvatarSuccess = (response, uploadFile) => {
  if (response.code === 200) {
    form.imageUrl = response.data
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('Picture must be JPG or PNG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Picture size can not exceed 2MB!')
    return false
  }
  return true
}

const getList = async () => {
  loading.value = true
  const res = await getFacilityPage({ pageNum: 1, pageSize: 20 })
  tableData.value = res.data.records
  loading.value = false
}

const handleAdd = () => {
  Object.assign(form, { id: null, name: '', location: '', status: 1, imageUrl: '' })
  dialog.title = '新增设施'
  dialog.visible = true
}

const handleEdit = (row) => {
  Object.assign(form, row)
  dialog.title = '编辑设施'
  dialog.visible = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(async () => {
    await deleteFacility(row.id)
    ElMessage.success('删除成功')
    getList()
  })
}

const submitForm = async () => {
  if (form.id) {
    await updateFacility(form)
  } else {
    await saveFacility(form)
  }
  dialog.visible = false
  getList()
}

onMounted(() => getList())
</script>

<style scoped>
.page-container { padding: 20px; background: #fff; }

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  border: 1px dashed #d9d9d9;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style>
