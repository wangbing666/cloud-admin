import React from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  DatePicker,
} from 'antd';
import moment from 'moment';
import styles from '../../activity-edit/index.less';

const FormItem = Form.Item;
const { TextArea } = Input;

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function disabledDate(current) {
  // Can not select days before today and today
  let date = getBeforeDate(0)
  return current && current < moment(date);
}

function getBeforeDate(n) {
  var date = new Date();
  let year, month, day, s;
  date.setDate(date.getDate() - n);
  year = date.getFullYear();
  month = date.getMonth() + 1;
  day = date.getDate();
  s = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day);
  return s
}

function disabledDateTime() {
  return {
    disabledHours: () => range(0, 24).splice(0, 0),
    disabledMinutes: () => range(0, 60).splice(0, 0)
  };
}

export default class ActivityInfo extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { formData } = this.props;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 11 }
    }
    return (
      <div className={styles.info_edit}>
        <div className={styles.activity_title}>
          <label>基本信息</label>
        </div>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="活动名称">
              {getFieldDecorator('groupActivityName', {
                initialValue: formData.groupActivityName || '',
                getValueFromEvent: e => {
                  return e.target.value.replace(/[!~@#$%*&()_+\s^]/g, '');
                },
                rules: [
                  { required: true, message: '请输入内容' },
                  { max: 20, message: '输入文字超过限制字数' },
                ],
              })(
                <Input placeholder="活动名称必须填写，请输入1-20个字" disabled={formData.isStatus == 1 || formData.isStatus == 2} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="活动开始" >
              {getFieldDecorator('startTimeString', {
                initialValue: formData.startTime ? moment(formData.startTime) : null,
                rules: [
                  { required: true, message: '请选择日期!' },
                ],
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  disabled={formData.isStatus == 1 || formData.isStatus == 2}
                  disabledDate={disabledDate}
                  disabledTime={disabledDateTime}
                  format="YYYY-MM-DD HH:mm:ss" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="活动结束">
              {getFieldDecorator('endTimeString', {
                initialValue: formData.endTime ? moment(formData.endTime) : null,
                rules: [
                  { required: true, message: '请选择商品分组!' },
                ],
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  disabledDate={disabledDate}
                  disabledTime={disabledDateTime}
                  format="YYYY-MM-DD HH:mm:ss" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="活动主题">
              {getFieldDecorator('theme', {
                initialValue: formData.theme || '',
                rules: [
                  { max: 100, message: '输入文字超过最大字数限制!' },
                ],
              })(
                <TextArea
                  placeholder="添加针对此活动的主题或备注说明，不超过100字即可"
                  autosize={{ minRows: 6, maxRows: 10 }}
                  disabled={formData.isStatus == 1 || formData.isStatus == 2}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12} style={{position:'relative'}}>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 5 }} label="商品限购">
              {getFieldDecorator('goodsLimitNumber', {
                initialValue: formData.goodsLimitNumber || 0,
                rules: [
                  { required: true, message: '请输入内容' },
                ],
              })(
                <Input placeholder="" type="text" maxLength="8" onKeyUp={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')} disabled={formData.isStatus == 1 || formData.isStatus == 2} />
              )}
              <span className={styles.limit}>件/人</span>
            </FormItem>
            {/* <span className={styles.limit}>件/人</span> */}
          </Col>
        </Row>
      </div>
    );
  }
}