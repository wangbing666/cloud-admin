/*
登录用户信息
*/
import { 
  queryEnterpriseShopList,
  getCode,
  checkIfScanQrCode,
} from "../api/index";
// import '../../../assets/vendor/stomp.js';
// import Stomp from 'stompjs';
import { Modal, message } from 'antd';
import router from 'umi/router';
// import { config } from 'utils';

let againListenStat = true;

const listenLogin = (uuid, payload) => {
  checkIfScanQrCode({ 
    uuid: uuid,
  }).then((result) => {
    if(result && result.status === 201) {
      // 过期
      Modal.info({
        title: '温馨提示',
        content: '二维码过期，请重新获取',
        okText: '重新获取',
        onOk: () => {
          payload({type: 'loginUser/getCode', payload: payload })
        }
      })
    }
    if(result && result.status === 207) {
      if (againListenStat) {
        listenLogin(uuid, payload);
      }
    }
    if(result && result.status === 0) {
      againListenStat = false;
      const userId = result.body.user.userId;
      sessionStorage.setItem('userId', userId);
      queryEnterpriseShopList({userId: userId }).then((resolve) => {
        if (resolve && resolve.status === 0){
          const passEnt = resolve.body.AuditStatusIsTrue;
          const auditEnt = resolve.body.AuditStatusIsFalse;
          const sum = passEnt.length + auditEnt.length;
          if (sum > 1) {
            router.push({ pathname: '/login/select-ent' })
          } else if (sum === 0) {
            sessionStorage.setItem('auditEntStat', '1')
            sessionStorage.setItem('isSteps', 1)
            router.push({ pathname: '/register' })
          } else if (passEnt.length === 1) {
              if (passEnt[0].isFrozen === 2) {
                // 冻结
                sessionStorage.setItem('shopId', passEnt[0].shopId);
                router.push({ pathname: '/register/disable' })
              } else {
                sessionStorage.setItem('enterpriseId', passEnt[0].enterpriseId);
                sessionStorage.setItem('shopId', passEnt[0].shopId);
                sessionStorage.setItem('walletId', passEnt[0].walletId);
                  const commonModuleInfo = {
                  moduleType: 2, // 平台 1：企业钱包 2：电商 3：企业应用
                  enterpriseId: passEnt[0].enterpriseId, // 商户id
                  bussId: passEnt[0].shopId, // 钱包id或电商id
                  userId: sessionStorage.getItem('userId'), // 用户id
                };
                sessionStorage.setItem('commonModuleInfo', JSON.stringify(commonModuleInfo));// 公共模块所需
                // router.push({ pathname: '/home' });
                window.location.href = '';
              }
          } else {
            if (auditEnt[0].auditStatus == 4 || auditEnt[0].auditStatus == 1) {
              sessionStorage.setItem('isSteps', 1)
            }else {
              sessionStorage.setItem('isSteps', 0)
            }
            sessionStorage.setItem('auditEntStat', auditEnt[0].auditStatus);
            sessionStorage.setItem('auditShopId', auditEnt[0].shopId);
            sessionStorage.setItem('enterpriseShopId', auditEnt[0].enterpriseId);
            router.push({ pathname: '/register' })
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }).catch((err) => {
    console.log(err)
    // listenLogin(uuid, payload);
  })
}

export default {
  namespace: 'loginUser',
  state: {
    AuditStatusIsFalse: [],
    AuditStatusIsTrue: [],
    QrCode: {
      message: '',
      uuid: '',
    }
  },
  effects: {
    // 店铺列表
    * queryEnterpriseShopList({ payload }, { call, put }) {
      const data = yield call(queryEnterpriseShopList, payload)
      if (data && data.status === 0) {
        yield put({ type: 'saveEntList', payload: data.body })
      }
    },
    * getCode({ payload }, { call, put }) {
      const data = yield call(getCode, { businessType: 1, platformType: 2 });
      if (data && data.status === 0) {
        yield put({type: 'saveQrCode', payload: data.body})  
        listenLogin(data.body.uuid, payload)
        // const ws = new SockJS(`${config.BASE_URL}/commonModule/endpointChat`);
        // const client = Stomp.over(ws);
        // client.onclose = (evt) => {
        //   console.log('ws关闭');
        // };
        // client.connect('guest', 'guest', (msg) => {
        //   console.log('连接成功')
        //   client.subscribe('/user/' + data.body.uuid + '/message', (res) => {
        //     const result = JSON.parse(res.body);
        //     if (result.status === 0) {
        //       const userId = result.body.userId;
        //       sessionStorage.setItem('userId', userId);
        //       queryEnterpriseShopList({userId: userId }).then((resolve) => {
        //         if (resolve && resolve.status === 0){
        //           const passEnt = resolve.body.AuditStatusIsTrue;
        //           const auditEnt = resolve.body.AuditStatusIsFalse;
        //           const sum = passEnt.length + auditEnt.length;
        //           if (sum > 1) {
        //             router.push({ pathname: '/login/select-ent' })
        //           } else if (sum === 0) {
        //             sessionStorage.setItem('auditEntStat', '1')
        //             sessionStorage.setItem('isSteps', 1)
        //             router.push({ pathname: '/register' })
        //           } else if (passEnt.length === 1) {
        //             if (passEnt[0].isFrozen === 2) {
        //               // 冻结
        //               sessionStorage.setItem('shopId', passEnt[0].shopId);
        //               router.push({ pathname: '/register/disable' })
        //             } else {
        //               sessionStorage.setItem('enterpriseId', passEnt[0].enterpriseId);
        //               sessionStorage.setItem('shopId', passEnt[0].shopId);
        //               sessionStorage.setItem('walletId', passEnt[0].walletId);
        //               const commonModuleInfo = {
        //                 moduleType: 2, // 平台 1：企业钱包 2：电商 3：企业应用
        //                 enterpriseId: passEnt[0].enterpriseId, // 商户id
        //                 bussId: passEnt[0].shopId, // 钱包id或电商id
        //                 userId: sessionStorage.getItem('userId'), // 用户id
        //               };
        //               sessionStorage.setItem('commonModuleInfo', JSON.stringify(commonModuleInfo));// 公共模块所需
        //               // router.push({ pathname: '/home' });
        //               window.location.href = '';
        //             }
        //           } else {
        //             if (auditEnt[0].auditStatus == 4 || auditEnt[0].auditStatus == 1) {
        //               sessionStorage.setItem('isSteps', 1)
        //             }else {
        //               sessionStorage.setItem('isSteps', 0)
        //             }
        //             sessionStorage.setItem('auditEntStat', auditEnt[0].auditStatus);
        //             sessionStorage.setItem('auditShopId', auditEnt[0].shopId);
        //             sessionStorage.setItem('enterpriseShopId', auditEnt[0].enterpriseId);
        //             router.push({ pathname: '/register' })
        //           }
        //         }
        //       }).catch((err) => {
        //         console.log(err)
        //       })
        //       ws.close();
        //     } else if (result.status === -2) {
        //       ws.close();
        //       Modal.info({
        //         title: '温馨提示',
        //         content: result.msg,
        //         okText: '重新获取',
        //         onOk: () => {
        //           payload({type: 'loginUser/getCode', payload: payload })
        //         }
        //       })
        //     } else if (result.status === -1) {
        //       message.success('扫码成功!请点击登录！')
        //     }
        //   })
        // })
      }
    }
  },
  reducers: {
    saveEntList(state, { payload }) {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key]
      })
      return {...state}
    },
    saveQrCode(state, { payload }) {
      state.QrCode = payload;
      return {...state}
    }
  }
}