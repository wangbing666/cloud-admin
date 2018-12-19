import {
  queryApplyRecord,
  queryWalletAuditResult,
  queryAuditResult,
  isRecommitEnterprise,
  queryFrozenReason,
} from '../api/index'

export default {
  namespace: 'registerModel',
  state: {
    entInfo: {
      enterpriseName: '', // 企业名称
      enterpriseAbbreviation: '', //企业简称
      unifiedSocialRegCode: '', // 社会注册代码
      contactName: '', // 联系人
      contactMobile: '', // 联系手机号
      industryId: '', // 所属行业id
      businessLicensePicId: 0, // 营业执照-文件-id
      businessLicensePicUrl: '', // 营业执照-url
      authorizationPicId: 0, // 企业授权书-文件-id
      authorizationPicUrl: '', // 企业授权书-url
      logoPicId: 0, // logo-文件-id
      logoPicUrl: '', // logo-url
      shopName: '', // 店铺名称
      categoryList: [], // 选择经营类目
      shopAbbreviation: '', // 店铺简介
      shopCoverPicId: 0, // 封面-id
      shopCoverPicUrl: '', // 封面-URL
      categoryStringList: [], 
      industryString: '',
    },
    // 企业信息审核
    auditEnt: {
      status: 0, //  0 待审核 1 已过期 2通过 3 驳回  4 撤销
      msg: [],
      resubmit: false, // 是否可以重新提交(是否超过24小时)
    },
    // 钱包审核
    auditWallet: {
      status: 0, // // 0未提交 1待审核 2通過 3驳回 (auditStatus)
      msg: '',
      walletNo: '',
    },
    stopInfo: {
      msg: [],
    }
  },
  effects: {
    // 获取企业资料
    * queryApplyRecord({ payload }, { call, put }) {
      const data = yield call(queryApplyRecord, payload)
      if (data && data.status === 0) {
        yield put({ type: 'saveEntInfo', payload: data.body.enterpriseMsg })
      }
    },
    // 查询企业关联钱包审核结果及失败原因
    * queryWalletAuditResult({ payload }, { call, put }) {
      const data = yield call(queryWalletAuditResult, payload)
      if (data && data.status === 0) {
        yield put({type: 'saveAuditWallet', payload: data.body})
      }
    },
    // 查询资料审核结果和失败原因
    * queryAuditResult({ payload }, { call, put }) {
      const data = yield call(queryAuditResult, payload)
      if (data && data.status === 0) {
        yield put({type: 'saveAuditEnt', payload: data.body})
      }
    },
    // 是否可以重新提交
    * isRecommitEnterprise({ payload }, { call, put }) {
      const data = yield call(isRecommitEnterprise, payload)
      if (data && data.status === 0) {
        yield put({ type: 'saveReSubStat', payload: data.body.result})
      }
    },
    // 冻结原因
    * queryFrozenReason({ payload }, { call, put }) {
      const data = yield call(queryFrozenReason, payload)
      if (data && data.status === 0) {
        yield put({type: 'saveStopInfo', payload: data.body.result })
      }
    }
  },
  reducers: {
    saveEntInfo(state, { payload }) {
      Object.keys(state.entInfo).forEach((key) => {
        state.entInfo[key] = payload[key]
      })
      return {...state}
    },
    // 修改文件
    changeImg(state, { payload }) {
      const id = payload.name + 'Id'
      const url = payload.name + 'Url'
      state.entInfo[id] = payload.fileId
      state.entInfo[url] = payload.fileUrl
      return {...state}
    },
    // 企业审核返回
    saveAuditEnt(state, { payload }) {
      state.auditEnt.status = payload.audit_result;
      state.auditEnt.msg = payload.refusedReason;
      return {...state}
    },
    // 钱包审核状态
    saveAuditWallet(state, { payload }) {
      state.auditWallet.status = payload.auditStatus;
      state.auditWallet.msg = payload.auditOpinion;
      state.auditWallet.walletNo = payload.walletNo;
      return {...state}
    },
    saveReSubStat(state, { payload }) {
      state.auditEnt.resubmit = payload === 1 ? true : false;
      return {...state}
    },
    setDefaultEntData(state) {
      state.entInfo = { 
        enterpriseName: '', // 企业名称
        enterpriseAbbreviation: '', //企业简称
        unifiedSocialRegCode: '', // 社会注册代码
        contactName: '', // 联系人
        contactMobile: '', // 联系手机号
        industryId: '', // 所属行业id
        businessLicensePicId: 0, // 营业执照-文件-id
        businessLicensePicUrl: '', // 营业执照-url
        authorizationPicId: 0, // 企业授权书-文件-id
        authorizationPicUrl: '', // 企业授权书-url
        logoPicId: 0, // logo-文件-id
        logoPicUrl: '', // logo-url
        shopName: '', // 店铺名称
        categoryList: [], // 选择经营类目
        shopAbbreviation: '', // 店铺简介
        shopCoverPicId: 0, // 封面-id
        shopCoverPicUrl: '', // 封面-URL
        categoryStringList: [], 
        industryString: '',
      }
      return { ...state }
    },
    saveStopInfo(state, { payload }) {
      state.stopInfo.msg = payload;
      return {...state}
    }
  }
}