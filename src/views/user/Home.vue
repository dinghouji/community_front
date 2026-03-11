<template>
  <div class="page-container">
    <h2>欢迎回来，业主</h2>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>最新公告</span>
        </div>
      </template>
      <div v-if="list.length > 0">
        <div v-for="item in list" :key="item.id" class="announcement-item">
          <div class="title">{{ item.title }}</div>
          <div class="content">{{ item.content }}</div>
          <div class="time">{{ item.publishTime }}</div>
          <el-divider />
        </div>
      </div>
      <el-empty v-else description="暂无公告" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAnnouncementPage } from '@/api/announcement'

const list = ref([])

const getList = async () => {
  const res = await getAnnouncementPage({ pageNum: 1, pageSize: 5 })
  list.value = res.data.records
}

onMounted(() => getList())
</script>

<style scoped>
.page-container { padding: 20px; }
.announcement-item { margin-bottom: 10px; }
.title { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
.content { color: #666; margin-bottom: 5px; line-height: 1.5; }
.time { color: #999; font-size: 12px; }
</style>
