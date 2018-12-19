import {
  getReleaseActivity,
  getDeleteActivity,
  getCancelActivity,
  getActivityDetail,
  getActivityWater,
  getGoods,
  getAddActivity,
  getGrouping,
  getGroupFlowOrder,
} from '../services/services';

import { message } from 'antd';
import router from 'umi/router';
import { authorization } from 'utils';

export default {
  namespace: 'activityDetailModel',
  state: {
    searchData: {
      goodsName: '', // 商品名称
      groupId: 0, // 商品分组 
    },
    enterpriseId: authorization.getUserInfo().enterpriseId, // 企业店铺ID
    shopId: authorization.getUserInfo().shopId, // 店铺ID
    operationVisible: false,
    confirmLoading: false,
    showListLoadding: false,
    goodsList: [], // 获取已上架商品
    goodsGrouping: [], // 获取商品分组
    actiList: [], // 获取活动流水
    acOrderList: [], // 活动流水订单列表
    selectGoodsList: [], // 选择的已上架商品
    selectGoodsId: [], // 选择的已上架的商品ID，便于回显勾选的商品
    pageSize: 5,
    pageNow: 1,
    total: 0,
    goodsTotal: 0,
    ActivityDetail: { // 获取活动详情
      groupActivityBuy: {}, // 活动详情基本信息
      groupGoods: [], // 活动详情活动商品
    }
  },
  effects: {
    //发布活动
    * ReleaseActivity({ payload }, { call, put }) {
      yield put({ type: 'showConfirmLoading' });
      const data = yield call(getReleaseActivity, payload);
      yield put({ type: 'hideConfirmLoading' });
      yield put({ type: 'hideModal' });
      if (data && data.status == 0) {
        message.success('操作成功');
        router.push(`/business/activity-management`)
      } else {
        message.error(data.msg || '操作失败');
      }
    },

    //删除活动
    * DeleteActivity({ payload }, { call, put }) {
      yield put({ type: 'showConfirmLoading' });
      const data = yield call(getDeleteActivity, payload);
      yield put({ type: 'hideConfirmLoading' });
      if (data && data.status == 0) {
        message.success('操作成功');
        router.push(`/business/activity-management`)
      } else {
        message.error('操作失败');
      }
    },

    // 取消活动
    * CancelActivity({ payload }, { call, put }) {
      yield put({ type: 'showConfirmLoading' });
      const data = yield call(getCancelActivity, payload);
      yield put({ type: 'hideConfirmLoading' });
      yield put({ type: 'hideModal' });
      if (data && data.status == 0) {
        message.success('操作成功');
        router.push(`/business/activity-management`)
      } else {
        message.error(data.msg || '操作失败');
      }
    },

    // 查看活动详情
    * ActivityDetail({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getActivityDetail, payload.activityId);
      yield put({ type: 'hideListLoadding' });
      if (data && data.status == 0) {
        yield put({
          type: 'setActivityDetail',
          payload: { ActivityDetail: data }
        })
        if (data.groupGoods) {
          yield put({
            type: 'setSelectGoodsList',
            payload: { selectGoodsList: data.groupGoods }
          })
          let selectGoodsId = [];
          for (let i = 0; i < data.groupGoods.length; i++) {
            selectGoodsId.push(data.groupGoods[i].goodsId)
          }
          yield put({
            type: 'setSelectGoodsId',
            payload: { selectGoodsId: selectGoodsId }
          })
        }
      } else if (data && data.status !== 0) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
    },

    // 获取活动流水
    * ActivityWater({ payload }, { call, put }) {
      const data = yield call(getActivityWater, payload);
      if (data && data.status == 0) {
        yield put({
          type: 'setActivityWater',
          payload: {
            actiList: data.actiList,
            total: data.total,
          }
        })
      } else if (data && data.status !== 0) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
    },

    // 获取活动流水订单列表
    * GroupFlowOrder({ payload }, { call, put }) {
      const data = yield call(getGroupFlowOrder, payload);
      if (data && data.status == 0) {
        yield put({
          type: 'setGroupFlowOrder',
          payload: {
            acOrderList: data.groupOrderInfo,
          }
        })
        console.log(data)
      } else if (data && data.status !== 0) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
    },

    // 获取已上架商品
    * shelvesGoods({ payload }, { call, put }) {
      const data = yield call(getGoods, payload);
      if (data && data.status == 0) {
        yield put({
          type: 'setShelvesGoods',
          payload: {
            goodsList: data.goods,
            goodsTotal: data.goodsNum,
          }
        })
      } else if (data && data.status !== 0) {
        message.error(data.msg || '请求出错');
      } else {
        console.log('服务器请求出错了')
      }
    },

    //获取商品分组
    * grouping({ payload }, { call, put }) {
      const data = yield call(getGrouping, payload);
      if (data && data.status == 0 && data.body && data.body.groupList) {
        let body = data.body.groupList;
        yield put({
          type: 'initListData',
          payload: { goodsGrouping: body }
        })
      } else {
        message.error('服务器请求出错了');
      }
    },

    // 新增或修改团购活动
    * AddActivity({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getAddActivity, payload);
      yield put({ type: 'hideListLoadding' });
      if (data && data.status == 0) {
        message.success('操作成功');
        router.push(`/business/activity-management`)
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
    setSearchData(state, action) {
      return { ...state, ...action.payload }
    },
    showConfirmLoading(state) {
      return { ...state, confirmLoading: true };
    },
    hideConfirmLoading(state) {
      return { ...state, confirmLoading: false };
    },
    showListLoadding(state) {
      return { ...state, showListLoadding: true };
    },
    hideListLoadding(state) {
      return { ...state, showListLoadding: false };
    },
    setPageNow(state, action) { //设置PageNow
      return { ...state, ...action.payload };
    },
    setPageShowSize(state, action) {//设置PageSize
      return { ...state, ...action.payload };
    },
    setActivityDetail(state, action) { // 设置活动详情
      return { ...state, ...action.payload }
    },
    setActivityWater(state, action) { // 设置活动流水
      return { ...state, ...action.payload }
    },
    setGroupFlowOrder(state, action) { // 设置活动流水订单列表
      return { ...state, ...action.payload }
    },
    setShelvesGoods(state, action) { // 设置已上架商品
      return { ...state, ...action.payload }
    },
    setSelectGoodsList(state, action) { // 设置选择的已上架商品
      return { ...state, ...action.payload }
    },
    setSelectGoodsId(state, action) { // 设置选择的已上架商品ID
      return { ...state, ...action.payload }
    }
  }
}