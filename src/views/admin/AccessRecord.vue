<template>
  <div class="page-container">
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon> 新增记录</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" border stripe style="margin-top: 20px;">
      <el-table-column prop="cardNumber" label="门禁卡号" />
      <el-table-column prop="direction" label="方向">
        <template #default="scope">
          <el-tag v-if="scope.row.direction === 0" type="success">进入</el-tag>
          <el-tag v-else type="warning">外出</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="accessTime" label="通行时间" />
      <el-table-column prop="imageUrl" label="抓拍图片">
         <template #default="scope">
            <el-image 
            v-if="scope.row.imageUrl" 
            style="width: 50px; height: 50px" 
            :src="getImageUrl(scope.row.imageUrl)" 
            :preview-src-list="[getImageUrl(scope.row.imageUrl)]" 
            preview-teleported />
         </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="danger" link @click="handleDelete(scope.row)"><el-icon><Delete /></el-icon></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog -->
    <el-dialog title="新增进出记录" v-model="dialog.visible">
      <el-form :model="form" label-width="100px">
        <el-form-item label="门禁卡" required>
          <el-select v-model="form.accessCardId" placeholder="请选择门禁卡" filterable style="width: 100%">
            <el-option v-for="card in cardList" :key="card.id" :label="card.cardNumber + ' (' + (card.ownerName || '未知') + ')'" :value="card.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="方向">
          <el-select v-model="form.direction" style="width: 100%">
            <el-option label="进入" :value="0" />
            <el-option label="外出" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="通行时间">
          <el-date-picker v-model="form.accessTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
        <el-form-item label="抓拍图片">
          <el-upload
            class="avatar-uploader"
            action="/api/file/upload"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :headers="uploadHeaders"
          >
            <img v-if="form.imageUrl" :src="getImageUrl(form.imageUrl)" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">点击上传抓拍图片（可选）</div>
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
import { getAccessRecordPage, saveAccessRecord, deleteAccessRecord } from '@/api/accessRecord'
import { getAccessCardPage } from '@/api/accessCard'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const cardList = ref([])
const dialog = reactive({ visible: false })
const form = reactive({ accessCardId: null, direction: 0, accessTime: '', imageUrl: '' })

// 上传请求头，携带 token
const uploadHeaders = computed(() => ({
  Authorization: localStorage.getItem('token') || ''
}))

const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `/api${path}`
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('图片大小不能超过 10MB!')
    return false
  }
  return true
}

const handleUploadSuccess = (response) => {
  if (response.code === 200) {
    form.imageUrl = response.data
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

const fetchCards = async () => {
  const res = await getAccessCardPage({ pageNum: 1, pageSize: 100 })
  cardList.value = res.data.records || []
}

const getList = async () => {
  loading.value = true
  const res = await getAccessRecordPage({ pageNum: 1, pageSize: 100 })
  tableData.value = res.data.records || []
  loading.value = false
}

const handleAdd = async () => {
  await fetchCards()
  form.accessCardId = null
  form.direction = 0
  form.accessTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  form.imageUrl = ''
  dialog.visible = true
}

const submitForm = async () => {
  if (!form.accessCardId) {
    return ElMessage.warning('请选择门禁卡')
  }
  try {
    await saveAccessRecord(form)
    ElMessage.success('新增成功')
    dialog.visible = false
    getList()
  } catch (error) {
    // 错误已在 request.js 中处理显示
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(async () => {
    await deleteAccessRecord(row.id)
    ElMessage.success('删除成功')
    getList()
  })
}

onMounted(() => getList())
</script>

<style scoped>
.page-container { padding: 20px; background: #fff; }
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
.avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
}
.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}
</style>
