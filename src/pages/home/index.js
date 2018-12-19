/* eslint eqeqeq:0 */
import React from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from './index.less'
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import { Divider, Spin } from 'antd';

const shop = {
  'shopPV': { min: 0 },
  'currentDate': { range: [0, 1] }
};

const order = {
  'orderNums': { min: 0 },
  'currentDate': { range: [0, 1] }
}

const payAmount = {
  'payAmount': { min: 0 },
  'currentDate': { range: [0, 1] }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shopColor: true,
      orderColor: true,
      tradingColor: true,
    }
  }

  componentDidMount() {
    const { dispatch, homeModel } = this.props;
    dispatch({
      type: 'homeModel/SalesAmount',
      payload: {
        shopId: homeModel.shopId,
      }
    });
    dispatch({
      type: 'homeModel/OrderNums',
      payload: {
        shopId: homeModel.shopId,
      }
    });
    dispatch({
      type: 'homeModel/WaitOrderNums',
      payload: {
        shopId: homeModel.shopId,
      }
    });

    // 特殊业务商户
    dispatch({
      type: 'homeModel/IsSupportTx',
      payload: {
        shopId: homeModel.shopId,
      }
    });
    this.getData(1, 0); // 参数分别为1日的数据和店铺数据，订单数据，交易数据
    this.getData(1, 1); // 参数分别为1日的数据和店铺数据，订单数据，交易数据
    this.getData(1, 2); // 参数分别为1日的数据和店铺数据，订单数据，交易数据
  }

  // 获取店铺数据，订单数据，交易数据
  getData = (id, type) => {
    const { dispatch, homeModel } = this.props;
    if (type == 0) {
      dispatch({
        type: 'homeModel/ShopPV',
        payload: {
          shopId: homeModel.shopId,
          rangeType: id
        }
      });
    }
    if (type == 1) {
      dispatch({
        type: 'homeModel/NewOrderNums',
        payload: {
          shopId: homeModel.shopId,
          rangeType: id
        }
      });
    }
    if (type == 2) {
      dispatch({
        type: 'homeModel/NewTradeBill',
        payload: {
          shopId: homeModel.shopId,
          rangeType: id
        }
      });
    }
  }

  // 店铺数据1日
  onChangeShopOne = () => {
    let { shopColor } = this.state;
    this.getData(1, 0);
    this.setState({
      shopColor: !shopColor
    })
  }

  // 店铺数据七日
  onChangeShopSeven = () => {
    let { shopColor } = this.state;
    this.getData(2, 0);
    this.setState({
      shopColor: !shopColor,
    })
  }

  // 订单新增一日
  onChangeOrderOne = () => {
    let { orderColor } = this.state;
    this.getData(1, 1);
    this.setState({
      orderColor: !orderColor,
    })
  }

  // 订单新增七日
  onChangeOrderSeven = () => {
    let { orderColor } = this.state;
    this.getData(2, 1);
    this.setState({
      orderColor: !orderColor,
    })
  }

  // 交易新增一日
  onChangeTradingOne = () => {
    let { tradingColor } = this.state;
    this.getData(1, 2);
    this.setState({
      tradingColor: !tradingColor,
    })
  }

  // 交易新增七日
  onChangeTradingSeven = () => {
    let { tradingColor } = this.state;
    this.getData(2, 2);
    this.setState({
      tradingColor: !tradingColor,
    })
  }

  render() {
    const { salesAmount, todayOrder, stayOrder, showListLoadding, shopData, orderData, tradingData, isSupportTx } = this.props.homeModel;
    const { shopColor, orderColor, tradingColor } = this.state;
    return (
      <div className={styles.Home} >
        <Spin size="large" spinning={showListLoadding}>
          <div className={styles.trading_data}>
            <div className={styles.trading_title}>
              <span>今日交易情况</span>
            </div>
            <div className={styles.statistics}>
              <Link className={styles.sales} to={'/business/order-management'}>
                <span>今日销售额</span>
                <div className={styles.sales_number}>
                  <span>￥</span>
                  {salesAmount}
                </div>
              </Link>
              <Link className={styles.order} to={'/business/order-management'}>
                <span>今日订单</span>
                <div className={styles.order_number}>{todayOrder}</div>
              </Link>
              <Link className={styles.unfinished_order} to={'/business/order-management?status=2'}>
                <span>待发货订单</span>
                <div className={styles.unfinished_order_number}>{stayOrder}</div>
              </Link>
              {isSupportTx && isSupportTx == 1 ?
                <Link className={styles.special} to={'/home/specical'}>
                  <span>特殊1业务</span>
                </Link> : null}
            </div>
          </div>
          <div className={styles.store_data}>
            <div className={styles.store_title}>
              <span>店铺数据（PV）</span>
            </div>
            <Chart height={400} width={1000} data={shopData} scale={shop} className={styles.echarts}>
              <div className={styles.switch_date}>
                <a href="javascript:;" onClick={this.onChangeShopOne} style={{ color: shopColor ? '#1890ff' : '#666' }}>1日</a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={this.onChangeShopSeven} style={{ color: !shopColor ? '#1890ff' : '#666' }}>7日</a>
              </div>
              <Axis name="currentDate" />
              <Axis name="shopPV" />
              <Tooltip crosshairs={{ type: "y" }} itemTpl='<tr class="g2-tooltip-list-item"><td>店铺访问量：</td><td>{value}</td></tr>' />
              <Geom type="line" position="currentDate*shopPV" size={2} />
              <Geom type='point' position="currentDate*shopPV" size={4} shape={'circle'} style={{ stroke: '#fff', lineWidth: 1 }} />
            </Chart>
          </div>
          <div className={styles.order_data}>
            <div className={styles.order_title}>
              <span>订单新增数量</span>
            </div>
            <Chart height={400} width={1000} data={orderData} scale={order} forceFit className={styles.echarts}>
              <div className={styles.switch_date}>
                <a href="javascript:;" onClick={this.onChangeOrderOne} style={{ color: orderColor ? '#1890ff' : '#666' }}>1日</a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={this.onChangeOrderSeven} style={{ color: !orderColor ? '#1890ff' : '#666' }}>7日</a>
              </div>
              <Axis name="currentDate" />
              <Axis name="orderNums" />
              <Tooltip crosshairs={{ type: "y" }} itemTpl='<tr class="g2-tooltip-list-item"><td>订单新增数量：</td><td>{value}</td></tr>' />
              <Geom type="line" position="currentDate*orderNums" size={2} />
              <Geom type='point' position="currentDate*orderNums" size={4} shape={'circle'} style={{ stroke: '#fff', lineWidth: 1 }} />
            </Chart>
          </div>
          <div className={styles.trading_price_data}>
            <div className={styles.trading_price_title}>
              <span>交易新增金额</span>
            </div>
            <Chart height={400} width={1000} data={tradingData} scale={payAmount} forceFit className={styles.echarts}>
              <div className={styles.switch_date}>
                <a href="javascript:;" onClick={this.onChangeTradingOne} style={{ color: tradingColor ? '#1890ff' : '#666' }}>1日</a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={this.onChangeTradingSeven} style={{ color: !tradingColor ? '#1890ff' : '#666' }}>7日</a>
              </div>
              <Axis name="currentDate" />
              <Axis name="payAmount" />
              <Tooltip crosshairs={{ type: "y" }} itemTpl='<tr class="g2-tooltip-list-item"><td>交易新增金额：</td><td>{value}</td></tr>' />
              <Geom type="line" position="currentDate*payAmount" size={2} />
              <Geom type='point' position="currentDate*payAmount" size={4} shape={'circle'} style={{ stroke: '#fff', lineWidth: 1 }} />
            </Chart>
          </div>
        </Spin>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { homeModel: state.homeModel }
}

export default connect(mapStateToProps)(Home)

