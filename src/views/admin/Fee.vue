<template>
  <div class="page-container">
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon> 新增费用项</el-button>
      <el-button type="success" @click="handlePublish"><el-icon><Money /></el-icon> 发布缴费任务</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" border stripe style="margin-top: 20px;">
      <el-table-column prop="itemName" label="项目名称" />
      <el-table-column prop="price" label="单价" />
      <el-table-column prop="unit" label="单位" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" link @click="handleEdit(scope.row)"><el-icon><Edit /></el-icon></el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)"><el-icon><Delete /></el-icon></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 缴费任务列表 -->
    <h3 style="margin-top: 30px; margin-bottom: 15px;">缴费任务列表</h3>
    <el-table :data="billList" v-loading="billLoading" border stripe>
      <el-table-column prop="ownerName" label="业主" />
      <el-table-column prop="feeItemName" label="费用项目" />
      <el-table-column prop="amount" label="金额">
        <template #default="scope">¥{{ scope.row.amount }}</template>
      </el-table-column>
      <el-table-column prop="billingCycle" label="账单周期" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="warning">未缴费</el-tag>
          <el-tag v-else type="success">已缴费</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="danger" link @click="handleDeleteBill(scope.row)"><el-icon><Delete /></el-icon></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Fee Item Dialog -->
    <el-dialog :title="dialog.title" v-model="dialog.visible">
      <el-form :model="form" label-width="80px">
        <el-form-item label="项目名称">
          <el-input v-model="form.itemName" prefix-icon="Money" />
        </el-form-item>
        <el-form-item label="单价">
          <el-input-number v-model="form.price" :precision="2" :step="0.1" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.unit" placeholder="如：元/月/平米" prefix-icon="ScaleToOriginal" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- Publish Bill Dialog -->
    <el-dialog title="发布缴费任务" v-model="billDialog.visible">
      <el-form :model="billForm" label-width="100px">
        <el-form-item label="收费项目">
            <el-select v-model="billForm.feeItemId" @change="handleFeeItemChange" placeholder="请选择项目">
                <el-option v-for="item in tableData" :key="item.id" :label="item.itemName" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item label="业主">
            <el-select v-model="billForm.ownerId" placeholder="请选择业主" filterable>
                <el-option v-for="user in userList" :key="user.id" :label="(user.realName || user.username) + ' (' + user.username + ')'" :value="user.id" />
            </el-select>
        </el-form-item>
        <el-form-item label="房屋">
             <el-select v-model="billForm.houseId" placeholder="请选择房屋 (可选)" filterable clearable>
                 <el-option v-for="house in houseList" :key="house.id" :label="house.buildingName + ' - ' + house.unitName + ' - ' + house.houseNumber" :value="house.id" />
             </el-select>
        </el-form-item>
        <el-form-item label="金额">
            <el-input-number v-model="billForm.amount" :precision="2" :step="10" />
        </el-form-item>
        <el-form-item label="账单周期">
            <el-input v-model="billForm.billingCycle" placeholder="例如：2026-01" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="billDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitBill">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getFeeItemPage, saveFeeItem, updateFeeItem, deleteFeeItem } from '@/api/fee'
import { getBillPage, saveBill, deleteBill } from '@/api/bill'
import { getUserPage } from '@/api/user'
import { getHousePage } from '@/api/house'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const userList = ref([])
const houseList = ref([])
const dialog = reactive({ visible: false, title: '' })
const form = reactive({ id: null, itemName: '', price: 0, unit: '' })

const billDialog = reactive({ visible: false })
const billForm = reactive({ ownerId: null, houseId: null, feeItemId: null, amount: 0, billingCycle: '', status: 0 })

// 缴费任务列表
const billList = ref([])
const billLoading = ref(false)

const getList = async () => {
  loading.value = true
  const res = await getFeeItemPage({ pageNum: 1, pageSize: 100 }) // Fetch more for selection
  tableData.value = res.data.records
  loading.value = false
}

// 获取缴费任务列表
const getBillList = async () => {
  billLoading.value = true
  const res = await getBillPage({ pageNum: 1, pageSize: 100 })
  const bills = res.data.records || []
  // 填充业主名称和费用项目名称
  bills.forEach(bill => {
    const user = userList.value.find(u => u.id === bill.ownerId)
    bill.ownerName = user ? (user.realName || user.username) : '-'
    const feeItem = tableData.value.find(f => f.id === bill.feeItemId)
    bill.feeItemName = feeItem ? feeItem.itemName : '-'
  })
  billList.value = bills
  billLoading.value = false
}

const handleAdd = () => {
  Object.assign(form, { id: null, itemName: '', price: 0, unit: '' })
  dialog.title = '新增费用项'
  dialog.visible = true
}

const handleEdit = (row) => {
  Object.assign(form, row)
  dialog.title = '编辑费用项'
  dialog.visible = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(async () => {
    await deleteFeeItem(row.id)
    ElMessage.success('删除成功')
    getList()
  })
}

const submitForm = async () => {
  if (form.id) {
    await updateFeeItem(form)
  } else {
    await saveFeeItem(form)
  }
  dialog.visible = false
  getList()
}

// Bill Logic
const fetchDropdowns = async () => {
    const userRes = await getUserPage({ pageNum: 1, pageSize: 1000 })
    userList.value = userRes.data.records || []
    const houseRes = await getHousePage({ pageNum: 1, pageSize: 1000 })
    houseList.value = houseRes.data.records || []
}

const handlePublish = async () => {
    Object.assign(billForm, { ownerId: null, houseId: null, feeItemId: null, amount: 0, billingCycle: '', status: 0 })
    await fetchDropdowns()
    billDialog.visible = true
}

const handleFeeItemChange = (id) => {
    const item = tableData.value.find(i => i.id === id)
    if (item) {
        billForm.amount = item.price
    }
}

const submitBill = async () => {
    await saveBill(billForm)
    ElMessage.success('发布成功')
    billDialog.visible = false
    getBillList()
}

const handleDeleteBill = (row) => {
  ElMessageBox.confirm('确认删除该缴费任务?', '提示', { type: 'warning' }).then(async () => {
    await deleteBill(row.id)
    ElMessage.success('删除成功')
    getBillList()
  })
}

onMounted(async () => {
  await fetchDropdowns()
  await getList()
  await getBillList()
})
</script>

<style scoped>
.page-container { padding: 20px; background: #fff; }
</style>
