import React, { Component } from 'react';
import styles from './index.less';
import { Icon } from 'antd';
import { connect } from 'dva';
import { authorization } from 'utils';
import router from 'umi/router';

class DisablePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      renderStat: false,
    }
  }

  componentDidMount() {
    const userInfo = authorization.getUserInfo();
    if (userInfo.shopId && userInfo.userId) {
      this.setState({
        renderStat: true
      })
      const { dispatch } = this.props;
      dispatch({ type: 'registerModel/queryFrozenReason', payload: {shopId: userInfo.shopId} })
    } else {
      router.push('/login')
    }
  } 

  render() {
    const { renderStat } = this.state;
    return (
      <div className={styles.container}>
      {
        renderStat && 
        <div className={styles.content}>
          <Icon type="stop" theme="outlined" style={{ fontSize: '80px', color: 'red' }} />
          <h1>您的店铺已被冻结！</h1>
          <div className={styles.resultMsg}>
            <h2>您可能由于违反下述规定导致店铺冻结：</h2>
            <ul>
            {
              this.props.registerModel.stopInfo.msg.map((value) => {
                return (
                  <li>{value.reason}</li>
                )
              })
            }
            </ul>
            <p>如有疑问，可联系客服：<span>021-6079-0010</span></p>
          </div>
        </div>
      }
      </div>
    )
  }
}

const mapPropsState = (state) => {
  return {
    registerModel: state.registerModel,
  }
}

export default connect(mapPropsState)(DisablePage);