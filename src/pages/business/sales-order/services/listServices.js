import { request, config } from 'utils';

const { API } = config;

const PATH = {
  getAfterSaleList: 'admin/afterSale/getAfterSaleList', //查询售后订单列表
}

// 查询售后订单列表
export async function getAfterSaleList(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.getAfterSaleList}`, {
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}