import React from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, Table, Radio, Row, Col, Spin, Select, message } from 'antd';
import { Link, Switch } from 'dva/router';
import styles from './order-table.less';
import ShowLogistics from './show-logistics';
import { relative } from 'path';

const { TextArea } = Input;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const columns = [{
  title: '商品名称',
  dataIndex: 'name',
  render: (text, row) => {
    return (
      <div>
        <p>{row.goodsName}</p>
        {row.specifications.map((item, index) => {
          return <div key={index} className={styles.goods_specifications}><span>{item.type}</span><span>{item.name}</span></div>
        })}
      </div>
    )
  },
}, {
  title: '数量',
  dataIndex: 'goodsNum',
}, {
  title: '物流单号',
  dataIndex: 'deliverCompanyName',
}, {
  title: '状态',
  dataIndex: 'isSend',
}];

class OrderTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visible1: false, // 查看物流弹框
      confirmLoading: false,
      isTable: false,
      goodsList: [], // 选择的商品列表 
      modal: '', // 显示模态框，1为备注， 2为立即发货
      remark: '', // 备注信息
      orderId: '', // 操作的订单ID
    }
  }

  // 显示备注模态框
  showModal = (id) => {
    this.setState({
      visible: true,
      isTable: false,
      title: '写备注',
      modal: 1,
      orderId: id,
    });
  }

  // 获取备注信息
  onBlurRemark = (e) => {
    const value = e.target.value;
    this.setState({
      remark: value
    })
  }

  // 隐藏模态框
  handleCancel = () => {
    console.log('Clicked cancel button');
    this.formRef.props.form.resetFields() // 表单置空
    this.setState({
      visible: false,
      selectedRowKeys: [], // 重置勾选的发货商品
    });
  }

  // 显示发货模态框
  onDelivery = (value) => {
    const { dispatch } = this.props;
    this.setState({
      visible: true,
      isTable: true,
      modal: 2,
      title: '商品发货',
      orderId: value.orderId, // 存储订单ID，发货时用
      orderNo: value.orderNo // 存储订单号，发货时用到
    })
    dispatch({ // 查看买家信息
      type: 'orderListModel/buyers',
      payload: {
        orderId: value.orderId,
      }
    })
    dispatch({ // 获取快递公司列表
      type: 'orderListModel/CompanyList',
    })
  }

  // 确认操作
  handleSubmit = () => {
    const { modal, remark, orderId, goodsList, orderNo } = this.state;
    const { dispatch, orderListModel } = this.props;
    if (modal == 1) { // 1为备注
      this.setState({
        confirmLoading: true,
      });
      dispatch({
        type: 'orderListModel/remarkOrder',
        payload: {
          remark: remark,
          orderId: orderId,
        }
      })
        .then(() => {
          this.setState({
            visible: false,
            confirmLoading: false,
          });
          this.props.onCompelete();
        })
    }
    if (modal == 2) {
      this.formRef.props.form.validateFields((err, values) => {
        if (!err) {
          if (goodsList.length == 0) {
            message.info('请选择商品');
            return;
          }
          this.setState({
            confirmLoading: true,
          });
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
          dispatch({
            type: 'orderListModel/InsertOrderPackage',
            payload: {
              'combinationId[]': combinationId,
              orderNo: orderNo,
              transportCompanyCode: logistics[1],
              transportNo: values.transportNo,
              'goodsNums[]': goodsNums,
            },
            callback: res => { // 调用订单包裹接口之后发货
              dispatch({
                type: 'orderListModel/OrderSend',
                payload: {
                  logisticsId: logistics[0],
                  transportNo: values.transportNo,
                  transportType: values.transportType,
                  userId: orderListModel.userId,
                  orderId: orderId,
                  orderNo: orderNo,
                  'relationId[]': list,
                },
              })
                .then(() => {
                  this.setState({
                    visible: false,
                    confirmLoading: false,
                    selectedRowKeys: [], // 重置勾选的发货商品
                  });
                  this.formRef.props.form.resetFields() // 表单置空
                  this.props.onCompelete();
                })
            }
          })
            .then(() => {
              this.setState({
                confirmLoading: false,
              });
            })
        }
      });
    }
  }

  // 使用模态框确定按钮提交表单
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  // 查看物流
  onShowLogistics = (id) => {
    this.setState({
      visible1: true,
      orderId: id,
    })
    const { dispatch } = this.props;
    dispatch({
      type: 'orderListModel/Logistics',
      payload: {
        orderId: id,
      }
    })
    dispatch({ // 获取快递公司列表
      type: 'orderListModel/CompanyList',
    })
  }

  // 子组件触发回调函数关闭商品物流弹窗
  onCompelete = () => {
    this.setState({
      visible1: false,
    })
    this.props.onCompelete(); // 刷新页面
  }

  // 选择发货商品
  onSelectGoods = (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    this.setState({
      selectedRowKeys,
      goodsList: selectedRows,
    })
  }

  // 付款方式
  termsPayment = (value) => {
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

  orderStatus = (status, isSend, item) => {
    if (status == 1) {
      return '待付款'
    } else if (status == 2 || status == 8) {
      if (isSend == 1) {
        return '已发货'
      } else {
        return '待发货'
      }
    } else if (status == 3 || status == 9 || status == 12 || status == 18) {
      if (item.refundAmount && item.payAmount && item.refundAmount == item.payAmount) { // 全额退款为已关闭，部分退款为已发货
        return '已关闭'
      }
      return '已发货'
    } else if (status == 4 || status == 22 || status == 23 || status == 26 || status == 28) {
      if (item.refundAmount && item.payAmount && item.refundAmount == item.payAmount) {// 全额退款为已关闭，部分退款为已完成
        return '已关闭'
      }
      return '已完成'
    } else if (status >= 5 && status <= 7 || status == 10 || status == 11 || status == 13 || status == 14 || status >= 19 && status <= 21 || status == 24 || status == 29 || status == 27) {
      return '退款中'
    } else if (status == 30) {
      return '待成团'
    } else if (status >= 15 && status <= 17 || status == 25) {
      if (item.refundAmount && item.payAmount && item.refundAmount < item.payAmount) {// 全额退款为已关闭，部分退款为已完成
        return '已完成'
      }
      return '已关闭'
    }
  }

  render() {
    const { list } = this.props;
    const tabContent = list.map((item, index) => {
      if (item.orderType == 1) {
        item.orderTypes = "普通"
      }
      if (item.orderType == 2) {
        item.orderTypes = "拼团"
      }
      if (item.isProxySale == 0) {
        item.isProxySale = "官方订单"
      }
      if (item.isProxySale == 1) {
        item.isProxySale = "分销订单"
      }

      // 拼团状态
      const spellGroup = (item) => {
        if (item.groupOrderStatus && item.groupOrderStatus == 1) {
          return (
            <div>
              <p>已关闭</p>
              <p style={{ color: 'red' }}>拼团失败</p>
            </div>
          )
        }
        if (item.groupOrderStatus && item.groupOrderStatus == 2) {
          return (
            <div>
              <p>待成团</p>
              <p style={{ color: 'red' }}>拼团进行中</p>
            </div>
          )
        }
      }

      // 立即发货和查看物流显示
      const deliveryStatus = (item, lists) => {
        if (item.status == 2 || item.status == 8) {
          if (lists.isSend == 1) {
            return (
              <div>
                <a href="javascript:;" onClick={() => this.onShowLogistics(item.orderId)}>查看物流</a>
              </div>
            )
          }
          return (
            <div>
              <a href="javascript:;" onClick={() => this.onDelivery(item)}>立即发货</a>
            </div>
          )
        }
        if (item.status == 3 || item.status == 9 || item.status == 12 || item.status == 18 && lists.isSend == 1) {
          return (
            <div>
              <a href="javascript:;" onClick={() => this.onShowLogistics(item.orderId)}>查看物流</a>
            </div>
          )
        }
      }

      return (
        <div className={styles.table_content} key={index}>
          <div className={styles.order_info}>
            {item.orderType && item.orderType == 2 ? <div className={styles.order_tuan}>团</div> : null}
            <div className={styles.left}>
              <div>
                <span>订单号:{item.orderNo}</span>
                <span>订单来源:{item.isProxySale}</span>
                <span>订单类型：{item.orderTypes}</span>
              </div>
              <div>
                <span>支付流水号：{item.payOrderId}</span>
              </div>
              <div>
                <span>实付金额：{item.payAmount}</span>
                <span>支付方式：{this.termsPayment(item.billType)}</span>
              </div>
            </div>
            <div className={styles.right}>
              <Link to={`/business/order-management/order-detail/${item.orderId}`}>
                <Button type="primary" ghost>查看详情</Button>
              </Link>
              <Button type="primary" ghost onClick={() => this.showModal(item.orderId)}>备注</Button>
            </div>
          </div>
          <table className={styles.tbody}>
            <tbody>
              {item.goods.map((lists, i) => {
                return (
                  <tr key={i}>
                    <td style={{ width: "25%", minWidth: 253, padding: 20, position: 'relative' }}>
                      <div className={styles.goods_img} style={{ backgroundImage: `url(${lists.goodsFile})` }}>

                      </div>
                      <div className={styles.goods_info}>
                        <h4>{lists.goodsName}</h4>
                        {lists.specifications && lists.specifications.length > 0 ?
                          lists.specifications.map((children, j) => {
                            if (children.type && children.name) {
                              return <div key={j}>{children.type}：{children.name}</div>
                            }
                          })
                          : null
                        }
                      </div>
                    </td>
                    <td style={{ width: "15%", minWidth: 100 }}>
                      <div>￥{lists.price}</div>
                      <div>（{lists.goodsNum ? lists.goodsNum : 1}件）</div>
                    </td>
                    <td style={{ width: "15%", minWidth: 100 }}>
                      <div>{lists.receiverName}</div>
                      <div>{lists.receiverMobile}</div>
                    </td>
                    <td style={{ width: "15%", minWidth: 100 }}>
                      <div>{lists.createTime}</div>
                    </td>
                    <td style={{ width: "15%", minWidth: 100 }}>
                      {item.orderType && item.groupOrderStatus !== 1 && item.groupOrderStatus !== 2 ? <div>{this.orderStatus(item.status, lists.isSend, item)}</div> : null}
                      {item.orderType && item.groupOrderStatus !== 1 && item.groupOrderStatus !== 2 ? deliveryStatus(item, lists) : null}
                      {spellGroup(item)}
                    </td>
                    <td style={{ width: "15%", minWidth: 100 }}>￥{lists.amount}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className={styles.remark}>{item.remark}</div>
        </div>
      )
    })

    return (
      <div>
        <table className={styles.table_title}>
          <thead>
            <tr>
              <th style={{ width: "25%", minWidth: 253 }}>商户</th>
              <th style={{ width: "15%", minWidth: 100 }}>单价/数量</th>
              <th style={{ width: "15%", minWidth: 100 }}>买家信息</th>
              <th style={{ width: "15%", minWidth: 100 }}>下单时间</th>
              <th style={{ width: "15%", minWidth: 100 }}>订单状态</th>
              <th style={{ width: "15%", minWidth: 100 }}>实付金额</th>
            </tr>
          </thead>
        </table>
        {tabContent}
        <OrderTableForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          handleCancel={this.handleCancel}
          handleSubmit={this.handleSubmit}
          onSelectGoods={this.onSelectGoods}
          onBlurRemark={this.onBlurRemark}
          {...this.props}
          {...this.state}
        />
        <ShowLogistics modal={this.state.visible1} id={this.state.orderId} onCompelete={this.onCompelete} />
      </div>
    )
  }
};

const OrderTableForm = Form.create()(
  class extends React.Component {
    render() {
      const { handleCancel, handleSubmit, form, visible, confirmLoading, isTable, title, orderListModel, onSelectGoods, onBlurRemark, selectedRowKeys, onSelectCourier } = this.props;
      const { getFieldDecorator } = form;
      const { showListLoadding, buyersInfo, courierList } = orderListModel;
      const formItemLayout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 15 }
      }

      const rowSelection = {
        selectedRowKeys,
        onChange: onSelectGoods,
        getCheckboxProps: record => ({
          disabled: record.isSend === '已发货', // Column configuration not to be checked
        }),
      };
      const showTable = () => {
        const { addressJson, transportJsonList } = buyersInfo;
        return (
          <Spin size="large" spinning={showListLoadding}>
            <Table rowSelection={rowSelection} columns={columns} dataSource={transportJsonList} rowKey={(r, i) => r.relationId} />
            <Form className="login-form">
              <Row>
                <Col span={3} style={{ textAlign: 'right' }}>收货信息：</Col>
                {addressJson ? <Col span={21}>{addressJson.province} {addressJson.country} {addressJson.address} {addressJson.receiverName}, {addressJson.mobile}</Col> : null}
              </Row>
              <FormItem {...formItemLayout} label="发货方式">
                {getFieldDecorator('transportType', {
                  initialValue: 1,
                  rules: [{ required: true, message: '请选择发货方式' }],
                })(
                  <RadioGroup>
                    <Radio value={1}>物流发货</Radio>
                    <Radio value={2}>用户自提</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="快递公司">
                {getFieldDecorator('logisticsId', {
                  rules: [{ required: true, message: '请选择快递公司' }],
                })(
                  <Select
                    showSearch
                    placeholder="请选择"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {courierList.map((item, index) => {
                      return <Option key={index} value={`${item.companyId},${item.companyCode}`}>{item.companyName}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="快递单号">
                {getFieldDecorator('transportNo', {
                  rules: [{ required: true, message: '请输入快递单号' }],
                })(
                  <Input type="text" placeholder="请输入快递单号" onKeyUp={e => e.target.value = e.target.value.replace(/[^0-9a-zA-Z]*$/g, '')} />
                )}
              </FormItem>
            </Form>
          </Spin>
        )
      }
      return (
        <Modal title={title}
          visible={visible}
          width="700px"
          onOk={handleSubmit}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          {isTable ? showTable() : <TextArea placeholder="请填写备注信息，最多200字" maxLength="200" onBlur={onBlurRemark} autosize={{ minRows: 2, maxRows: 6 }} />}
        </Modal>
      );
    }
  }
);

const mapStateToProps = (state) => {
  return { orderListModel: state.orderListModel }
}

export default connect(mapStateToProps)(OrderTable)
