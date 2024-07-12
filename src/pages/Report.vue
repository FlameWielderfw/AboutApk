<template>
  <el-dialog
      v-model="dialogVisible"
      title="APP 检测报告"
      width="1000"
      height="80vh"
      style="border-radius: 8px"
      :before-close="HandleDialogClose"
  >
    <div id="Result" class="result-body">
      <!--      静态分析加载界面-->
      <section v-loading="true" v-show="staticLoading"
               style="height: 200px;justify-content: center;text-align: center"
               element-loading-text="静态分析中，请耐心等待.....">
      </section>
      <section v-show="!staticLoading">
        <div class="container-fluid">
          <div class="row">
            <div class="row-body">
              <el-card class="card">
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 18%; display: flex; flex-direction: column;">
                    <strong>图标</strong>
                    <el-image
                        style="width: 60%; margin-top: 5px"
                        :src="iconImage"
                        fit="cover"
                    >
                    </el-image>
                  </div>
                  <div style="width: 45%">
                    <strong>文件基本信息</strong>
                    <br>
                    <span class="badge">文件名</span>
                    {{APK.file_name}}
                    <br>
                    <span class="badge">大小</span>
                    {{APK.size}}MB
                    <br>
                    <span class="badge">md5</span>
                    {{signatureInfo.md5.replaceAll(" ","")}}
                    <br>
                    <span class="badge">sha1</span>
                    {{signatureInfo.sha1.replaceAll(" ","")}}
                    <br>
                    <span class="badge">sha256</span>
                    {{signatureInfo.sha256.replaceAll(" ","")}}
                  </div>
                  <div>
                    <strong>应用基本信息</strong>
                    <br>
                    <span class="badge">应用名称</span>
                    {{APK.app_name}}
                    <br>
                    <span class="badge">包名</span>
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
                <strong>应用权限清单</strong>
                <el-table :data="permissionData"  border style="width: 100%; margin-top: 5px">
                  <el-table-column prop="permissions" sortable label="权限名称" width="200"/>
                  <el-table-column prop="status" label="危险级别" width="150">
                    <template #default="scope" >
                      <span class="status" :style="{backgroundColor:GetColorByStatus(scope.row.status)}">{{scope.row.status}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="info" label="功能" width="200"/>
                  <el-table-column prop="description" label="描述"/>
                </el-table>
              </el-card>
            </div>
            <div class="row-body">
              <el-card class="card">
                <div style="width: 100%;display: flex;flex-direction: row">
                  <div style="width: 80%;" >
                    <strong>签名信息</strong>
                    <br>
                    <span class="badge">subject</span>
                    {{signatureInfo.subject}}
                    <br>
                    <span class="badge">md5</span>
                    {{signatureInfo.md5}}
                    <br>
                    <span class="badge">sha1</span>
                    {{signatureInfo.sha1}}
                    <br>
                    <span class="badge">sha256</span>
                    {{signatureInfo.sha256}}
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </section>

      <!--      动态分析加载界面 -->
      <section v-loading="true" v-show="staticLoading !== dynamicLoading"
               style="height: 200px; text-align: center; justify-content: center;"
               element-loading-text="动态分析中，请耐心等待.....">
      </section>
      <section v-show="!dynamicLoading">
        <div class="container-fluid">
          <div class="row">
            <div class="row-body">
              <el-card class="card">
                <strong>通联地址</strong>
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
                <strong>App内文本</strong>
                <br>
                {{screenContent}}
              </el-card>
            </div>
          </div>
        </div>
      </section>

      <!--      研判加载界面 -->
      <section v-loading="true" v-show="judgeLoading === true && staticLoading === false && dynamicLoading == false"
               style="height: 200px; text-align: center; justify-content: center;"
               element-loading-text="研判中，请耐心等待.....">
      </section>
      <section v-show="!judgeLoading">
        <div class="row">
          <div class="row-body">
            <el-card class="card">
              <strong>研判结果（仅供参考）</strong><br>
              <div v-for="item in resultData">
                该应用可能涉及 {{item.val}}<br><br>
                <strong>判断理由</strong><br>
                <el-text v-for="reason in item.reason.split('\n')">
                  {{reason}}<br>
                </el-text>
              </div><br>
              <strong>应用图像</strong><br>
              <div class="image-grid">
                <div v-for="(imageUrl, index) in imageUrls" :key="index" class="image-container">
                  <img :src="imageUrl" alt="Image" class="image">
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </section>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="CloseDialog">关闭</el-button>
        <el-button type="primary" color="#725feb" @click="ProofPDF">
          导出为 .pdf
        </el-button>
        <el-button type="primary" color="#725feb" @click="ProofWord">
          导出为 .docx
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue'
import { ElMessageBox } from 'element-plus'
import DVM_PERMISSIONS from '@/data/dvm_permission';
import OutputUtils from '@/utils/OutputUtils'
import UrlUtils from '@/utils/UrlUtils'
import AnalysisService from '@/service/AnalysisService'

const props = defineProps<{
  analysisNo: string;
}>();

/**
 * 若 props 发生变化，则显示对话框报告并开启 Timer
 * */
watch(props, () => {
  dialogVisible.value = true
  StartTimer()
})

const dialogVisible = ref(false)  // 控制本组件的显示
const staticLoading = ref(true)
const dynamicLoading = ref(true)
const judgeLoading = ref(true)

// 定时器轮询
const intervalId = ref<number>(-1)
const isTimerRunning = ref(false)

// apk 基本信息
const APK = ref({
  file_name: '',
  app_name: '',
  size: 0,
  package_name: '',
})

const VersionInfo = ref({
  minSDKVersion: 0,
  TargetSDKVersion: 0,
  CompileSDKVersion: 0
})

const signatureInfo = ref({
  subject:'',
  md5:'',
  sha1:'',
  sha256:''
})

const iconImage = ref('')  // icon 图片的 base64 字符串
const imageUrls = ref([])  // app 图像的地址

// 权限信息
const permissionData = ref([
  {
    permissions:"",
    status:'',
    info:'',
    description:''
  },
]);

// app 内部文本
const screenContent = ref('')

// ？
let resultData = ref([]);

// 通联地址
interface UrlData {
  url: string;
}
const urls = ref<UrlData[]>([]);

// SDK
interface SdkData {
  sdk: string;
}
const sdks = ref<SdkData[]>([]);

/**
 * 点击空白区域让 Dialog 关闭的回调函数
 * */
const HandleDialogClose = () => {
  ElMessageBox.confirm(
      'APK 未解析完毕，是否确认离开？',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }
  )
      .then(() => { CloseDialog() })
      .catch(() => {})
}

// 根据不同状态获得颜色
const GetColorByStatus = (status: string)=>{
  let color = ''
  if (status === '正常')
    color = '#17a2b8'
  else if (status === '危险')
    color = '#dc3545'
  else if (status === 'signatureOrSystem')
    color = '#ffc107'
  else
    color = '#a775ff'
  return color
}

const CloseDialog = () => {
  dialogVisible.value = false
  ClearReportValue()
  StopTimer()
}

const ProofPDF = () => {
  OutputUtils.downloadPDF(document.getElementById("Result"), "检测报告")
}

const ProofWord = () => {
  OutputUtils.downloadWord({
    name: "title"
  })
}

// 重置报告中的值
const ClearReportValue = () => {
  staticLoading.value = true;
  dynamicLoading.value = true;
  judgeLoading.value = true;
  APK.value = {
    file_name:'',
    app_name:'',
    size:0,
    package_name:'',
  }
  signatureInfo.value = {
    subject: "",
    md5: "",
    sha1: "",
    sha256: ""
  }
  permissionData.value = []
  sdks.value = []
  urls.value = []
  resultData.value = []
  imageUrls.value = []
  iconImage.value = ""
  screenContent.value = ""
}

// 定时发送获取分析结果请求
const StartTimer = () => {
  RequestForReport()
  if (!isTimerRunning.value) {
    isTimerRunning.value = true
    intervalId.value = setInterval(() => {
      RequestForReport()
    }, 5000)  // 每 5 秒钟发送一次请求
  }
}

const StopTimer = () => {
  if (isTimerRunning.value === true) {
    if (intervalId.value !== -1) {
      clearInterval(intervalId.value)
      intervalId.value = null
      isTimerRunning.value = false
    }
  }
}

/**
 * 为分析结果赋值
 * */
function GetStaticData(Data){
  APK.value.package_name = Data.packageName
  APK.value.app_name = Data.name
  APK.value.size = Data.size/1024
  APK.value.file_name = Data.absolutePath.split('\\').pop()
  VersionInfo.value.minSDKVersion = Data.versionInfo.minSdkVersion
  VersionInfo.value.TargetSDKVersion = Data.versionInfo.targetSdkVersion
  VersionInfo.value.CompileSDKVersion = Data.versionInfo.compileSdkVersion

  const updateSignatureInfo = (certification) => {
    signatureInfo.value.subject = certification.subject
    signatureInfo.value.md5 = certification.md5
    signatureInfo.value.sha1 = certification.sha1
    signatureInfo.value.sha256 = certification.sha256
  }
  if (Data.v1SignatureInfo.certification.subject !== "") {
    updateSignatureInfo(Data.v1SignatureInfo.certification)
  } else if (Data.v2SignatureInfo.certification.subject !== "") {
    updateSignatureInfo(Data.v2SignatureInfo.certification)
  } else if (Data.v3SignatureInfo.certification.subject === "") {
    updateSignatureInfo(Data.v3SignatureInfo.certification)
  }

  iconImage.value = "data:image/png;base64," + Data.icon

  permissionData.value = Data.permissions.map(permission => {
    const package_list = permission.split(".");
    const permission_name = package_list[package_list.length - 1];
    const permission_info = DVM_PERMISSIONS[permission_name] === undefined ? ['未知', '未知', '未知'] : DVM_PERMISSIONS[permission_name]
    return {
      permissions: permission_name,
      status: permission_info[0],
      info: permission_info[1],
      description: permission_info[2]
    };
  });

  urls.value = Data.urls.map((item) => {
    return {["url"]: item};
  });

  sdks.value = Data.sdks.map((item) => {
    return {["sdk"]: item};
  });
}

// 获取图片
const GetScreencaps = () => {
  AnalysisService.getScreencaps(props.analysisNo)
      .then(response => {
        console.log('获取图片成功!');
        response.message.forEach(uri => {
          imageUrls.value.push(UrlUtils.staticImageUrl(uri));
        });
      })
      .catch(error => {
        console.error('获取图片失败！');
        ElMessageBox.confirm(
            error,
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }
        ).then(() => {}).catch(() => {})
      });
}

// 请求分析结果
const RequestForReport = () => {
  AnalysisService.getResult(props.analysisNo)
      .then(response => {
        const staticStatus = response.staticStatus
        const dynamicStatus = response.dynamicStatus
        const judgeStatus = response.judgeStatus
        if (staticStatus === "Success") {
          console.log('静态分析完成！')
          GetStaticData(response.message)
          staticLoading.value = false
        }
        if (dynamicStatus === "Success") {
          console.log('动态分析完成！');
          const Data = response.message
          urls.value = Data.urls.map((item: string) => {
            return {["url"]: item};
          });
          screenContent.value = Data.screenContent
          dynamicLoading.value = false
        } else if (dynamicStatus !== "Analysing") {
          console.log(`动态分析失败，失败原因${dynamicStatus}`)
          dynamicLoading.value = false
        }
        if (judgeStatus === "Success") {
          GetJudgeResult()
          GetScreencaps()
          judgeLoading.value = false
          StopTimer()
        } else if (judgeStatus !== "Judging") {
          console.log(`研判失败，失败原因 ${judgeStatus}`)
          StopTimer()
        }
      })
      .catch(error => {
        console.error('/api/get_result 发生错误:', error);
      });
}

// 获取判断结果
const GetJudgeResult = () => {
  AnalysisService.getJudgeResult(props.analysisNo)
      .then(response => {
        console.log('获取研判结果成功!');
        const code = response.code
        const message = response.message
        if (code === 2000) {
          message.forEach((item)=>{
            let parts = item.split('\n');
            const result = {
              val: parts[0],
              reason: parts.slice(1).join('\n')
            }
            resultData.value.push(result);
          })
        }
      })
      .catch(error => {
        console.error('获取结果失败！');
        ElMessageBox.confirm(
            error,
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }
        ).then(() => {}).catch(() => {})
      });
}
</script>

<style>
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
  font-size: 20px;
}
.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 500px;
  grid-gap: 20px;
}

.image-container {
  position: relative;
  width: 100%;
  height: auto;
  padding-bottom: 60%; /* 1280 / 768 = 1.6667, 75% = 1.5 */
}

.image {
  position: absolute;
  width: 100%;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

