import { queryOperateLog } from '../api/index';

export default {
  namespace: 'loggerModel',
  state: {
    userInfo: {

    },
    list: [],
    total: 0,
    searchParams: {
      pageNow: 1,
      pageSize: 10,
      startTime: '',
      endTime: '',
      realname: '',
      loginIp: '',
      userId: '',
      shopId: sessionStorage.getItem('shopId'),
    }
  },
  effects: {
    * queryOperateLog({ payload }, { call, put }) {
      const data = yield call(queryOperateLog, payload)
      if (data && data.status === 0 && data.body.result) {
        yield put({type: 'saveInfo', payload: data.body.result})
      }
    }
  },
  reducers: {
    saveInfo(state, { payload }) {
      state.list = payload.list ? payload.list : []
      state.total = payload.total
      return {...state}
    },
    saveSearchParams(state, { payload }) {
      Object.keys(payload).forEach((key) => {
        state.searchParams[key] = payload[key]
      })
      return {...state}
    },
  }
}
