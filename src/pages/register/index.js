import React, { Component } from 'react';
import { Button, Steps, Row, Col, Form, Input, Icon, message, Modal, Spin } from 'antd';
import styles from './index.less';
import successImg from '../../assets/images/sales-order/u5436.png';
import EnterpriseDatumForm from '../../components/EnterpriseDatumForm';
import { connect } from 'dva';
import { saveInfo, getWalletInfoById, bindEnterpriseWallet, reapply, queryEnterpriseShopList } from './api/index';
import router from 'umi/router';

const Step = Steps.Step;
const FormItem = Form.Item;

const rowConf = {
  type: 'flex',
  justify: 'center',
}

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: {
    offset: 1,
    span: 12,
  },
}

const formItemRight = {
  wrapperCol: {
    offset: 8,
    span: 12,
  },
}

const ShowWalletInfo = Form.create()((props) => {
  return (
    <Form>
      <FormItem label="钱包ID" {...formItemLayout}>
        <p className="show-Ent-info-p">{props.walletNo}</p>
      </FormItem>
    </Form>
  )
})

const ShowEntInfo = Form.create()((props) => {
  const { entInfo } = props;
  return (
    <Form>
      <FormItem label="企业名称" {...formItemLayout}>
        <p className="show-Ent-info-p">{entInfo.enterpriseName}</p>
      </FormItem>
      <FormItem label="企业简称" {...formItemLayout}>
        <p className="show-Ent-info-p">{entInfo.enterpriseAbbreviation}</p>
      </FormItem>
      <FormItem label="社会注册代码" {...formItemLayout}>
        <p className="show-Ent-info-p">{entInfo.unifiedSocialRegCode}</p>
      </FormItem>
      <FormItem label="联系人" {...formItemLayout}>
        <p className="show-Ent-info-p">{entInfo.contactName}</p>
      </FormItem>
      <FormItem label="联系手机号" {...formItemLayout}>
        <p className="show-Ent-info-p">{entInfo.contactMobile}</p>
      </FormItem>
      <FormItem label="所属行业" {...formItemLayout}>
        <p className="show-Ent-info-p">{entInfo.industryString}</p>
      </FormItem>
      <FormItem label="营业执照" {...formItemLayout}>
        <img src={entInfo.businessLicensePicUrl} alt="" style={{width: 250, height: 190}} />
      </FormItem>
      <FormItem label="企业授权书" {...formItemLayout}>
        <img src={entInfo.authorizationPicUrl} alt="" style={{width: 250, height: 190}} />
      </FormItem>
      <FormItem label="logo" {...formItemLayout}>
        <img src={entInfo.logoPicUrl} alt="" style={{width: 250, height: 190}} />
      </FormItem>
      <FormItem label="店铺名称" {...formItemLayout}>
        <p className="show-Ent-info-p">{entInfo.shopName}</p>
      </FormItem>
      <FormItem label="经营类目" {...formItemLayout}>
        <p className="show-Ent-info-p">{entInfo.categoryStringList.join(',')}</p>
      </FormItem>
      <FormItem label="店铺简介" {...formItemLayout}>
        <p className="show-Ent-info-p">{entInfo.shopAbbreviation}</p>
      </FormItem>
      <FormItem label="封面" {...formItemLayout}>
        <img src={entInfo.shopCoverPicUrl} alt="" style={{width: 250, height: 190}} />
      </FormItem>
    </Form>
  )
})

const BindWallet = Form.create()(
  class createForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        searchStatus: false,
        searchParams: '', // 搜索内容
        resStatus: 1, // 1 有结果   -2已被占用  -1无结果(钱包搜索结果)
        walletInfo: {
          walletAlias: '',
          zoomUrl: '',
          fileUrl: '',
          walletNo: '',
        }
      }
    }
 
    onChangeSearch = (res) => {
      const { value } = res.target;
      this.setState({
        searchParams: value,
      })
    }
    // 搜索
    _search() {
      const { searchParams } = this.state;
      getWalletInfoById({walletNo: searchParams}).then((res) => {
        if (res && res.status === 0) {
          this.setState({
            resStatus: res.body.body,
            searchStatus: true,
            walletInfo: res.body.body === 1 ? res.body : this.state.walletInfo,
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    }

    openWalletCue() {
      Modal.info({
        title: '提示',
        content: '企业钱包是业务方首付款的资金账户，企业钱包ID便是企业钱包的唯一标识！',
        okText: '知道了',
      })
    }

    render() {
      const { searchStatus, resStatus, walletInfo } = this.state;
      const { bindWallet } = this.props;
      return (
        <div className={styles.bindWallet}>
          <Form>
            <FormItem label="输入企业钱包ID" {...formItemLayout}>
              <Row>
                <Col span={22}>
                  <Input onChange={this.onChangeSearch}/>
                  <p>什么是<a onClick={this.openWalletCue}>企业钱包?</a></p>
                </Col>
                <Col span={2} style={{ textAlign: 'right' }}>
                  <a onClick={this._search.bind(this)}>搜索</a>
                </Col>
              </Row>
            </FormItem>
            <FormItem {...formItemRight}>
              <Row>
                <Col span={22} style={{ textAlign: 'center' }}>
                  {
                    searchStatus && resStatus === 1 ? <ResSuccessOK walletInfo={walletInfo} bindWallet={bindWallet} /> : searchStatus && resStatus === -2 ? <ResSuccessNo /> : searchStatus && resStatus === -1 ? <ResFail /> : null
                  }
                </Col>
              </Row>
            </FormItem>
          </Form>
        </div>
      )
    }
  }
)

const SubFinish = (props) => {
  return (
    <div className={styles.complete}>
      <img src={successImg} alt="" />
      <p>{props.text}</p>
    </div>
  )
}

const Verifying = (props) => {
  const {stat } = props;
  if(stat === 'error') {
    const { text, msg, name, resubmit, logger} = props;
    return (
      <div className={styles.verifying}>
        <Icon type="close-circle-o" style={{ fontSize: '80px', color: 'red' }} />
        <p>{text}</p>
        {
          Array.isArray(msg) ? 
            msg.map((value) => {
              return (
                <p>{value}</p>
              )
            }) : msg
        }
        <p>
          <Button onClick={() => logger(name)}>查看申请记录</Button>
          <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => resubmit(name)}>重新提交</Button>
        </p>
      </div>
    )
  } else if(stat === 'loading') {
    const { text, name, resubmit, logger} = props;
    return (
      <div className={styles.verifying}>
        <Icon type="clock-circle" style={{ fontSize: '80px', color: '#007AED' }} />
        <p>{text}</p>
        <p>如有疑问，可联系客服：021-6079-0010</p>
        <p>
          <Button onClick={() => logger(name)}>查看申请记录</Button>
          {
            (props.reSubStat &&  name === 'info') ? <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => resubmit(name)}>重新提交</Button> : null
          }
        </p>
      </div>
    )
  } else {
    if (stat === 'all-error') {
      return (
        <div className={styles.verifying}>
          <Icon type="close-circle-o" style={{ fontSize: '80px', color: 'red' }} />
          <p>审核失败</p>
        </div>
      )
    }else {
      return (
        <div className={styles.verifying}>
          <Icon type="clock-circle" style={{ fontSize: '80px', color: '#007AED' }} />
          <p>审核中</p>
          <p>如有疑问，可联系客服：021-6079-0010</p>
        </div>
      )
    }
  }
}

const ResSuccessOK = (props) => {
  return (
    <div>
      <div className={styles.showSearchRes} style={{ padding: '10px', lineHeight: '20px' }}>
        <Row>
          <Col span={7} style={{ textAlign: 'left' }}>
            <img className={styles.walletLogo} src={props.walletInfo.zoomUrl} alt="" />
          </Col>
          <Col span={17} style={{ textAlign: 'left' }}>
            <p style={{ marginTop: '30px' }}>ID：{props.walletInfo.walletNo}</p>
            <p style={{ marginTop: '10px' }}>钱包名称：{props.walletInfo.walletAlias}</p>
          </Col>
        </Row>
      </div>
      <Button type="primary" onClick={() => props.bindWallet(props.walletInfo.walletNo)}>提交</Button>
    </div>
  );
}

const ResSuccessNo = () => {
  return (
    <div>
      <div className={styles.showSearchRes}>该钱包已被占用，请重新开通钱包！</div>
    </div>
  );
}
const ResFail = () => {
  return (
    <div>
      <div className={styles.showSearchRes}>没有搜索结果，请确认ID的准确性！</div>
    </div>
  );
}

/*
  后台状态 
  1.未填写
  2.审核成功
  3.审核失败
  4.保存未提交
  5.审核中 
*/

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false, // render-status
      isOnce: true, // 是否
      current: 0, // 进度条状态
      infoStatus: 0, // 1未填 2 已填未提交 3 审核中 4 审核失败 5 审核成功
      walletStatus: 0, // 1未关联 2审核中 3 审核失败 4 审核成功
      currentShow: 0, // 1资料表单 2关联信息填写 3关联审核中 4关联审核失败 5关联审核成功 6.资料审核中 7资料审核失败 8资料审核成功 9首次提交完成 10整体审核中 11整体审核失败 12整体审核通过 
      loggerDialog: false,
      loggerPeg: '',
    }
  }
  
  switchShow(auditEntStat, userId, enterpriseShopId, auditShopId) {
    const { dispatch } = this.props;
    if (auditEntStat && userId) {
      this.setState({
        auth: true,
      })
      switch(auditEntStat) {
        case '1': 
          this.setState({
            currentShow: 1, // 企业资料
            current: 0, 
            walletStatus: 1, // 未关联
            infoStatus: 1
          })
          dispatch({type: 'registerModel/setDefaultEntData'});
          break;
        case '2':
          this.setState({
            current: 2,
            infoStatus: 5,
            walletStatus: 4,
            currentShow: 12,
          })
          break;
        case '3': 
          // promiss-是否企业资料 失败
          if (enterpriseShopId && auditShopId) {
            dispatch({type: 'registerModel/queryAuditResult', payload: {enterpriseShopId: enterpriseShopId }}).then(()=>{
              return dispatch({type: 'registerModel/queryWalletAuditResult', payload: {shopId: auditShopId }})
            }).then(() => {
              const { registerModel } = this.props;
              const { auditEnt, auditWallet } = registerModel;
              const infoStatus = auditEnt.status === 0 ? 3 : auditEnt.status === 2 ? 5 : 4;
              const walletStatus = auditWallet.status === 0 ? 1 : auditWallet.status === 1 ? 2 : auditWallet.status === 2 ? 4 : 3;
              this.setState({
                current: 2,
                infoStatus: infoStatus,
                currentShow: infoStatus === 4 ? 7 : 4,
                walletStatus: walletStatus,
              })
            })
          }
          break;
        case '4':
          this.setState({
            current: 0,
            walletStatus: 1,
            currentShow: 1,
            infoStatus: 2,
          })
          if (enterpriseShopId){
            setTimeout(() => {
              dispatch({ type: 'registerModel/queryApplyRecord', payload: {enterpriseShopId: enterpriseShopId } })
            }, 250)
          } 
          break;
        case '5': 
          if (enterpriseShopId && auditShopId) {
            dispatch({type: 'registerModel/queryAuditResult', payload: {enterpriseShopId: enterpriseShopId }}).then(()=>{
              return dispatch({type: 'registerModel/queryWalletAuditResult', payload: {shopId: auditShopId }})
            }).then(() => {
              const { registerModel } = this.props;
              const { auditEnt, auditWallet } = registerModel;
              const infoStatus = auditEnt.status === 0 ? 3 : 5;
              const walletStatus = auditWallet.status === 0 ? 1 : auditWallet.status === 1 ? 2 : 4;
              if (walletStatus === 1) {
                this.setState({
                  current: 2,
                  infoStatus: infoStatus,
                  currentShow: 2,
                  walletStatus: 1,
                })
              } else if(walletStatus === 4 && infoStatus === 5) {
                this.setState({
                  currentShow: 12,
                  current: 2,
                })
              } else {
                this.setState({
                  current: 2,
                  infoStatus: infoStatus,
                  currentShow: infoStatus === 5 ? 3 : 6,
                  walletStatus: walletStatus,
                })
              }
            })
          }
          break;
        default:
          break;
      }
    } else {
      router.replace('/login');
    }
  }
  
  async componentDidMount() {
    const auditEntStat = sessionStorage.getItem('auditEntStat');
    const userId = sessionStorage.getItem('userId');
    const enterpriseShopId = sessionStorage.getItem('enterpriseShopId');
    const auditShopId = sessionStorage.getItem('auditShopId');
    const isSteps = sessionStorage.getItem('isSteps'); 
    const self = this;
    if(isSteps === '0') {
      queryEnterpriseShopList({userId: userId}).then((res) => {
        if (res && res.status === 0) {
          res.body.AuditStatusIsFalse.forEach((value) => {
            // console.log(value.enterpriseId, enterpriseShopId)
            if (value.enterpriseId == enterpriseShopId) {
              const auditStatus = value.auditStatus.toString();
              sessionStorage.setItem('auditEntStat', auditStatus);
              self.switchShow(auditStatus, userId, enterpriseShopId, auditShopId)
            }
          });
        }
      })
      // this.switchShow(auditEntStat, userId, enterpriseShopId, auditShopId )
    } else {
      this.switchShow(auditEntStat, userId, enterpriseShopId, auditShopId )
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    const { infoStatus, currentShow } = this.state;
    const { dispatch } = this.props;
    const enterpriseShopId = sessionStorage.getItem('enterpriseShopId')
    if (prevState.currentShow !== 6 && infoStatus === 3 && enterpriseShopId && currentShow === 6) {
      dispatch({
        type: 'registerModel/isRecommitEnterprise',
        payload: { enterpriseShopId: enterpriseShopId }
      })
    }
  }

  // 更换文件
  changeImg(name, options) {
    const { dispatch } = this.props;
    const fileId = options.fileId;
    const fileUrl = options.hostUrl + options.fileUrl;
    dispatch({ type: 'registerModel/changeImg', payload: {name: name, fileId: fileId, fileUrl: fileUrl } })
  }

  // 保存企业信息
  saveInfo(params) {
    const enterpriseShopId = sessionStorage.getItem('enterpriseShopId');
    const userId = sessionStorage.getItem('userId');
    const auditEntStat = sessionStorage.getItem('auditEntStat');// 审核状态 大类
    const { isOnce, walletStatus } = this.state;
    if (userId) {
      const orderData = Object.assign({}, params)
      if (auditEntStat !== '1') {
        orderData['enterpriseShopId'] = enterpriseShopId; // 非新增
      }
      orderData['shopAdminId'] = userId;
      if (!isOnce) {
        // 重新提交
        reapply(orderData).then((res) => {
          if (res && res.status === 0) {
            if(walletStatus === 3){
              sessionStorage.setItem('auditEntStat', 3);
            } else {
              sessionStorage.setItem('auditEntStat', 5);
            }
            this.setState({
              current: 2,
              currentShow: 6,
              infoStatus: 3,
            })
          } else {
            if (res.status === -2) {
              Modal.info({
                title: '提示',
                content: '工单号过期， 请刷新页面',
                okText: '刷新',
                onOk: () => {
                  /* eslint-enable */
                  window.location.reload();
                  /* eslint-enable */
                }
              })
            } else {
              message.error(res.msg)
            }
          }
        }).catch((err) => {
          console.log(err)
        })
        
      }else {
        // 首次提交
        saveInfo(orderData).then((res) => {
          if (res && res.status === 0) {
            if(params.type === 1) {
              /**
               * first submit save enterpriseId,shopId and change auditShopId 
              */
              sessionStorage.setItem('auditEntStat', 5);
              sessionStorage.setItem('enterpriseShopId', res.body.enterpriseShopId);
              sessionStorage.setItem('auditShopId', res.body.shopId);
              this.setState({
                current: 1,
                walletStatus: 1,
                currentShow: 2,
                infoStatus: 3,
              })
            } else {
              message.success('保存成功');
              router.push({pathname: '/login/select-ent'});
            }
          }else {
            message.error(res.msg)
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }

  changeCurrentShow = (res) => {
    const { infoStatus, walletStatus } = this.state;
    const auditEntStat = sessionStorage.getItem('auditEntStat');
    const isSteps = sessionStorage.getItem('isSteps'); 
    if (isSteps === '0') {
      if (res === 0) {
        switch(infoStatus) {
          case 1:
            this.setState({
              currentShow: 1,
            })
            break;
          case 2:
            this.setState({
              currentShow: 1,
            })
            break;
          case 3:
            this.setState({
              currentShow: 6,
            })
            break;
          case 4:
            this.setState({
              currentShow: 7,
            })
            break;
          case 5:
            this.setState({
              currentShow: 8,
            })
            break;
          default:
            break;
        } 
      } else if (res === 1) {
        switch(walletStatus) {
          case 1:
            this.setState({
              currentShow: 2,
            })
            break;
          case 2:
            this.setState({
              currentShow: 3,
            })
            break;
          case 3:
            this.setState({
              currentShow: 4,
            })
            break;
          case 4:
            this.setState({
              currentShow: 5,
            })
            break;
          default:
            break;
        } 
      } else {
        switch(auditEntStat) {
          case '3':
            this.setState({
              currentShow: 11,
            })
            break;
          case '5':
            this.setState({
              currentShow: 10,
            })
            break;
          default:
            break;
        }
      } 
    }
  }

  // 重新提交
  resubmit = async (res) => {
    if (res !== 'wallet') {
      const { dispatch, registerModel } = this.props;
      const currentAuditEntStatus = {...registerModel.auditEnt}.status;
      const enterpriseShopId = sessionStorage.getItem('enterpriseShopId');
      if (currentAuditEntStatus === 0) {
        await dispatch({type: 'registerModel/queryAuditResult', payload: {enterpriseShopId: enterpriseShopId}});
        const { auditEnt } = this.props.registerModel;
        if (auditEnt.status === 0) {
          this.setState({
            currentShow: 1,
            isOnce: false,
          })
          setTimeout(() => {
            dispatch({ type: 'registerModel/queryApplyRecord', payload: {enterpriseShopId: enterpriseShopId } })
          }, 100)
        } else {
          message.error('工单号过期');
          /* eslint-enable */
          setTimeout(() => {
            window.location.reload();
          }, 1000)
          /* eslint-enable */
        }
      } else {
        this.setState({
          currentShow: 1,
          isOnce: false,
        })
        setTimeout(() => {
          dispatch({ type: 'registerModel/queryApplyRecord', payload: {enterpriseShopId: enterpriseShopId } })
        }, 100)
      }
      // dispatch({type: 'registerModel/setDefaultEntData'});// 清空
    } else {
      this.setState({
        currentShow: 2,
        isOnce: true,
      })
    }
  }

  // 查看提交记录
  logger = (res) => {
    const { dispatch } = this.props;
    const enterpriseShopId = sessionStorage.getItem('enterpriseShopId');
    if (res === 'info') {
      dispatch({ type: 'registerModel/queryApplyRecord', payload: {enterpriseShopId: enterpriseShopId } }).then(() => {
        this.setState({
          loggerDialog: true,
          loggerPeg: 'info',
        })
      })
    } else {
      this.setState({
        loggerDialog: true,
        loggerPeg: 'wallet',
      })
    }
  }

  // 关闭查看提交记录
  changeLoggerDialogStat() {
    this.setState({
      loggerDialog: false,
      loggerPeg: '',
    })
  }

  // 绑定钱包
  bindWallet(res) {
    const enterpriseShopId = sessionStorage.getItem('enterpriseShopId')
    if(res && enterpriseShopId) {
      bindEnterpriseWallet({
        walletNo: res,
        enterpriseShopId: enterpriseShopId
      }).then((res) => {
        if (res && res.status === 0 && res.body.body === 1) {
          message.success('提交成功');
          const isSteps = sessionStorage.getItem('isSteps'); 
          if (isSteps === '1') {
            this.setState({
              walletStatus: 2,
              currentShow: 9,
              current: 2,
            })
          } else {
            const { infoStatus } = this.state;
            if (infoStatus === 4) {
              sessionStorage.setItem('auditEntStat', 3);
            } else {
              sessionStorage.setItem('auditEntStat', 5);
            }
            this.setState({
              walletStatus: 2,
              currentShow: 6,
              current: 2,
            })
          }
        } else{
          message.error(res.msg);
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  } 

  render() {
    const auditEntStat = sessionStorage.getItem('auditEntStat');
    const isSteps = sessionStorage.getItem('isSteps'); 
    const { current, infoStatus, walletStatus, currentShow, auth, isOnce, loggerDialog, loggerPeg } = this.state;
    const { registerModel } = this.props;
    const { entInfo, auditEnt, auditWallet } = registerModel;
    const infoIcon = isSteps === '1' ? null : infoStatus === 3 ? 
      <Icon type="clock-circle" /> : infoStatus === 4 ? 
      <Icon type="close-circle-o" style={{ color: 'red' }} /> : infoStatus === 5 ? 
      <Icon type="check-circle-o" style={{ color: '#52C41A'}} /> : null;
    const walletIcon = isSteps === '1' ? null : walletStatus === 1 ?
      <Icon type="edit" theme="outlined" /> : walletStatus === 2 ? 
      <Icon type="clock-circle" /> : walletStatus === 3 ? 
      <Icon type="close-circle-o" style={{ color: 'red' }} /> : walletStatus === 4 ?  
      <Icon type="check-circle-o" style={{ color: '#52C41A'}} /> : null;
    const allStatIcon = isSteps === '1' ? null : auditEntStat === '3'  ? 
       <Icon type="close-circle-o" style={{ color: 'red' }} /> : auditEntStat === '5' ?
       <Icon type="clock-circle" /> : null;
    return (
      <div className={styles.container}>
      {
        auth ? <Row {...rowConf}>
          <div className={styles.content}>
            <Steps current={current}>
              <Step title="资料填写" icon={infoIcon} onClick={() => this.changeCurrentShow(0)} />
              <Step title="关联钱包" icon={walletIcon} onClick={() => this.changeCurrentShow(1)} />
              <Step title="结果" icon={allStatIcon} onClick={() => this.changeCurrentShow(2)} />
            </Steps>
            <div className={styles.sliceLinne}></div>
            { 
              currentShow === 1 ? 
              <EnterpriseDatumForm isOnce={isOnce} entInfo={entInfo} changeImg={this.changeImg.bind(this)} saveInfo={this.saveInfo.bind(this)} /> : currentShow === 2 ? 
              <BindWallet bindWallet={this.bindWallet.bind(this)} /> : currentShow === 3 ? 
              <Verifying logger={this.logger} resubmit={this.resubmit} name="wallet" text="关联信息审核中" stat="loading" /> : currentShow === 4 ? 
              <Verifying logger={this.logger} resubmit={this.resubmit} name="wallet"  text="关联信息审核失败" stat="error" msg={auditWallet.msg} /> : currentShow === 5 ? 
              <SubFinish name="wallet" text="关联钱包成功" /> : currentShow === 6 ?  
              <Verifying logger={this.logger} resubmit={this.resubmit} reSubStat={auditEnt.resubmit} name="info" text="资料审核中" stat="loading" /> : currentShow === 7 ?
              <Verifying logger={this.logger} resubmit={this.resubmit} name="info" text="资料审核失败" stat="error" msg={auditEnt.msg} /> : currentShow === 8 ?  
              <SubFinish name="info" text="资料审核成功" /> : currentShow === 9 ?  
              <SubFinish text="提交完成" /> : currentShow === 10 ?
              <Verifying stat="all-loading" /> : currentShow === 11 ?
              <Verifying stat="all-error" /> : currentShow === 12 ?
              <SubFinish text="审核完成" /> : null 
            }
          </div>
          <Modal
            title="企业信息"
            visible={loggerDialog}
            okText="确认"
            cancelText="取消"
            onOk={this.changeLoggerDialogStat.bind(this)}
            onCancel={this.changeLoggerDialogStat.bind(this)}
            width={800}
          >
          {
            loggerPeg === 'info' ? <ShowEntInfo entInfo={entInfo} /> : loggerPeg === 'wallet' ? <ShowWalletInfo walletNo={auditWallet.walletNo} /> : null
          }
          </Modal>
        </Row> : <div style={{ textAlign: "center" }}><Spin size="large" /></div>
      }
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return { 
    registerModel: state.registerModel,
  }
}

export default connect(mapStateToProps)(Register);
