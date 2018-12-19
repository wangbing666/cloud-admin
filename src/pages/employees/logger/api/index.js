import { request, config } from 'utils'

const prefix = config.API;
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
const formatGetParams = (params) => {
  let query = ''
  Object.keys(params).forEach((key) => {
    query += `${key}=${params[key]}&`
  })
  return query
}

const URL = {
  queryOperateLog: prefix + 'log/queryOperateLog',
}

export const queryOperateLog = (params) => {
  const query = formatGetParams(params);
  return request(URL.queryOperateLog, {
    method: 'post',
    body: query,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
