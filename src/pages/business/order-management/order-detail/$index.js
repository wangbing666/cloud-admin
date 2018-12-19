/**
 * Created by fantt on 2018/6/15.
 * 订单详情
 */
import React, { Component } from 'react';
import {
  Button,
  Steps,
  Spin,
  Popover,
  Row,
  Table,
  Form,
  Radio,
  Select,
  Input,
  Col,
  Modal,
  message,
} from 'antd';
import router from 'umi/router';
import { connect } from 'dva';

import ShowLogistics from '../components/order-list/show-logistics';
import { GoodsDeliveryForm } from '../components';

import styles from './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const columns = [{
  title: '商品',
  dataIndex: 'productImg',
  key: 'productImg',
  align: 'center',
  render: (text, row, index) => {
    return (
      <div>
        <div className={styles.goods_image}>
          <img src={row.goodsFile}></img>
        </div>
        <div className={styles.goods_info}>
          <h4>{row.goodsName}</h4>
          {row.specificationsList && row.specificationsList.length > 0 ?
            row.specificationsList.map((item, index) => {
              return <div key={index}>{item.type} {item.name}</div>
            })
            : null}
        </div>
      </div>
    )
  },
}, {
  title: '价格',
  dataIndex: 'oughtAmount',
  key: 'oughtAmount',
  align: 'center',
}, {
  title: '数量',
  dataIndex: 'goodsNum',
  key: 'goodsNum',
  align: 'center',
}, {
  title: '优惠（元）',
  dataIndex: 'salePrice',
  key: 'salePrice',
  align: 'center',
}, {
  title: '小计（元）',
  dataIndex: 'trueAmount',
  key: 'trueAmount',
  align: 'center',
  render: (text, row) => {
    if (row.salePrice == 0) {
      return row.oughtAmount
    }
    return text
  }
}, {
  title: '7天退货截止时间',
  dataIndex: 'limitTime',
  key: 'limitTime',
  align: 'center',
}];

const Step = Steps.Step;

class OrderEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      orderId: this.props.match.params.index,
      visible: false,
      visible1: false,
    }
    this.tableColumn = columns.concat({
      title: '订单状态',
      dataIndex: 'opration',
      key: 'opration',
      width: '15%',
      align: 'center',
      render: (text, record) => {
        let status = record.status;
        if (record.groupOrderStatus) {
          return (
            <div>
              <div>待成团</div>
            </div>
          );
        }
        if (status == 1) {
          return (
            <div>
              <div>待付款</div>
            </div>
          );
        };
        if (status == 2 || status == 8) {
          return (
            <div>
              <div>待发货</div>
              {/* <a href="javascript:;" onClick={() => this.shelves(record.orderId)}>立即发货</a> */}
            </div>
          );
        };
        if (status == 3 || status == 9 || status == 12 || status == 18) {
          return (
            <div>
              <div>已发货</div>
            </div>
          );
        };
        if (status == 4 || status == 22 || status == 23 || status == 26 || status == 28) {
          return (
            <div>
              <div>已完成</div>
            </div>
          );
        };
        if (status >= 5 && status <= 7 || status == 10 || status == 11 || status == 13 || status == 14 || status >= 19 && status <= 21 || status == 24 || status == 29 || status == 27) {
          return (
            <div>
              <div>退款中</div>
            </div>
          );
        };
        if (status >= 15 && status <= 17 || status == 25) {
          return (
            <div>
              <div>已关闭</div>
            </div>
          );
        };
      }
    })
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // initDetailData
    dispatch({
      type: 'orderDetailModel/DetailData',
      payload: {
        orderId: this.state.orderId,
      }
    });
  }


  // 查看物流
  showLogistics = () => {
    const { dispatch } = this.props;
    this.setState({
      visible: true,
    })
    dispatch({
      type: 'orderListModel/Logistics',
      payload: {
        orderId: this.state.orderId,
      }
    })
    dispatch({
      type: 'orderListModel/CompanyList',
    })
  }

  // 关闭模态框
  onCompelete = () => {
    this.setState({
      visible: false,
    })
  }

  // 确认发货
  handleSubmit = (goodsList) => {
    const { dispatch, orderListModel, orderDetailModel } = this.props;
    const { orderdetail } = orderDetailModel;
    const { orderId } = this.state;
    this.formRef.props.form.validateFields((err, values) => {
      if (!err) {
        if (goodsList.length == 0) {
          message.info('请选择商品!');
          return;
        }
        let list = [], combinationId = [], goodsNums = [], logistics = [];
        for (let i = 0; i < goodsList.length; i++) {
          list.push(goodsList[i].relationId)
          goodsNums.push(goodsList[i].goodsNum)
          if (goodsList[i].param1) {
            combinationId.push(goodsList[i].param1)
          }
        }
        if (values.logisticsId) {
          logistics = values.logisticsId.split(',')
        }
        console.log()
        dispatch({ // 添加订单包裹打包发货
          type: 'orderListModel/InsertOrderPackage',
          payload: {
            'combinationId[]': combinationId,
            orderNo: orderdetail.orderNo,
            transportCompanyCode: logistics[1],
            transportNo: values.transportNo,
            'goodsNums[]': goodsNums,
          },
          callback: res => {
            dispatch({ // 确认发货
              type: 'orderListModel/OrderSend',
              payload: {
                logisticsId: logistics[0],
                transportNo: values.transportNo,
                transportType: values.transportType,
                userId: orderListModel.userId,
                orderId: orderId,
                orderNo: orderdetail.orderNo,
                'relationId[]': list,
              },
            })
              .then(() => {
                message.success('操作成功')
                this.setState({
                  visible1: false,
                });
                dispatch({ // 发货成功后刷新页面
                  type: 'orderDetailModel/DetailData',
                  payload: {
                    orderId: orderId,
                  }
                });
              })
          }
        })
      }
    });
  }

  // 取消发货模态框
  handleCancel = () => {
    this.setState({
      visible1: false,
    })
  }

  // 显示发货模态框
  shelves = (id) => {
    const { dispatch } = this.props;
    this.setState({
      visible1: true,
    })
    dispatch({
      type: 'orderListModel/buyers',
      payload: {
        orderId: id,
      }
    })
    dispatch({
      type: 'orderListModel/CompanyList',
    })
  }

  // 使用模态框确定按钮提交表单
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  render() {
    const { orderdetail } = this.props.orderDetailModel
    // 订单类型
    const orderType = (orderType) => {
      if (orderType == 1) {
        return '普通订单'
      }
      if (orderType == 2) {
        return '拼团订单'
      }
    }

    // 订单来源
    const proxySale = (type) => {
      if (type == 0) {
        return '官方订单'
      }
      if (type == 1) {
        return '分销订单'
      }
    }

    // 付款方式
    const termsPayment = (value) => {
      if (value == 1) {
        return '银行卡(快捷)';
      } else if (value == 2) {
        return '信用卡(快捷)';
      } else if (value == 3) {
        return '微信';
      } else if (value == 4) {
        return '支付宝';
      } else if (value == 5) {
        return '零钱';
      } else if (value == 6) {
        return '银行卡';
      } else if (value == 7) {
        return '信用卡';
      } else if (value == 8) {
        return '企业钱包';
      } else if (value == 9) {
        return '公务钱包';
      } else if (value == 10) {
        return '福利钱包';
      }
    }

    // 发货方式
    const deliveryWay = (value) => {
      if (value == 1) {
        return '物流发放'
      }
      if (value == 2) {
        return '上门自提'
      }
    }

    // 送货时间
    const deliveryTime = (value) => {
      if (value && value == 1) {
        return '随时'
      }
      if (value && value == 2) {
        return '工作日'
      }
      if (value && value == 3) {
        return '非工作日'
      }
    }

    // 订单状态
    const orderStatus = (orderdetail) => {
      let status = orderdetail.status;
      if (orderdetail.groupOrderStatus && orderdetail.groupOrderStatus == 1) {
        return '已关闭';
      }
      if (orderdetail.groupOrderStatus && orderdetail.groupOrderStatus == 2) {
        for (let i = 0; i < orderdetail.goodsList.length; i++) {
          orderdetail.goodsList[0].groupOrderStatus = orderdetail.groupOrderStatus
        }
        return '待成团';
      }
      if (status == 1) {
        return '待付款'
      } else if (status == 2 || status == 8) {
        return '待发货'
      } else if (status == 3 || status == 9 || status == 12 || status == 18) {
        return '已发货'
      } else if (status == 4 || status == 22 || status == 23 || status == 26 || status == 28) {
        return '已完成'
      } else if (status >= 5 && status <= 7 || status == 10 || status == 11 || status == 13 || status == 14 || status >= 19 && status <= 21 || status == 24 || status == 29 || status == 27) {
        return '退款中'
      } else if (status == 30) {
        return '待成团'
      } else if (status >= 15 && status <= 17 || status == 25) {
        return '已关闭'
      }
    }

    // 订单步骤
    const steps = () => {
      if (orderdetail && orderdetail.flowList && orderdetail.flowList.length > 0) {
        return (
          <Steps current={orderdetail.flowList.length - 1} progressDot>
            <Step title="买家下单" description={orderdetail.flowList[0] ? orderdetail.flowList[0].flowCreateTime : ''} />
            <Step title="买家付款" description={orderdetail.flowList[1] ? orderdetail.flowList[1].flowCreateTime : ''} />
            <Step title="商家发货" description={orderdetail.flowList[2] ? orderdetail.flowList[2].flowCreateTime : ''} />
            <Step title="交易完成" description={orderdetail.flowList[3] ? orderdetail.flowList[3].flowCreateTime : ''} />
          </Steps>
        )
      }
    }
    return (
      <div className={styles.orderdetail}>
        <div className={styles.orderBody}>
          <Spin size="large" spinning={false}>
            <div className={styles.cloudHead}>
              <div className={styles.cloudHeadLeft}>
                <span>订单详情</span>
              </div>
              <div className={styles.cloudHeadRight}>
                <div className="row" style={{ display: 'inline-block' }}>
                  <Button type="primary" ghost onClick={() => { router.go(-1) }}>返回</Button>
                </div>
              </div>
            </div>
            <div className={styles.order_content}>
              <div className={styles.steps}>
                {steps()}
              </div>
              <Row>
                <Col span={12} className={styles.content_left}>
                  <Row>
                    <Col span={7} className={styles.title}>订单号：</Col>
                    <Col span={17}>{orderdetail.orderNo}</Col>
                  </Row>
                  <Row>
                    <Col span={7} className={styles.title}>订单类型：</Col>
                    <Col span={17}>{orderType(orderdetail.orderType)}</Col>
                  </Row>
                  <Row>
                    <Col span={7} className={styles.title}>订单来源：</Col>
                    <Col span={17}>{proxySale(orderdetail.isProxySale)}</Col>
                  </Row>
                  <Row>
                    <Col span={7} className={styles.title}>付款方式：</Col>
                    <Col span={17}>{termsPayment(orderdetail.billType)}</Col>
                  </Row>
                  <Row>
                    <Col span={7} className={styles.title}>发货方式：</Col>
                    <Col span={17}>{deliveryWay(orderdetail.transportType)}</Col>
                  </Row>
                  <Row>
                    <Col span={7} className={styles.title}>收件人姓名：</Col>
                    <Col span={17}>{orderdetail.receiverName}  {orderdetail.receiverMobile}</Col>
                  </Row>
                  <Row>
                    <Col span={7} className={styles.title}>收货地址：</Col>
                    <Col span={17}>{orderdetail.address}</Col>
                  </Row>
                  <Row>
                    <Col span={7} className={styles.title}>下单人手机号：</Col>
                    <Col span={17}>{orderdetail.mobile}</Col>
                  </Row>
                  <Row>
                    <Col span={7} className={styles.title}>实付金额：</Col>
                    <Col span={17}>{orderdetail.payMoney}元</Col>
                  </Row>
                  {orderdetail.isProxySale && orderdetail.isProxySale == 1 ?
                    <Row>
                      <Col span={7} className={styles.title}>分销汇总金额：</Col>
                      <Col span={17}>{orderdetail.proxyTotalMoney}元</Col>
                    </Row>
                    : null}
                  {orderdetail.isProxySale && orderdetail.isProxySale == 1 ?
                    <Row>
                      <Col span={7} className={styles.title}>分销者微度ID：</Col>
                      <Col span={17}>{orderdetail.proxyUserId}</Col>
                    </Row>
                    : null}
                </Col>
                <Col span={12}>
                  <div className={styles.content_right}>
                    <Row>
                      <Col span={5} style={{ textAlign: 'right' }}>送货时间：</Col>
                      <Col span={19}>{deliveryTime(orderdetail.sendType)}</Col>
                    </Row>
                    <Row>
                      <Col span={5} style={{ textAlign: 'right', lineHeight: "20px" }}>买家留言：</Col>
                      <Col span={18} style={{ lineHeight: "20px" }}>{orderdetail.leaveMsg}</Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row className={styles.logistics}>
                <Col span={12}>
                  <Row>
                    <Col span={7} className={styles.title}>订单状态：</Col>
                    <Col span={17}>{orderStatus(orderdetail)}</Col>
                  </Row>
                  <Row>
                    <Col span={7} className={styles.title}> </Col>
                    {orderdetail.orderType && orderdetail.orderType == 1 ?
                      <Col span={17}>
                        {orderdetail.status && orderdetail.status == 2 ? <Button type="primary" ghost onClick={() => this.shelves(orderdetail.orderId)}>立即发货</Button> : null}
                        {orderdetail.status && (orderdetail.status == 3 || orderdetail.status == 4 || orderdetail.status == 8) ? <Button type="primary" ghost onClick={this.showLogistics}>查看物流</Button> : null}
                      </Col>
                      : null}
                    {orderdetail.orderType && orderdetail.orderType == 2 && orderdetail.groupOrderStatus == 0 ?
                      <Col span={17}>
                        {orderdetail.status && orderdetail.status == 2 ? <Button type="primary" ghost onClick={() => this.shelves(orderdetail.orderId)}>立即发货</Button> : null}
                        {orderdetail.status && (orderdetail.status == 3 || orderdetail.status == 4 || orderdetail.status == 8) ? <Button type="primary" ghost onClick={this.showLogistics}>查看物流</Button> : null}
                      </Col>
                      : null}
                  </Row>
                </Col>
                <Col span={12}>
                  <div className={styles.content_right}>
                    <Row>
                      <Col span={5} style={{ color: '#333', textAlign: 'right', fontWeight: 'bold' }}>友情提醒</Col>
                    </Row>
                    <Row>
                      <Col span={5}> </Col>
                      <Col span={18} style={{ marginLeft: '-52px', lineHeight: "20px" }}>• 如果无法发货，请及时与买家联系并说明情况后进行退款；</Col>
                    </Row>
                    <Row>
                      <Col span={5}> </Col>
                      <Col span={18} style={{ marginLeft: '-52px', lineHeight: "20px" }}>• 买家申请退款后，须征得买家同意再发货，否则买家有权拒收货物；</Col>
                    </Row>
                    <Row>
                      <Col span={5}> </Col>
                      <Col span={18} style={{ marginLeft: '-52px', lineHeight: "20px" }}>• 买家付款后超过7天仍未发货，将有权申请退款维权；</Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Table columns={this.tableColumn}
                className={styles.goods_table}
                dataSource={orderdetail.goodsList}
                pagination={false}
                rowKey={(r, i) => i} />
            </div>
          </Spin>
        </div>
        <ShowLogistics modal={this.state.visible} id={this.state.orderId} onCompelete={this.onCompelete} />
        <GoodsDeliveryForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible1}
          handleCancel={this.handleCancel}
          handleSubmit={this.handleSubmit}
          {...this.props}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    orderDetailModel: state.orderDetailModel,
    orderListModel: state.orderListModel,
  }
}

export default connect(mapStateToProps)(OrderEdit)
