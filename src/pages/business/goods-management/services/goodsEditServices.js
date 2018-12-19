import { request, config } from 'utils';

const { API } = config;

const PATH = {
  goodsSDetail: 'admin/goodsManager/showgoodsdetail', // 查询商品详情
  saveGoods: 'admin/goodsManager/saveOrUpdateGoods', // 编辑保存商品
  grouping: 'admin/goodsgroup/pagegroup', // 查询商品分组
  addGrouping: 'admin/goodsgroup/addfile', // 新增商品分组
  queryAllInfos: 'enterprise/getCategoryList', // 查询商品类目
}

// 查询商品详情
export async function getGoodsDetail(goodsId) {
  return request(`${API}${PATH.goodsSDetail}`,{
    method: 'POST',
    body: `goodsId=${goodsId}`
  })
}

// 编辑保存商品
export async function getSaveGoods(params) {
  return request(`${API}${PATH.saveGoods}`,{
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  })
}

// 查询商品类目
export async function getQueryAllInfos() {
  return request(`${API}${PATH.queryAllInfos}`)
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

// 新增商品分组
export async function addGrouping(params) {
  let queryParams = '';
  Object.keys(params).forEach(key => 
    queryParams += `${key}=${params[key]}&`
  )
  return request(`${API}${PATH.addGrouping}`,{
    method: 'POST',
    body: queryParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
