import React from 'react';
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Tag,
  Select,
  Upload,
  Icon,
  message,
} from 'antd';
import { connect } from 'dva';
import Specifications from './specifications';

import styles from '../../goods-edit/index.less';

const FormItem = Form.Item;
const Option = Select.Option;

class PriceRepertory extends React.Component {
  constructor(props) {
    super(props)
  }

  // 验证价格和分润
  verifyPrice = (obj) => {
    if (obj.target.value == '0.00') {
      obj.target.value = '';
    }
    obj.target.value = obj.target.value.replace(/[^\d.]/g, "");
    obj.target.value = obj.target.value.replace(/^\./g, "");
    obj.target.value = obj.target.value.replace(/\.{2,}/g, ".");
    obj.target.value = obj.target.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.target.value = obj.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
  }

  // 验证库存
  verifyInventory = (obj) => {
    obj.target.value = obj.target.value.replace(/[^0-9]/g, '');
    obj.target.value = obj.target.value.replace(/\D/g, '');
  }

  // 验证划线价不能超过价格的70%
  handleSharePrice = (rule, value, callback) => {
    const { getFieldValue } = this.props.form
    if (value && getFieldValue('price') && getFieldValue('price') * 0.7 < value) {
      callback('分润不能超过价格的70%！')
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback()
  }

  // 验证价格的70%必须超过划线价
  handPrice = (rule, value, callback) => {
    const { getFieldValue } = this.props.form
    if (value && value * 0.7 < getFieldValue('shareProfit')) {
      callback('价格的70%要大于分润！')
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback()
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { formData } = this.props;
    const { sepAll, stock, sepTable } = this.props.goodsEditModel
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 }
    }
    let price = [], shareProfit = [];
    for (let i = 0; i < sepTable.length; i++) { // 循环批量设置的价格和分润
      if (sepTable[i].price && sepTable[i].shareProfit) {
        price.push(Number(sepTable[i].price));
        shareProfit.push(Number(sepTable[i].shareProfit))
      }
    }

    price.sort(function(a, b){ // 将价格进行排序
      return a - b
    })

    shareProfit.sort(function(a, b){ // 将分润进行排序
      return a - b
    })

    return (
      <div className={styles.info_edit}>
        <div className={styles.price_edit}>
          <div className={styles.goods_title}>
            <label>价格库存</label>
          </div>
          <Specifications onCompelete={this.onCompelete} />
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="价格:">
                {getFieldDecorator('price', {
                  initialValue: price[0] ? price[0] : formData.price,
                  rules: [
                    { required: sepTable.length == 0, message: '请输入内容' },
                    { validator: this.handPrice },
                    { pattern: /^[1-9]\d*(\.\d{1,2})?$|^[0]\.\d{1,2}$/g, message: '请输入正确的价格' }
                  ],
                })(
                  <Input placeholder="请输入价格" type="text" maxLength="10" onKeyUp={this.verifyPrice} disabled={sepTable.length > 0} />
                )}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem wrapperCol={{ span: 15 }} labelCol={{ span: 7 }} label="划线价:">
                {getFieldDecorator('linePrice', {
                  initialValue: formData.linePrice || '',
                  rules: [
                    { pattern: /^[1-9]\d*(\.\d{1,2})?$|^[0]\.\d{1,2}$/g, message: '请输入正确的内容' }
                  ],
                })(
                  <Input placeholder="请输入划线价" type="text" maxLength="10" onKeyUp={this.verifyPrice} disabled={sepTable.length > 0} />
                )}
                <div className={styles.line_price}>
                  商品没有优惠的情况下，划线价在商品详情会以划线形式显示
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="分润:">
                {getFieldDecorator('shareProfit', {
                  initialValue: shareProfit[0] ? shareProfit[0] : formData.shareProfit,
                  rules: [
                    { required: sepTable.length == 0, message: '请输入内容' },
                    { validator: this.handleSharePrice },
                    { pattern: /^[1-9]\d*(\.\d{1,2})?$|^[0]\.\d{1,2}$/g, message: '请输入正确的内容' }
                  ],
                })(
                  <Input placeholder="请输入分润价格" type="text" maxLength="10" onKeyUp={this.verifyPrice} disabled={sepTable.length > 0} />
                )}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem {...formItemLayout} label="库存:">
                {getFieldDecorator('stock', {
                  initialValue: stock || "",
                  rules: [
                    { required: sepTable.length == 0, message: '请输入内容' },
                  ],
                })(
                  <Input placeholder="请输入库存" type="text" maxLength="8" onKeyUp={this.verifyInventory} disabled={sepTable.length > 0} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="商品编码:">
                {getFieldDecorator('goodsno', {
                  initialValue: formData.goodsNo || '',
                })(
                  <Input placeholder="请输入商品编码" type="text" />
                )}
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { goodsEditModel: state.goodsEditModel };
};

export default connect(mapStateToProps)(PriceRepertory)
