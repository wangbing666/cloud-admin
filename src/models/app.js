/* eslint-disable */

import { routerRedux } from 'dva/router';
import createHistory from 'history/createBrowserHistory';
// import { parse } from 'qs'
// import config from 'config'
// import { EnumRoleType } from 'enums'
// import { query, logout } from 'services/app'
// import * as menusService from 'services/menus'
// import queryString from 'query-string'

// const { prefix } = config
export default {
  namespace: 'app',
  state: {
    user: {},
  },
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(( pathname ) => {

      })
    },
    
  },
  reducers: {
    
  },
}