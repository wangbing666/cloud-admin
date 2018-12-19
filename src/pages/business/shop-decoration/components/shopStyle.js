import React, { Component } from 'react';
import styles from '../index.less';
import BlockHead from './blockHead/index';
import { Row, Col, Checkbox, Radio, Button, message, Modal } from 'antd';
import { saveShopTheme } from "../api/index";
import { authorization } from 'utils';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

const options = [
  { label: '店铺Banner', value: 'a' },
  { label: '店铺分类', value: "b" },
  { label: '首页分区', value: "c" },
  { label: '活动页面', value: "d" },
];

class ShopStyle extends Component {

  constructor(props) {
    super(props)
    this.state = {
      shopFormwork: [],
      bufferShopFormWork: [],
      walletDialogStat: false,
      themeId: 1
    }
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    const userInfo = authorization.getUserInfo();
    await dispatch({type: 'shopModel/getshopThemeShopList', payload: {} })
    await dispatch({type: 'shopModel/getShopThemeInfo', payload: {enterpriseId: userInfo.enterpriseId, shopId: userInfo.shopId} })

    const { shopThemeInfo } = this.props.data;
    this.setState({
      shopFormwork: shopThemeInfo.shopFormwork,
      themeId: shopThemeInfo.colorId,
    })
  }

  // 保存样式
  saveShopTheme() {
    const { data, dispatch } = this.props;
    const { shopFormwork, themeId } = this.state;
    const userInfo = authorization.getUserInfo();
    const orderData = {
      shopFormwork: shopFormwork.join(""),
      themeId: parseInt(themeId) + 1,
      shopId: userInfo.shopId,
      shape: data.shopThemeInfo.btStyleId + 1,
      needCS: data.shopThemeInfo.switchStat ? 1 : 0,
      log: 1,
    }
    saveShopTheme(orderData).then((res) => {
      if (res.status === 0) {
        message.success('保存成功')
        dispatch({type: 'shopModel/getShopThemeInfo', payload: {enterpriseId: userInfo.enterpriseId, shopId: userInfo.shopId} })
      }
    }).catch((err) => {
      console.log(err)
    })
  }
  
  _changeShopFormwork(e) {
    const sortFormWork = e.sort();
    const { shopFormwork } = this.state;
    if(e.length < shopFormwork.length){
      this.setState({
        walletDialogStat: true,
        bufferShopFormWork: [...sortFormWork],
      })
    } else {
      this.setState({
        shopFormwork: [...sortFormWork],
      })
    }
  }

  onOkDialogModal() {
    const { bufferShopFormWork } = this.state;
    this.setState({
      walletDialogStat: false,
      shopFormwork: [...bufferShopFormWork],      
    })
  }

  cancelDialogModal() {
    this.setState({
      walletDialogStat: false,
    })
  }

  _changeColor(e) {
    const { value } = e.target;
    this.setState({
      themeId: value,
    })
  }
  
  render() {
    const { data } = this.props;
    const { themeColors } = data;
    const { shopFormwork, themeId, walletDialogStat } = this.state;
    return (
      <div className={styles.container}>
        <BlockHead leftText="店铺风格" leftIcon={1} rightText={{ src: '/business/shop-decoration/shopStyle', text: '详情>>' }} />
        <Row style={{ height: '100px', padding: '30px 32px 10px 32px' }}>
          <Col span={2}>
            <span className={styles.itemLabel}>店铺模块:</span>
          </Col>
          <Col span={18}>
          { 
            shopFormwork ? <CheckboxGroup 
              options={options} 
              value={shopFormwork} 
              onChange={this._changeShopFormwork.bind(this)} 
            /> : null
          }
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.saveShopTheme.bind(this)}>保存</Button>
          </Col>
        </Row>
        <Row style={{ height: 'auto', padding: '10px 10px 40px 32px' }}>
          <Col span={2}>
            <span className={styles.itemLabel}>主题搭配:</span>
          </Col>
          <Col span={20}>
          { 
            typeof(themeId) === 'number' ?  <RadioGroup value={themeId} onChange={this._changeColor.bind(this)}>
              { 
                themeColors.map((e, i) => {
                  return <Radio value={i}>
                    <div className={styles.styleBlock}>
                      <span style={{ background: e.color1 }}></span>
                      <span style={{ background: e.color2 }}></span>
                      <span style={{ background: e.color3 }}></span>
                    </div>
                  </Radio>
              })}
            </RadioGroup> : null 
          }
          </Col>
        </Row>
        <Modal
         title="提示"
         visible={walletDialogStat}
         okText="确认"
         cancelText="取消"
         onOk={this.onOkDialogModal.bind(this)}
         onCancel={this.cancelDialogModal.bind(this)}
         width={350}
        >
         <p>请确认删除未勾选的模块</p>
        </Modal>
      </div>
    )
  }
}

export default ShopStyle;
