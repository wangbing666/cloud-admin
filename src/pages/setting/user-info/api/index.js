import { request, config } from "utils";

const prefix = config.API;
const prefix_upl = config.UPL_API;
const comPrefix = config.commonAPI;

const formatParams = (params) => {
  let formData = '';
  Object.keys(params).forEach((key, index) => {
    if ((index+1) === Object.keys(params).length){
      formData += `${key}=${params[key]}`
    }else{
      formData += `${key}=${params[key]}&`
    }
  })  
  return formData;
}

const formatGetParams = (params) => {
  let query = ''
  Object.keys(params).forEach((key) => {
    query += `${key}=${params[key]}&`
  })
  return query
}

const URL = {
  queryAccountInfo: comPrefix + 'employee/findAdministrator', // 查询用户信息
  queryShopContact: prefix + 'enterprise/queryAccountInfo', // GET 查询店铺联系方式
  queryAuditPassCategory: prefix +  'enterprise/queryAuditPassCategory', // 查询经营类目
  updateShopContactType: prefix + 'admin/shop/updateShopContactType', // 修改联系方式
  queryApplyRecord: prefix + 'enterprise/queryApplyRecord', // 获取企业信息
  reapply: prefix + 'enterprise/reapply', // 提交审核企业资料
  queryAuditResult: prefix + 'enterprise/queryAuditResult',
  getCode: comPrefix + 'getCode', // 获取二维码
  getAdminAuditResult: comPrefix + 'employee/getAdminAuditResult', // 更换管理员审核结果
  changeSuperAdminSubmit: comPrefix + 'employee/changeSuperAdminSubmit', // 提交审核
  downloadWord: prefix + 'word/DownloadWord',
  checkIfScanQrCode: comPrefix + 'checkIfScanQrCode', // 监听是否扫码与扫码结果
  upload: prefix_upl + '/upload',
}

// 查询用户信息
export const queryAccountInfo = (params) => {
  return request(URL.queryAccountInfo, {
    method: 'POST',
    body: params,
  })
}

// 查询店铺联系方式
export const queryShopContact = (params) => {
  const query = '?' + formatGetParams(params);
  return request(URL.queryShopContact + query, {
    method: 'GET',
  })
}

// 获取企业资料
export const queryApplyRecord = (params) => {
  const query = '?' + formatGetParams(params);
  return request(URL.queryApplyRecord + query, {
    method: 'GET'
  })
}

// 查询经营类目
export const queryAuditPassCategory = (params) => {
  const query = '?' + formatGetParams(params);
  return request(URL.queryAuditPassCategory + query, {
    method: 'GET',
  })
}

// 修改联系方式
export const updateShopContactType = (params) => {
  const formData = formatParams(params);
  return request(URL.updateShopContactType, {
    method: 'POST',
    body: formData,
  })
}

// 企业资料提交
export const reapply = (params) => {
  const formData = formatParams(params);
  return request(URL.reapply, {
    method: 'POST',
    body: formData,
  })
}

// 查询资料审核结果和失败原因
// 1001       0 待审核
// 10120     1 已过期
// 685         2 通过
// 10255     3 驳回
// 19          4 撤销
export const queryAuditResult = (params) => {
  const query = '?' + formatGetParams(params);
  return request(URL.queryAuditResult + query, {
    method: 'GET'
  })  
}

// 获取二维码
export const getCode = (params) => {
  return request(URL.getCode, {
    method: 'POST',
    body: params,
  }) 
}

// 更换管理员 审核结果
export const getAdminAuditResult = (params) => {
  return request(URL.getAdminAuditResult, {
    method: 'POST',
    body: params,
  })
}

// 更换管理员提交申请
export const changeSuperAdminSubmit = (params) => {
  return request(URL.changeSuperAdminSubmit, {
    method: 'POST',
    body: params,
  })
}

// 获取下载模板链接
export const downloadWord = () => {
  return request(URL.downloadWord, {
    method: 'POST'
  })
}

// 监听是否扫码与扫码结果
export const checkIfScanQrCode = (params) => {
  return request(URL.checkIfScanQrCode, {
    method: 'POST',
    body: params,
  })
}

// 上传本地
export const upload = (params) => {
  return request(URL.upload, {
    method: 'POST',
    body: params,
  })
}
