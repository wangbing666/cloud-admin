import { 
  getPagegroup,
  groupGoodsList
} from "../api/index";

export default {
  namespace: 'groupModel',
  state: {
    userInfo: {
      shopId: 1003,
      userId: 12491983,
    },
    groupInfo: {
      list: [],
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      name: '', 
      createTime: '',
      endTime: '',
    }
  },
  effects: {
    * getPagegroup({ payload }, { call, put }) {
      const data = yield call(getPagegroup, payload)
      if (data.status === 0) {
        yield put({type: 'saveGroupInfo', payload: {
          list: data.body.groupList.list,
          pageIndex: data.body.groupList.pageNow,
          pageSize: data.body.groupList.pageSize,
          total: data.body.groupList.total
        }})
      } else if (data.status === -1) {
        yield put({type: 'saveGroupInfo', payload: { 
          list: [], 
          pageIndex: 1, 
          pageSize: 10, 
          total: 0 
        }})
      }
    }
  },
  reducers: {
    // 保存信息
    saveGroupInfo(state, { payload }){
      Object.keys(payload).forEach((key) => {
        state.groupInfo[key] = payload[key]
      })
      return {...state}
    },
    // 保存搜索条件
    saveSearchParams(state, { payload }) {
      Object.keys(payload).forEach((key) => {
        state.groupInfo[key] = payload[key]
      })
      return {...state}
    }
  }
}