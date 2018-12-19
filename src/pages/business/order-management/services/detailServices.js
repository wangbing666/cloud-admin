import { request, config } from 'utils';

const { API } = config;

const PATH = {
  orderDetail: 'admin/order/getOrderDetail', //查询订单详情
  orderExport: 'admin/order/orderExport', // 导出
}

// 查询订单详情
export async function getOrderDetail(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.orderDetail}`, {
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

// 取消发布活动
export async function getCancelActivity(id) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.cancelActivity}`,{
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 删除活动
export async function getDeleteActivity(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.deleteActivity}`,{
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
