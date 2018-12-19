import React, { Component } from 'react';
import styles from './index.less';
import EnterpriseDatumForm from '../../../components/EnterpriseDatumForm';
import { Button, Icon, message } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import { authorization } from 'utils';
import { reapply } from "./api/index";

const Verifying = (props) => {
  const { stat, msg, onAgain} = props;
  console.log(props)
  if(stat === 'error') {
    return (
      <div className={styles.verifying}>
        <Icon type="close-circle-o" style={{ fontSize: '80px', color: 'red' }} />
        <p>审核失败</p>
        <p>{msg ? msg : null}</p>
        <p>
          <Button type="primary" onClick={onAgain}>重新提交</Button>
        </p>
      </div>
    )
  } else {
    return (
      <div className={styles.verifying}>
        <Icon type="clock-circle" style={{ fontSize: '80px', color: '#007AED' }} />
        <p>审核中</p>
        <p>如有疑问，可联系客服：021-6079-0010</p>
      </div>
    )
  }
}

class EnterpriseDatum extends Component {

  constructor(props) {
    super(props)
    this.state = {
      again: false
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const userInfo = authorization.getUserInfo()
    dispatch({ type: 'userInfoModel/queryAuditResult', payload: {enterpriseShopId: userInfo.enterpriseId } }).then(() =>{
      const { userInfoModel } = this.props;
      const { auditEnt } = userInfoModel;
      if (auditEnt.status === 2) {
        setTimeout(() => {
          dispatch({ type: 'userInfoModel/queryApplyRecord', payload: {enterpriseShopId: userInfo.enterpriseId } })
        }, 0)
      }
    })
  }

  // 更换文件
  changeImg(name, options) {
    const { dispatch } = this.props;
    const fileId = options.fileId;
    const fileUrl = options.hostUrl + options.fileUrl;
    dispatch({ type: 'userInfoModel/changeImg', payload: {name: name, fileId: fileId, fileUrl: fileUrl } })
  }
  
  // 保存企业信息
  saveInfo(params) {
    const userInfo = authorization.getUserInfo();
    const orderData = Object.assign({}, params);
    const { dispatch } = this.props;
    orderData['enterpriseShopId'] = userInfo.enterpriseId;
    orderData['shopAdminId'] = userInfo.userId;
    orderData.type = 2;
    // orderData['categoryList[]'] = orderData.categoryList
    // delete orderData.categoryList;
    reapply(orderData).then((res) => {
      if (res && res.status === 0) {
        dispatch({ type: 'userInfoModel/changeAuditStat', payload: 0 });
      } else {
        message.error(res.msg);
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  // 重新提交
  onAgain = () => {
    const { dispatch } = this.props;
    const userInfo = authorization.getUserInfo()
    dispatch({ type: 'userInfoModel/queryApplyRecord', payload: {enterpriseShopId: userInfo.enterpriseId } })
    this.setState({
      again: true
    })
  }
  
  render() {

    const { userInfoModel } = this.props;
    const { entInfo, auditEnt } = userInfoModel;
    return (
      <div className={styles.container}>
        <div className={styles.blockHead}>
          <div className={styles.blockHeadLeft}>
            <span>修改企业与经营信息</span>
          </div>
          <div className={styles.blockHeadRight}>
            <Button onClick={() => { router.goBack() }}>返回</Button>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.entDatumContainer}>
          {
            auditEnt.status === 0 ? <Verifying stat="loading" /> : (auditEnt.status === 2 || this.state.again) ? 
            <EnterpriseDatumForm entInfo={entInfo} changeImg={this.changeImg.bind(this)} saveInfo={this.saveInfo.bind(this)} /> : auditEnt.status === 3 ?
            <Verifying stat="error" msg={auditEnt.msg} onAgain={this.onAgain}/> : null
          }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { userInfoModel: state.userInfoModel }
}

export default connect(mapStateToProps)(EnterpriseDatum);
