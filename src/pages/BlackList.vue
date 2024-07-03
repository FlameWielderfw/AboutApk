<script setup>
import {onMounted, ref} from 'vue'
import dayjs from 'dayjs'
import axios from "axios";

const now = new Date()
const BaseUrl = 'http://localhost:8080'
const tableData = ref([
  {
    id: 25,
    apkName: "1ace25ed992a997d43362ed4f0665e95.apk",
    packageName: "",
    staticStatus: "Success",
    dynamicStatus: "Success",
    judgeStatus: "Success",
    judgeResult: "80",
    createTime: "2024-06-25T02:22:06.000+00:00",
    analysisNo: "ac6ae201b2b4e918c66c9d61d4a65e3c"
  },

])

onMounted(()=>{
  axios({
    method: 'GET',
    url: BaseUrl+'/api/get_black_list',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
      .then(response => {
        console.log('获取黑名单成功');
        tableData.value = response.data.message
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        alert(error)
      });
})
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
          <el-table-column prop="apkName" label="App" width="200" />
          <el-table-column prop="createTime" label="检定时间" width="200" />
          <el-table-column prop="judgeResult" label="评分" width="80" />
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
          <el-table-column prop="apkName" label="App" width="200" />
          <el-table-column prop="createTime" label="检定时间" width="200" />
          <el-table-column prop="judgeResult" label="评分" width="80" />
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
