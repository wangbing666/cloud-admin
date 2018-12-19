import { request, config } from 'utils';

const { API, BASE_URL } = config;

const PATH = {
  BranchShopList: 'admin/shop/queryBranchShopList', //查询分销店列表
  operateBranchSale: 'admin/shop/operateBranchSale', // 禁止或恢复分销
  qrCode:'userManager/encryptionMsg', // 对话分销商二维码
}

// 查询售后订单列表
export async function getBranchShopList(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.BranchShopList}`,{
    method: 'POST',
    body: queryParams,
  })
}

// 禁止恢复分销
export async function getOperateBranchSale(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.operateBranchSale}`, {
    method: 'POST',
    body: queryParams,
  })
}

// 对话分销商二维码
export async function getQrCode(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${BASE_URL}/uu-admin/${PATH.qrCode}`, {
    method: 'POST',
    body: queryParams,
  })
}