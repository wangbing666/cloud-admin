import { request, config } from 'utils';

const { API } = config;

const PATH = {
  OrderDetail: 'admin/afterSale/getAfterSaleDetail', //查询售后详情
  finishedConfirmRefund: 'admin/afterSale/finishedConfirmRefund',// 退款审核 status > 18
  ConfirmRefund: 'admin/afterSale/ConfirmRefund', // 退款审核 status < 18
  ConfirmReceipt: 'admin/afterSale/ConfirmReceipt', // 确认收货 status < 18 
  finishedConfirmReceipt: 'admin/afterSale/finishedConfirmReceipt', // 确认收货 status > 18
  finishedReFundUserMoney: 'admin/afterSale/finishedReFundUserMoney', // 退款失败重试
  RefundSuccessInfo: 'admin/afterSale/getRefundSuccessInfo', // 查询退款成功的交易信息
  IsLogistics: 'admin/afterSale/queryAfterSaleDetail', // 是否显示查看物流按钮
  queryLogistics: 'transportInfo/getAftersaleTransportInfo', // 查询物流信息
  queryTransProgress: 'transportInfo/getTransportInfoByKuaidi100', // 查看物流进度
  returnMoney: 'admin/afterSale/reFundUserMoney', // 退款到钱包
}

// 查询售后订单详情
export async function getAfterSaleDetail(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.OrderDetail}`, {
    method: 'POST',
    body: queryParams,
  })
}

// 确认收货 status > 18
export async function getFinishedConfirmReceipt(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.finishedConfirmReceipt}`, {
    method: 'POST',
    body: queryParams,
  })
}

// 确认收货 status < 18
export async function getConfirmReceipt(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.ConfirmReceipt}`, {
    method: 'POST',
    body: queryParams,
  })
}

// 退款审核 status < 18
export async function getConfirmRefund(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.ConfirmRefund}`, {
    method: 'POST',
    body: queryParams,
  })
}

// 退款审核 status > 18
export async function getFinishedConfirmRefund(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.finishedConfirmRefund}`, {
    method: 'POST',
    body: queryParams,
  })
}

// 退款到钱包 status < 18
export async function getReturnMoney(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.returnMoney}`, {
    method: 'POST',
    body: queryParams
  })
}

// 退款失败重试 status > 18
export async function getRetry(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.finishedReFundUserMoney}`, {
    method: 'POST',
    body: queryParams
  })
}

// 查询退款成功的交易信息
export async function getRefundSuccessInfo(params) {
  return request(`${API}${PATH.RefundSuccessInfo}?afterSaleId=${params}`)
}

// 是否显示查看物流按钮
export async function getIsLogistics(params) {
  return request(`${API}${PATH.IsLogistics}?orderId=${params}`)
}

// 查询物流信息
export async function getQueryLogistics(id) {
  return request(`${API}${PATH.queryLogistics}`, {
    method: 'POST',
    body: `orderId=${id}`,
  })
}

// 查询物流进度
export async function getQueryTransProgress(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.queryTransProgress}`, {
    method: 'POST',
    body: queryParams,
  })
}