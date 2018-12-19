import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { Button, Form, Input, Select, Row, Col, DatePicker, Modal } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

import styles from '../../index.less';

class Search extends React.Component {

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
          'createStartTime': fieldsValue['time'][0].format('YYYY-MM-DD HH:mm:ss'),
          'createEndTime': fieldsValue['time'][1].format('YYYY-MM-DD HH:mm:ss'),
        };
        delete values['time']
        this.props.getSearchData(values)
      } else {
        delete fieldsValue['time'];
        const values = {
          ...fieldsValue,
          'createStartTime': '',
          'createEndTime': '',
        };
        this.props.getSearchData(values)
      }
    });
  }

  render() {
    const { form, searchData } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 }
    }
    const { goodsGrouping } = this.props.goodsModel;
    return (
      <div className={styles.formContent}>
        <Form onSubmit={this.handleChang}>
          <Row>
            <Col span={7}>
              <FormItem {...formItemLayout} label="商品名称">
                {getFieldDecorator('goodsName', { initialValue: searchData.goodsName })(
                  <Input placeholder="" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem {...formItemLayout} label="发布状态">
                {getFieldDecorator('status', { initialValue: searchData.status })(
                  <Select>
                    <Option value="">全部</Option>
                    <Option value={0}>待上架</Option>
                    <Option value={1}>上架中</Option>
                    <Option value={2}>已下架</Option>
                    <Option value={3}>已售罄</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="创建日期">
                {getFieldDecorator('time', {initialValue: searchData.createStartTime && searchData.createEndTime ? [moment(searchData.createStartTime), moment(searchData.createEndTime)] : []})(
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={7}>
              <FormItem {...formItemLayout} label="商品分组">
                {getFieldDecorator('groupId', { initialValue: searchData.groupId })(
                  <Select>
                    <Option value="">全部</Option>
                    {goodsGrouping && goodsGrouping.list ? 
                      goodsGrouping.list.map((item, index) => {
                        return <Option key={index} value={item.groupId}>{item.name}</Option>
                      })
                    : null}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem {...formItemLayout} label="商品类型">
                {getFieldDecorator('goodsType', { initialValue: searchData.goodsType })(
                  <Select>
                    <Option value="">全部</Option>
                    <Option value={1}>普通商品</Option>
                    <Option value={2}>拼团商品</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="异常商品">
                {getFieldDecorator('runStatus', { initialValue: searchData.runStatus })(
                  <Select style={{ width: 200 }}>
                    <Option value={1}>正常</Option>
                    <Option value={2}>被撤下</Option>
                    <Option value={3}>待审核</Option>
                  </Select>
                )}
                <Button style={{ marginLeft: 40 }} type="primary" htmlType="submit">搜索</Button>
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

const goodsSearch = Form.create()(Search)

export default connect(mapStateToProps)(goodsSearch)