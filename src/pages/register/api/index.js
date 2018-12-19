import { request, config } from "utils";

const prefix = config.API;
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
  saveInfo: prefix + 'enterprise/saveInfo',
  queryApplyRecord: prefix + 'enterprise/queryApplyRecord',
  queryWalletAuditResult: prefix + 'enterprise/queryWalletAuditResult', 
  queryAuditResult: prefix + 'enterprise/queryAuditResult',
  isRecommitEnterprise: prefix + 'enterprise/isRecommitEnterprise',
  getWalletInfoById: prefix + 'enterprise/getWalletInfoById',
  bindEnterpriseWallet: prefix + 'enterprise/bindEnterpriseWallet',
  reapply: prefix + 'enterprise/reapply', // 重新提交
  queryWalletRecord: prefix + 'enterprise/queryWalletRecord',
  queryEnterpriseShopList: prefix + 'enterprise/queryEnterpriseShopList', // 获取审核列表
  queryFrozenReason: prefix + 'admin/shop/queryFrozenReason', // 冻结原因
}

// 保存企业资料 type-0保存1提交
export const saveInfo = (params) => {
  const formData = formatParams(params)
  return request(URL.saveInfo, {
    method: 'POST',
    body: formData,
  })
}

// 重新提交
export const reapply = (params) => {
  const formData = formatParams(params);
  return request(URL.reapply, {
    method: 'POST',
    body: formData,
  })
}

// 获取企业资料
export const queryApplyRecord = (params) => {
  const query = '?' + formatGetParams(params);
  return request(URL.queryApplyRecord + query, {
    method: 'GET'
  })
}

// 获取钱包审核资料
export const queryWalletRecord = (params) => {
  const query = '?' + formatGetParams(params);
  return request(URL.queryWalletRecord + query, {
    method: 'GET'
  })
}

// 查询企业关联钱包审核结果及失败原因
// 0未审核 1待审核 2通過 3驳回 (auditStatus)
export const queryWalletAuditResult = (params) => {
  const query = '?' + formatGetParams(params);
  return request(URL.queryWalletAuditResult + query, {
    method: 'GET'
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
// 是否超过24小时
export const isRecommitEnterprise = (params) => {
  const query = '?' + formatGetParams(params);
  return request(URL.isRecommitEnterprise + query, {
    method: 'GET'
  })
}
// 搜索钱包
export const getWalletInfoById = (params) => {
  const query = '?' + formatGetParams(params);
  return request(URL.getWalletInfoById + query, {
    method: 'GET'
  })
}
// 绑定钱包
export const bindEnterpriseWallet = (params) => {
  const formData = formatParams(params);
  return request(URL.bindEnterpriseWallet, {
    method: 'POST',
    body: formData,
  })
}

// 审核列表
export const queryEnterpriseShopList = (params) => {
  const query = formatGetParams(params);
  return request(URL.queryEnterpriseShopList + '?' + query, {
    method: 'GET',
  })
}

// 冻结原因
export const queryFrozenReason = (params) => {
  const query = '?' + formatGetParams(params);
  return request(URL.queryFrozenReason + query, {
    method: 'GET',
  })
}
