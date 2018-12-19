import {
  getGoodsList,
  getShelves,
  getDelGoods,
  getActivity,
  getUndergoods,
  getgoodsWhy,
  getReapply,
  getGrouping,
  getCommitTime,
  getStopGoodsInActivity
} from '../services/goodServices';
import { authorization } from 'utils';

import { message } from 'antd';
import router from 'umi/router';

export default {
  namespace: 'goodsModel',
  state: {
    searchData: {
      groupId: '', // 商品分组ID
      goodsName: "", // 商品名称
      status: "", // 商品状态
      createStartTime: '', // 创建开始时间
      createEndTime: '', // 创建结束时间
      goodsType: "", // 商品类型
      runStatus: 1, // 异常商品
    },
    enterpriseId: authorization.getUserInfo().enterpriseId, // 商品所在企业ID
    shopId: authorization.getUserInfo().shopId, // 商品所在店铺ID
    pageSize: 10, //初始化分页数
    pageNow: 1, // 初始化分页
    total: null, //商品总数
    goodsList: [], // 商品列表
    goodsWhy: [], // 商品撤下原因
    stopActivityGoods: [], // 停止活动的商品列表
    goodsGrouping: null, //商品分组
    showListLoadding: false, // 初始化页面loading
    visible: false, // 确认取消操作模态弹框
    visibleEdit: false, // 提示信息模态弹框
    visibleDetail: false, //商品被撤下弹框详情 
    confirmLoading: false, // 接口请求中的loading
    auditingDate: '', // 商品重新申请提交时间
  },
  effects: {
    //搜索列表
    * searchListData({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getGoodsList, payload);
      if (data && data.status == 0) {
        let body = data.body;
        yield put({
          type: 'initListData',
          payload: { goodsList: body.result.list, total: body.result.total }
        })
        yield put({ type: 'hideListLoadding' });
      } else {
        yield put({ type: 'hideListLoadding' });
        message.error('服务器请求出错了');
      }
    },

    //商品上架
    * Shelves({ payload }, { call, put }) {
      yield put({ type: 'showConfirmLoading' })
      const data = yield call(getShelves, payload);
      console.log('data---->', data);
      if (data && data.status == 0) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'hideConfirmLoading' })
        message.success('操作成功');
      } else {
        yield put({ type: 'hideModal' })
        yield put({ type: 'hideConfirmLoading' })
        message.error(data.msg || '网络请求出错了，请重试');
      }
    },

    // 删除商品
    * delGoods({ payload }, { call, put }) {
      yield put({ type: 'showConfirmLoading' })
      const data = yield call(getDelGoods, payload);
      console.log('data---->', data);
      if (data && data.status == 0) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'hideEditModal' })
        yield put({ type: 'hideConfirmLoading' })
        message.success('操作成功');
      } else {
        yield put({ type: 'hideModal' })
        yield put({ type: 'hideEditModal' })
        yield put({ type: 'hideConfirmLoading' })
        message.error('网络请求出错了，请重试');
      }
    },

    // 商品下架
    * Undergoods({ payload }, { call, put }) {
      yield put({ type: 'showConfirmLoading' })
      const data = yield call(getUndergoods, payload);
      console.log('data---->', data);
      if (data && data.status == 0) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'hideEditModal' })
        yield put({ type: 'hideConfirmLoading' })
        message.success('操作成功');
      } else {
        yield put({ type: 'hideModal' })
        yield put({ type: 'hideEditModal' })
        yield put({ type: 'hideConfirmLoading' })
        message.error(data.msg || '网络请求出错了，请重试');
      }
    },

    // 判断商品是否处于活动状态
    * isActivity({ payload }, { call, put }) {
      const data = yield call(getActivity, payload);
      console.log('data---->', data);
      if (data && data.status == 0) {
        if (payload.edit) {
          router.push(`/business/goods-management/goods-edit/${payload['goodsIds[]'][0]}`)
        } else {
          yield put({ type: 'showModal' })
        }
      } else if (data && data.status == 2) {
        let body = data.body
        yield put({ type: 'showEditModal' })
        if (body){
          yield put({
            type: 'setStopActivityGoods',
            payload: { stopActivityGoods: body.inActivityGoodsIds }
          })
        }
      } else {
        message.error(data.msg);
      }
    },

    // 取消商品活动
    * StopGoodsInActivity({ payload }, { call, put }) {
      const data = yield call(getStopGoodsInActivity, payload);
      yield put({ type: 'hideEditModal' })
      console.log('data---->', data);
      if (data && data.status == 0) {
        message.success('操作成功');
        // router.push(`/business/goods-management/goods-edit/${payload.goodsId}`)
      } else if (data && data.status == 1) {
        message.error(data.msg || '操作失败');
      } else {
        message.error('网络请求出错了');
      }
    },

    // 商品被撤下原因
    * goodsWhy({ payload }, { call, put }) {
      const data = yield call(getgoodsWhy, payload.goodsId);
      console.log('data---->', data);
      if (data && data.status == 0) {
        const body = data.body;
        yield put({
          type: 'setGoodsWhy',
          payload: { goodsWhy: body.result }
        })
      } else {
        message.error(data.msg);
      }
    },

    // 商品重新上架
    * Reapply({ payload }, { call, put }) {
      const data = yield call(getReapply, payload.goodsId);
      console.log('data---->', data);
      if (data && data.status == 0) {
        yield put({ type: 'hideDetailModal' })
        yield put({ type: 'hideConfirmLoading' })
      } else {
        yield put({ type: 'hideDetailModal' })
        yield put({ type: 'hideConfirmLoading' })
        message.error(data.msg || '网络请求出错了，请重试');
      }
    },

    //获取商品分组
    * grouping({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getGrouping, payload);
      if (data && data.status == 0 && data.body && data.body.groupList) {
        let body = data.body.groupList;
        yield put({
          type: 'initListData',
          payload: { goodsGrouping: body }
        })
        yield put({ type: 'hideListLoadding' });
      } else {
        yield put({ type: 'hideListLoadding' });
        message.error('服务器请求出错了');
      }
    },

    // 商品重新申请提交时间
    * CommitTime({ payload }, { call, put }) {
      const data = yield call(getCommitTime, payload.goodsId);
      if (data && data.status == 0 && data.body) {
        const body = data.body;
        yield put({
          type: 'setCommitTime',
          payload: { auditingDate: body.result }
        })
      } else {
        message.error(data.msg);
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
    setGoodsWhy(state, action) { // 商品被撤下原因
      return { ...state, ...action.payload }
    },
    setCommitTime(state, action) { // 商品重新申请提交时间
      return { ...state, ...action.payload }
    },
    setStopActivityGoods(state, action) { // 停止活动的商品列表
      return { ...state, ...action.payload }
    },
    showModal(state) {
      return { ...state, visible: true }
    },
    hideModal(state) {
      return { ...state, visible: false }
    },
    showEditModal(state) {
      return { ...state, visibleEdit: true }
    },
    hideEditModal(state) {
      return { ...state, visibleEdit: false }
    },
    showDetailModal(state) {
      return { ...state, visibleDetail: true }
    },
    hideDetailModal(state) {
      return { ...state, visibleDetail: false }
    },
    showConfirmLoading(state) {
      return { ...state, confirmLoading: true }
    },
    hideConfirmLoading(state) {
      return { ...state, confirmLoading: false }
    },
    showListLoadding(state) {
      return { ...state, showListLoadding: true };
    },
    hideListLoadding(state) {
      return { ...state, showListLoadding: false };
    },
  }
}