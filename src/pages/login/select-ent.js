import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './index.less';
import { connect } from "dva";
import router from 'umi/router';
import { authorization } from "utils";

class SelectEnt extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      renderStat: false,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const userInfo = authorization.getUserInfo();
    const userId = userInfo.userId;
    if (userId) {
      this.setState({
        renderStat: true,
      })
      dispatch({ type: 'loginUser/queryEnterpriseShopList', payload: { userId: userId } })
    } else {
      router.push('/login');
    }
  }

  // 添加企业
  addNewShop() {
    sessionStorage.setItem('auditEntStat', 1)
    router.push({pathname: '/register'})
    sessionStorage.setItem('isSteps', 1)
  }
  // 审核处理
  goAudit(params) {
    sessionStorage.setItem('auditEntStat', params.state)
    sessionStorage.setItem('enterpriseShopId', params.enterpriseId)
    sessionStorage.setItem('auditShopId', params.shopId)
    if (params.state == 4 || params.state == 1) {
      sessionStorage.setItem('isSteps', 1)
    }else {
      sessionStorage.setItem('isSteps', 0)
    }
    router.push({pathname: '/register'})
  }
  // 进去店铺
  goHome(params) {
    if (params && params.isFrozen !== 2) {
      const commonModuleInfo = {
        moduleType: 2, // 平台 1：企业钱包 2：电商 3：企业应用
        enterpriseId: params.enterpriseId, // 商户id
        bussId: params.shopId, // 钱包id或电商id
        userId: sessionStorage.getItem('userId'), // 用户id
      };
      sessionStorage.setItem('walletId', params.walletId);
      sessionStorage.setItem('commonModuleInfo', JSON.stringify(commonModuleInfo));// 公共模块所需信息
      sessionStorage.setItem('shopId', params.shopId)
      sessionStorage.setItem('enterpriseId', params.enterpriseId)
      // router.push({pathname: '/home'});
      window.location.href = '/cloud-operator'; 
    } else if (params.isFrozen === 2) {
      // 冻结
      sessionStorage.setItem('shopId', params.shopId);
      router.push({ pathname: '/register/disable' })
    }
  }

  render() {
    const { loginUser } = this.props;
    const { AuditStatusIsFalse, AuditStatusIsTrue } = loginUser;
    const { renderStat } = this.state;
    return (
      <div className={styles.LoginBody}>
      {
        renderStat ? <div>
        <div className={styles.systemName}>微度电商商户后台</div>
          <div className={styles.loginSelectEnt}>
            <div className={styles.loginSelectEntCenter}>
              <span className={styles.loginSelectEntTitle}>选择您的店铺</span>
              <div className={styles.admissionDivision}></div>
              <div className={styles.controlItem}>
                <span className={styles.title}>开通您的店铺</span>
                <div>
                  <div className={styles.entBody}>
                    <div className={styles.addNew} onClick={this.addNewShop}>
                      <Icon type="plus" style={{ fontSize: '20px' }} />
                    </div>
                  </div>
                  <div className={styles.entDivision} />
                </div>
              </div>
  
              <div className={styles.controlItem}>
                <span className={styles.title}>审核成功的企业</span>
                {
                  AuditStatusIsTrue.map((ent, i) => {
                    return (
                    <div key={ent.shopId}>
                      <div className={styles.entBody} onClick={() => this.goHome(ent)}>
                        <div className={styles.entLogo}>
                          <img src={ent.logoUrl} alt="" />
                        </div>
                        <div className={styles.entCentent}>
                          <div className={styles.entWalletName}>{ent.shopName}</div>
                          <div className={styles.currentStatus}>已开通</div>
                          <div className={styles.entName}>{ent.enterpriseName}</div>
                        </div>
                      </div>
                      <div className={styles.entDivision} />
                    </div>
                    );
                  })
                }
              </div>
  
              <div className={styles.controlItem}>
                <span className={styles.title}>正在处理的企业</span>
                {
                  AuditStatusIsFalse.map((ent, i) => {
                    return (
                    <div key={ent.shopId}>
                      <div className={styles.entBody} onClick={() => this.goAudit({state: ent.auditStatus, shopId: ent.shopId, enterpriseId: ent.enterpriseId})}>
                        <div className={styles.entLogo}>
                          <img src={ent.logoUrl} alt="" />
                        </div>
                        <div className={styles.entCentent}>
                          <div className={styles.entWalletName}>{ent.shopName}</div>
                          <div className={styles.currentStatus}>{
                            ent.auditStatus === 1 ? '未填写' : ent.auditStatus === 2 ? '审核成功' : ent.auditStatus === 3 ? '审核失败' : ent.auditStatus === 4 ? '保存未提交' : ent.auditStatus === 5 ? '审核中' : null
                          }</div>
                          <div className={styles.entName}>{ent.enterpriseName}</div>
                        </div>
                      </div>
                      <div className={styles.entDivision} />
                    </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
        </div> : null
      }
      </div> 
    );
  }
}

// SelectEnt.propTypes = {
//   history: PropTypes.shape({
//     push: PropTypes.func,
//   }).isRequired,
// };

const mapStateToProps = (state) => {
  return { loginUser: state.loginUser }
}

export default connect(mapStateToProps)(SelectEnt);
