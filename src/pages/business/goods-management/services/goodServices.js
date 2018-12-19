import { request, config } from 'utils';

const { API } = config

const PATH = {
  goodList: 'admin/groupactivity/getGoodsList', //商品列表接口
  delgoods: 'admin/goodsManager/deletegoods', // 删除商品接口
  shelves: 'admin/goodsManager/undergoods', // 商品上架接口
  remove: '/getGoodsRevokeReasons', // 商品被撤下原因
  isActivity: 'admin/goodsManager/isDeletedGoodsInActivity', //判断商品是否有活动
  reapply: '/reapply', // 重新提交申请（商品上架）
  undergoods: 'admin/goodsManager/undergoods', // 商品下架
  grouping: 'admin/goodsgroup/pagegroup', // 查询商品分组
  CommitTime: 'getCommitTime', // 查询申请提交时间
  stopGoodsInActivity: 'admin/goodsManager/stopGoodsInActivity', // 取消商品活动
}

// 获取商品列表接口
export async function getGoodsList(params) {
  return request(`${API}${PATH.goodList}`, {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 删除商品接口
export async function getDelGoods(params) {
  return request(`${API}${PATH.delgoods}`, {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 商品上架接口
export async function getShelves(params) {
  let queryParams = '';
  Object.keys(params).forEach(key =>
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.shelves}`, {
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 商品下架接口
export async function getUndergoods(params) {
  let queryParams = '';
  Object.keys(params).forEach(key =>
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.undergoods}`, {
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 判断商品是否处于活动状态
export async function getActivity(params) {
  let queryParams = '';
  Object.keys(params).forEach(key =>
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.isActivity}?`, {
    method: 'POST',
    body: queryParams,
  })
}

// 查询商品被撤下原因
export async function getgoodsWhy(goodsId) {
  return request(`${API}${PATH.remove}?goodsId=${goodsId}`)
}

// 商品重新上架
export async function getReapply(goodsId) {
  return request(`${API}${PATH.reapply}`, {
    method: 'POST',
    body: `goodsId=${goodsId}`
  })
}

// 查询商品分组
export async function getGrouping(params) {
  let queryParams = '';
  Object.keys(params).forEach(key =>
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.grouping}`, {
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 查询申请提交时间
export async function getCommitTime(goodsId) {
  return request(`${API}${PATH.CommitTime}?goodsId=${goodsId}`)
}

// 取消商品活动
export async function getStopGoodsInActivity(params) {
  let queryParams = '';
  Object.keys(params).forEach(key =>
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.stopGoodsInActivity}`, {
    method: 'POST',
    body: queryParams,
  })
}
