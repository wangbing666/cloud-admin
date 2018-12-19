import { request, config } from 'utils';

const prefix = config.API;
const comPrefix = config.commonAPI;

const formatGetParams = (params) => {
  let query = ''
  Object.keys(params).forEach((key) => {
    query += `${key}=${params[key]}&`
  })
  return query
}

const URL = {
  queryEnterpriseShopList: prefix + 'enterprise/queryEnterpriseShopList', // 获取审核列表
  getCode: comPrefix + 'getCode', // 获取二维码
  checkIfScanQrCode: comPrefix + 'checkIfScanQrCode', // 监听是否扫码与扫码结果
}

// 审核列表
export const queryEnterpriseShopList = (params) => {
  const query = formatGetParams(params);
  return request(URL.queryEnterpriseShopList + '?' + query, {
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

// 监听是否扫码与扫码结果
export const checkIfScanQrCode = (params) => {
  return request(URL.checkIfScanQrCode, {
    method: 'POST',
    body: params,
  })
}
