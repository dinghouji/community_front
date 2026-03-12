<template>
  <div>
    <!-- 添加新增车位类型的按钮 -->
    <van-button type="primary" @click="addParkingType">+ 新增车位类型</van-button>

    <!-- 表格部分 -->
    <table>
      <thead>
        <tr>
          <th>类型名称</th>
          <th>描述</th> 
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in parkingTypes" :key="index">
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td> 
          <td>
            <van-icon name="edit" @click="editParkingType(index)" />
            <van-icon name="delete" @click="deleteParkingType(index)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parkingTypes: [
        { name: '地下私家车位', description: '500元/月' }, // 确保描述字段包含完整信息
        { name: '地面临时车位', description: '300元/月' } // 确保描述字段包含完整信息
      ]
    };
  },
  methods: {
    addParkingType() {
      // 添加车位类型逻辑
    },
    editParkingType(index) {
      // 编辑车位类型逻辑
    },
    deleteParkingType(index) {
      // 删除车位类型逻辑
    }
  }
};
</script>