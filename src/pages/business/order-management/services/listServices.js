import { request, config } from 'utils';

const { API } = config;

const PATH = {
  orderList: 'admin/order/getOrderList', //查询订单列表
  orderExport: 'admin/order/orderExport', // 导出
  orderSend: 'admin/order/orderSend', //发货
  remarkOrder: 'admin/order/remarkOrder', // 备注
  buyersInformation: 'admin/order/getTransportInfoByOrder', // 查看买家信息
  companyList: 'admin/dictionary/companyList', // 查询快递公司列表
  getTransportInfoByOrder: 'admin/order/getTransportInfoByOrder', // 查看物流
  queryTransProgress: 'transportInfo/getTransportInfoByKuaidi100', // 查看物流进度
  updateTransNo: 'admin/order/updateTransNo', // 修改物流
  insertOrderPackage: 'orderPackage/insertOrderPackage', // 新增订单包裹
}

// 查询订单列表
export async function getOrderList(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.orderList}`, {
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 导出
export async function getOrderExport(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  window.location.href = `${API}${PATH.orderExport}?${queryParams}`
}

// 发货
export async function getOrderSend(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.orderSend}`,{
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 备注
export async function getRemarkOrder(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.remarkOrder}`,{
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 查看买家信息
export async function getBuyers(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.buyersInformation}`,{
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 获取快递公司列表
export async function getCompanyList() {
  return request(`${API}${PATH.companyList}`)
}

// 获取物流详情
export async function getLogistics(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.getTransportInfoByOrder}`,{
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
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

// 修改快递公司
export async function getUpdateTransNo(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.updateTransNo}`,{
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 新增订单包裹
export async function getInsertOrderPackage(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.insertOrderPackage}`,{
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
