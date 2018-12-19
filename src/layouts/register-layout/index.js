import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import GlobalHeader from '../../components/GlobalHeader';
import styles from './index.less';
import logo from '../../assets/images/logo.png';

const { Header } = Layout;

const App = props => (
  <div className={styles.container}>
    <Layout>
      <Helmet>
        <title>{props.location.pathname.includes('disable') ? '店铺冻结' : '电商账号注册'}</title>
      </Helmet>
      <Header style={{ padding: 0, height: 100, marginBottom: 5 }}>
        <GlobalHeader
          logo={logo}
          currentUser={{
            name: 'Serati Ma',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
            userid: '00000001',
            notifyCount: 12,
          }}
        />
      </Header>
      <div className={styles.pageTitle}>{props.location.pathname.includes('disable') ? '店铺冻结' : '电商账号注册'}</div>
      {props.children}
    </Layout>
  </div>
);

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;
