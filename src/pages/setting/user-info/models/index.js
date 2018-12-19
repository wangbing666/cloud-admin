import {
  queryAccountInfo,
  queryAuditPassCategory,
  queryApplyRecord,
  queryAuditResult,
  getCode,
  getAdminAuditResult,
  checkIfScanQrCode,
  queryShopContact,
} from '../api/index';
// import '../../../../assets/vendor/stomp.js';
// import Stomp from 'stompjs';
import { Modal, message } from 'antd';
import router from 'umi/router';
// import { authorization, config } from 'utils';

let againListenStat = true;

const listenLogin = (uuid, payload) => {
  checkIfScanQrCode({
    uuid: uuid,
  }).then((result) => {
    console.log(result)
    if (result && result.status === 201) {
      // 过期
      Modal.info({
        title: '温馨提示',
        content: result.msg,
        okText: '重新获取',
        onOk: () => {
          payload.dispatch({ type: 'userInfoModel/getCode', payload })
        }
      })
    }
    if (result && result.status === 207) {
      const pathname = router.location.pathname;
      if (againListenStat && pathname.includes('change-manager')) {
        listenLogin(uuid, payload);
      }
    }
    if (result && result.status === 0) {
      againListenStat = false;
      payload.dispatch({ type: 'userInfoModel/changeAuditSteps', payload: { point: 1, relationId: result.body.user.userId } })
    }
  }).catch((err) => {
    console.log(err)
  })
}

export default {
  namespace: 'userInfoModel',
  state: {
    // 企业信息
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
    },
    // 类目信息
    categoryList: {
      list: [],
      pageNow: 1,
      pageSize: 10,
      total: 0,
    },
    // 用户信息
    userInfo: {
      userName: '',
      mobile: "",
    },
    // 店铺联系方式
    contactNum: "",
    // 企业信息审核
    auditEnt: {
      status: 1, //  0 待审核 1 已过期 2通过 3 驳回  4 撤销
      msg: '',
    },
    // 更换管理员 二维码
    QrCode: {
      message: '',
      uuid: '',
    },
    // 更换管理员
    auditMaster: {
      status: 0, // 1.审核中 2.通过 3.驳回
      msg: [],
      time: '',
    },
    auditSteps: 0,
    relationId: 1,
  },
  effects: {
    // 查询经营类目
    * queryAuditPassCategory({ payload }, { call, put }) {
      const data = yield call(queryAuditPassCategory, payload)
      if (data && data.status === 0) {
        yield put({ type: 'saveCategory', payload: data.body.total })
      }
    },
    // 查询用户信息
    * queryAccountInfo({ payload }, { call, put }) {
      const data = yield call(queryAccountInfo, payload)
      if (data && data.status === 0) {
        // 手机号脱敏
        if (data.body && data.body.mobile) {
          let mobile = data.body.mobile
          let ruten = String(mobile).substring(3, 8);
          data.body.mobile = String(mobile).replace(ruten, '****')
        }
        yield put({ type: 'saveUserInfo', payload: data.body })
      }
    },

    // 查询店铺联系方式
    * queryShopContact({ payload }, { call, put }) {
      const data = yield call(queryShopContact, payload)
      if (data && data.status === 0) {
        yield put({ type: 'saveShopContact', payload: data.body })
      }
    },

    // 获取企业资料
    * queryApplyRecord({ payload }, { call, put }) {
      const data = yield call(queryApplyRecord, payload)
      if (data && data.status === 0) {
        yield put({ type: 'saveEntInfo', payload: data.body.enterpriseMsg })
      }
    },
    // 查询资料审核结果和失败原因
    * queryAuditResult({ payload }, { call, put }) {
      const data = yield call(queryAuditResult, payload)
      if (data && data.status === 0) {
        yield put({ type: 'saveAuditEnt', payload: data.body })
      }
    },
    // 更换管理员 -获取二维码
    * getCode({ payload }, { call, put }) {
      const data = yield call(getCode, payload.data);
      if (data && data.status === 0) {
        yield put({ type: 'saveQrCode', payload: data.body });
        listenLogin(data.body.uuid, payload)

        // const ws = new SockJS(`${config.BASE_URL}/commonModule/endpointChat`);
        // const client = Stomp.over(ws);
        // client.onclose = (evt) => {
        //   console.log('ws关闭');
        // };
        // const status = yield new Promise((resolve) => {
        //   client.connect('guest', 'guest', () => {
        //     resolve(true)
        //   });
        // }) 
        // if (status) {
        //   client.subscribe('/user/' + data.body.uuid + '/message', (res) => {
        //     const result = JSON.parse(res.body);
        //     if (result.status === 0) {
        //       payload.dispatch({ type: 'userInfoModel/changeAuditSteps', payload: 1 })
        //       ws.close();
        //     } else if (result.status ===  -2) {
        //       Modal.confirm({
        //         title: '温馨提示',
        //         content: result.msg,
        //         cancelText: '取消',
        //         okText: '重新获取',
        //         onOk: () => {
        //           /* eslint-disable */
        //           const userInfo = authorization.getUserInfo();
        //           payload.dispatch({type: 'userInfoModel/getCode', payload: {
        //             data: {
        //               businessType: 3, 
        //               enterpriseId: parseInt(userInfo.enterpriseId),
        //               walletId: userInfo.walletId,
        //             },
        //             dispatch: payload.dispatch,
        //           }});
        //           /* eslint-disable */
        //         }
        //       })
        //       ws.close();
        //     } else if (result.status === -1) {
        //       message.success('扫码成功!请点击登录！')
        //     }
        //   })
        // }
      }
    },
    // 更换管理员审核结果
    * getAdminAuditResult({ payload }, { call, put }) {
      const data = yield call(getAdminAuditResult, payload);
      if (data && data.status === 0) {
        yield put({ type: 'saveAuditMasterStat', payload: data.body });
      }
    }
  },
  reducers: {
    // 当前类目
    saveCategory(state, { payload }) {
      Object.keys(state.categoryList).forEach((key) => {
        state.categoryList[key] = payload[key]
      })
      return { ...state }
    },
    changePageInfo(state, { payload }) {
      state.categoryList.pageNow = payload.pageNow;
      state.categoryList.pageSize = payload.pageSize;
      return { ...state }
    },
    // 用户信息
    saveUserInfo(state, { payload }) {
      state.userInfo = payload;
      return { ...state }
    },
    // 店铺联系方式
    saveShopContact(state, { payload }) {
      state.contactNum = payload.reslut.contactNum;
      return { ...state }
    },
    // 企业信息
    saveEntInfo(state, { payload }) {
      Object.keys(state.entInfo).forEach((key) => {
        state.entInfo[key] = payload[key]
      })
      return { ...state }
    },
    // 修改文件
    changeImg(state, { payload }) {
      const id = payload.name + 'Id'
      const url = payload.name + 'Url'
      state.entInfo[id] = payload.fileId
      state.entInfo[url] = payload.fileUrl
      return { ...state }
    },
    // 企业审核返回
    saveAuditEnt(state, { payload }) {
      state.auditEnt.status = payload.audit_result;
      state.auditEnt.msg = payload.refusedReason;
      return { ...state }
    },
    // 修改审核状态
    changeAuditStat(state, { payload }) {
      state.auditEnt.status = payload;
      return { ...state }
    },
    // 更换管理员二维码
    saveQrCode(state, { payload }) {
      state.QrCode = payload;
      return { ...state }
    },
    // 更换管理员 状态
    saveAuditMasterStat(state, { payload }) {
      state.auditMaster.status = payload.AuditStatus;
      state.auditMaster.msg = payload.contentList;
      state.auditMaster.time = payload.createTime;
      return { ...state }
    },
    // 更换管理员 -步骤条
    changeAuditSteps(state, { payload }) {
      return { ...state, auditSteps: payload.point, relationId: payload.relationId }
    }
  }
}