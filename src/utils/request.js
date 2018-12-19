import fetch from 'dva/fetch';
import { message } from 'antd';
/* eslint-disable */
import router from "umi/router";
/* eslint-disable */
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  message.error('网络请求出错了，请稍后再试！');
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    // credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      if (typeof newOptions.body === 'object') {
        // params type is json
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...newOptions.headers,
        };
        /*
        * 加日志 需求字段 userId and shopId
        */
        if (!newOptions.body['public']) { // 单独设置部门列表公共模块请求
          newOptions.body['operateUserId'] = Number(sessionStorage.getItem('userId')); 
          newOptions.body['operateShopId'] = Number(sessionStorage.getItem('shopId'));
        }
        if (newOptions.body.head && typeof newOptions.body.head === 'object') { // 单独设置删除商品接口
          delete newOptions.body['operateUserId'];
          delete newOptions.body['operateShopId'];
          newOptions.body.data['operateUserId'] = Number(sessionStorage.getItem('userId'));
          newOptions.body.data['operateShopId'] = Number(sessionStorage.getItem('shopId'));
        }
        delete newOptions.body['public'];// 部门列表公共模块需去掉OperateUserId和OperateShopId
        newOptions.body = JSON.stringify(newOptions.body);
      } else {
        /*
        * 加日志 需求字段 userId and shopId
        */
        let query = newOptions.body;
        if (query && !url.includes('saveInfo') && !url.includes('reapply') && !url.includes('uu-admin')) {
          query = query.length === 0 ? '' : query.substr(query.length - 1, 1);
          if (query === '&') {
            newOptions.body = `${newOptions.body}OperateUserId=${sessionStorage.getItem('userId')}&OperateShopId=${sessionStorage.getItem('shopId')}`;
          } else {
            newOptions.body = `${newOptions.body}&OperateUserId=${sessionStorage.getItem('userId')}&OperateShopId=${sessionStorage.getItem('shopId')}`;
          }
        }
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          ...newOptions.headers,
        };
      }
    } else {
      // params type is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  } 
  
  return fetch(url, newOptions)
    // .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      if (response.status === 201 || response.status === 207) {
        return response; // 扫码需求状态码
      }
      return response.json();
    })
    .catch(e => {
      const dispatch = window.g_app._store.dispatch;
      const status = e.name;
      // if (status === 401) {
      //   dispatch({
      //     type: 'login/logout',
      //   });
      //   return;
      // }
      // if (status === 403) {
      //   router.push('/exception/403');
      //   return;
      // }
      // if (status <= 504 && status >= 500) {
      //   router.push('/exception/500');
      //   return;
      // }
      if (status >= 404 && status < 422) {
        router.push('/404');
      }
    });
}
