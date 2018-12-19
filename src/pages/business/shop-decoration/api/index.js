import { request, config, authorization } from 'utils'

const prefix = config.API 

const URL = {
  getShopInfo: prefix + 'admin/shop/getShopInfo',
  getBanners: prefix + 'admin/dictionary/getbanners',
  getPartitions: prefix + 'admin/partition/getPartitions',
  getAtivityList: prefix + 'admin/activity/queryAll',
  deleteActivity: prefix + 'admin/activity/deleteActivity',
  getshopThemeShopList: prefix + 'admin/cloudGood/getshopThemeShopList', // 主题色调样式
  getShopThemeInfo: prefix + 'admin/cloudGood/getShopThemeInfo',
  upOrDownMove: prefix + 'admin/cloudGood/shopThemeOrder', // 店铺装修-上下位移
  saveShopTheme: prefix + 'admin/cloudGood/saveShopTheme',
  getGoodsByShopId: prefix + 'admin/partition/getGoodsByShopId', // 获取商品列表-分页
  listShopGroupName: prefix + 'admin/partition/listShopGroupName', // 商品分组-下拉框
  getlistShopGroup: prefix + 'admin/partition/getlistShopGroup', // 获取商品列表
  getVoucher: prefix + 'upload/getVoucher',
  uploadToQn: '//upload.qiniu.com/',
  qiniuUpload: prefix + 'upload/qiniuUpload',
  saveOrUpdatePartition: prefix + 'admin/partition/saveOrUpdatePartition', // 保存分区
  insertOrUpdateShop: prefix + 'admin/shop/insertOrUpdateShop', // 保存店铺信息
  pushBanner: prefix + 'admin/dictionary/pushbanner', // 保存banner
  publicPartition: prefix + 'admin/partition/publicPartition', // 保存分区排序
  updateStyleId: prefix + 'admin/cloudGood/updateStyleId', // 保存分组样式
  activityDetail: prefix + 'admin/activity/activityContent', // 活动详情
  activityUpAndInsert: prefix + 'admin/activity/activityUpAndInsert', // 保存活动
  insertLog: prefix + 'log/insertLog', // 调取日志接口
}

const formatParams = (params) => {
  let formData = '';
  Object.keys(params).forEach((key, index) => {
    if ((index+1) === Object.keys(params).length){
      formData += `${key}=${params[key]}`
    }else{
      formData += `${key}=${params[key]}&`
    }
  })
  return formData;
}

// 获取基本信息
export const getShopInfo = (params) => {
  const formData = formatParams(params)
  return request(URL.getShopInfo, {
    method: 'POST',
    body: formData,
  })
}

// 调取日志接口
export const getInsertLog = (params) => {
  const formData = formatParams(params)
  return request(URL.insertLog, {
    method: 'POST',
    body: formData,
  })
}

// 获取banner
export const getBanners = (params) => {
  const formData = formatParams(params)
  return request(URL.getBanners, {
    method: 'POST',
    body: formData,
  })
}

// 获取分区列表
export const getPartitions = (params) => {
  const formData = formatParams(params)
  return request(URL.getPartitions, {
    method: 'POST',
    body: formData,
  })
}

// 获取活动列表
export const getAtivityList = (params) => {
  const formData = formatParams(params)
  return request(URL.getAtivityList, {
    method: 'POST',
    body: formData
  })
}

// 获取所有的主题色系列表
export const getshopThemeShopList = () => {
  return request(URL.getshopThemeShopList, {
    method: 'POST',
    body: {},
  })
}

// 获取主题参数
export const getShopThemeInfo = (params) => {
  const formData = formatParams(params)
  return request(URL.getShopThemeInfo, {
    method: 'POST',
    body: formData,
  })
}

// 上下位移
export const upOrDownMove = (params) => {
  const formData = formatParams(params)
  return request(URL.upOrDownMove,{
    method: 'POST',
    body: formData
  })
}

// 删除某一个活动
export const deleteActivity = (params) => {
  const formData = formatParams(params)
  return request(URL.deleteActivity,{
    method: 'POST',
    body: formData
  })
}

// 保存样式
export const saveShopTheme = (params) => {
  const formData = formatParams(params)
  return request(URL.saveShopTheme,{
    method: 'POST',
    body: formData
  })
}

// 添加商品=> 获取商品列表
export const getGoodsByShopId = (params) => {
  const formData = formatParams(params)
  return request(URL.getGoodsByShopId,{
    method: 'POST',
    body: formData
  })
}

// 商品分组 下拉框
export const listShopGroupName = (params) => {
  const formData = formatParams(params)
  return request(URL.listShopGroupName, {
    method: 'POST',
    body: formData,
  })
}

// 自动同步商品
export const getlistShopGroup = (params) => {
  const formData = formatParams(params)
  return request(URL.getlistShopGroup, {
    method: 'POST',
    body: formData,
  })
}

// 获取上传七牛验证
export const getVoucher = (params) => {
  const formData = formatParams(params)
  return request(URL.getVoucher, {
    method: 'POST',
    body: formData,
  })
}

// 上传图片
export const uploadToQn = (params) => {
  let formData = new FormData()
  formData.append('file', params.file, 'file');
  formData.append('token', params.token);
  return request(URL.uploadToQn, {
    method: 'POST',
    body: formData,
  })
}

// 图片info 上传数据库
export const qiniuUpload = (params) => {
  return request(URL.qiniuUpload, {
    method: 'POST',
    body: params,
  })
}

// 保存分区详情
export const saveOrUpdatePartition = (params) => {
  const formData = formatParams(params)
  return request(URL.saveOrUpdatePartition, {
    method: 'POST',
    body: formData,
  })
}

// 保存店铺基本信息
export const insertOrUpdateShop = (params) => {
  const formData = formatParams(params)
  return request(URL.insertOrUpdateShop, {
    method: 'POST',
    body: formData,
  })
}

// 保存图片
export const pushBanner = (params) => {
  // const formData = formatParams(params)
  return request(`${URL.pushBanner}?shopId=${authorization.getUserInfo().shopId}&userId=${authorization.getUserInfo().userId}`, {
    method: 'POST',
    body: params,
  })
 }

 // 保存分区排序
 export const publicPartition = (params) => {
   const formData = formatParams(params)
   return request(URL.publicPartition, {
     method: 'POST',
     body: formData,
   })
 }

 // 保存分组样式
 export const updateStyleId = (params) => {
  const formData = formatParams(params)
   return request(URL.updateStyleId, {
    method: 'POST',
    body: formData,
  })
 }

 // 获取活动详情
 export const activityDetail = (params) => {
   const formData = formatParams(params)
   return request(URL.activityDetail, {
     method: 'POST',
     body: formData,
   })
 }

 // 保存活动
 export const activityUpAndInsert = (params) => {
   const formData = formatParams(params)
   return request(URL.activityUpAndInsert, {
     method: 'POST',
     body: formData,
   })
 }
