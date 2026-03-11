<template>
  <div class="feedback-page">
    <div class="action-bar" style="margin-bottom: 20px;">
      <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon> 提交反馈/报修</el-button>
    </div>
    
    <el-card v-for="item in list" :key="item.id" class="feedback-item">
      <template #header>
        <div class="card-header">
          <span class="title">{{ item.title }}</span>
          <div class="tags">
             <el-tag v-if="item.type === 1">建议</el-tag>
             <el-tag v-else-if="item.type === 2" type="warning">投诉</el-tag>
             <el-tag v-else type="danger">报修</el-tag>
             <el-tag v-if="item.status === 0" type="info" style="margin-left: 10px;">待处理</el-tag>
             <el-tag v-else type="success" style="margin-left: 10px;">已处理</el-tag>
          </div>
        </div>
      </template>
      <div class="content">{{ item.content }}</div>
      <div class="reply" v-if="item.reply">
        <el-divider>物业回复</el-divider>
        <p>{{ item.reply }}</p>
      </div>
    </el-card>

    <el-dialog :title="dialog.title" v-model="dialog.visible">
      <el-form :model="form" label-width="80px">
        <el-form-item label="类型">
          <el-select v-model="form.type">
            <el-option label="建议" :value="1" />
            <el-option label="投诉" :value="2" />
            <el-option label="报修" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title" prefix-icon="Edit" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="form.content" rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getFeedbackPage, saveFeedback } from '@/api/feedback'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const list = ref([])
const dialog = reactive({ visible: false, title: '提交反馈' })
const form = reactive({ type: 1, title: '', content: '' })

// Assuming backend can filter by current user, or we filter locally for demo
// Real implementation should have backend filter by userId from token
const getList = async () => {
  loading.value = true
  // In a real app, pass userId or let backend handle it
  const res = await getFeedbackPage({ pageNum: 1, pageSize: 100 })
  list.value = res.data.records
  loading.value = false
}

const handleAdd = () => {
  form.type = 1
  form.title = ''
  form.content = ''
  dialog.visible = true
}

const submitForm = async () => {
  // Need to set userId from local storage if backend expects it in body
  const user = JSON.parse(localStorage.getItem('user'))
  const data = { ...form, userId: user ? user.id : null }
  
  await saveFeedback(data)
  ElMessage.success('提交成功')
  dialog.visible = false
  getList()
}

onMounted(() => getList())
</script>

<style scoped>
.feedback-page { padding: 20px; }
.feedback-item { margin-bottom: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.title { font-weight: bold; font-size: 16px; }
.reply { background: #f9f9f9; padding: 10px; border-radius: 4px; margin-top: 10px; }
</style>
