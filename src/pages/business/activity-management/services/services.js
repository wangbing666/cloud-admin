import { request, config } from 'utils';

const { API } = config

const PATH = {
  activityList: 'admin/groupActivityBuy/getGroupActivityList', //活动列表接口
  cancelActivity: 'admin/groupactivity/cancelGroupBuyActivity', // 取消发布活动接口
  releaseActivity: 'admin/groupactivity/releaseGroupActivity', // 发布活动
  deleteActivity: 'admin/groupactivity/deleGroupActivity', // 删除活动
  addActivity: 'admin/groupActivityBuy/addOrUpdateGroupActivityBuy', // 新增团购活动
  goods: 'admin/partition/getGoodsByShopId', // 获取已上架商品
  activityDetail: 'admin/groupactivity/groupActivityInfo', //查看活动详情
  activityWater: 'admin/groupactivity/getGroupActivityFlow', // 获取活动流水
  getGroupFlowOrder: 'admin/groupactivity/getGroupFlowOrder', // 获取团购流水订单号列表
  grouping: 'admin/goodsgroup/pagegroup', // 查询商品分组
}

// 获取活动列表
export async function getActivityList(params) {
  let queryParams = '';
  Object.keys(params).forEach(key =>
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.activityList}`, {
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 发布活动
export async function getReleaseActivity(params) {
  let queryParams = '';
  Object.keys(params).forEach(key =>
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.releaseActivity}`, {
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 取消发布活动
export async function getCancelActivity(params) {
  let queryParams = '';
  Object.keys(params).forEach(key =>
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.cancelActivity}`, {
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
  return request(`${API}${PATH.deleteActivity}`, {
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 新增团购活动
export async function getAddActivity(params) {
  const { data, table } = params;
  let queryParams = '';
  Object.keys(data).forEach(key =>
    queryParams += `${key}=${data[key]}&`
  )
  Object.keys(table).forEach(key =>
    queryParams += `${key}=${table[key]}&`
  )
  return request(`${API}${PATH.addActivity}`, {
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 获取已上架商品
export async function getGoods(params) {
  let queryParams = '';
  Object.keys(params).forEach(key =>
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.goods}`, {
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 查询商品分组
export async function getGrouping(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.grouping}`,{
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 查看活动详情
export async function getActivityDetail(id) {
  return request(`${API}${PATH.activityDetail}`, {
    method: 'POST',
    body: `groupBuyId=${id}`
  })
}

// 获取活动流水列表
export async function getActivityWater(params) {
  let queryParams = '';
  Object.keys(params).forEach(key =>
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.activityWater}`, {
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

// 获取团购流水订单号列表
export async function getGroupFlowOrder(params) {
  let queryParams = '';
  Object.keys(params).forEach(key =>
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.getGroupFlowOrder}`, {
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
