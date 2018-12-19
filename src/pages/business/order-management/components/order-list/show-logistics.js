import React from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, Table, Radio, Row, Col, Spin, Select, Steps } from 'antd';
import { Link, Switch } from 'dva/router';
import styles from './show-logistics.less';
import { relative } from 'path';

const Step = Steps.Step;
const { TextArea } = Input;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class ShowLogistics extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    logisticsVisible: false,
    visible: false,
  }

  // 打开物流详情弹框
  LogisticsProgress = (row) => {
    const { dispatch } = this.props;
    console.log(row)
    dispatch({
      type: 'orderListModel/LogisticsProgress',
      payload: {
        deliverCompanyNo: row.deliverCompanyNo,
        transportNo: row.transportNo
      }
    })
    this.setState({
      logisticsVisible: true,
    });
  }

  // 关闭物流弹框
  handleCancel = () => {
    this.props.onCompelete();
  }

  // 关闭物流弹框
  handleSubmit = () => {
    this.props.onCompelete();
  }

  // 关闭物流详情弹框
  handleCancelProgress = () => {
    this.setState({
      logisticsVisible: false,
    });
  }

  // 修改物流
  LogisticsEdit = (value) => {
    this.setState({
      visible: true,
      relationId: value.relationId,
    })
  }

  // 确认修改物流
  handleConfirm = () => {
    const { dispatch } = this.props;
    this.formRef.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'orderListModel/UpdateTransNo',
        payload: {
          orderId: this.props.id,
          relationId: this.state.relationId,
          ...values,
        }
      })
        .then(() => {
          this.setState({
            visible: false,
          })
          this.props.onCompelete();
        })
    });
  }

  // 使用模态框确定按钮提交表单
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  // 关闭修改物流模态框
  handleClose = () => {
    this.setState({
      visible: false,
    })
  }
  render() {
    const { logistics, logisticsProgress } = this.props.orderListModel;
    const { modal } = this.props;
    const { logisticsVisible } = this.state;
    const columns = [{
      title: '商品名称',
      dataIndex: 'name',
      render: (text, row) => {
        return (
          <div>
            <p>{row.goodsName}</p>
            {row.specifications.map((item, index) => {
              return <div key={index} className={styles.goods_specifications}><span>{item.type} </span><span> {item.name}</span></div>
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
      render: (text, row) => {
        return (
          <div>
            <div>承运来源: {row.deliverCompanyName}</div>
            <div>运单编号: <a href="javascript:;" onClick={() => this.LogisticsProgress(row)}>{row.transportNo}</a></div>
          </div>
        )
      },
    }, {
      title: '状态',
      dataIndex: 'isSend',
      render: (text, row) => {
        return (
          <div>
            <div>{text}</div>
            {row.isSend == '已发货' ? <div><a href="javascript:;" onClick={() => this.LogisticsEdit(row)}>修改</a></div> : null}
          </div>
        )
      },
    }];
    const logisticsStatus = (status) => {
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
    return (
      <div>
        <Modal title='商品物流'
          visible={modal}
          width="700px"
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
        >
          {logistics.transportJsonList ? <Table columns={columns} dataSource={logistics.transportJsonList} rowKey={(r, i) => i} /> : null}
          <Row>
            <Col span={3} style={{ textAlign: 'right' }}>收货信息：</Col>
            {logistics.addressJson ? <Col span={21}>{logistics.addressJson.province} {logistics.addressJson.country} {logistics.addressJson.address} {logistics.addressJson.receiverName}, {logistics.addressJson.mobile}</Col> : null}
          </Row>
        </Modal>
        <Modal
          title="物流进度"
          visible={logisticsVisible}
          onCancel={this.handleCancelProgress}
          footer={null}
        >
          {logisticsProgress.data ?
            <div>
              {/* <Row>
                <Col span={4}>物流状态：</Col>
                <Col>{logisticsStatus(logisticsProgress.result.transStatus)}</Col>
              </Row>
              <Row>
                <Col span={4}>承运来源：</Col>
                <Col>{logisticsProgress.result.name}</Col>
              </Row>
              <Row>
                <Col span={4}>运单编号：</Col>
                <Col>{logisticsProgress.result.transportNo}</Col>
              </Row> */}
              <div className={styles.logistics_step}>
                {logisticsProgress.data ?
                  <Steps direction="vertical" current={logisticsProgress.data.length - 1} size="small">
                    {logisticsProgress.data.reverse().map((item, index) => {
                      return <Step key={index} title={item.context} description={item.time} />
                    })}
                  </Steps>
                  : null}
              </div>
            </div>
            : <div style={{textAlign: 'center', color: '#999'}}>未查询到物流信息</div>}
        </Modal>
        <LogisticsForm
          {...this.props}
          {...this.state}
          handleCancel={this.handleClose}
          handleConfirm={this.handleConfirm}
          wrappedComponentRef={this.saveFormRef}
        />
      </div>
    )
  }
};

const LogisticsForm = Form.create()(
  class extends React.Component {
    render() {
      const { handleCancel, handleConfirm, form, visible, orderListModel } = this.props;
      const { getFieldDecorator } = form;
      const { courierList } = orderListModel;

      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 15 }
      }

      const showTable = () => {
        return (
          <Form className="login-form">
            <FormItem {...formItemLayout} label="快递公司">
              {getFieldDecorator('logisticId', {
                rules: [
                  { required: true, message: '请选择快递公司' },
                ],
              })(
                <Select
                  showSearch
                  placeholder="请选择"
                  optionFilterProp="children"
                  onChange={this.handleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {courierList.map((item, index) => {
                    return <Option key={index} value={item.companyId}>{item.companyName}</Option>
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="快递单号">
              {getFieldDecorator('transportNo', {
                rules: [
                  { required: true, message: '请输入内容' },
                ],
              })(
                <Input type="text" placeholder="请输入快递单号" onKeyUp={e => e.target.value = e.target.value.replace(/[^0-9a-zA-Z]*$/g,'')}/>
              )}
            </FormItem>
          </Form>
        )
      }
      return (
        <Modal title="修改"
          visible={visible}
          onOk={handleConfirm}
          onCancel={handleCancel}
        >
          {showTable()}
        </Modal>
      );
    }
  }
);

const mapStateToProps = (state) => {
  return { orderListModel: state.orderListModel }
}

export default connect(mapStateToProps)(ShowLogistics)
