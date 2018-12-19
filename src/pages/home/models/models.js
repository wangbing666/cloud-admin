import {
  getSalesAmount,
  getOrderNums,
  getWaitOrderNums,
  getShopPV,
  getNewOrderNums,
  getNewTradeBill,
  getTxShopRate,
  getUpdateShopRate,
  getSpecicalExport,
  getIsSupportTx,
} from '../services/services'

// import {requestPost} from '../../common/Apis/request';
import { message } from 'antd';
import { authorization } from 'utils';

export default {
  namespace: 'homeModel',
  state: {
    shopId: authorization.getUserInfo().shopId, // 商品所在店铺ID
    showListLoadding: false,
    salesAmount: '',
    todayOrder: '',
    stayOrder: '',
    isSupportTx: 0, // 特殊业务用户 0为普通商户，1为特殊商户
    shopData: [], // 店铺数据PV
    orderData: [], //订单新增数量 
    tradingData: [], // 交易新增额
    txShopRate: [], // 商户推荐人比例列表
  },
  effects: {
    //获取今日销售额
    * SalesAmount({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getSalesAmount, payload.shopId);
      if (data && data.status == 0) {
        yield put({
          type: 'initSalesAmount',
          payload: { salesAmount: data.msg }
        })
        yield put({ type: 'hideListLoadding' });
      } else {
        yield put({ type: 'hideListLoadding' });
        message.error('网络请求出错了，请刷新页面重试');
      }
    },

    // 获取今日订单
    * OrderNums({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getOrderNums, payload.shopId);
      if (data && data.status == 0) {
        yield put({
          type: 'initOrderNums',
          payload: { todayOrder: data.msg }
        })
        yield put({ type: 'hideListLoadding' });
      } else {
        yield put({ type: 'hideListLoadding' });
        message.error('网络请求出错了，请刷新页面重试');
      }
    },

    // 获取待发货订单
    * WaitOrderNums({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getWaitOrderNums, payload.shopId);
      if (data && data.status == 0) {
        yield put({
          type: 'initWaitOrderNums',
          payload: { stayOrder: data.msg }
        })
        yield put({ type: 'hideListLoadding' });
      } else {
        yield put({ type: 'hideListLoadding' });
        message.error('网络请求出错了，请刷新页面重试');
      }
    },

    //获取店铺数据(PV)
    * ShopPV({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getShopPV, payload);
      if (data && data.status == 0) {
        let res = data.body;
        yield put({
          type: 'initShopPv',
          payload: { shopData: res.shoppvday }
        })
        yield put({ type: 'hideListLoadding' });
      } else {
        yield put({ type: 'hideListLoadding' });
        message.error('网络请求出错了，请刷新页面重试');
      }
    },

    //获取订单新增数量
    * NewOrderNums({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getNewOrderNums, payload);
      if (data && data.status == 0) {
        let res = data.body;
        yield put({
          type: 'initNewOrderNums',
          payload: { orderData: res.NewOrderInfoVO }
        })
        yield put({ type: 'hideListLoadding' });
      } else {
        yield put({ type: 'hideListLoadding' });
        message.error('网络请求出错了，请刷新页面重试');
      }
    },

    //获取交易新增额
    * NewTradeBill({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getNewTradeBill, payload);
      if (data && data.status == 0) {
        let res = data.body;
        yield put({
          type: 'initNewTradeBill',
          payload: { tradingData: res.newTradeInfoVO }
        })
        yield put({ type: 'hideListLoadding' });
      } else {
        yield put({ type: 'hideListLoadding' });
        message.error('网络请求出错了，请刷新页面重试');
      }
    },

    // 查询商户推荐人费率比例
    * TxShopRate({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getTxShopRate, payload);
      if (data && data.status == 0) {
        let res = data.body;
        yield put({
          type: 'initTxShopRate',
          payload: { txShopRate: res.txShopRate }
        })
        yield put({ type: 'hideListLoadding' });
      } else {
        yield put({ type: 'hideListLoadding' });
        message.error(data.msg || '网络请求出错了，请刷新页面重试');
      }
    },

    //修改费率
    * updateShopRate({ payload }, { call, put }) {
      const data = yield call(getUpdateShopRate, payload);
      if (data && data.status == 0) {
        message.success('操作成功');
      } else {
        message.error(data.msg || '网络请求出错了，请重试');
      }
    },

    // 查询是否有特殊业务
    * IsSupportTx({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getIsSupportTx, payload.shopId);
      if (data && data.status == 0) {
        yield put({
          type: 'initSupportTx',
          payload: { isSupportTx: data.data }
        })
        yield put({ type: 'hideListLoadding' });
      } else {
        yield put({ type: 'hideListLoadding' });
        message.error('网络请求出错了，请刷新页面重试');
      }
    },

    // 导出费率
    * specicalExport({ payload }, { call, put }) {
      const data = yield call(getSpecicalExport, payload);
    },
  },
  reducers: {
    initTxShopRate(state, action) {
      return { ...state, ...action.payload }
    },
    initSupportTx(state, action) {
      return { ...state, ...action.payload }
    },
    initSalesAmount(state, action) {
      return { ...state, ...action.payload }
    },
    initOrderNums(state, action) {
      return { ...state, ...action.payload }
    },
    initWaitOrderNums(state, action) {
      return { ...state, ...action.payload }
    },
    initShopPv(state, action) {
      return { ...state, ...action.payload }
    },
    initNewOrderNums(state, action) {
      return { ...state, ...action.payload }
    },
    initNewTradeBill(state, action) {
      return { ...state, ...action.payload }
    },
    showListLoadding(state) {
      return { ...state, showListLoadding: true };
    },
    hideListLoadding(state) {
      return { ...state, showListLoadding: false };
    },
  }
}