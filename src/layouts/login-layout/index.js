import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
// import { withRouter } from 'dva/router';
import styles from './login.less';

const App = props => (
  <div className={styles.container}>
    <Helmet>
      <title>登陆</title>
    </Helmet>
    { props.children }
  </div>
);

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;
