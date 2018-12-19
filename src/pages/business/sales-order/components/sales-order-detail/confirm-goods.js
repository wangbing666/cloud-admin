import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Button,
  Modal,
  Steps,
  Spin
} from 'antd';

import styles from '../../sales-order-detail/index.less';

const Step = Steps.Step;

class ConfirmGoods extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    logisticsVisible: false,
    confirmVisible: false
  }

  componentDidMount() {
    const { dispatch } = this.props;
    let id = this.props.index.split('&');
    if (id.length == 2) {
      this.setState({
        aftersaleId: id[0],
        orderId: id[1]
      })
      dispatch({
        type: 'salesOrderDetailModel/QueryLogistics',
        payload: {
          orderId: id[1],
        }
      })
    }
  }

  // 查看物流
  showLogistics = () => {
    this.setState({
      logisticsVisible: true,
    });
  }

  // 确认收货弹框
  onConfirm = () => {
    this.setState({
      confirmVisible: true,
    });
  }

  // 取消弹框
  handleCancel = (e) => {
    this.setState({
      logisticsVisible: false,
      confirmVisible: false,
    });
  }

  // 确认收货
  onDetermine = () => {
    const { dispatch, salesOrderDetailModel } = this.props;
    const { salesOrderDetail, userId, enterpriseId } = salesOrderDetailModel;
    const { aftersaleId, orderId } = this.state;
    this.setState({ loading: true });
    if (salesOrderDetail.status < 18) { // 消费者在已付款或者付款待发货状态下，申请售后退款的状态
      dispatch({ // 商家执行确认收货操作
        type: 'salesOrderDetailModel/ConfirmReceipt',
        payload: {
          orderId,
          aftersaleId,
        },
        callback: res => {
          // 未计算，资金处于中间账户
          if (salesOrderDetail.isPayed && salesOrderDetail.isPayed == 1) {
            dispatch({
              type: 'salesOrderDetailModel/ReturnMoney',
              payload: {
                aftersaleId,
                orderId,
                userId,
                amount: salesOrderDetail.amount,
                saleOrderNo: salesOrderDetail.saleOrderNo,
                enterpriseId: enterpriseId,
              },
            })
              .then(() => {
                this.setState({ loading: false, confirmVisible: false });
                dispatch({
                  type: 'salesOrderDetailModel/initDetail',
                  payload: {
                    aftersaleId,
                    orderId,
                  },
                });
              })
          }
          // 已结算，资金到达商家账户
          if (salesOrderDetail.isPayed && salesOrderDetail.isPayed == 2) {
            dispatch({
              type: 'salesOrderDetailModel/Retry',
              payload: {
                aftersaleId,
                orderId,
                userId,
                amount: salesOrderDetail.amount,
                saleOrderNo: salesOrderDetail.saleOrderNo,
                enterpriseId: enterpriseId,
              },
            })
              .then(() => {
                this.setState({ loading: false, confirmVisible: false });
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
      })
    } else { // 消费者在确认收货的状态下， 申请售后退款退货的状态
      dispatch({
        type: 'salesOrderDetailModel/Refund',
        payload: {
          orderId,
          aftersaleId,
        },
        callback: res => {
          // 未计算，资金处于中间账户
          if (salesOrderDetail.isPayed && salesOrderDetail.isPayed == 1) {
            dispatch({
              type: 'salesOrderDetailModel/ReturnMoney',
              payload: {
                aftersaleId,
                orderId,
                userId,
                amount: salesOrderDetail.amount,
                saleOrderNo: salesOrderDetail.saleOrderNo,
                enterpriseId: enterpriseId,
              },
            })
              .then(() => {
                this.setState({ loading: false, confirmVisible: false });
                dispatch({
                  type: 'salesOrderDetailModel/initDetail',
                  payload: {
                    aftersaleId,
                    orderId,
                  },
                });
              })
          }
          // 已结算，资金到达商家账户
          if (salesOrderDetail.isPayed && salesOrderDetail.isPayed == 2) {
            dispatch({
              type: 'salesOrderDetailModel/Retry',
              payload: {
                aftersaleId,
                orderId,
                userId,
                amount: salesOrderDetail.amount,
                saleOrderNo: salesOrderDetail.saleOrderNo,
                enterpriseId: enterpriseId,
              },
            })
              .then(() => {
                this.setState({ loading: false, confirmVisible: false });
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
      })
    }
  }

  render() {
    const { logisticsVisible, confirmVisible, loading } = this.state;
    const { isLogistics, showListLoadding, logisticsProgress, salesOrderDetail, logisticsProgressDetail } = this.props.salesOrderDetailModel;
    const status = (status) => {
      if (status == 0) {
        return '未完成';
      }
      if (status == 1) {
        return '已完成'
      }
      if (status == 2) {
        return '已撤销'
      }
    }

    // 物流状态
    const logisticsStatus = (logisticsProgress) => {
      return (
        <div>
          <Row>
            <Col span={4}>物流状态：</Col>
            <Col>已发货</Col>
          </Row>
          <Row>
            <Col span={4}>承运来源：</Col>
            <Col>{logisticsProgressDetail.transportName}</Col>
          </Row>
          <Row>
            <Col span={4}>运单编号：</Col>
            <Col>{logisticsProgressDetail.transportNo}</Col>
          </Row>
          <div className={styles.logistics_step}>
            {logisticsProgress.length > 0 ?
              <Steps direction="vertical" current={logisticsProgress.length - 1} size="small">
                {logisticsProgress.map((item, index) => {
                  return <Step key={index} title={item.context} description={item.createTime} />
                })}
              </Steps>
              : null}
          </div>
        </div>
      )
    }
    return (
      <div className={styles.confirm_goods}>
        <Spin size="large" spinning={showListLoadding}>
          <h2>商家确认收到退货商品👌</h2>
          <p>收到买家退还的商品后，请确认商品是否影响第二次销或是否符合买家所描述瑕疵。收到货物后商家请尽快对退货订单进行处理。</p>
          {logisticsProgressDetail.deliverCompanyNo ?
            <div className={styles.confirm_btn}>
              {isLogistics == 0 ? <Button type="default" onClick={this.showLogistics}>查看物流</Button> : null}
              <Button type="primary" onClick={this.onConfirm}>确认收货</Button>
            </div>
            : <div className={styles.confirm_btn}>买家未发货，请耐心等待</div>}
          <div className={styles.prompt}>
            <h3>提醒：</h3>
            <p>· 如果商家已收到货物，请尽快进行处理</p>
          </div>
          <Modal
            title="物流进度"
            visible={logisticsVisible}
            onCancel={this.handleCancel}
            footer={null}
          >
            {logisticsStatus(logisticsProgress)}
          </Modal>
          <Modal
            title="售后处理"
            className={styles.after_processing}
            visible={confirmVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
          >
            <h4 style={{ textAlign: 'center' }}>是否确认收到退货商品并确认没有问题</h4>
            <p style={{ textAlign: 'center' }}>退款金额{salesOrderDetail.amount}元</p>
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <Button type="primary" onClick={this.onDetermine} loading={loading}>确定</Button>
            </div>
          </Modal>
        </Spin>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { salesOrderDetailModel: state.salesOrderDetailModel }
}

export default connect(mapStateToProps)(ConfirmGoods)