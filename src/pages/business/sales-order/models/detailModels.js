import {
  getAfterSaleDetail,
  getRetry,
  getRefundSuccessInfo,
  getIsLogistics,
  getQueryLogistics,
  getFinishedConfirmReceipt,
  getConfirmReceipt,
  getConfirmRefund,
  getFinishedConfirmRefund,
  getReturnMoney,
  getQueryTransProgress
} from '../services/detailServices';

import { message } from 'antd';
import { authorization } from 'utils';

export default {
  namespace: 'salesOrderDetailModel',
  state: {
    userId: authorization.getUserInfo().userId, // 用户ID
    enterpriseId: authorization.getUserInfo().enterpriseId, // 企业店铺ID
    shopId: authorization.getUserInfo().shopId, // 店铺ID
    showListLoadding: false, // 初始化页面loading
    salesOrderDetail: {}, // 售后订单详情
    piclist: [], // 详情图片
    successInfo: {}, // 退款成功信息
    isLogistics: "", // 是否显示查看物流
    logisticsProgress: [], // 物流进度
    logisticsProgressDetail: {}, // 物流详情
  },
  effects: {
    //查询售后订单详情
    * initDetail({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getAfterSaleDetail, payload);
      if (data && data.status == 0 && data.body) {
        let body = data.body;
        yield put({
          type: 'initDetailData',
          payload: { salesOrderDetail: body.afterSalePojo, piclist: body.piclist },
        })
        yield put({ type: 'hideListLoadding' });
      } else if (data && !data.body) {
        message.error(data.msg || '请求出错');
      } else {
        yield put({ type: 'hideListLoadding' });
        console.log('服务器请求出错了')
      }
    },

    // 确认收货 status > 18
    * Refund({ payload, callback }, { call, put }) {
      const data = yield call(getFinishedConfirmReceipt, payload);
      if (data && data.status == 0) {
        callback(data)
      } else if (data && data.msg) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
    },

    // 确认收货 status < 18
    * ConfirmReceipt({ payload, callback }, { call, put }) {
      const data = yield call(getConfirmReceipt, payload);
      if (data && data.status == 0) {
        callback(data)
      } else if (data && data.msg) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
    },


    // 退款审核 status < 18
    * ConfirmRefund({ payload, callback }, { call, put }) {
      const data = yield call(getConfirmRefund, payload);
      if (data && data.status == 0) {
        callback(data)
      } else if (data && data.msg) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
    },

    // 退款审核 status > 18
    * FinishedConfirmRefund({ payload, callback }, { call, put }) {
      const data = yield call(getFinishedConfirmRefund, payload);
      if (data && data.status == 0) {
        
        callback(data)
      } else if (data && data.msg) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
    },

    // 退款到钱包 status < 18
    * ReturnMoney({ payload }, { call, put }) {
      const data = yield call(getReturnMoney, payload);
      if (data && data.status == 0) {
        message.success('操作成功');
      } else if (data && data.msg) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
    },

    // 确认付款或重新申请 status > 18 
    * Retry({ payload }, { call, put }) {
      const data = yield call(getRetry, payload);
      if (data && data.status == 0) {
        message.success('操作成功');
      } else if (data && data.msg) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
    },

    // 查询退款成功的交易信息
    * RefundSuccessInfo({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getRefundSuccessInfo, payload.afterSaleId);
      if (data && data.status == 0 && data.body) {
        let body = data.body;
        yield put({
          type: 'setsuccessInfo',
          payload: { successInfo: body.result },
        })
        yield put({ type: 'hideListLoadding' });
      } else if (data && data.msg) {
        yield put({ type: 'hideListLoadding' });
        message.error(data.msg || '请求出错');
      } else {
        yield put({ type: 'hideListLoadding' });
        console.log('服务器请求出错了')
      }
    },

    // 是否显示售后物流按钮
    * IsLogistics({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getIsLogistics, payload.orderId);
      if (data && data.status == 0 && data.body) {
        let body = data.body;
        yield put({
          type: 'setIsLogistics',
          payload: { isLogistics: body.result },
        })
        yield put({ type: 'hideListLoadding' });
      } else if (data && data.msg) {
        yield put({ type: 'hideListLoadding' });
        message.error(data.msg || '请求出错');
      } else {
        yield put({ type: 'hideListLoadding' });
        console.log('服务器请求出错了')
      }
    },

    // 查询物流信息
    * QueryLogistics({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getQueryLogistics, payload.orderId);
      if (data && data.status == 0 && data.body) {
        let body = data.body;
        yield put({
          type: 'LogisticsProgress',
          payload: { data: body.data },
        })
        yield put({
          type: 'setLogisticsDetail',
          payload: { logisticsProgressDetail: body.data },
        })
        yield put({ type: 'hideListLoadding' });
      } else if (data && data.msg) {
        yield put({ type: 'hideListLoadding' });
        message.error(data.msg || '请求出错');
      } else {
        yield put({ type: 'hideListLoadding' });
        console.log('服务器请求出错了')
      }
    },

    // 查看物流进度
    * LogisticsProgress({ payload }, { call, put }) {
      const params = {
        transportNo: payload.data.transportNo,
        deliverCompanyNo: payload.data.deliverCompanyNo
      }
      const data = yield call(getQueryTransProgress, params);
      if (data && data.status == 0) {
        yield put({
          type: 'setQueryLogistics',
          payload: {
            logisticsProgress: data.body.data ? data.body.data.reverse() : [],
          }
        })
      } else if (data && data.status !== 0) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
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
    setsuccessInfo(state, action) { // 退款成功的交易信息
      return { ...state, ...action.payload }
    },
    setIsLogistics(state, action) { // 是否显示查看物流
      return { ...state, ...action.payload }
    },
    setLogisticsDetail(state, action) { // 物流详情
      return { ...state, ...action.payload }
    },
    setQueryLogistics(state, action) { // 物流进度
      return { ...state, ...action.payload }
    }
  }
}