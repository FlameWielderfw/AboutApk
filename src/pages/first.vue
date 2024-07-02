<template>
  <el-container style="height:800px;width: 100%;position: absolute;left: 0;top: 0;">
    <el-header style="height:150px;width: 100%;margin-top: 50px">
      <el-row>
        <text class="TEXT" >在线APK分析器</text>
      </el-row>
      <el-row>
        <text  class="content">使用我们的在线APK分析器,您可以轻松分析和优化Android APK,快速识别出是否为违规软件。</text>
      </el-row>
    </el-header>
    <el-main class="upload-container">
      <el-container>
        <el-aside style="width: 50%;height: 450px;display: flex;justify-content: center;flex-direction: column;align-items: center;">
          <el-card shadow="hover" class="UploadCard">
            <el-text  class="title">多文件上传</el-text>
            <el-upload
                class="uploadBox"
                drag
                action="https://1bd345dd-1f51-4fb4-b640-7853dccf5a32.mock.pstmn.io/getapk"
                multiple
                :show-file-list= "false"
                v-model:file-list="fileList"
                :on-change="handleChange"
                :on-success="handleUploadSuccess"
                :on-progress="handleProgress"
                :before-upload="handleBeforeUpload"
                :on-error="handleErrorUpload"
                :accept="'.apk,.jpg,.jpeg,.png,'"
            >
              <div style="text-align: center;position: relative;top:60px">
                <el-button type="primary" color="#725feb" size="mini" style="width: 220px;height: 60px">
                  <el-icon size="20px"><Document /></el-icon>
                  <h style="font-size: 20px;font-weight: 600">选择文件</h></el-button>
              </div>
              <div style="text-align: center;position: relative;top:80px">
                <h style="color: gray">请将您的apk文件拖到这里</h>
              </div>
            </el-upload>
          </el-card>

        </el-aside>
        <el-main style="height: 450px;display: flex;justify-content: center;flex-direction: column;align-items: center;padding: 0">
          <el-card shadow="hover" class="UploadCard">
          <el-text class="title" >单文件上传</el-text>
          <el-upload
              class="uploadBox2"
              drag
              action="https://1bd345dd-1f51-4fb4-b640-7853dccf5a32.mock.pstmn.io/getapk"
              multiple
              :show-file-list= "false"
              :on-change="handleChange"
              :on-error="handleErrorUpload"
              :on-success="qrcodeUpload"
              :limit = 1
              :accept="'.jpg,.jpeg,.png,'"
          >
            <div style="text-align: center;position: relative;top:60px">
              <el-button type="primary" color="#725feb" size="mini" style="width: 180px;height: 50px">
                <el-icon size="20px"><Document /></el-icon>
                <h style="font-size: 16px;font-weight: 550">选择二维码</h></el-button>
            </div>
            <div style="text-align: center;position: relative;top:80px">
              <h style="color: gray">请将您的二维码拖到这里</h>
            </div>
          </el-upload>
          <el-row style="justify-content: center;top:20px;height: 100px;width: 100%" >
            <el-input  v-model="input" style="width: 65%;height: 40px;margin-right: 20px;" placeholder="Please enter the URL" />
            <el-button style="position:relative;top:5px"  type="primary" color="#725feb" @click="UploadURL">上传</el-button>
          </el-row>
          </el-card>
        </el-main>
      </el-container>

      <div class="report" v-show="isShow">
        <el-table :data="tableData" style="width: 80%">
          <el-table-column prop="name" label="apk名字" width="240" />
          <el-table-column prop="progress" label="上传进度" >
            <template #default="scope">
              <el-progress
                  v-if="progressShow(scope.row)"
                  :color="customColor"
                  :stroke-width="7"
                  :percentage="scope.row.progress">
              </el-progress>
              <el-icon v-if="!progressShow(scope.row)" color="green" size="17px" style="position : relative; bottom : -2px"><circleCheck/></el-icon>
              <el-text v-if="!progressShow(scope.row)">上传成功</el-text>
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作">
            <template #default="scope">
              <el-button type="primary" @click="Submit(scope.row)" :disabled="scope.row.submit" color="#725feb">提交检查</el-button>
              <el-button type="danger" @click="ItemDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>

  </el-container>
  <el-dialog
      v-model="dialogVisible"
      title="检测报告"
      width="1000"
      height="80vh"
      :before-close="handleClose"
  >
    <span style="margin-left: 20px">上传进度</span>
    <el-progress
        v-if ="ProgressShow"
        :color="customColor"
        :stroke-width="7"
        :percentage="UploadProgress"
        style="margin-bottom: 20px;margin-right: 40px;margin-top: 15px">
    </el-progress>
    <el-row style="height: 50px;align-content: center;margin-left: 20px">
      <el-icon v-if="!ProgressShow" color="green" size="17px" style="position : relative; bottom : -2px"><circleCheck/></el-icon>
      <el-text v-if="!ProgressShow">上传成功</el-text>
    </el-row>
    <div id="Result" class="result-body">
      <section v-loading="true" v-show="staticLoading"
               style="height: 200px;justify-content: center;text-align: center"
               element-loading-text="静态分析中，请耐心等待.....">
      </section>
      <section v-show="!staticLoading">
        <div class="container-fluid">
          <div class="row">
            <div class="row-body">
              <el-card class="card">
                <div style="display: flex;flex-direction: row;">
                  <div style="width: 25%">
                    <strong>基本信息</strong>
                  </div>
                  <div style="width: 40%">
                    <strong>FILE INFORMATION</strong>
                    <br>
                    <span class="badge">File Name</span>
                    {{APK.file_name}}
                    <br>
                    <span class="badge">Size</span>
                    {{APK.size}}MB
                    <br>
                    <span class="badge">md5</span>
                    {{v1SignatureInfo.md5.replaceAll(" ","")}}
                    <br>
                    <span class="badge">sha1</span>
                    {{v1SignatureInfo.sha1.replaceAll(" ","")}}
                    <br>
                    <span class="badge">sha256</span>
                    {{v1SignatureInfo.sha256.replaceAll(" ","")}}
                  </div>
                  <div>
                    <strong>APP INFORMATION</strong>
                    <br>
                    <span class="badge">App Name</span>
                    {{APK.app_name}}
                    <br>
                    <span class="badge">Package Name</span>
                    {{APK.package_name}}
                    <br>
                    <span class="badge">Target SDK</span>
                    {{VersionInfo.TargetSDKVersion}}
                    <span class="badge">Min SDK</span>
                    {{VersionInfo.minSDKVersion}}
                    <span class="badge">Compile SDK</span>
                    {{VersionInfo.CompileSDKVersion}}
                  </div>
                </div>
              </el-card>
            </div>
            <div class="row-body">
              <el-card class="card" >
                <strong>Application Permissions</strong>
                <el-table :data="permissionData"  border style="width: 100%;margin-top: 5px">
                  <el-table-column prop="permissions" sortable label="Permission" width="200"/>
                  <el-table-column prop="status" label="STATUS" width="150">
                    <template #default="scope" >
                      <span class="status" :style="{backgroundColor:GetColor(scope.row.status)}">{{scope.row.status}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="info" label="INFO" width="200"/>
                  <el-table-column prop="description" label="DESCRIPTION"/>
                </el-table>
              </el-card>
            </div>
            <div class="row-body" v-show="v2SignatureShow">
              <el-card class="card">
                <div style="width: 100%;display: flex;flex-direction: row">
                  <div style="width: 50%;" >
                    <strong>v2SignatureInfo</strong>
                    <br>
                    <span class="badge">md5</span>
                    {{v2SignatureInfo.md5.replaceAll(" ","")}}
                    <br>
                    <span class="badge">sha1</span>
                    {{v2SignatureInfo.sha1.replaceAll(" ","")}}
                    <br>
                    <span class="badge">sha256</span>
                    {{v2SignatureInfo.sha256.replaceAll(" ","")}}
                  </div>
                  <div style="width: 50%;" v-show="v3SignatureShow">
                    <strong>v3SignatureInfo</strong>
                    <br>
                    <span class="badge">md5</span>
                    {{v3SignatureInfo.md5.replaceAll(" ","")}}
                    <br>
                    <span class="badge">sha1</span>
                    {{v3SignatureInfo.sha1.replaceAll(" ","")}}
                    <br>
                    <span class="badge">sha256</span>
                    {{v3SignatureInfo.sha256.replaceAll(" ","")}}
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </section>
      <section v-loading="true" v-show="staticLoading!==dynamicLoading"
               style="height: 200px;text-align: center;justify-content: center;"
               element-loading-text="动态分析中，请耐心等待.....">
      </section>
      <section v-show="!dynamicLoading">
        <div class="container-fluid">
          <div class="row">
            <div class="row-body">
              <el-card class="card">
                <strong>URLS</strong>
                <el-table border :data="urls">
                  <el-table-column prop="url" label="URL"/>
                </el-table>
              </el-card>
            </div>
            <div class="row-body">
              <el-card class="card">
                <strong>SDKS</strong>
                <el-table border :data="sdks">
                  <el-table-column prop="sdk" label="SDK"/>
                </el-table>
              </el-card>
            </div>
            <div class="row-body">
              <el-card class="card">
                <strong>Result</strong>
                {{result}}
              </el-card>
            </div>
          </div>
        </div>
      </section>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="CancelUpload">Cancel</el-button>
        <el-button type="primary" @click="ProofPDF">
          导出为pdf
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>
<script lang="ts" setup>
import {computed, onMounted, ref, watchEffect} from 'vue'
import type {
  UploadFile,
  UploadFiles,
  UploadProgressEvent,
  UploadProps,
  UploadRawFile,
  UploadUserFile
} from 'element-plus'
import {CircleCheck, Document, Upload} from '@element-plus/icons-vue'
import axios from "axios";
import jsQR from 'jsqr'

let analysisNum = ref()
const BaseUrl = 'http://127.0.0.1:8080'
let cancelFileUpload
let isShow = ref(false)
const qrcodeData = ref('无结果')
const UploadProgress = ref(0);
const input = ref('')
const isTimerRunning = ref(false)
const intervalId = ref<number | null>(null)
const UploadFiles = ref([])
const customColor = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#1989fa', percentage: 80 },
  { color: '#5cb87a', percentage: 100 },
]
const tableData = ref([])



const fileList = ref<UploadUserFile[]>([])
const UploadURL = ()=>{
  RequestByURL(input.value)
}
const progressShow = (row) =>{
  return row.progress < 100;

}
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {

  fileList.value = fileList.value.slice(-3);
}

const handleProgress = (evt: UploadProgressEvent, uploadFile: UploadFile, uploadFiles: UploadFiles)=>{
  uploadFiles.forEach((file, index) => {
    tableData.value.find((item) => item.name === file.name).progress = file.percentage
  });
}

const handleBeforeUpload = (rawFile: UploadRawFile) => {
  console.log('即将上传')
  tableData.value.push({
    name:rawFile.name,
    progress: 0,
    deleted : false,
    submit : true
  })
  return true; // 返回 true 继续上传
};
const handleUploadSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  // 上传成功时,更新 uploadedFiles 数据列表
  console.log(uploadFile.name+"上传成功");
  UploadFiles.value.push(uploadFile.raw);
  tableData.value.find((item) => item.name === uploadFile.name).progress = 101;
  tableData.value.find((item) => item.name === uploadFile.name).submit = false;
}
const handleErrorUpload = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  alert(uploadFile.name + "上传失败！")
  tableData.value = tableData.value.filter((item) => item.name !== uploadFile.name);
}
const ItemDelete = (row) =>{
  tableData.value = tableData.value.filter((item) => item.name !== row.name);
}
//请求动态分析结果
const RequestForReport=()=>{
  const formData = new FormData();
  formData.append('analysis_no',analysisNum.value)
  axios({
    method: 'POST',
    url: BaseUrl+'/api/get_analysis_result',
    data:formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  })
      .then(response => {
        if(response.data.staticStatus == "success"){
          console.log('静态分析完成！')
          GetStaticData(response.data.message)
          staticLoading.value = false
        }
        if(response.data.dynamicStatus == "success"){
          console.log('动态分析完成！');
          let Data = response.data.message
          urls.value = Data.urls
          sdks.value = Data.sdks
          if(Data.isBad)
            result.value = "鉴定为很黄很暴力"
          else
            result.value = "莫得问题"
          dynamicLoading.value = false
        }
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
}
//定时发送请求
function startTimer() {
  if (!isTimerRunning.value) {
    isTimerRunning.value = true
    intervalId.value = setInterval(() => {
      RequestForReport()
    }, 5000) // 每 5 秒钟发送一次请求
  }
}

function stopTimer() {
  if (intervalId.value) {
    clearInterval(intervalId.value)
    intervalId.value = null
    isTimerRunning.value = false
  }
}

const Submit = (row) => {
  dialogVisible.value = true
  const formData = new FormData();
  console.log(UploadFiles.value.find((item)=> item.name === row.name))
  formData.append('file', UploadFiles.value.find((item)=> item.name === row.name));
  cancelFileUpload = axios.CancelToken.source()
  axios({
    method: 'POST',
    url: BaseUrl+'/api/upload_apk',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    cancelToken: cancelFileUpload.token,
    onUploadProgress: (progressEvent) => {
      UploadProgress.value = Math.round((progressEvent.loaded / progressEvent.total) * 100)
      console.log(UploadProgress.value)
    }
  })
      .then(response => {
        console.log('上传apk成功!');
        ProgressShow.value = false
        analysisNum.value = response.data.message.analysis_no
        startTimer()
        //tableData.value = tableData.value.filter((item) => item.name !== row.name);
        //UploadFiles.value = UploadFiles.value.filter((item) => item.name !== row.name);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        alert(error)
      });
}
function GetStaticData(Data){
  APK.value.package_name=Data.packageName
  APK.value.app_name = Data.name
  APK.value.size = Data.size/1024
  APK.value.file_name = Data.absolutePath.split('\\').pop()
  VersionInfo.value.minSDKVersion = Data.versionInfo.minSdkVersion
  VersionInfo.value.TargetSDKVersion = Data.versionInfo.targetSdkVersion
  VersionInfo.value.CompileSDKVersion = Data.versionInfo.compileSdkVersion
  v1SignatureInfo.value.md5 = Data.v1SignatureInfo.certification.md5
  v1SignatureInfo.value.sha1 = Data.v1SignatureInfo.certification.sha1
  v1SignatureInfo.value.sha256 = Data.v1SignatureInfo.certification.sha256
  v2SignatureInfo.value.md5 = Data.v2SignatureInfo.certification.md5
  v2SignatureInfo.value.sha1 = Data.v2SignatureInfo.certification.sha1
  v2SignatureInfo.value.sha256 = Data.v2SignatureInfo.certification.sha256
  v3SignatureInfo.value.md5 = Data.v3SignatureInfo.certification.md5
  v3SignatureInfo.value.sha1 = Data.v3SignatureInfo.certification.sha1
  v3SignatureInfo.value.sha256 = Data.v3SignatureInfo.certification.sha256
  permissionData.value = Data.permissions
}
//二维码解析
const decodeQRCode=(image)=> {
  //创建画布
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  //把二维码画上去
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const decodedResult = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'dontInvert',
  });
  if (decodedResult) {
    //返回识别结果
    return decodedResult.data
  } else {
    window.alert('未识别到二维码!')
    return ''
  }
}
const RequestByURL = (text)=>{
  const formData = new FormData();
  formData.append('url',text)
  axios({
    method: 'POST',
    url: BaseUrl+'/api/upload_url',
    data:formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  })
      .then(response => {
        console.log('File uploaded successfully!');
        dialogVisible.value = true
        analysisNum.value = response.data.message.analysis_no
        startTimer()
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        alert('上传失败！')
      });
}
const qrcodeUpload = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles)=>{
  const file = uploadFile.raw;
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      if (typeof e.target.result === "string") {
        image.src = e.target.result;
      }
      image.onload = () => {
        let code = decodeQRCode(image);
        console.log(code)//识别结果
        qrcodeData.value = code;
        RequestByURL(qrcodeData.value)
      };
    };
    reader.readAsDataURL(file);
  }
}

//以下为对话框部分：
import { ElMessageBox } from 'element-plus'
import { downloadPDF }   from './printPDF'

let v2SignatureShow = ref(true)
let v3SignatureShow = ref(false)
const dialogVisible = ref(false)
let ProgressShow = ref(true)
let staticLoading = ref(false)
let dynamicLoading = ref(false)
let APK = ref({
  file_name:'1ace25ed992a997d43362ed4f0665e95.apk',
  app_name:'金鼎娱乐城',
  size:520.1314,
  package_name:'com.cashwebappjinDingYLC',
})
let VersionInfo = ref({
  minSDKVersion: 14,
  TargetSDKVersion: 28,
  CompileSDKVersion: 28
})
let v1SignatureInfo = ref({
  md5:'66 BE DA 48 2C 14 5C 9B B6 FE A4 83 83 8C 1A E0',
  sha1:'DE 57 DA 7A AC 68 9B E3 47 83 FA A0 10 9D 8C 9B 51 8D 83 74',
  sha256:'63 AA 36 63 A1 EF DD 49 80 78 41 85 C1 E7 38 15 95 64 CB FF E3 EC 05 0C FC 46 90 AE 4B CB 52 BB'
})
let v2SignatureInfo = ref({
  md5:'',
  sha1:'',
  sha256:''
})
let v3SignatureInfo = ref({
  md5:'',
  sha1:'',
  sha256:''
})
const permissionData = ref([
  {
    permissions:"android.permission.INTERNET",
    status:'normal',
    info:'send SMS messages',
    description:'Allows application to send SMS messages. Malicious applications may cost you money by sending messages without your confirmation'
  },
  {
    permissions: "android.permission.ACCESS_NETWORK_STATE",
    status:'dangerous',
    info:'send SMS messages',
    description:'Allows application to send SMS messages. Malicious applications may cost you money by sending messages without your confirmation'
  },
  {
    permissions:"android.permission.WRITE_EXTERNAL_STORAGE",
    status:'signatureOrSystem',
    info:'send SMS messages',
    description:'Allows application to send SMS messages. Malicious applications may cost you money by sending messages without your confirmation'
  },
  {
    permissions:"android.permission.INTERNET",
    status:'normal',
    info:'send SMS messages',
    description:'Allows application to send SMS messages. Malicious applications may cost you money by sending messages without your confirmation'
  },
])
let urls = ref([
  {url:"http://47.108.138.165:8081/fingByKey/CirjDDDK",},
  {url:"https://aa.41yd.bet"}
])
let sdks = ref([
  {sdk:"com.bet8df.cloudtopapp.MainActivity"},
  {sdk:"android.content.ContentResolver"},
  {sdk:"android.app.NotificationChannel"},
  {sdk:"android.content.AsyncQueryHandler"},
  {sdk:"java.lang.Class"},
  {sdk:"com.bet8df.cloudtopapp.jpush.PushService"},
])
let result = ref()
const GetColor = (status)=>{
  let color = '#'
  if(status == 'normal')
    color = '#17a2b8'
  if(status == 'dangerous')
    color = '#dc3545'
  if(status == 'signatureOrSystem')
    color = '#ffc107'
  return color
}
//重置报告中的值
function ClearALl(){
  staticLoading.value = true;
  dynamicLoading.value = true;
  APK.value = {
    file_name:'',
    app_name:'',
    size:0,
    package_name:'',
  }
  v2SignatureInfo.value = {
    md5:'',
    sha1:'',
    sha256:''
  }
  permissionData.value = []
  sdks.value = []
  urls.value = []
}
const CancelUpload = ()=>{
  cancelFileUpload.cancel()
  ClearALl()
  stopTimer()
  dialogVisible.value = false
  UploadProgress.value = 0
}
const handleClose = (done: () => void) => {
  const text = 'apk尚未解析完毕，确认离开？'
  ElMessageBox.confirm(text)
      .then(() => {
        CancelUpload()
      })
      .catch(() => {
        // catch error
      })
}
const ProofPDF=()=>{
  // let newstr = document.getElementById("Result").innerHTML;
  // let oldstr = document.body.innerHTML;
  // document.body.innerHTML = newstr;
  // window.print();
  // document.body.innerHTML = oldstr;
  downloadPDF(document.getElementById("Result"),"检测报告")
  CancelUpload();
}
//监测某些值的变化
watchEffect(() => {
  isShow.value = tableData.value.length > 0;
  v2SignatureShow.value = v2SignatureInfo.value.md5 != '';
  v3SignatureShow.value = v3SignatureInfo.value.md5 != '';

});
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
/*对话框部分*/
.result-body{
  width: 100%;
  min-height: 200px;
  background: #f4f6f9;
}
.container-fluid{
  width: 100%;
  padding-right: 7px;
  padding-left: 7px;
  margin-right: auto;
  margin-left: auto;
}
.row{
  display: flex;
  flex-wrap: wrap;
  margin-right: -7.5px;
  margin-left: -7.5px;
}
.row-body{
  position: relative;
  width: 100%;
  padding-right: 7px;
  padding-left: 7px;
  margin-top: 10px;
}
.card {
  position: relative;
  top: 6px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 0 solid rgba(0, 0, 0, .125);
  border-radius: .25rem;
}
.badge{
  display: inline-block;
  padding: .25em .4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: .25rem;
  background-color: #007bff;
  color: white;
  transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}
.status{
  display: inline-block;
  padding: .25em .4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: .25rem;
  color: white;
  transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}
strong{
  font-weight: bolder;

}
</style>
