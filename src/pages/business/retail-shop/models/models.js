import {
  getBranchShopList,
  getOperateBranchSale,
  getQrCode,
} from '../services/services';

import { message } from 'antd';
import { authorization } from 'utils';

export default {
  namespace: 'retailShopModel',
  state: {
    searchData: {
      shopName: "", // 店铺名称
      isForbidSale: '', // 商家操作 1恢复分销 2禁止分销
      proxyMode: '', // 代理模式 1 专营 2 混合
      isFrozen: '', // 店铺状态 1 正常 2 关闭
    },
    enterpriseId: authorization.getUserInfo().enterpriseId, // 企业店铺ID
    shopId: authorization.getUserInfo().shopId, // 店铺ID
    showListLoadding: false, // 初始化页面loading
    retailShop: [], // 分销店列表
    qrCode: '', // 分销商二维码
    pageSize: 10,
    pageNow: 1,
    total: 0,
  },
  effects: {
    //查询分销店列表
    * searchListData({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getBranchShopList, payload);
      if (data && data.status == 0 && data.body) {
        let body = data.body;
        yield put({
          type: 'initListData',
          payload: { retailShop: body.result.list, total: body.result.total }
        })
        yield put({ type: 'hideListLoadding' });
      } else if (data && !data.body) {
        yield put({ type: 'hideListLoadding' });
        yield put({
          type: 'initListData',
          payload: { retailShop: [], total: 0 }
        })
        message.error(data.msg || '请求出错');
      } else {
        yield put({ type: 'hideListLoadding' });
        console.log('服务器请求出错了')
      }
    },

    //禁止或恢复分销
    * OperateBranchSale({ payload }, { call, put }) {
      const data = yield call(getOperateBranchSale, payload);
      if (data && data.status == 0) {
        message.success('操作成功');
      } else {
        message.error(data.msg || '操作失败');
      }
    },

    // 对话分销商二维码
    * getQrCode({ payload }, { call, put }) {
      const data = yield call(getQrCode, payload);
      if (data && data.code == 0) {
        yield put({
          type: 'initListData',
          payload: { qrCode: 'https://m.uns1066.com?msg='+data.result+'' }
        })
      } else {
        yield put({
          type: 'initListData',
          payload: { qrCode: '' }
        })
        message.error(data.msg || '请求失败');
      }
    },
  },
  reducers: {
    initListData(state, action) {
      return { ...state, ...action.payload }
    },
    setSearchData(state, action) {
      return { ...state, ...action.payload }
    },
    setPageNow(state, action) { //设置PageNow
      return { ...state, ...action.payload };
    },
    setPageShowSize(state, action) {//设置PageSize
      return { ...state, ...action.payload };
    },
    showListLoadding(state) {
      return { ...state, showListLoadding: true }
    },
    hideListLoadding(state) {
      return { ...state, showListLoadding: false }
    },
  }
}