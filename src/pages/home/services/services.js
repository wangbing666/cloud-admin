import { request, config } from 'utils';

const { API } = config;

const PATH = {
  querySalesAmount: 'shop/statistics/querySalesAmount', //查询今日销售额接口
  queryOrderNums: 'shop/statistics/queryOrderNums', // 查询今日订单数
  queryWaitOrderNums: 'shop/statistics/queryWaitOrderNums', //查询待发货订单
  queryShopPV: 'shop/statistics/queryShopPV', // 查询店铺数据pv
  queryNewOrderNums: 'shop/statistics/queryNewOrderNums', // 查询订单新增数量
  queryNewTradeBill: 'shop/statistics/queryNewTradeBill', // 查询交易新增额
  getTxShopRate: 'txShopRate/getTxShopRate', // 查询商户推荐人费率比例列表
  updateShopRate: 'txShopRate/updateShopRate', // 修改费率比例
  exportTxShopRate: 'txShopRate/exportTxShopRate', // 导出费率
  getIsSupportTx: 'txShopRate/getIsSupportTx' //查询是否有特殊业务 
}

// 获取今日销售额
export async function getSalesAmount(shopId) {
  return request(`${API}${PATH.querySalesAmount}?shopId=${shopId}`)
}

// 获取今日订单数
export async function getOrderNums(shopId) {
  return request(`${API}${PATH.queryOrderNums}?shopId=${shopId}`)
}

// 获取待发货订单数
export async function getWaitOrderNums(shopId) {
  return request(`${API}${PATH.queryWaitOrderNums}?shopId=${shopId}`)
}

// 获取店铺数据PV
export async function getShopPV(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.queryShopPV}?${queryParams}`)
}

// 获取订单新增数量
export async function getNewOrderNums(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.queryNewOrderNums}?${queryParams}`)
}

// 获取交易新增额
export async function getNewTradeBill(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.queryNewTradeBill}?${queryParams}`)
}

// 查询商户推荐人费率比例
export async function getTxShopRate(params) {
  let queryParams = '';
  Object.keys(params).forEach(key =>
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.getTxShopRate}`, {
    method: 'POST',
    body: queryParams,
  })
}

// 修改费率比例
export async function getUpdateShopRate(params) {
  let queryParams = '';
  Object.keys(params).forEach(key =>
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.updateShopRate}`, {
    method: 'POST',
    body: queryParams,
  })
}

// 导出费率
export async function getSpecicalExport(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  window.location.href = `${API}${PATH.exportTxShopRate}?${queryParams}`
}

// 获取待发货订单数
export async function getIsSupportTx(shopId) {
  return request(`${API}${PATH.getIsSupportTx}?shopId=${shopId}`)
}
