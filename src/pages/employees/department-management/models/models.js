import { getDepartList, getDeptDetail, saveOrUpdateDept, getDeleteDept, getDeptList } from '../services/services'
import { message } from 'antd';
import { authorization } from 'utils';
import router from 'umi/router';

export default {
  namespace: 'departmentModel',
  state: {
    searchData: {
      deptName: "",
      parentId: 0,
    },
    bussId: authorization.getUserInfo().commonModuleInfo.bussId || '',
    bussType: authorization.getUserInfo().commonModuleInfo.moduleType || '',
    hasEmployee: 0,
    enterpriseId: authorization.getUserInfo().enterpriseId,
    userId: authorization.getUserInfo().userId,
    showListLoadding: false,
    pageSize: 10,
    pageNow: 1,
    total: null,
    departmentList: [], // 部门列表
    superiorDdepList: [], // 上级部门列表
    departmentDetail: {}, // 部门详情
  },
  effects: {
    //搜索列表
    * searchListData({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getDepartList, payload);
      console.log('data---->', authorization.getUserInfo().commonModuleInfo);
      if (data && data.status == 1 && data.body) {
        let body = data.body;
        yield put({
          type: 'initListData',
          payload: { departmentList: body.deptList, total: body.count }
        })
        yield put({ type: 'hideListLoadding' });
      } else {
        yield put({ type: 'hideListLoadding' });
        message.error(data && data.msg ? data.msg : '网络请求出错了，请稍后再试');
      }
    },

    // 获取上级部门列表
    * DeptList({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getDeptList, payload);
      console.log('data---->', data);
      if (data && data.status == 1 && data.body) {
        let body = data.body;
        yield put({
          type: 'setDepList',
          payload: { superiorDdepList: body.deptList }
        })
        yield put({ type: 'hideListLoadding' });
      } else {
        yield put({ type: 'hideListLoadding' });
        message.error(data && data.msg ? data.msg : '网络请求出错了，请稍后再试');
      }
    },

    //获取部门详情
    * DeptDetail({ payload }, { call, put }) {
      yield put({ type: 'showListLoadding' });
      const data = yield call(getDeptDetail, payload);
      if (data && data.status == 1 && data.body) {
        let body = data.body;
        yield put({
          type: 'setDeptDetail',
          payload: { departmentDetail: body.dept, hasEmployee: body.hasEmployee }
        })
        yield put({ type: 'hideListLoadding' });
      } else {
        yield put({ type: 'hideListLoadding' });
        message.error(data.msg);
      }
    },

    // 新增或修改部门
    * saveOrUpdateDept({ payload }, { call, put }) {
      const data = yield call(saveOrUpdateDept, payload);
      if (data && data.status == 1 && data.body) {
        message.success('操作成功')
        router.push(`/employees/department-management`);
      } else {
        message.error(data.msg);
      }
    },

    // 删除部门
    * DeleteDept({ payload }, { call, put }) {
      const data = yield call(getDeleteDept, payload);
      if (data && data.status == 0 && data.body) {
        message.success('操作成功')
        router.push(`/employees/department-management`);
      } else {
        message.error(data.msg);
      }
    },
  },
  reducers: {
    initListData(state, action) {
      return { ...state, ...action.payload }
    },
    setDepList(state, action) {
      return { ...state, ...action.payload }
    },
    setSearchData(state, action) {
      return { ...state, ...action.payload }
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
    setDeptDetail(state, action) {
      return { ...state, ...action.payload }
    },
  }
}