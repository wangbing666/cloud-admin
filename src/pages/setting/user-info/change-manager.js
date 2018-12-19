import React, { Component } from 'react';
import styles from './index.less';
import { Button, Steps, Row, Upload, message, Icon } from 'antd';
import router from 'umi/router';
import QRCode from 'qrcode.react';
import { connect } from 'dva';
import { authorization, uploadQiniu } from 'utils';
import { changeSuperAdminSubmit, downloadWord } from './api/index';

const Step = Steps.Step;

const QRCodeBody = (props) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <p className={styles.title}>扫码验证身份</p>
      <p className={styles.descript}>请将要成为管理员的用户用微度扫一扫进行身份验证</p>
      <QRCode
        className={styles.QRCodeBody}
        bgColor="#ffffff"
        size={300}
        value={props.QrCode.message}
      />
    </div>
  )
}

const EntAuthorize = (props) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <p className={styles.title}>上传企业授权书</p>
      <p className={styles.descript}>我们会在3-5个工作日内给到您审批结果，审批通过后即更换成功。</p>
      <Upload
        name="avatar"
        listType="picture-card"
        className="entAutheration-uploader"
        showUploadList={false}
        accept="image/gif, image/jpeg"
        beforeUpload={props.beforeUpload}
      >
        {props.fileUrl ? <img src={props.fileUrl} style={{ width: '200px', height: '200px' }} alt="avatar" /> : <Button size="small">上传</Button>}
      </Upload>
      <p className={styles.control}>
        <a href={props.wordUrl}><Button>下载授权书模板</Button> </a>
        <Button type="primary" style={{ marginLeft: '10px' }} onClick={props.submitAudit} >提交</Button>
      </p>
    </div>
  )
}

class ChangeManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileId: 0,
      fileUrl: '',
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const userInfo = authorization.getUserInfo();
    const relationId = window.localStorage.getItem('adminUserId') || '';
    downloadWord().then((res) => {
      if (res && res.status === 0) {
        this.setState({
          downTemUrl: res.data,
        })
      }
    })
    dispatch({
      type: 'userInfoModel/getAdminAuditResult', payload: {
        userId: relationId ? relationId : userInfo.userId,
        bussId: parseInt(userInfo.shopId),
        bussType: 2,
      }
    }).then(() => {
      const { userInfoModel } = this.props;
      const { auditMaster } = userInfoModel;
      if (auditMaster.status === 1) {
        dispatch({
          type: 'userInfoModel/getCode', payload: {
            data: {
              businessType: 3,
              enterpriseId: parseInt(userInfo.enterpriseId),
              walletId: parseInt(userInfo.shopId),
              platformType: 2,
            },
            dispatch: dispatch,
          }
        })
      }
    })
  }

  // 上传企业授权书
  async beforeUpload(file) {
    const fileSize = file.size / 1024 / 1024 < 10;
    if (!fileSize) {
      message.error('文件过大')
    }
    if (fileSize) {
      const formData = new FormData()
      formData.append('file', file, 'file')
      const res = await uploadQiniu(formData, {
        width: 200,
        height: 200,
        originHeight: 150,
        originWidth: 150,
      });
      if (res && res.length > 0) {
        this.setState({
          fileId: res[0].fileId,
          fileUrl: res[0].hostUrl + res[0].fileUrl,
        })
      }
    }
    return false;
  }

  againApply = () => {
    this.setState({
      again: true,
    })
  }

  submitAudit() {
    const { fileId } = this.state;
    if (fileId === 0) {
      message.error('请上传文件')
    } else {
      const userInfo = authorization.getUserInfo();
      const { relationId } = this.props.userInfoModel;
      changeSuperAdminSubmit({
        enterpriseId: userInfo.enterpriseId,
        userId: userInfo.userId,
        bussId: userInfo.shopId,
        bussType: 2, // 商户后台
        fileId: fileId,
        relationId: relationId,
      }).then((res) => {
        if (res && res.status === 0) {
          message.success('操作成功，请耐心等待审批结果');
          window.localStorage.setItem('adminUserId', relationId);
          router.goBack()
        } else {
          message.error(res.msg);
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
  render() {
    const { userInfoModel } = this.props;
    const { QrCode, auditMaster, auditSteps } = userInfoModel;
    return (
      <div className={styles.container}>
        <div className={styles.blockHead}>
          <div className={styles.blockHeadLeft}>
            <span>管理员更换审核</span>
          </div>
          <div className={styles.blockHeadRight}>
            <Button onClick={() => { router.goBack() }}>返回</Button>
          </div>
        </div>
        <div className={styles.content}>
          {
            auditMaster.status === 1 || this.state.again ?
              <div className={styles.managerContainer}>
                <Row type="flex" align="center" style={{ marginTop: '40px' }}>
                  <Steps current={auditSteps} style={{ width: '500px' }}>
                    <Step title="身份验证" />
                    <Step title="公司授权" />
                  </Steps>
                </Row>
                <div className={styles.sliceLinne}></div>
                {auditSteps === 0 ? <QRCodeBody QrCode={QrCode} /> :
                  <EntAuthorize
                    submitAudit={this.submitAudit.bind(this)}
                    beforeUpload={this.beforeUpload.bind(this)}
                    fileUrl={this.state.fileUrl}
                    wordUrl={this.state.downTemUrl}
                  />}
              </div>
              : auditMaster.status === 0 || auditMaster.status === 2 ? <div className={styles.auditContainer}>
                <h1>更换管理员申请</h1>
                <p>提交时间{auditMaster.time}</p>
                <h3>{auditMaster.status === 0 ? '审核中' : '审核失败'}</h3>
                {
                  auditMaster.status === 0 ? <p>我们会在3-5个工作日内给到您审批结果，审批通过后即更换成功。</p> :
                    auditMaster.msg.map((item) => {
                      return <p>{item}</p>
                    })
                }
                {
                  auditMaster.status === 2 ? <p><Button type="primary" onClick={this.againApply}>重新申请</Button></p> : null
                }
              </div> : null
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { userInfoModel: state.userInfoModel }
}

export default connect(mapStateToProps)(ChangeManager);
