import React from 'react';
import {
  Checkbox,
  Form,
  Input,
  Row,
  Select,
  Col,
  Button,
  Radio,
  DatePicker,
} from 'antd';
import { connect } from 'dva';

import moment from 'moment';

import styles from '../../goods-edit/index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const options = [
  { label: '包邮', value: '1' },
  { label: '正品保证', value: '2' },
  { label: '7天无理由退货', value: '3' },
];
class otherInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      saleTime: false,
      serviceList: [{ serviceDescription: '' }],
    }
  }

  // 立即开售or定时开售
  saleDate = (e) => {
    const { formData } = this.props;
    const index = e.target.value
    if (index == 2) {
      formData.saleMethod = 2;
    } else {
      formData.saleMethod = 1;
    }
  }

  // 增加服务说明
  addService = () => {
    const { services } = this.props.goodsEditModel;
    const { dispatch } = this.props;
    if (services && services.length < 10) {
      services.push('')
    }
    dispatch({
      type: 'goodsEditModel/setServices',
      payload: {
        services
      },
    })
  }

  // 减少服务说明
  reduceService = (i) => {
    const { services } = this.props.goodsEditModel;
    const { dispatch } = this.props;
    if (services && services.length > 1){
      services.splice(i, 1);
    }
    dispatch({
      type: 'goodsEditModel/setServices',
      payload: {
        services
      },
    })
  }

  // 保存服务说明内容
  onChangeValue = (i, e) => {
    const { services } = this.props.goodsEditModel;
    const { dispatch } = this.props;
    services[i] = e.target.value
    dispatch({
      type: 'goodsEditModel/setServices',
      payload: {
        services
      },
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { formData, goodsId } = this.props;
    const { services } = this.props.goodsEditModel;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 }
    }
    let list = [];
    if (formData.condition) {
      list = String(formData.condition).split("")
    }

    if (formData.backGoods) {
      list.push('3');
      list = [...new Set(list)] // 数组去重
    }
    return (
      <div className={styles.info_edit}>
        <div className={styles.goods_title}>
          <label>其他信息</label>
        </div>
        <Row>
          <Col span={12}>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 4 }} label="每人限购">
              {getFieldDecorator('restrictionsNumber', {
                initialValue: formData.resNumber || 0,
              })(
                <Input placeholder="0" />
              )}
            </FormItem>
            <FormItem className={styles.describe_radio} labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
              {getFieldDecorator('condition', {
                initialValue: list.length > 0 ? list : (goodsId == 0 ? ['2', '3'] : []), // 新增商品默认勾选正品保证和7天退货
              })(
                <CheckboxGroup options={options} onChange={this.onChange} />
              )}
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem {...formItemLayout} label="开售时间">
              {getFieldDecorator('saleMethod', {
                initialValue: formData.saleMethod || 1,
              })(
                <RadioGroup onChange={this.saleDate}>
                  <Radio value={1}>立即开售</Radio>
                  <Radio value={2}>定时开售</Radio>
                </RadioGroup>
              )}
            </FormItem>
            {formData.saleMethod == 2 ? <FormItem {...formItemLayout} label=" " className={styles.saleTime}>
              {getFieldDecorator('saleTime', {
                initialValue: formData.saleTime ? moment(formData.saleTime) : null,
              })(
                <DatePicker
                  dropdownClassName={styles.sale_time_select}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择开售时间"
                />
              )}
            </FormItem> : null}
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="商品描述">
              {getFieldDecorator('describe', {
                initialValue: formData.describe || '',
                rules: [
                  { max: 50, message: '已超过最大字数限制' },
                ],
              })(
                <TextArea placeholder="描述产品卖点，关键点，注意简洁精炼！不超过50个字" autosize={{ minRows: 2, maxRows: 6 }} />
              )}
            </FormItem>
          </Col>
          <Col span={11}>
            {services.map((item, index) => {
              return (
                <div key={index}>
                  <FormItem
                    {...formItemLayout}
                    label={index == 0 ? '服务说明' : ' '}
                    className={index == 0 ? '' : styles.other_services}
                    style={{ marginBottom: 0 }}
                  >
                    {getFieldDecorator(`serviceDescription[${index}]`, {
                      validateTrigger: ['onChange', 'onBlur'],
                      initialValue: item,
                      rules: [
                        { max: 50, message: '已超过最大字数限制' },
                      ],
                    })(
                      <Input placeholder="每行不超过50字"  onBlur={(e) => this.onChangeValue(index, e)}/>
                    )}
                    <div className={styles.product_services}>
                      <Button type="primary" ghost onClick={() => this.addService(index)}>+</Button>
                      <Button type="primary" ghost onClick={() => this.reduceService(index)}>-</Button>
                    </div>
                  </FormItem>

                </div>
              )
            })}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { goodsEditModel: state.goodsEditModel };
};

export default connect(mapStateToProps)(otherInfo)