import {
  getOrderDetail,
} from '../services/detailServices';

import { message } from 'antd';
import { authorization } from 'utils';

export default {
  namespace: 'orderDetailModel',
  state: {
    enterpriseId: authorization.getUserInfo().enterpriseId, // 企业店铺ID
    shopId: authorization.getUserInfo().shopId, // 店铺ID
    showListLoadding: false, // 初始化页面loading
    orderdetail: {},
  },
  effects: {
    //查询订单详情
    * DetailData({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getOrderDetail, payload);
      if (data && data.status == 0 && data.body) {
        let body = data.body;
        yield put({
          type: 'initDetailData',
          payload: { orderdetail: body.orderDetail }
        })
        yield put({ type: 'hideListLoadding' });
      } else if (data && !data.body) {
        yield put({ type: 'hideListLoadding' });
        message.error(data.msg || '请求出错');
      } else {
        yield put({ type: 'hideListLoadding' });
        console.log('服务器请求出错了')
      }
    },

    // 导出订单
    * orderExport({ payload }, { call, put }) {
      const data = yield call(getOrderExport, payload);
    },
  },
  reducers: {
    initDetailData(state, action) {
      return { ...state, ...action.payload }
    },
    showListLoadding(state) {
      return { ...state, showListLoadding: true }
    },
    hideListLoadding(state) {
      return { ...state, showListLoadding: false }
    },
  }
}