import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Spin,
  Icon
} from 'antd';

import styles from '../../sales-order-detail/index.less';
import { Spread } from 'lodash-decorators';


class RefundSuccess extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    let id = this.props.index.split('&');
    if (id.length == 2) {
      dispatch({
        type: 'salesOrderDetailModel/RefundSuccessInfo',
        payload: {
          afterSaleId: id[0],
        }
      })
    }
  }

  render() {
    const { successInfo, showListLoadding } = this.props.salesOrderDetailModel;
    return (
      <div className={styles.refund_success}>
        <Spin size="large" spinning={showListLoadding}>
          <div className={styles.sucess_info}>
            <Icon type="check-circle" theme="twoTone" style={{fontSize: '80px', color: '#52C41A'}}/>
            <h3>退款完成!</h3>
          </div>
          <div className={styles.refund_info}>
            <Row>
              <Col span={6} offset={4} style={{ textAlign: 'right' }}>交易流水号：</Col>
              <Col span={12}>{successInfo.refundId}</Col>
            </Row>
            <Row>
              <Col span={6} offset={4} style={{ textAlign: 'right' }}>交易时间：</Col>
              <Col span={12}>{successInfo.createTime}</Col>
            </Row>
            <Row>
              <Col span={6} offset={4} style={{ textAlign: 'right' }}>交易金额：</Col>
              <Col span={12}>{successInfo.amount}</Col>
            </Row>
            <Row>
              <Col span={6} offset={4} style={{ textAlign: 'right' }}>交易账户：</Col>
              <Col span={12}>{successInfo.account}</Col>
            </Row>
          </div>
        </Spin>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { salesOrderDetailModel: state.salesOrderDetailModel }
}

export default connect(mapStateToProps)(RefundSuccess)