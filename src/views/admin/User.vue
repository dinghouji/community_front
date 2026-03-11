<template>
  <div class="user-manage">
    <div class="search-bar">
      <el-input v-model="queryParams.username" placeholder="请输入用户名" style="width: 200px; margin-right: 10px;" clearable @clear="handleSearch" prefix-icon="Search" />
      <el-button type="primary" @click="handleSearch">
        <el-icon><Search /></el-icon> 查询
      </el-button>
      <el-button type="success" @click="handleAdd">
        <el-icon><Plus /></el-icon> 新增
      </el-button>
    </div>

    <el-table :data="tableData" v-loading="loading" style="width: 100%; margin-top: 20px;" border stripe>
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="realName" label="真实姓名" align="center" />
      <el-table-column prop="phone" label="电话" align="center" />
      <el-table-column prop="userType" label="角色" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.userType === 0">管理员</el-tag>
          <el-tag v-else-if="scope.row.userType === 1" type="warning">客服</el-tag>
          <el-tag v-else-if="scope.row.userType === 2" type="danger">维修人员</el-tag>
          <el-tag v-else type="success">业主</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button type="primary" link @click="handleEdit(scope.row)">
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
      />
    </div>

    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="!!form.id" prefix-icon="User" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!form.id">
            <el-input v-model="form.password" type="password" show-password placeholder="默认密码123456" prefix-icon="Lock" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" prefix-icon="Postcard" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" prefix-icon="Phone" />
        </el-form-item>
        <el-form-item label="角色" prop="userType">
          <el-select v-model="form.userType" placeholder="请选择角色">
            <el-option label="管理员" :value="0" />
            <el-option label="客服" :value="1" />
            <el-option label="维修人员" :value="2" />
            <el-option label="业主" :value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog.visible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getUserPage, saveUser, updateUser, deleteUser } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  username: ''
})

const dialog = reactive({
  visible: false,
  title: ''
})

const formRef = ref(null)
const form = reactive({
  id: null,
  username: '',
  password: '',
  realName: '',
  phone: '',
  userType: 2
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  userType: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const getList = async () => {
  loading.value = true
  try {
    const res = await getUserPage(queryParams)
    tableData.value = res.data.records
    total.value = res.data.total
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  queryParams.pageNum = 1
  getList()
}

const handleSizeChange = (val) => {
  queryParams.pageSize = val
  getList()
}

const handleCurrentChange = (val) => {
  queryParams.pageNum = val
  getList()
}

const resetForm = () => {
  form.id = null
  form.username = ''
  form.password = ''
  form.realName = ''
  form.phone = ''
  form.userType = 3
}

const handleAdd = () => {
  resetForm()
  dialog.title = '新增用户'
  dialog.visible = true
}

const handleEdit = (row) => {
  resetForm()
  Object.assign(form, row)
  form.password = ''
  dialog.title = '编辑用户'
  dialog.visible = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该用户吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    getList()
  })
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (form.id) {
        await updateUser(form)
        ElMessage.success('修改成功')
      } else {
        await saveUser(form)
        ElMessage.success('新增成功')
      }
      dialog.visible = false
      getList()
    }
  })
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.user-manage {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}
.search-bar {
  display: flex;
  align-items: center;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
