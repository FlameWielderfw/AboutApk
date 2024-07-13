<script setup lang="ts">
import {onMounted, ref} from 'vue'
import AnalysisService from '@/service/AnalysisService'
import Report from "@/pages/Report.vue";

interface BlackListData {
  id: number;
  apkName: string;
  packageName: string;
  staticStatus: string;
  dynamicStatus: string;
  judgeStatus: string;
  judgeResult: string;
  isGamble: boolean;
  gambleReason: string;
  isSex: boolean;
  sexReason: string;
  isScam: boolean;
  scamReason: string;
  createTime: string;
  analysisNo: string;
  type: string;
}

const analysisNum = ref<string>('')
const forceShowReport = ref<boolean>(false)  // 用于强制显示 Report
const blackList = ref<BlackListData[]>([])
const whiteList = ref<BlackListData[]>([])

onMounted(() => {
  AnalysisService.getBlacklist()
      .then(response => {
        const allOrders: BlackListData[] = response.message
        whiteList.value = allOrders.filter((order) => {
          return !order.isScam && !order.isSex && !order.isGamble;
        })
        blackList.value = allOrders.filter((order) => {
          return !(!order.isScam && !order.isSex && !order.isGamble);
        })
        blackList.value = blackList.value.map((order) => {
          order.type = ""
          if (order.isSex) order.type += "涉黄 "
          if (order.isScam) order.type += "涉诈 "
          if (order.isGamble) order.type += "涉赌 "
          return order
        })
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        alert(error)
      });
})

const showReport = (analysisNo: string) => {
  analysisNum.value = analysisNo
  forceShowReport.value = !forceShowReport.value
}
</script>

<template>
  <el-container>
    <el-aside class="Side">
      <div class="Title">
        <text>App黑名单</text>
      </div>
      <div class="Table">
        <el-table :data="blackList" style="width: 90%">
          <el-table-column prop="apkName" label="文件名" width="200" />
          <el-table-column prop="createTime" label="检定时间" width="180" />
          <el-table-column prop="type" label="类别" />
          <el-table-column fixed="right" label="操作" min-width="100">
            <template #default="scope">
              <el-button
                  type="primary" size="large" link
                  @click.prevent="showReport(scope.row.analysisNo)"
              >
                详细信息
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
        <el-table :data="whiteList" style="width: 90%">
          <el-table-column prop="apkName" label="文件名" width="320" />
          <el-table-column prop="createTime" label="检定时间" width="180" />
          <el-table-column fixed="right" label="操作">
            <template #default="scope">
              <el-button
                  type="primary" size="large" link
                  @click.prevent="showReport(scope.row.analysisNo)"
              >
                详细信息
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>

  <Report :analysis-no="analysisNum" :force-show="forceShowReport"/>
</template>

<style scoped>
.Side{
  width: 50%;
  height: 105vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
  position: relative;
}
.Title{
  text-align: center;
  height: 100px;
  width: 100%;
}
.Table{
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
}
</style>
