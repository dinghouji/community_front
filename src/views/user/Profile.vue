<template>
  <div class="profile-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>个人中心</span>
        </div>
      </template>
      <div class="avatar-container">
        <el-upload
          class="avatar-uploader"
          action="/api/file/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="headers"
        >
          <img v-if="form.avatar" :src="getImageUrl(form.avatar)" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <div class="avatar-tip">点击图片修改头像</div>
      </div>
      <el-form :model="form" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" disabled prefix-icon="User" />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="form.realName" prefix-icon="Postcard" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" prefix-icon="Phone" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { updateUser } from '@/api/user'
import { ElMessage } from 'element-plus'

const form = reactive({
  id: null,
  username: '',
  realName: '',
  phone: '',
  avatar: ''
})

const headers = computed(() => {
  return {
    Authorization: localStorage.getItem('token')
  }
})

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    Object.assign(form, user)
  }
})

const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `/api${path}`
}

const handleAvatarSuccess = (response, uploadFile) => {
  if (response.code === 200) {
    form.avatar = response.data
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('Avatar picture must be JPG or PNG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const handleSave = async () => {
  await updateUser(form)
  ElMessage.success('修改成功')
  // Update local storage
  let user = JSON.parse(localStorage.getItem('user'))
  Object.assign(user, form)
  localStorage.setItem('user', JSON.stringify(user))
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}
.avatar-container {
  text-align: center;
  margin-bottom: 20px;
}
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
  border-radius: 50%;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 50%;
  object-fit: cover;
}
.avatar-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}
</style>
