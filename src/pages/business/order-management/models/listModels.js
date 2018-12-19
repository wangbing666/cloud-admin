import {
  getOrderList,
  getOrderExport,
  getRemarkOrder,
  getBuyers,
  getCompanyList,
  getLogistics,
  getQueryTransProgress,
  getUpdateTransNo,
  getOrderSend,
  getInsertOrderPackage,
} from '../services/listServices';

import { message } from 'antd';
import { authorization } from 'utils';

export default {
  namespace: 'orderListModel',
  state: {
    searchData: {
      conditionType: 1, // 订单号或姓名或手机
      conditionValue: '', // 搜索框
      startTime: '', // 下单开始时间 
      endTime: '', // 下单结束时间
      isProxySale: '', // 订单来源
      billType: 0, // 付款方式
      transportType: 0, // 物流方式
      orderType: 0, // 订单类型
    },
    enterpriseId: authorization.getUserInfo().enterpriseId, // 企业店铺ID
    shopId: authorization.getUserInfo().shopId, // 店铺ID
    userId: authorization.getUserInfo().userId, // 用户ID
    showListLoadding: false, // 初始化页面loading
    status: "0", // tab选项
    orderList: [], // 订单列表
    buyersInfo: {}, // 收货人信息
    courierList: [], // 快递公司列表
    logistics: {}, // 物流单号
    logisticsProgress: {}, //物流进度
    pageSize: 10,
    pageNow: 1,
    total: 0,
  },
  effects: {
    //查询订单管理列表
    * searchListData({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getOrderList, payload);
      if (data && data.status == 0 && data.body) {
        let body = data.body;
        yield put({
          type: 'initListData',
          payload: { orderList: body.orderList.list, total: body.orderList.total }
        })
        yield put({ type: 'hideListLoadding' });
      } else if (data && !data.body) {
        yield put({ type: 'hideListLoadding' });
        yield put({
          type: 'initListData',
          payload: { orderList: [], total: 0 }
        })
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

    //备注
    * remarkOrder({ payload }, { call, put }) {
      const data = yield call(getRemarkOrder, payload);
      if (data && data.status == 0) {
        message.success('操作成功');
      } else {
        message.error(data.msg || '操作失败');
      }
    },

    // 查看买家信息
    * buyers({ payload }, { call, put }) {
      yield put({ type: 'showConfirmLoading' });
      const data = yield call(getBuyers, payload);
      yield put({ type: 'hideConfirmLoading' });
      if (data && data.status == 0) {
        const body = data.body
        yield put({
          type: 'setBuyersInfo',
          payload: { buyersInfo: body }
        })
      } else if (data && data.status !== 0) {
        message.error(data.msg || '请求出错');
      }
    },

    // 获取快递公司列表
    * CompanyList({ payload }, { call, put }) {
      const data = yield call(getCompanyList, payload);
      if (data && data.status == 0) {
        const { lists } = data.body
        yield put({
          type: 'initListData',
          payload: { courierList: lists }
        })
      } else if (data && data.status !== 0) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
    },

    // 获取物流信息
    * Logistics({ payload }, { call, put }) {
      const data = yield call(getLogistics, payload);
      if (data && data.status == 0) {
        yield put({
          type: 'setLogistics',
          payload: {
            logistics: data.body,
          }
        })
      } else if (data && data.status !== 0) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
    },

    // 查看物流进度
    * LogisticsProgress({ payload }, { call, put }) {
      const data = yield call(getQueryTransProgress, payload);
      if (data && data.status == 0) {
        yield put({
          type: 'initListData',
          payload: {
            logisticsProgress: data.body,
          }
        })
      } else if (data && data.status !== 0) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
    },

    // 修改快递公司
    * UpdateTransNo({ payload }, { call, put }) {
      const data = yield call(getUpdateTransNo, payload);
      if (data && data.status == 0) {
        yield put({
          type: 'initListData',
          payload: {
            logisticsProgress: data.body,
          }
        })
        message.success('修改成功');
      } else if (data && data.status !== 0) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
    },

    // 商品发货
    * OrderSend({ payload }, { call, put }) {
      const data = yield call(getOrderSend, payload);
      if (data && data.status == 0) { // 发货成功后调用订单包裹便于查询物流
        message.success('操作成功');
      } else if (data && data.status !== 0) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
    },

    // 新增订单包裹
    * InsertOrderPackage({ payload, callback}, { call, put }) {
      const data = yield call(getInsertOrderPackage, payload);
      if (data && data.status == 0) {
        callback(data);
      } else if (data && data.status !== 0) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
    },
  },
  reducers: {
    initListData(state, action) {
      return { ...state, ...action.payload }
    },
    setPageNow(state, action) { //设置PageNow
      return { ...state, ...action.payload };
    },
    setPageShowSize(state, action) {//设置PageSize
      return { ...state, ...action.payload };
    },
    setStatus(state, action) { // 设置tabs
      return { ...state, ...action.payload };
    },
    setLogistics(state, action) {// 设置物流详情
      return { ...state, ...action.payload };
    },
    setBuyersInfo(state, action) {
      return { ...state, ...action.payload };
    },
    setSearchData(state, action) {
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