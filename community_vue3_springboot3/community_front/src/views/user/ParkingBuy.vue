const showPurchaseDialog = (parking) => {
  Object.assign(form, {
    id: parking.id,
    parkingNumber: parking.parkingNumber,
    purchasePrice: parking.purchasePrice || 0,
    rentPrice: parking.rentPrice || 0,
    description: parking.description || '', // 确保从后端获取 description 字段
    type: 'purchase' // 默认选择购买
  })
  dialog.title = `购买/租赁车位 ${parking.parkingNumber}`
  dialog.visible = true
}

const resetForm = () => {
  Object.assign(form, {
    id: null,
    parkingNumber: '',
    type: 'purchase',
    purchasePrice: 0,
    rentPrice: 0,
    description: '' // 重置 description 字段
  })
}