<template>
  <el-container style="height:800px; width: 100%; position: absolute; left: 0; top: 0;">
    <el-header style="height:150px; width: 100%; margin-top: 50px">
      <el-row>
        <text class="TEXT">在线 APK 分析器</text>
      </el-row>
      <el-row>
        <text  class="content">使用我们的在线 APK 分析器，您可以轻松分析和优化 APK，快速识别出涉诈，涉赌，涉黄应用。</text>
      </el-row>
    </el-header>
    <el-main class="upload-container">
      <el-container>
        <el-aside style="width: 50%;height: 450px;display: flex;justify-content: center;flex-direction: column;align-items: center;">
          <el-card shadow="hover" class="UploadCard">
            <el-text  class="title">离线分析模式</el-text>
            <el-upload
                v-model:file-list="fileList"
                class="uploadBox" drag
                action="http://127.0.0.1:10315/api/upload_apk"
                :show-file-list= "false"
                :on-change="handleChange"
                :on-success="handleUploadSuccess"
                :on-progress="handleProgress"
                :before-upload="handleBeforeUpload"
                :on-error="handleErrorUpload"
                :accept="'.apk,.jpg,.jpeg,.png,'"
            >
              <div style="text-align: center; position: relative; top:60px">
                <el-button type="primary" color="#725feb" size="small" style="width: 220px;height: 60px">
                  <el-icon size="20px"><Document /></el-icon>
                  <p style="font-size: 20px; font-weight: 600">选择文件</p>
                </el-button>
              </div>
              <div style="text-align: center; position: relative; top:80px">
                <p style="color: gray">请将您的 APK 文件拖到这里</p>
              </div>
            </el-upload>
          </el-card>
        </el-aside>

        <el-main style="height: 450px;display: flex;justify-content: center;flex-direction: column;align-items: center;padding: 0">
          <el-card shadow="hover" class="UploadCard">
            <el-text class="title" >互联网分析模式</el-text>
            <el-upload
                class="uploadBox2"
                drag
                action="http://127.0.0.1:10315/api/upload_qrcode"
                :show-file-list= "false"
                :on-change="handleChange"
                :on-error="handleErrorUpload"
                :before-upload="handleBeforeUpload"
                :on-success="qrcodeUploadSuccess"
                :on-progress="handleProgress"
                :limit = 1
                :accept="'.jpg,.jpeg,.png,'"
            >
              <div style="text-align: center; position: relative; top:60px">
                <el-button type="primary" color="#725feb" size="small" style="width: 220px;height: 60px">
                  <el-icon size="20px"><FullScreen /></el-icon>
                  <p style="font-size: 20px;font-weight: 600">选择二维码</p>
                </el-button>
              </div>
              <div style="text-align: center;position: relative;top:80px">
                <p style="color: gray">请将您的二维码拖到这里</p>
              </div>
            </el-upload>
            <el-row style="justify-content: center;top:20px;height: 100px;width: 100%" >
              <el-input v-model="urlInput" style="width: 65%;height: 40px;margin-right: 20px;" placeholder="请输入 APK 所在的 URL" />
              <el-button style="position:relative;top:5px" type="primary" color="#725feb" @click="UploadURL(urlInput)">上传</el-button>
            </el-row>
          </el-card>
        </el-main>
      </el-container>

      <div class="report" v-show="showUploadedFileTable">
        <el-table :data="uploadFileTableData" style="width: 80%">
          <el-table-column prop="name" label="APK文件名" width="370" />
          <el-table-column prop="progress" label="上传进度" >
            <template #default="scope">
              <el-progress
                  v-if="scope.row.progress < 100"
                  :color="customColor"
                  :stroke-width="7"
                  :percentage="scope.row.progress">
              </el-progress>
              <el-icon v-if="scope.row.progress >= 100" color="green" size="17px" style="position : relative; bottom : -2px"><circleCheck/></el-icon>
              <el-text v-if="scope.row.progress >= 100">上传成功</el-text>
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作">
            <template #default="scope">
              <el-button type="primary" @click="ShowResultReport(scope.row)" color="#725feb">分析结果</el-button>
              <el-button type="danger" @click="ItemDelete(scope.row)">删除条目</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>

  <Report :analysis-no="analysisNum"/>
</template>

<script lang="ts" setup>
import {ref, watchEffect} from 'vue'
import type {
  UploadFile,
  UploadFiles,
  UploadProgressEvent,
  UploadProps,
  UploadRawFile,
  UploadUserFile
} from 'element-plus'
import {CircleCheck, Document, FullScreen} from '@element-plus/icons-vue'
// import ImageUtils from '@/utils/ImageUtils'
import { ElMessageBox } from 'element-plus'
import Report from "@/pages/Report.vue";
import AnalysisService from "@/service/AnalysisService";

const urlInput = ref('')
const customColor = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#1989fa', percentage: 80 },
  { color: '#5cb87a', percentage: 100 },
]

// ============================ START Upload ============================
interface UploadFileData {
  name: string,
  progress: number,
  deleted: boolean,
  analysisNum: string
}
// 存储已经上传的文件信息
const uploadFileTableData = ref<UploadFileData[]>([])  // 需要显示在界面上的信息
const showUploadedFileTable = ref(false)
const fileList = ref<UploadUserFile[]>([])

watchEffect(() => {
  showUploadedFileTable.value = uploadFileTableData.value.length > 0;
});

const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  fileList.value = fileList.value.slice(-3);
}

/**
 * 上传 apk 成功处理逻辑
 * */
const handleUploadSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  // 上传成功时, 更新 uploadedFiles 数据列表
  const analysisNum = response.message
  uploadFileTableData.value.find((item) => item.name === uploadFile.name)!.progress = 101;
  uploadFileTableData.value.find((item) => item.name === uploadFile.name)!.analysisNum = analysisNum;
}

/**
 * 更新所有上传文件的进度条
 * */
const handleProgress = (evt: UploadProgressEvent, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  uploadFiles.forEach((file) => {
    uploadFileTableData.value.find((item) => item.name === file.name)!.progress = file.percentage ?? 0
  });
}

const handleBeforeUpload = (rawFile: UploadRawFile) => {
  if (uploadFileTableData.value.find((item) => item.name === rawFile.name) === undefined) {
    uploadFileTableData.value.push({
      name: rawFile.name,
      progress: 0,
      deleted : false,
      analysisNum: ""
    })
    return true;  // 返回 true 继续上传
  } else {
    return false;
  }
};

/**
 * apk 文件上传失败处理逻辑
 * */
const handleErrorUpload = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  ElMessageBox.alert(
      `${uploadFile.name} 上传失败, 失败原因: ${error}`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }
  ).then(() => {}).catch(() => {})
  uploadFileTableData.value = uploadFileTableData.value.filter((item) => item.name !== uploadFile.name);
}

/**
 * 处理二维码
 * */
const qrcodeUploadSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  // 上传成功时, 更新 uploadedFiles 数据列表
  const analysisNum = response.message
  uploadFileTableData.value.find((item) => item.name === uploadFile.name)!.progress = 101;
  uploadFileTableData.value.find((item) => item.name === uploadFile.name)!.analysisNum = analysisNum;

  // const qrCodeFile = uploadFile.raw;
  // if (qrCodeFile) {
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const image = new Image();
  //     if (typeof e.target.result === "string") {
  //       image.src = e.target.result;
  //     }
  //     image.onload = () => {
  //       const code = ImageUtils.decodeQRCode(image);
  //       console.log(code)
  //       urlInput.value = code;
  //       UploadURL(urlInput.value)
  //     };
  //   };
  //   reader.readAsDataURL(qrCodeFile);
  // }
}
// ============================ End Upload ============================

// ============================ START Analysis ============================
const analysisNum = ref('')
/**
 * 显示报告对话框
 * */
const ShowResultReport = (row: UploadFileData) => {
  analysisNum.value = row.analysisNum
}

/**
 * 删除选中的文件
 * */
const ItemDelete = (row: UploadFileData) =>{
  uploadFileTableData.value = uploadFileTableData.value.filter((item) => item.name !== row.name);
}

/**
 * 直接上传 url, 通过 url 请求分析
 * */
const UploadURL = (url: string) => {
  AnalysisService.uploadUrl(url)
      .then(response => {
        if (response.code === 2000) {
          uploadFileTableData.value.push({
            name: url,
            progress: 100,
            deleted : false,
            analysisNum: response.message
          })
        } else {
          ElMessageBox.confirm(
              `上传失败，原因：${response.message}`,
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }
          ).then(() => {}).catch(() => {})
        }
      })
      .catch(error => {
        ElMessageBox.confirm(
            `上传失败，原因：${error}`,
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }
        ).then(() => {}).catch(() => {})
      });
}
</script>

<style>
.UploadCard{
  width: 100%;
  justify-content: center;
  height: 450px;
  padding: 0
}

.UploadCard:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transform: translateX(-4px)translateY(-3px);
}

.title{
  font-weight: bolder;
  font-size: 20px;
}

.content{
  text-align: center;
  width: 100%;
  font-size: 15px;
  color:gray;
}

.TEXT{
  text-align: center;
  width: 100%;
  font-size: 40px;
  font-weight: 600;
}

.upload-container{
  width: 100%;
  height: 800px;
  text-align: center;
  display: flex;
  padding:0
}

.uploadBox{
  margin-top: 20px;
  width: 90%;
  height: 400px;
  margin-left: 5%;
}

.uploadBox2{
  margin-top: 20px;
  width: 80%;
  height: 300px;
  margin-left: 10%;
}

.el-upload-dragger{
  height: 300px;
  border-width: 3px;
  border-color: #725feb;
}

.report{
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  position:absolute;
  top:700px
}

strong{
  font-weight: bolder;
  font-size: 20px;
}
</style>
