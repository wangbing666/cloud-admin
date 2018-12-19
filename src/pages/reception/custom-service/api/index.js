import { request, config } from "utils";

const comPrefix = config.commonAPI;

const URL = {
  getFunctionList: comPrefix + 'function/getFunctionList',
}

// 获取权限
export const getFunctionList = (params) => {
  return request(URL.getFunctionList, {
    method: 'POST',
    body: params
  })
}
