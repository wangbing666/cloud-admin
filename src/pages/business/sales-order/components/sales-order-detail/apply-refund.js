import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button,
  Input,
  Row,
  Col,
  Modal,
} from 'antd';


import styles from '../../sales-order-detail/index.less';

const { TextArea } = Input;

class ApplyRefund extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
    loading: false,
    text: "",
    leaveMsg: '', // 审核留言
    index: this.props.index, // 订单ID
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

  // 同意退款弹框
  onChangeConfirm = () => {
    this.setState({
      visible: true,
      text: '同意',
      isAgree: 1, // 同意状态
      refuse: true, // 同意后调退款接口
    })
  }

  // 拒绝退款弹框
  onChangeRefused = () => {
    this.setState({
      visible: true,
      text: '拒绝',
      isAgree: 2, // 拒绝状态
      refuse: false, // 拒绝后退款接口不用调
    })
  }

  // 确认或拒绝退款按钮
  handleOk = () => {
    this.setState({ loading: true });
    const { dispatch, salesOrderDetailModel } = this.props;
    const { salesOrderDetail, userId, enterpriseId } = salesOrderDetailModel;
    const { orderId, aftersaleId, isAgree, leaveMsg, refuse } = this.state;
    if (salesOrderDetail.status < 18) {
      dispatch({ // 商家同意或拒绝退款
        type: 'salesOrderDetailModel/ConfirmRefund',
        payload: {
          orderId,
          aftersaleId,
          isAgree,
          leaveMsg,
          SaleType: salesOrderDetail.saleType,
        },
        callback: res => {
          this.setState({ loading: false, visible: false });
          if (salesOrderDetail.saleType && salesOrderDetail.saleType == 1 && refuse) { // 判断是否退款退货，退款退货先跳到确认收货页面
            // 未结算，资金处于中间账户
            if (salesOrderDetail.isPayed && salesOrderDetail.isPayed == 1) {
              dispatch({ // 仅退款时先进行退款操作，成功或失败后刷新页面
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
                  dispatch({ // 仅退款刷新页面
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
          } else {
            // 退款退货时，只刷新页面
            dispatch({
              type: 'salesOrderDetailModel/initDetail',
              payload: {
                aftersaleId,
                orderId,
              },
            });
          }
        }
      })
        .then(() => {
          this.setState({ loading: false, visible: false });
        })
    } else { // 消费者在确认收货的状态下， 申请售后退款退货的状态 status > 18
      dispatch({
        type: 'salesOrderDetailModel/FinishedConfirmRefund',
        payload: {
          orderId,
          aftersaleId,
          isAgree,
          leaveMsg,
        },
        callback: res => {
          this.setState({ loading: false, visible: false });
          if (salesOrderDetail.saleType && salesOrderDetail.saleType == 1 && refuse) { // 判断是否退款退货，退款退货先跳到确认收货页面
            // 未结算，资金处于中间账户
            if (salesOrderDetail.isPayed && salesOrderDetail.isPayed == 1) {
              dispatch({ // 仅退款时先进行退款操作，成功或失败后刷新页面
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
                  dispatch({ // 仅退款刷新页面
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
              dispatch({// 仅退款时先进行退款操作，成功或失败后刷新页面
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
                  dispatch({ // 仅退款刷新页面
                    type: 'salesOrderDetailModel/initDetail',
                    payload: {
                      aftersaleId,
                      orderId,
                    },
                  });
                })
            }
          } else {
            dispatch({// 仅退款刷新页面
              type: 'salesOrderDetailModel/initDetail',
              payload: {
                aftersaleId,
                orderId,
              },
            });
          }
        }
      })
        .then(() => {
          this.setState({ loading: false, visible: false });
        })
    }
  }

  // 取消退款按钮
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  // 获取审核留言
  onChange = (e) => {
    let value = e.target.value;
    this.setState({
      leaveMsg: value,
    })
  }

  render() {
    const { visible, loading, text } = this.state;
    const { salesOrderDetail } = this.props.salesOrderDetailModel;
    return (
      <div className={styles.apply_refund}>
        <Row>
          <Col span={6} style={{ textAlign: 'right' }}>
            审核留言：
          </Col>
          <Col span={16}>
            <TextArea autosize={{ minRows: 6, maxRows: 10 }} onChange={this.onChange} />
            <div className={styles.refund_info}>收到买家的退款申请，请尽快处理请在处理本次退款，如逾期未处理，将自动通过审核</div>
            <div className={styles.refund_btn}>
              <Button onClick={this.onChangeRefused}>拒绝</Button>
              <Button type="primary" onClick={this.onChangeConfirm}>同意</Button>
            </div>
          </Col>
        </Row>
        <Modal
          title="消息详情"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={700}
          footer={[
            <Button key="back" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              确认
            </Button>,
          ]}
        >
          <p style={{ textAlign: 'center', color: '#000', fontWeight: 'bold' }}>是否{text}退款申请？</p>
          <p style={{ textAlign: 'center' }}>退款金额{salesOrderDetail.amount}元</p>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { salesOrderDetailModel: state.salesOrderDetailModel }
}

export default connect(mapStateToProps)(ApplyRefund)