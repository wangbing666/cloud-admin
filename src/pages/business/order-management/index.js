/**
 * Created by wangbing on 2018/6/12.
 * 订单管理
 */
import React from 'react';
import { Spin, Pagination, Divider, Modal, Tabs } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';

import { OrderSearch, OrderTable } from './components';

// import ActivitySearch from './activitySearch';
import styles from './index.less';

const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;

const tabList = [{
  title: '全部',
  key: '0',
}, {
  title: '待付款',
  key: '1',
}, {
  title: '待成团',
  key: '7',
}, {
  title: '待发货',
  key: '2',
}, {
  title: '已发货',
  key: '3',
}, {
  title: '已完成',
  key: '4',
}, {
  title: '退款中',
  key: '5',
}, {
  title: '已关闭',
  key: '8',
}]

class OrderManagement extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { status } = this.props.location.query;
    if (status) { // 判断是否从首页跳转过来的
      dispatch({ type: 'orderListModel/setStatus', payload: { status: status } });
      this.initList(status)
    } else {
      dispatch({ type: 'orderListModel/setStatus', payload: { status: "0" } });
      this.initList()
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderListModel/setSearchData',
      payload: {
        searchData: {
          conditionType: 1, // 订单号或姓名或手机
          conditionValue: '', // 搜索框
          startTime: '', // 下单开始时间 
          endTime: '', // 下单结束时间
          isProxySale: '', // 订单来源
          billType: 0, // 付款方式
          transportType: 0, // 物流方式
          orderType: 0, // 订单类型
        },
      }
    });
  }

  // 初始化列表
  initList = (status = 0) => {
    const { dispatch, orderListModel } = this.props;
    dispatch({
      type: 'orderListModel/searchListData',
      payload: {
        ...orderListModel.searchData,
        status: status,
        enterpriseId: orderListModel.enterpriseId,
        shopId: orderListModel.shopId,
        pageNow: orderListModel.pageNow,
        pageSize: orderListModel.pageSize,
      }
    });
  }

  //查询订单
  getSearchData = (values) => {
    const { dispatch, orderListModel } = this.props;
    dispatch({ type: 'orderListModel/setPageNow', payload: { pageNow: 1 } });
    dispatch({ type: 'orderListModel/setSearchData', payload: { searchData: values } });
    dispatch({
      type: 'orderListModel/searchListData',
      payload: {
        ...values,
        pageNow: 1,
        enterpriseId: orderListModel.enterpriseId,
        shopId: orderListModel.shopId,
        status: orderListModel.status,
        pageSize: orderListModel.pageSize
      }
    });
  }

  //设置PageSize
  setShowSizeChange = (current, pageSize) => {
    const { dispatch, orderListModel } = this.props;
    dispatch({ type: 'orderListModel/setPageShowSize', payload: { pageSize } });
    dispatch({ type: 'orderListModel/setPageNow', payload: { pageNow: 1 } });
    dispatch({
      type: 'orderListModel/searchListData',
      payload: {
        ...orderListModel.searchData,
        pageNow: 1,
        pageSize,
        enterpriseId: orderListModel.enterpriseId,
        shopId: orderListModel.shopId,
        status: orderListModel.status,
      }
    });
  };

  //设置PageNow
  setNewPageNow = (pageNow) => {
    const { dispatch, orderListModel } = this.props;
    dispatch({ type: 'orderListModel/setPageNow', payload: { pageNow } });
    dispatch({
      type: 'orderListModel/searchListData',
      payload: {
        ...orderListModel.searchData,
        pageNow,
        enterpriseId: orderListModel.enterpriseId,
        shopId: orderListModel.shopId,
        status: orderListModel.status,
        pageSize: orderListModel.pageSize
      }
    });
  };

  // 切换Tabs
  callback = (key) => {
    const { dispatch, orderListModel } = this.props;
    dispatch({ type: 'orderListModel/setStatus', payload: { status: key } });
    dispatch({ type: 'orderListModel/setPageNow', payload: { pageNow: 1 } });
    dispatch({
      type: 'orderListModel/searchListData',
      payload: {
        ...orderListModel.searchData,
        status: key,
        pageNow: 1,
        enterpriseId: orderListModel.enterpriseId,
        shopId: orderListModel.shopId,
        pageSize: orderListModel.pageSize,
      }
    });
  }

  // 备注和发货完成
  compelete = () => {
    const { orderListModel } = this.props;
    this.initList(orderListModel.status);
  }

  render() {
    const { orderListModel } = this.props;
    const { status } = this.props.location.query;
    const { pageNow, total, searchData, showListLoadding, orderList } = orderListModel;
    const Tab = tabList.map((item, index) => {
      return (
        <TabPane tab={item.title} key={item.key}>
          {orderList.length > 0 ? <OrderTable list={orderList} title="商品发货" onCompelete={this.compelete} /> : null}
          {orderList.length > 0 ?
            <Pagination showSizeChanger current={pageNow}
              onShowSizeChange={this.setShowSizeChange}
              onChange={this.setNewPageNow} total={total}
              className={styles.pagination} showQuickJumper />
            : <div className="bottomDiv"></div>}
        </TabPane>
      )
    });
    return (
      <div className={styles.orderlist}>
        <div className={styles.orderBody}>
          <div className={styles.orderHead}>
            <div className={styles.orderHeadLeft}>
              <span>订单管理列表</span>
            </div>
          </div>
          <OrderSearch ref={(form) => this.form = form}
            getSearchData={(e) => this.getSearchData(e)}
          />
          <Spin size="large" spinning={showListLoadding}>
            <Tabs style={{ padding: 30 }} defaultActiveKey={status ? status : '0'} onChange={this.callback}>
              {Tab}
            </Tabs>
          </Spin>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { orderListModel: state.orderListModel }
}

export default connect(mapStateToProps)(OrderManagement)