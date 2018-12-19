import React, { Component } from 'react';
import styles from './index.less';
import BlockHead from '../components/blockHead/index';
import { Row, Col, Checkbox, Radio, Switch, Icon, message, Modal } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import homePage1 from '../components/img/homePage1.PNG';
import homePage2 from '../components/img/homePage2.png';
import homePage3 from '../components/img/homePage3.png';
import commodityDetails from '../components/img/commodityDetails.png'
import { saveShopTheme } from '../api/index'
import { authorization } from 'utils';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

const options = [
  { label: '店铺Banner', value: 'a' },
  { label: '店铺分类', value: 'b' },
  { label: '首页分区', value: 'c' },
  { label: '活动页面', value: 'd' },
];

const buttonOps = [{
  key: 1,
  value: '0',
}, {
  key: 2,
  value: '5px',
}, {
  key: 3,
  value: '15px',
}]

class ShopStyle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      walletDialogStat: false,
      bufferShopFormWork: [],
    }
  }
  
  async componentDidMount() {
    const { dispatch } = this.props;
    const userInfo = authorization.getUserInfo();

    await dispatch({type: 'shopModel/getshopThemeShopList', payload: {} })
    await dispatch({type: 'shopModel/getShopThemeInfo', payload: {enterpriseId: userInfo.enterpriseId, shopId: userInfo.shopId} })
  }

  goBack() {
    router.goBack();
  }

  _save() {
    const { shopModel } = this.props;
    const { shopThemeInfo } = shopModel;
    const userInfo = authorization.getUserInfo();

    const orderData = {
      shopFormwork: shopThemeInfo.shopFormwork.join(""),
      themeId: parseInt(shopThemeInfo.colorId) + 1,
      shape: shopThemeInfo.btStyleId + 1,
      needCS: shopThemeInfo.switchStat ? 1 : 0,
      shopId: userInfo.shopId,
      log: 2, // 传递log，打印日志
    }
    saveShopTheme(orderData).then((res) => {
      if(res.status === 0) {
        message.success('提交成功')
        router.goBack()
      }
    })
  }

  _changeColor(e) {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({type: 'shopModel/setThemeColorId', payload: value});
  }

  _SelectBtStyle(e) {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({type: 'shopModel/setThemeBt', payload: value});
  }

  _changeSwith(e) {
    const { dispatch } = this.props;
    console.log(e)
    if (!e) {
      Modal.confirm({
        title: '模块修改提示',
        content: '关闭首页客服功能，则首页不在展示客服入口',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          dispatch({type: 'shopModel/setSwitchStat', payload: e});
        }
      })
    } else {
      dispatch({type: 'shopModel/setSwitchStat', payload: e});
    }
  }

  _changeShopFormwork(e) {
    const { dispatch, shopModel  } = this.props;
    const { shopFormwork } = shopModel.shopThemeInfo;
    if (e.length < shopFormwork.length) {
      this.setState({
        bufferShopFormWork: [...e],
        walletDialogStat: true,
      })
    } else {
      dispatch({ type: 'shopModel/setShopFormWork', payload: e })
    }
  }

  onOkDialogModal() {
    const { bufferShopFormWork } = this.state;
    this.setState({
      walletDialogStat: false,
    })
    const { dispatch } = this.props;
    dispatch({ type: 'shopModel/setShopFormWork', payload: [...bufferShopFormWork] })
  }

  cancelDialogModal() {
    this.setState({
      walletDialogStat: false,
    })
  }
  
  render() {
    const { themeColors, shopThemeInfo } = this.props.shopModel;
    const { btStyleId, colorId, switchStat, shopFormwork } = shopThemeInfo;
    return (
      <div>
      {themeColors.length !== 0 ? <div className={styles.container}>
        <BlockHead leftText="店铺风格" goBackBt={this.goBack} savetBt={{event: this._save.bind(this), text: '保存'}} />
        <Row style={{ height: '100px', padding: '32px' }}>
          <Col span={2}>
            <span className={styles.itemLabel}>店铺模块:</span>
          </Col>
          <Col>
            <CheckboxGroup options={options} value={shopFormwork} onChange={this._changeShopFormwork.bind(this)} />
          </Col>
        </Row>
        <Row style={{ height: '100px', padding: '32px' }}>
          <Col span={2}>
            <span className={styles.itemLabel}>客服模块:</span>
          </Col>
          <Col>
            <Switch checked={switchStat} onChange={this._changeSwith.bind(this)}></Switch>
          </Col>
        </Row>
        <Row style={{ height: 'auto', padding: '32px' }}>
          <Col span={2}>
            <span className={styles.itemLabel}>主题搭配:</span>
          </Col>
          <Col span={22}>
            <RadioGroup value={colorId} onChange={this._changeColor.bind(this)}>
              {themeColors ? themeColors.map((e, i)=>{
                  return <Radio value={i}>
                   <div className={styles.styleBlock}>
                    <span style={{ background: e.color1 }}></span>
                    <span style={{ background: e.color2 }}></span>
                    <span style={{ background: e.color3 }}></span>
                  </div>
                </Radio>
              }): null} 
            </RadioGroup>
          </Col>
        </Row>
        <Row style={{ height: '100px', padding: '32px' }}>
          <Col span={2}>
            <span className={styles.itemLabel}>按钮形状:</span>
          </Col>
          <Col>
            <RadioGroup value={btStyleId} onChange={this._SelectBtStyle.bind(this)}>
            {buttonOps.map((e, i) => { return <Radio value={i}>
              <span className={styles.buttonStyles} style={{ borderRadius: e.value, background: themeColors[colorId].color1 }}></span>
            </Radio>})}
            </RadioGroup>
          </Col>
        </Row>
        <Row style={{ height: 'auto', padding: '32px' }}>
          <Col span={2}>
            <span className={styles.itemLabel}>预览页面:</span>
          </Col>
          <Col span={22}>
            <Row>
              <Col span={12}>
                <div className={styles.previewLeft}>
                  <div className={styles.titleTop} style={{ background: themeColors[colorId].color1 }}>
                    <span>
                      <Icon type="user" style={{ color: themeColors[colorId].color3 }} />
                    </span>
                    <span style={{ color: themeColors[colorId].color3 }}>店铺名称</span>
                    <span>
                      <Icon type="search" style={{ color: themeColors[colorId].color3, marginRight: '10px' }} />
                      <Icon type="shopping-cart" style={{ color: themeColors[colorId].color3 }} />
                    </span>
                  </div>
                  <img src={homePage1}  alt="" />
                  <img src={homePage2}  alt="" />
                  <div className={styles.pratitonHead} style={{ background: themeColors[colorId].color1 }}>
                    <hr style={{ border: '1px solid' + themeColors[colorId].color3 }} />
                    <span style={{ color: themeColors[colorId].color3 }}>分区名称</span>
                    <hr style={{ border: '1px solid' + themeColors[colorId].color3 }}  />
                  </div>
                  <img src={homePage3}  alt="" />
                  <div className={styles.customerService} style={{ background: themeColors[colorId].color1, color: themeColors[colorId].color3, height: switchStat ? '50px' : '0'  }}>联系客服</div>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.previewRight}>
                  <img src={commodityDetails} alt="" />
                  <div className={styles.commodityDetailsFoot}>
                    <span>
                      <p>
                      <Icon type="shopping-cart" className={styles.Icon} style={{ color: themeColors[colorId].color1 }} />
                      </p>
                      <p>购物车</p>
                    </span>
                    <span>
                      <p>
                      <Icon type="shop" className={styles.Icon} style={{ color: themeColors[colorId].color1 }} /></p>
                      <p>进入店铺</p>
                    </span>
                    <span style={{ borderRadius: buttonOps[btStyleId].value, background: themeColors[colorId].color2 }}>加入购物车</span>
                    <span style={{ borderRadius: buttonOps[btStyleId].value, background: themeColors[colorId].color1 }}>立即购买</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div> : null}
      <Modal
         title="提示"
         visible={this.state.walletDialogStat}
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

const mapStateToProps = (state) => {
  return { shopModel: state.shopModel }
}

export default connect(mapStateToProps)(ShopStyle);
