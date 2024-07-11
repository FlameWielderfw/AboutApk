import axios from "axios";

/**
 * 获取分析结果，该接口采用轮询方式
 * */
const getResult = async (analysisNo) => {
  const formData = new FormData()
  formData.append('analysis_no', analysisNo)
  const res = await axios.post("/api/get_result", formData)
  try {
    return res.data;
  } catch (error) {
    return error;
  }
}

/**
 * 获取研判结果
 * */
const getJudgeResult = async (analysisNo) => {
  const formData = new FormData()
  formData.append('analysis_no', analysisNo)
  const res = await axios.post("/api/get_judge_result", formData)
  try {
    return res.data;
  } catch (error) {
    return error;
  }
}

/**
 * 获取截屏 uri
 * */
const getScreencaps = async (analysisNo: string) => {
  const formData = new FormData()
  formData.append('analysis_no', analysisNo)
  const res = await axios.post("/api/get_screencaps", formData)
  try {
    return res.data;
  } catch (error) {
    return error;
  }
}

/**
 * 上传 url
 * */
const uploadUrl = async (url: string) => {
  const formData = new FormData();
  formData.append('url', url)
  const res = await axios.post("/api/upload_url", formData)
  try {
    return res.data;
  } catch (error) {
    return error;
  }
}

const AnalysisService = {
  getResult: getResult,
  getJudgeResult: getJudgeResult,
  getScreencaps: getScreencaps,
  uploadUrl: uploadUrl
}

export default AnalysisService;
