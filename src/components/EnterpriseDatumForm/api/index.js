import { request, config } from "utils";

const prefix = config.API;

const URL = {
  getCategoryList: prefix + 'enterprise/getCategoryList', 
  getIndustryList: prefix + 'enterprise/getIndustryList',
  downloadWord: prefix + 'word/DownloadWord',
  addWord: prefix + 'word/AddWord',
  upload: '//192.168.9.81/upload',
}

// 获取经营类目
export const getCategoryList = () => {
  return request(URL.getCategoryList, {
    method: 'GET'
  })
}

 // 获取行业大类
export const getIndustryList = () => {
  return request(URL.getIndustryList, {
    method: 'GET'
  })
}

// 获取下载模板链接
export const downloadWord = () => {
  return request(URL.downloadWord, {
    method: 'POST'
  })
}

// 上传docx 
export const addWord = () => {
  return request(URL.addWord, {
    method: 'POST'
  })
}

// 上传本地
export const upload = (params) => {
  return request(URL.upload, {
    method: 'POST',
    body: params,
  })
}
