import {
  getShopInfo,
  getBanners,
  getPartitions,
  getAtivityList,
  getshopThemeShopList,
  getShopThemeInfo,
  getVoucher,
  listShopGroupName,
  getInsertLog,
} from '../api/index.js'

export default {
  namespace: 'shopModel',
  state: {
    userInfo: {
      shopId: 8,
      enterpriseId: 10280, // 10136
      userId: 12495389, // 12495389
    },
    previewStat: false,
    baseInfo: {
      shopName: '',
      shopIntrod: '',
      zoomUrl: '',
      fileUrl: '',
      hostUrl: '',
      fileId: 0,
    },
    bannerList: [
      // { 
      //   activityId: 0, 
      //   fileId: 0, 
      //   fileUrl: '', 
      //   hostUrl: '', 
      //   linkUrl: '', 
      //   templateId: null, 
      //   zoomUrl: '' 
      // },
    ],
    partitionList: [
      // { 
      //   partitionId: 0, 
      //   backGroupFileUrl: '',
      //   backGroupHostUrl: '',
      //   backGroupZoomUrl: '',
      //   sort: 2, 
      //   status: 2, 
      //   templateType: 2, 
      //   title: '',
      //   goodsFiles: []
      // }
    ],
    groupList: [
      { key: 1, type: 1 },
      { key: 2, type: 2 }
    ],
    sortKey: ['a', 'b', 'c'],
    activityInfo: {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    },
    themeColors: [],
    shopThemeInfo: {
      colorId: 0,
      btStyleId: 0,
      switchStat: true,
      shopFormwork: [],
      groupStyle: 1, // 分组样式
    },
    curGpstyle: 1,
    allActivity: {
      list: [] // 下拉框使用数据
    },
    qnVoucher: '',
    activityDetail: {

    },
    groupOptions: [],
    bannerCount: 0, // 统计是否修改店铺banner而没有保存发布
    groupingCount: 0, // 统计是否修改店铺分组而没有保存发布
    partitionCount: 0, // 统计是否修改店铺分区而没有保存发布
  },
  effects: {
    // 获取店铺基本信息
    * getShopInfo({ payload }, { call, put }) {
      const data = yield call(getShopInfo, payload)
      if (data && data.status === 0 && data.body.shopInfo !== null) {
        const orderData = {
          shopName: data.body.shopInfo.shopName,
          shopIntrod: data.body.shopInfo.describes,
          fileUrl: data.body.shopInfo.fileUrl,
          hostUrl: data.body.shopInfo.hostUrl,
          zoomUrl: data.body.shopInfo.zoomUrl,
          fileId: data.body.shopInfo.fileId,
        }
        yield put({ type: 'saveShopBaseInfo', payload: { ...orderData } })
      } else {
      }
    },
    // 获取店铺banner列表
    * getBanners({ payload }, { call, put }) {
      const data = yield call(getBanners, payload)
      if (data && data.status === 0) {
        yield put({
          type: 'saveShopBanner',
          payload: data.body.shopbannerjson
        })
      } else {
      }
    },
    // 获取分区列表
    * getPartitions({ payload }, { call, put }) {
      const data = yield call(getPartitions, payload)
      if (data && data.status === 0) {
        yield put({
          type: 'saveShopPartitions',
          payload: data.body.partitions
        })
      } else {
      }
    },
    // 获取店铺活动列表
    * getAtivityList({ payload }, { call, put }) {
      const data = yield call(getAtivityList, payload)
      if (data && data.status === 0) {
        yield put({
          type: 'savesShopActivityInfo',
          payload: {
            list: data.body.activityList.list,
            total: data.body.activityList.total,
            pageIndex: data.body.activityList.pageNow,
            pageSize: data.body.activityList.pageSize,
          }
        })
      } else {
      }
    },
    // 获取主题色板
    * getshopThemeShopList({ payload }, { call, put }) {
      const data = yield call(getshopThemeShopList, payload)
      if (data && data.status === 0) {
        yield put({ type: 'saveColorTheme', payload: data.body.themeColors })
      } else {
      }
    },
    // 获取主题设置参数
    * getShopThemeInfo({ payload }, { call, put }) {
      const data = yield call(getShopThemeInfo, payload)
      if (data && data.status === 0) {
        yield put({ type: 'saveShopThemeInfo', payload: data.body })
      }
    },
    // 获取全部关联活动(下拉框)
    * getAllActivity({ payload }, { call, put }) {
      const data = yield call(getAtivityList, payload)
      if (data && data.status === 0) {
        yield put({
          type: 'saveAllActivity', payload: {
            list: data.body.activityList.list,
          }
        })
      } else { }
    },
    // 店铺分组列表-下拉框
    * listShopGroupName({ payload }, { call, put }) {
      const data = yield call(listShopGroupName, payload)
      if (data && data.status === 0) {
        yield put({ type: 'saveGroupOption', payload: data.body.shopGroupList })
      }
    },

    // 获取上传七牛token
    * getVoucher({ payload }, { call, put }) {
      const data = yield call(getVoucher, payload)
      if (data && data.status === 0) {
        yield put({ type: 'saveVoucher', payload: data.body.uploadVoucher })
      }
    },

    // 调取日志接口
    * InsertLog({ payload }, { call, put }) {
      const data = yield call(getInsertLog, payload)
      if (data && data.status === 0) {
        console.log('成功')
      }
    },
  },
  reducers: {
    // 储存店铺基本信息
    saveShopBaseInfo(state, { payload }) {
      state.baseInfo = payload
      return { ...state };
    },
    // 储存banner信息
    saveShopBanner(state, { payload }) {
      state.bannerList = payload
      return { ...state }
    },
    // 储存所以关联活动(下拉框)
    saveAllActivity(state, { payload }) {
      state.allActivity.list = payload.list
      return { ...state }
    },
    // 储存分区信息
    saveShopPartitions(state, { payload }) {
      state.partitionList = payload
      return { ...state }
    },
    // 储存活动信息
    savesShopActivityInfo(state, { payload }) {
      Object.keys(payload).forEach((e) => {
        state.activityInfo[e] = payload[e]
      })
      return { ...state }
    },
    // 储存主题颜色列表
    saveColorTheme(state, { payload }) {
      state.themeColors = payload
      return { ...state }
    },
    // 储存风格样式
    saveShopThemeInfo(state, { payload }) {
      const { a, b, c, shopFormWork } = payload;
      const sortOb = { a: a, b: b, c: c }
      const newSortArr = Object.keys(sortOb).filter((key) => sortOb[key] !== 0).sort((a, b) => sortOb[a] - sortOb[b]) // 排序算法
      state.sortKey = newSortArr;
      state.shopThemeInfo.shopFormwork = [...shopFormWork.shopFormwork];
      state.shopThemeInfo.colorId = shopFormWork.themeId - 1;
      state.shopThemeInfo.btStyleId = shopFormWork.shape - 1;
      state.shopThemeInfo.switchStat = shopFormWork.needCS === 1 ? true : false;
      state.shopThemeInfo.groupStyle = shopFormWork.styleId;
      state.curGpstyle = shopFormWork.styleId;
      return { ...state }
    },
    // bannner排序
    sortBanner(state, { payload }) {
      state.bannerList = payload;
      return { ...state };
    },
    // 删除banner
    deleteBanner(state, { payload }) {
      state.bannerList.splice(payload, 1)
      return { ...state }
    },
    // 分区排序
    sortPartition(state, { payload }) {
      state.partitionList = payload;
      return { ...state };
    },
    // 删除分区
    deletePartition(state, { payload }) {
      state.partitionList.splice(payload, 1)
      return { ...state }
    },
    // 修改颜色
    setThemeColorId(state, { payload }) {
      state.shopThemeInfo.colorId = payload;
      return { ...state };
    },
    // 修改BT样式
    setThemeBt(state, { payload }) {
      state.shopThemeInfo.btStyleId = payload;
      return { ...state };
    },
    // 修改switch状态
    setSwitchStat(state, { payload }) {
      state.shopThemeInfo.switchStat = payload;
      return { ...state };
    },
    // 块级显示
    setShopFormWork(state, { payload }) {
      state.shopThemeInfo.shopFormwork = payload;
      return { ...state };
    },
    // 保存七牛token
    saveVoucher(state, { payload }) {
      state.qnVoucher = payload
      return { ...state }
    },
    // 编辑BANNER
    editBanerInfo(state, { payload }) {
      const { data, type } = payload;
      if (type !== 'new') {
        state.bannerList[type] = data
      } else {
        state.bannerList.push(data)
      }
      return { ...state }
    },
    // changePreviewStat
    changePreviewStat(state, { payload }) {
      state.previewStat = payload
      return { ...state }
    },
    // 修改分组风格
    setGroupStyle(state, { payload }) {
      state.shopThemeInfo.groupStyle = payload
      return { ...state }
    },
    // 店铺分组列表-下拉框
    saveGroupOption(state, { payload }) {
      state.groupOptions = payload;
      return { ...state }
    },
    changeCurGpstyle(state, { payload }) {
      state.curGpstyle = payload;
      return { ...state }
    },
    setBannerCount(state, action) { // 统计是否修改店铺banner，而没有保存进行保存并发布
      return { ...state, ...action.payload }
    },
    setGroupingCount(state, action) { // 统计是否修改店铺分组，而没有保存进行保存并发布
      return { ...state, ...action.payload }
    },
    setPartitionCount(state, action) { // 统计是否修改店铺分区，而没有保存进行保存并发布
      return { ...state, ...action.payload }
    }
  }
}
