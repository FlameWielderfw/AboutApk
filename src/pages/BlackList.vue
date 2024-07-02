<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const now = new Date()

const tableData = ref([
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    zip: 'CA 90036',
  },
])

const deleteRow = (index) => {
  tableData.value.splice(index, 1)
}
</script>

<template>
  <el-container>
    <el-aside class="Side">
      <div class="Title">
        <text>App黑名单</text>
      </div>
      <div class="Table">
        <el-table :data="tableData" style="width: 90%" max-height="250">
          <el-table-column prop="name" label="App" width="150" />
          <el-table-column prop="date" label="检定时间" width="170" />
          <el-table-column prop="state" label="State" width="150" />
          <el-table-column fixed="right" label="Operations" min-width="100">
            <template #default="scope">
              <el-button
                  link
                  type="primary"
                  size="small"
                  @click.prevent="deleteRow(scope.$index)"
              >
                Remove
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </el-aside>
    <el-main class="Side">
      <div class="Title">
        <text>App白名单</text>
      </div>
      <div class="Table">
        <el-table :data="tableData" style="width: 90%" max-height="250">
          <el-table-column prop="name" label="App" width="150" />
          <el-table-column prop="date" label="检定时间" width="170" />
          <el-table-column prop="state" label="State" width="150" />
          <el-table-column fixed="right" label="Operations" min-width="100">
            <template #default="scope">
              <el-button
                  link
                  type="primary"
                  size="small"
                  @click.prevent="deleteRow(scope.$index)"
              >
                Remove
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
.Side{
  width: 50%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
  position: relative;
}
.Title{
  text-align: center;
  height: 80px;
  width: 100%;
}
.Table{
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
}
</style>