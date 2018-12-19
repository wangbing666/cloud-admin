import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button,
  Steps,
  Spin,
  Popover,
  Divider,
  Row,
  Table,
  Col,
  Modal,
} from 'antd';
import router from 'umi/router';

import { ApplyRefund, RefundSuccess, RefundFailure, ConfirmGoods } from '../components';

import styles from './index.less';

const Step = Steps.Step;

class OrderEdit extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    status: false,
    index: this.props.match.params.index,
  }

  componentDidMount() {
    const { dispatch, salesOrderDetailModel } = this.props;
    const { index } = this.state;
    let id = index.split('&');
    if (id.length == 2) {
      dispatch({
        type: 'salesOrderDetailModel/initDetail',
        payload: {
          aftersaleId: id[0],
          orderId: id[1]
        },
      });
    }
  }

  render() {
    const { status } = this.state;
    const { salesOrderDetail, showListLoadding, piclist } = this.props.salesOrderDetailModel;
    // 格式化状态
    function getStatus() {
      if (salesOrderDetail.isAuth && salesOrderDetail.isAuth == 1) {
        return '待审核'
      }
      if (salesOrderDetail.isAuth && salesOrderDetail.isAuth == 2) {
        return '审核通过'
      }
      if (salesOrderDetail.isAuth && salesOrderDetail.isAuth == 3) {
        return '审核拒绝'
      }
      if (salesOrderDetail.isAuth && salesOrderDetail.isAuth == 4) {
        return '退款完成'
      }
      if (salesOrderDetail.isAuth && salesOrderDetail.isAuth == 5) {
        return '已撤销'
      }
    }

    // 格式化退款类型
    function getsaleType() {
      if (salesOrderDetail.saleType && salesOrderDetail.saleType == 1) {
        return '仅退款'
      }
      if (salesOrderDetail.saleType && salesOrderDetail.saleType == 2) {
        return '退货并退款'
      }
    }

    // 格式化订单状态
    function getOrderStatus() {
      if (salesOrderDetail.sendStatus == 0) {
        return '未发货'
      }
      if (salesOrderDetail.sendStatus && salesOrderDetail.sendStatus == 1) {
        return '发货'
      }
    }

    // 格式化退款步骤
    function getSteps() {
      let count = 0, list = [];
      if (salesOrderDetail.listStatus && salesOrderDetail.listStatus.length !== 0) {
        for (let i = 0; i < salesOrderDetail.listStatus.length; i++) {
          if (salesOrderDetail.listStatus[i]) {
            list.push(salesOrderDetail.listStatus[i]);
          }
        }
        count = list.length
      }
      return count;
    }

    return (
      <div className={styles.order_detail}>
        <Spin size="large" spinning={showListLoadding}>
          <div className={styles.cloudHead}>
            <div className={styles.cloudHeadLeft}>
              <span>售后订单详情</span>
            </div>
            <div className={styles.cloudHeadRight}>
              <div className="row" style={{ display: 'inline-block' }}>
                <Button type="primary" ghost onClick={() => { router.go(-1) }}>返回</Button>
              </div>
            </div>
          </div>
          <div>
            <Row>
              <Col span={16}>
                {salesOrderDetail.saleType == 1 && salesOrderDetail.listStatus ?
                  <Steps current={salesOrderDetail.listStatus ? getSteps() - 1 : null} progressDot  className={styles.steps}>
                    <Step title="买家申请退款" description={salesOrderDetail.listStatus[0] ? salesOrderDetail.listStatus[0].time : ''} />
                    <Step title="商家处理退款申请" description={salesOrderDetail.listStatus[1] ? salesOrderDetail.listStatus[1].time : ''} />
                    <Step title="退款完成" description={salesOrderDetail.listStatus[2] ? salesOrderDetail.listStatus[2].time : ''} />
                  </Steps>
                  : null
                }
                {salesOrderDetail.saleType == 2 && salesOrderDetail.listStatus ?
                  <Steps current={salesOrderDetail.listStatus ? getSteps() - 1 : null} progressDot  className={styles.steps}>
                    <Step title="买家申请退货" description={salesOrderDetail.listStatus[0] ? salesOrderDetail.listStatus[0].time : ''} />
                    <Step title="商家处理退货申请" description={salesOrderDetail.listStatus[1] ? salesOrderDetail.listStatus[1].time : ''} />
                    <Step title="商家确认收货" description={salesOrderDetail.listStatus[2] ? salesOrderDetail.listStatus[2].time : ''} />
                    <Step title="退款完成" description={salesOrderDetail.listStatus[3] ? salesOrderDetail.listStatus[3].time : ''} />
                  </Steps>
                  : null
                }
                <div className={styles.detail_content}>
                  {salesOrderDetail.isAuth && salesOrderDetail.isAuth == 1 ? <ApplyRefund {...this.state} /> : null}
                  {salesOrderDetail.isAuth && salesOrderDetail.isAuth == 4 ? <RefundSuccess {...this.state}/> : null}
                  {salesOrderDetail.isAuth && salesOrderDetail.saleType && salesOrderDetail.isAuth == 2 && salesOrderDetail.saleType == 1? <RefundFailure {...this.state}/> : null}
                  {salesOrderDetail.isAuth && salesOrderDetail.saleType && salesOrderDetail.isAuth == 2 && salesOrderDetail.saleType == 2 ? <ConfirmGoods {...this.state}/> : null}
                  {salesOrderDetail.isAuth && salesOrderDetail.isAuth == 5 ? <div>买家已撤销申请，无需跟进处理</div> : null}
                  {salesOrderDetail.isAuth && salesOrderDetail.isAuth == 3 ? <h3>商家拒绝退款</h3> : null}
                </div>
              </Col>
              <Col span={8} className={styles.order_info}>
                <Row>
                  <Col span={6} offset={2}>当前状态：</Col>
                  <Col span={16}>{getStatus()}</Col>
                </Row>
                <Row>
                  <Col span={6} offset={2}>退款类型：</Col>
                  <Col span={16}>{getsaleType()}</Col>
                </Row>
                <Row>
                  <Col span={6} offset={2}>售后单号：</Col>
                  <Col span={16}>{salesOrderDetail.saleOrderNo}</Col>
                </Row>
                <Row>
                  <Col span={6} offset={2}>创建时间：</Col>
                  <Col span={16}>{salesOrderDetail.blackTime}</Col>
                </Row>
                <Row>
                  <Col span={6} offset={2}>退款金额：</Col>
                  <Col span={16}>{salesOrderDetail.amount}</Col>
                </Row>
                <Row style={{ marginTop: '40px' }}>
                  <Col span={6} offset={2}>订单号：</Col>
                  <Col span={16}>{salesOrderDetail.orderNO}</Col>
                </Row>
                <Row>
                  <Col span={6} offset={2}>订单状态：</Col>
                  <Col span={16}>{getOrderStatus()}</Col>
                </Row>
                <Row style={{ marginBottom: '40px' }}>
                  <Col span={6} offset={2}>订单金额：</Col>
                  <Col span={16}>{salesOrderDetail.sAmount}</Col>
                </Row>
                <Row style={{ marginTop: '40px' }}>
                  <Col span={6} offset={2}>申请人：</Col>
                  <Col span={16}>{salesOrderDetail.applyUserName}</Col>
                </Row>
                <Row>
                  <Col span={6} offset={2}>联系方式：</Col>
                  <Col span={16}>{salesOrderDetail.mobile}</Col>
                </Row>
                <Row>
                  <Col span={6} offset={2}>申请原因：</Col>
                  <Col span={16}>{salesOrderDetail.saleReason}</Col>
                </Row>
                <Row style={{ marginBottom: '40px' }}>
                  <Col span={6} offset={2}>问题描述：</Col>
                  <Col span={16}>{salesOrderDetail.describes}</Col>
                </Row>
                <Row>
                  <Col span={22} offset={2} className={styles.detail_img}>
                    {piclist.map((item, index) => {
                      return <img key={index} src={item.hostUrl + item.zoomUrl} alt="" />
                    })}
                  </Col>
                </Row>
              </Col>
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

export default connect(mapStateToProps)(OrderEdit)