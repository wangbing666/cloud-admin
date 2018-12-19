import {
  getAfterSaleList,
} from '../services/listServices';

import { message } from 'antd';
import { authorization } from 'utils';

export default {
  namespace: 'salesOrderModel',
  state: {
    searchData: {
      saleOrderNo: "", // 售后单号
      orderNO: '', // 订单号
      mobile: '', // 收货人手机 
      blackStartTime: '', // 下单开始时间
      blackEndTime: '', // 下单结束时间
      isAuth: 0, // 当前状态
      saleType: 0, // 退款类型
    },
    enterpriseId: authorization.getUserInfo().enterpriseId, // 企业店铺ID
    shopId: authorization.getUserInfo().shopId, // 店铺ID
    showListLoadding: false, // 初始化页面loading
    salesOrderList: [], // 售后订单列表
    pageSize: 10,
    pageNow: 1,
    total: 0,
  },
  effects: {
    //查询售后订单列表
    * searchListData({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getAfterSaleList, payload);
      if (data && data.status == 0 && data.body) {
        let body = data.body;
        yield put({
          type: 'initListData',
          payload: { salesOrderList: body.total.list, total: body.total.total }
        })
        yield put({ type: 'hideListLoadding' });
      } else if (data && !data.body) {
        message.error(data.msg || '请求出错');
      } else {
        yield put({ type: 'hideListLoadding' });
        console.log('服务器请求出错了')
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