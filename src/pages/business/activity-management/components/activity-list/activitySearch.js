import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { Button, Form, Input, Select, Row, Col, DatePicker, Modal } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
import styles from '../../index.less';

const { RangePicker } = DatePicker;

class ActivitySearch extends React.Component {

  constructor(props) {
    super(props);
  }

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

  render() {
    const { form, searchData } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 }
    }
    const prefixSelector = getFieldDecorator('nameType', {
      initialValue: searchData.nameType,
    })(
      <Select style={{ width: 120 }}>
        <Option value={0}>活动名称</Option>
        <Option value={1}>商品名称</Option>
      </Select>
    );
    return (
      <div className={styles.formContent}>
        <Form onSubmit={this.handleChang}>
          <Row>
            <Col span={10}>
              <FormItem
                className={styles.select_name}
                {...formItemLayout}
                label=" "
              >
                {getFieldDecorator('conditionValue', { initialValue: searchData.conditionValue })(
                  <Input addonBefore={prefixSelector} type="text" maxLength={20} style={{ width: 310 }} />
                )}
              </FormItem>
            </Col>
            <Col span={14}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="活动类型">
                {getFieldDecorator('type', { initialValue: searchData.type })(
                  <Select style={{ width: 240 }}>
                    <Option value="">全部</Option>
                    <Option value={0}>团购活动</Option>
                  </Select>
                )}
              </FormItem>

            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem {...formItemLayout} label="活动状态">
                {getFieldDecorator('isStatus', { initialValue: searchData.isStatus })(
                  <Select style={{ width: 240 }}>
                    <Option value="">全部</Option>
                    <Option value={0}>未发布</Option>
                    <Option value={1}>等待开始</Option>
                    <Option value={2}>活动进行中</Option>
                    <Option value={3}>活动已结束</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={14}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="创建时间" className={styles.create_date}>
                {/* {getFieldDecorator('startTime', { initialValue: searchData.startTime || null })(<DatePicker style={{ width: 150 }} />)}
                <span> 到 </span>
                {getFieldDecorator('endTime', { initialValue: searchData.endTime || null })(<DatePicker style={{ width: 150 }} />)} */}
                {getFieldDecorator('time', { initialValue: searchData.startTime && searchData.endTime ? [moment(searchData.startTime), moment(searchData.endTime)] : [] })(
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                )}
                <Button style={{ marginLeft: '50px' }} type="primary" htmlType="submit">查询</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { goodsModel: state.goodsModel };
};

const activitySearch = Form.create()(ActivitySearch)

export default connect(mapStateToProps)(activitySearch)