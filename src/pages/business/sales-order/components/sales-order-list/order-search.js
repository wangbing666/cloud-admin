import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { Button, Form, Input, Select, Row, Col, DatePicker, Modal } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

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
      if (fieldsValue['blackStartTime'] && fieldsValue['blackEndTime']) {
        const values = {
          ...fieldsValue,
          'blackStartTime': fieldsValue['blackStartTime'].format('YYYY-MM-DD'),
          'blackEndTime': fieldsValue['blackEndTime'].format('YYYY-MM-DD'),
        };
        this.props.getSearchData(values)
      } else {
        fieldsValue['blackStartTime'] = '';
        fieldsValue['blackEndTime'] = '';
        this.props.getSearchData(fieldsValue)
      }
    });
  }

  // 待审核
  toAuditing = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        fieldsValue.isAuth = 1;
        if (fieldsValue['blackStartTime'] && fieldsValue['blackEndTime']) {
          const values = {
            ...fieldsValue,
            'blackStartTime': fieldsValue['blackStartTime'].format('YYYY-MM-DD'),
            'blackEndTime': fieldsValue['blackEndTime'].format('YYYY-MM-DD'),
          };
          this.props.getSearchData(values)
        } else {
          fieldsValue['blackStartTime'] = '';
          fieldsValue['blackEndTime'] = '';
          this.props.getSearchData(fieldsValue)
        }
      }
    });
  }

  // 近7天日期
  onChangeSevenDays = () => {
    const { searchData } = this.props.salesOrderModel;
    const { dispatch } = this.props;
    let startDate = this.getBeforeDate(7);
    let endDate = this.getBeforeDate(0);
    searchData.blackStartTime = moment(startDate);
    searchData.blackEndTime = moment(endDate);
    dispatch({
      type: 'salesOrderModel/setSearchData',
      payload: {
        searchData,
      }
    });
  }

  // 近30天日期
  onChangeThirtyDays = () => {
    const { searchData } = this.props.salesOrderModel;
    const { dispatch } = this.props;
    let startDate = this.getBeforeDate(30);
    let endDate = this.getBeforeDate(0);
    searchData.blackStartTime = moment(startDate);
    searchData.blackEndTime = moment(endDate);
    dispatch({
      type: 'salesOrderModel/setSearchData',
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

  render() {
    const { form, searchData } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    }
    return (
      <div className={styles.formContent}>
        <Form onSubmit={this.handleChang}>
          <div className={styles.cloudHead}>
            <div className={styles.cloudHeadLeft}>
              <span>售后订单搜索</span>
            </div>
            <div className={styles.cloudHeadRight}>
              <div className={styles.row} style={{ display: 'inline-block' }}>
                <Button type="primary" ghost onClick={this.toAuditing}>待审核</Button>
              </div>
            </div>
          </div>
          <Row>
            <Col span={6}>
              <FormItem
                className={styles.select_order}
                {...formItemLayout}
                label="售后单号："
              >
                {getFieldDecorator('saleOrderNo', {
                  initialValue: searchData.saleOrderNo
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                className={styles.select_order}
                {...formItemLayout}
                label="订单号："
              >
                {getFieldDecorator('orderNO', {
                  initialValue: searchData.orderNO
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={13}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="下单时间：">
                {getFieldDecorator('blackStartTime', {
                  initialValue: searchData.blackStartTime ? moment(searchData.blackStartTime) : null
                })(<DatePicker style={{ width: 120 }} />)}
                <span> 至 </span>
                {getFieldDecorator('blackEndTime', {
                  initialValue: searchData.blackEndTime ? moment(searchData.blackEndTime) : null
                })(<DatePicker style={{ width: 120 }} />)}
                <a href="javascript:;" style={{ paddingLeft: 16 }} onClick={() => this.onChangeSevenDays()}>近7天</a>
                <a href="javascript:;" style={{ paddingLeft: 16 }} onClick={() => this.onChangeThirtyDays()}>近30天</a>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem {...formItemLayout} label="收货人手机：">
                {getFieldDecorator('mobile', { initialValue: searchData.mobile })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem {...formItemLayout} label="退款类型">
                {getFieldDecorator('saleType', { initialValue: searchData.saleType })(
                  <Select>
                    <Option value={0}>全部</Option>
                    <Option value={1}>仅退款</Option>
                    <Option value={2}>退货并退款</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={13}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="当前状态">
                {getFieldDecorator('isAuth', { initialValue: searchData.isAuth })(
                  <Select style={{ width: 260 }}>
                    <Option value={0}>全部</Option>
                    <Option value={1}>待审核</Option>
                    <Option value={2}>审核通过</Option>
                    <Option value={3}>审核拒绝</Option>
                    <Option value={4}>退款成功</Option>
                    <Option value={5}>已撤销</Option>
                    <Option value={6}>退款失败</Option>
                  </Select>
                )}
                <Button type="primary" style={{ marginLeft: 35 }} htmlType="submit">查询</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { salesOrderModel: state.salesOrderModel };
};

const orderSearchSearch = Form.create()(OrderSearch)

export default connect(mapStateToProps)(orderSearchSearch)