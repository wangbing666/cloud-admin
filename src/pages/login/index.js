import React, { PureComponent } from 'react';
import QRCode from 'qrcode.react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import styles from './index.less';

class Login extends PureComponent {
  // constructor(props) {
  //   super(props);
  //   this.handleClick = this.handleClick.bind(this);
  // }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({type: 'loginUser/getCode', payload: dispatch })
  }

  // 跳转选择企业页面
  goHomePage() {
    // const { history } = this.props;
    // sessionStorage.setItem('userId', 12495389)
    // history.push({
    //   pathname: '/login/select-ent',
    //   state: { type: 3 },
    // });
  }
  // 跳转入驻页面
  goMerchantEntry() {
    // const { history } = this.props;
    // history.push({
    //   pathname: '/register',
    //   state: { type: 3 },
    // });
  }

  render() {
    const { loginUser } = this.props;
    const { QrCode } = loginUser;
    return (
      <div className={styles.LoginBody}>
        <div className={styles.systemName}>微度电商商户后台</div>
        {/* {<LoginHeader/>} */}
        <div className={styles.LoginCenter}>
          <span className={styles.loginText}>请打开微度app进行身份认证。</span>
          <QRCode
            onClick={() => this.goHomePage()}
            className={styles.QRCodeBody}
            bgColor="#ffffff"
            size={200}
            value={QrCode.message}
          />
          <div className={styles.admissionDivision} />
          <div
            className={styles.openWallet}
            onKeyPress={e => (e.key === 'Enter' ? this.goMerchantEntry() : null)}
            onClick={() => this.goMerchantEntry()}
            role="button"
            tabIndex="0"
          >
            {/* {<img src={require('../../images/login/a3.png')}/>} */}
            <span>
              { '开通电商后台>>' }
            </span>
          </div>
          <span className={styles.loginFootText}>*如还没有微度账号，请去下载微度手机端进行注册后再进行此操作。</span>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const mapPropsModel = (state) => {
  return { loginUser: state.loginUser }
}

export default connect(mapPropsModel)(Login);
