import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Button,
} from 'antd';

import styles from '../../sales-order-detail/index.less';


class RefundFailure extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    index: this.props.index,
  }

  componentDidMount() {
    let id = this.props.index.split('&');
    if (id.length == 2) {
      this.setState({
        aftersaleId: id[0],
        orderId: id[1],
      })
    }
  }

  // 退款失败重试
  onChangeRetry = (value) => {
    const { dispatch, salesOrderDetailModel } = this.props;
    const { userId, enterpriseId, salesOrderDetail } = salesOrderDetailModel;
    const { orderId, aftersaleId } = this.state
    if (salesOrderDetail.status < 18) {
      dispatch({
        type: 'salesOrderDetailModel/ReturnMoney',
        payload: {
          aftersaleId,
          orderId,
          userId,
          amount: value.amount,
          saleOrderNo: value.saleOrderNo,
          enterpriseId: enterpriseId,
        }
      })
        .then(() => {
          this.setState({ loading: false, visible: false });
          dispatch({
            type: 'salesOrderDetailModel/initDetail',
            payload: {
              aftersaleId,
              orderId,
            },
          });
        })
    } else {
      dispatch({
        type: 'salesOrderDetailModel/Retry',
        payload: {
          aftersaleId,
          orderId,
          userId,
          amount: value.amount,
          saleOrderNo: value.saleOrderNo,
          enterpriseId: enterpriseId,
        }
      })
        .then(() => {
          this.setState({ loading: false, visible: false });
          dispatch({
            type: 'salesOrderDetailModel/initDetail',
            payload: {
              aftersaleId,
              orderId,
            },
          });
        })
    }
  }

  render() {
    const { salesOrderDetailModel } = this.props;
    const { salesOrderDetail } = salesOrderDetailModel;
    return (
      <div className={styles.refund_failure}>
        <div className={styles.failure_info}>
          <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="" />
          <h3>退款中</h3>
        </div>
        <div className={styles.refund_info}>
          <p>请与企业钱包负责人联系后，重试。</p>
          <Button type="primary" onClick={() => this.onChangeRetry(salesOrderDetail)}>重试</Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { salesOrderDetailModel: state.salesOrderDetailModel }
}

export default connect(mapStateToProps)(RefundFailure)