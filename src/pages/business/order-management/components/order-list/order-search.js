import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { Button, Form, Input, Select, Row, Col, DatePicker, Modal } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

import styles from '../../index.less';

class OrderSearch extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };

  handleChang = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      if (fieldsValue['time'] && fieldsValue['time'].length > 0) {
        const values = {
          ...fieldsValue,
          'startTime': fieldsValue['time'][0].format('YYYY-MM-DD HH:mm:ss'),
          'endTime': fieldsValue['time'][1].format('YYYY-MM-DD HH:mm:ss'),
        };
        delete values['time']
        this.props.getSearchData(values)
      } else {
        delete fieldsValue['time'];
        const values = {
          ...fieldsValue,
          'startTime': '',
          'endTime': '',
        };
        this.props.getSearchData(values)
      }
    });
  }

  // 近7天日期
  onChangeSevenDays = () => {
    this.props.form.resetFields('time'); // 重置之前选择的时间
    const { searchData } = this.props.orderListModel;
    const { dispatch } = this.props;
    let startDate = this.getBeforeDate(7);
    let endDate = this.getBeforeDate(0);
    searchData.startTime = moment(startDate).format('YYYY-MM-DD HH:mm:ss');
    searchData.endTime = moment(endDate).format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'orderListModel/setSearchData',
      payload: {
        searchData,
      }
    });
  }

  // 近30天日期
  onChangeThirtyDays = () => {
    this.props.form.resetFields('time'); // 重置之前选择的时间
    const { searchData } = this.props.orderListModel;
    const { dispatch } = this.props;
    let startDate = this.getBeforeDate(30);
    let endDate = this.getBeforeDate(0);
    searchData.startTime = moment(startDate).format('YYYY-MM-DD HH:mm:ss');
    searchData.endTime = moment(endDate).format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'orderListModel/setSearchData',
      payload: {
        searchData,
      }
    });
  }

  // 获取任意一天的日期
  getBeforeDate = (n) => {
    var date = new Date();
    let year, month, day, s;
    date.setDate(date.getDate() - n);
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    s = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day);
    return s
  }

  // 导出
  onExport = () => {
    const { dispatch, orderListModel } = this.props;
    dispatch({
      type: 'orderListModel/orderExport',
      payload: {
        ...orderListModel.searchData,
        status: orderListModel.status,
        enterpriseId: orderListModel.enterpriseId,
        shopId: orderListModel.shopId,
      }
    });
  }

  render() {
    const { form } = this.props;
    const { searchData } = this.props.orderListModel;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 }
    }
    const prefixSelector = getFieldDecorator('conditionType', {
      initialValue: searchData.conditionType,
    })(
      <Select style={{ width: 120 }}>
        <Option value={1}>订单号</Option>
        <Option value={2}>收货人姓名</Option>
        <Option value={3}>收货人手机</Option>
      </Select>
    );
    return (
      <div className={styles.formContent}>
        <Form onSubmit={this.handleChang}>
          <Row>
            <Col span={10}>
              <FormItem
                className={styles.select_order}
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator('conditionValue', {
                  initialValue: searchData.conditionValue,
                  getValueFromEvent: e => {
                    return e.target.value.replace(/[!~@#$%*&()_+\s^]/g, '');
                  }
                })(
                  <Input addonBefore={prefixSelector} style={{ width: 310 }} />
                )}
              </FormItem>
            </Col>
            <Col span={14}>
              <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="下单时间">
                {/* {getFieldDecorator('startTime', { initialValue: searchData.startTime || null })(<DatePicker style={{ width: 140 }} />)}
                <span> 至 </span>
                {getFieldDecorator('endTime', { initialValue: searchData.endTime || null })(<DatePicker style={{ width: 140 }} />)} */}

                {getFieldDecorator('time', { initialValue: searchData.startTime && searchData.endTime ? [moment(searchData.startTime), moment(searchData.endTime)] : [] })(
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                )}
                <a href="javascript:;" style={{ paddingLeft: 32 }} onClick={() => this.onChangeSevenDays()}>近7天</a>
                <a href="javascript:;" style={{ paddingLeft: 16 }} onClick={() => this.onChangeThirtyDays()}>近30天</a>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem {...formItemLayout} label="订单来源">
                {getFieldDecorator('isProxySale', { initialValue: searchData.isProxySale })(
                  <Select style={{ width: 240 }}>
                    <Option value="">全部</Option>
                    <Option value={0}>官方订单</Option>
                    <Option value={1}>分销订单</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={14}>
              <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="订单类型">
                {getFieldDecorator('orderType', { initialValue: searchData.orderType })(
                  <Select style={{ width: 240 }}>
                    <Option value={0}>全部</Option>
                    <Option value={1}>普通</Option>
                    <Option value={2}>拼团</Option>
                  </Select>
                )}
                <Button style={{ marginLeft: '104px' }} type="primary" htmlType="submit">查询</Button>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem {...formItemLayout} label="付款方式">
                {getFieldDecorator('billType', { initialValue: searchData.billType })(
                  <Select style={{ width: 240 }}>
                    <Option value={0}>全部</Option>
                    <Option value={1}>银行卡(快捷)</Option>
                    <Option value={2}>信用卡(快捷)</Option>
                    <Option value={3}>微信</Option>
                    <Option value={4}>支付宝</Option>
                    <Option value={5}>零钱</Option>
                    <Option value={6}>银行卡</Option>
                    <Option value={7}>信用卡</Option>
                    <Option value={8}>企业钱包</Option>
                    <Option value={9}>公务钱包</Option>
                    <Option value={10}>福利钱包</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={14}>
              <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="物流方式">
                {getFieldDecorator('transportType', { initialValue: searchData.transportType })(
                  <Select style={{ width: 240 }}>
                    <Option value={0}>全部</Option>
                    <Option value={1}>普通物流</Option>
                    <Option value={2}>上门自提</Option>
                  </Select>
                )}
                <Button style={{ marginLeft: '104px' }} type="primary" onClick={this.onExport}>导出</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { orderListModel: state.orderListModel };
};

const orderSearchSearch = Form.create()(OrderSearch)

export default connect(mapStateToProps)(orderSearchSearch)