import {
  getActivityList,
  getReleaseActivity,
  getDeleteActivity,
  getCancelActivity,
} from '../services/services';

import { message } from 'antd';
import { authorization } from 'utils';

export default {
  namespace: 'activityModel',
  state: {
    searchData: {
      conditionValue: "", // 活动名称或商品名称搜索
      nameType: 0, // 活动名称 or 商品名称
      productName: '', // 商品名称
      type: '', // 活动类型
      isStatus: '', // 活动状态
      startTime: '', // 创建时间（起）
      endTime: '', // 创建时间(止)
    },
    enterpriseId: authorization.getUserInfo().enterpriseId, // 企业店铺ID
    shopId: authorization.getUserInfo().shopId, // 店铺ID
    operationVisible: false,
    confirmLoading: false,
    showListLoadding: false,
    pageSize: 10,
    pageNow: 1,
    total: 0,
    activityList: [], // 获取活动列表
  },
  effects: {
    //查询活动列表
    * searchListData({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getActivityList, payload);
      if (data && data.status == 0) {
        if (data.groupActList) {
          yield put({
            type: 'initListData',
            payload: { activityList: data.groupActList, total: data.count }
          })
        } else {
          yield put({
            type: 'initListData',
            payload: { activityList: [], total: 0 }
          })
        }
        yield put({ type: 'hideListLoadding' });
      } else if (data && data.status !== 0) {
        yield put({ type: 'hideListLoadding' });
        message.error(data.msg || '网络请求出错了，请稍后再试');
      } else {
        yield put({ type: 'hideListLoadding' });
        console.log('服务器请求出错了')
      }
    },

    //发布活动
    * ReleaseActivity({ payload }, { call, put }) {
      yield put({ type: 'showConfirmLoading' });
      const data = yield call(getReleaseActivity, payload);
      yield put({ type: 'hideConfirmLoading' });
      yield put({ type: 'hideModal' });
      if (data && data.status == 0) {
        message.success('操作成功');
      } else {
        message.error(data.msg || '操作失败');
      }
    },

    //删除活动
    * DeleteActivity({ payload }, { call, put }) {
      yield put({ type: 'showConfirmLoading' });
      const data = yield call(getDeleteActivity, payload);
      yield put({ type: 'hideConfirmLoading' });
      yield put({ type: 'hideModal' });
      console.log(data)
      if (data && data.status == 0) {
        message.success('操作成功');
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
      } else {
        message.error(data.msg || '操作失败');
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
    showModal(state) {
      return { ...state, operationVisible: true };
    },
    hideModal(state) {
      return { ...state, operationVisible: false };
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
  }
}