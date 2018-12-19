import React from 'react';

import { Button, Row, Col, Spin, Table, Select, Modal, Radio, Input, Form } from 'antd';

import styles from './goods-delivery.less';

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

class GoodsDelivery extends React.Component {

  constructor(props) {
    super(props);
    this.tableColumn = columns.concat({
      title: '操作',
      dataIndex: 'opration',
      key: 'opration',
      width: '15%',
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            <div>修改</div>
            <a href="javascript:;" onClick={() => this.onChangeEdit(record.id)}>修改</a>
          </div>
        );
      }
    });
    this.state = {
      goodsList: [], // 选择的商品列表 
    }
  }

  // 选择发货商品
  onSelectGoods = (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    this.setState({
      selectedRowKeys,
      goodsList: selectedRows,
    })
  }

  
  render() {
    const { handleCancel, handleSubmit, form, visible, orderListModel, } = this.props;
    const { getFieldDecorator } = form;
    const { showListLoadding, buyersInfo, courierList } = orderListModel;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 15 }
    }
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectGoods,
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
                rules: [
                  { required: true, message: '请选择发货方式' },
                ],
              })(
                <RadioGroup>
                  <Radio value={1}>物流发货</Radio>
                  <Radio value={2}>用户自提</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="快递公司">
              {getFieldDecorator('logisticsId', {
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
                    return <Option key={index} value={`${item.companyId},${item.companyCode}`}>{item.companyName}</Option>
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="快递单号">
              {getFieldDecorator('transportNo', {
                rules: [
                  { required: true, message: '请输入快递单号' },
                ],
              })(
                <Input type="text" placeholder="请输入快递单号" onKeyUp={e => e.target.value = e.target.value.replace(/[^0-9a-zA-Z]*$/g,'')}/>
              )}
            </FormItem>
          </Form>
        </Spin>
      )
    }
    return (
      <Modal title="商品发货"
        visible={visible}
        width="700px"
        onOk={() => handleSubmit(this.state.goodsList)}
        onCancel={handleCancel}
      >
      {showTable()}
      </Modal>
    );
  }
}

const GoodsDeliveryForm = Form.create()(GoodsDelivery);

export default GoodsDeliveryForm;