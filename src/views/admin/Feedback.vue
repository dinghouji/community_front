<template>
  <div class="page-container">
    <el-table :data="tableData" v-loading="loading" border stripe>
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="type" label="类型">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 1">建议</el-tag>
          <el-tag v-else-if="scope.row.type === 2" type="warning">投诉</el-tag>
          <el-tag v-else type="danger">报修</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="info">待处理</el-tag>
          <el-tag v-else type="success">已处理</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reply" label="回复内容" show-overflow-tooltip />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button type="primary" link @click="handleReply(scope.row)" v-if="scope.row.status === 0">
            <el-icon><EditPen /></el-icon> 回复
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="回复反馈" v-model="dialog.visible">
      <el-form :model="form">
        <el-form-item label="回复内容">
          <el-input type="textarea" v-model="form.reply" rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitReply">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getFeedbackPage, updateFeedback } from '@/api/feedback'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const dialog = reactive({ visible: false })
const form = reactive({ id: null, reply: '', status: 1 })

const getList = async () => {
  loading.value = true
  const res = await getFeedbackPage({ pageNum: 1, pageSize: 20 })
  tableData.value = res.data.records
  loading.value = false
}

const handleReply = (row) => {
  form.id = row.id
  form.reply = ''
  form.status = 1
  dialog.visible = true
}

const submitReply = async () => {
  await updateFeedback(form)
  ElMessage.success('回复成功')
  dialog.visible = false
  getList()
}

onMounted(() => getList())
</script>

<style scoped>
.page-container { padding: 20px; background: #fff; }
</style>
