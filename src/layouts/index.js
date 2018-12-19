import React, { Component } from 'react';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
/* eslint-disable */
import withRouter from 'umi/withRouter';
import Redirect from 'umi/redirect';
/* eslint-enable */
import LoginLayout from './login-layout';
import NavLayout from './nav-layout';
import RegisterLayout from './register-layout';
import './index.less';

class Layout extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      /* eslint-disable */
      window.scrollTo(0, 0);
      /* eslint-enable */
    }
  }
  /* eslint-disable */
  render() {
    const firstPath = this.props.location.pathname.split('/')[1];
    const audit = sessionStorage.getItem('userId') && sessionStorage.getItem('shopId') && sessionStorage.getItem('enterpriseId') && sessionStorage.getItem('walletId');
    if (firstPath === 'login') {
      return <LoginLayout>{this.props.children}</LoginLayout>;
    } else if (firstPath === 'register') {
      return <RegisterLayout location={this.props.location}>{this.props.children}</RegisterLayout>;
    } else {
      return (
        <LocaleProvider locale={zhCN}>
          <NavLayout location={this.props.location}>{audit ? this.props.children : <Redirect to="/login" />}</NavLayout>
        </LocaleProvider> 
      );
    }
  }
  /* eslint-disable */
}

export default withRouter(Layout);

