import { request, config } from 'utils'

const prefix = config.API 

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

const URL = {
  pageGroup: prefix + 'admin/goodsgroup/pagegroup', // 分组列表
  groupGoodsList: prefix + 'admin/goodsgroup/groupshopname', 
  groupMsg: prefix + 'admin/goodsgroup/groupmsg', // 分组详情
  updatenumber: prefix + 'admin/goodsgroup/updatenumber', // 更新排序
  addfile: prefix + 'admin/goodsgroup/addfile', // 保存分组详情
  deletelist: prefix + 'admin/goodsgroup/deletelist', // 删除分组
}

export const getPagegroup = (params) => {
  const formData = formatParams(params)
  return request(URL.pageGroup, {
    method: 'POST',
    body: formData,
  })
}
// 详情-商品下拉框数据
export const groupGoodsList = (params) => {
  const formData = formatParams(params)
  return request(URL.groupGoodsList, {
    method: 'POST',
    body: formData,
  })
}
// 详情接口使用
export const getGroupInfo = (params) => {
  const formData = formatParams(params)
  return request(URL.groupMsg, {
    method: 'POST',
    body: formData,
  })
}
// 更新排序
export const updatenumber = (params) => {
  const formData = formatParams(params)
  return request(URL.updatenumber, {
    method: 'POST',
    body: formData,
  })
}
// 保存分组详情
export const addfile = (params) => {
  const formData = formatParams(params)
  return request(URL.addfile, {
    method: 'POST',
    body: formData,
  })
}
// 删除分组
export const deleteGroup = (params) => {
  const formData = formatParams(params)
  return request(URL.deletelist, {
    method: 'POST',
    body: formData,
  })
}