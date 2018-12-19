/*eslint eqeqeq:0*/
import React from 'react';
import { connect } from 'dva';
import { Table, Button, Pagination, Spin } from 'antd';
import { Link } from 'dva/router';

import { OrderSearch } from './components';

import styles from './index.less';

const columns = [{
  title: '售后单号',
  dataIndex: 'saleOrderNo',
  key: 'saleOrderNo',
  align: 'center',
  render: (text, row, index) => {
    return <Link to={`/business/sales-order/sales-order-detail/${row.aftersaleId}&${row.orderId}`}>{text}</Link>
  },
}, {
  title: '退款类型',
  dataIndex: 'saleType',
  key: 'saleType',
  align: 'center',
  render: (text, row, index) => {
    if (text == 0) {
      return '全部'
    }
    if (text == 1) {
      return '仅退款'
    }
    if (text == 2) {
      return '退货并退款'
    }
  },
}, {
  title: '订单号',
  dataIndex: 'orderNO',
  key: 'orderNO',
  align: 'center',
  render: (text, row, index) => {
    return <Link to={`/business/order-management/order-detail/${row.orderId}`}>{text}</Link>
  },
}, {
  title: '申请人',
  dataIndex: 'receiverName',
  key: 'receiverName',
  align: 'center',
}, {
  title: '联系方式',
  dataIndex: 'mobile',
  key: 'mobile',
  align: 'center',
}, {
  title: '申请时间',
  dataIndex: 'blackTime',
  key: 'blackTime',
  align: 'center',
}, {
  title: '订单金额',
  dataIndex: 'sAmount',
  key: 'sAmount',
  align: 'center',
}, {
  title: '退款金额',
  dataIndex: 'amount',
  key: 'amount',
  align: 'center',
}, {
  title: '当前状态',
  dataIndex: 'isAuthString',
  key: 'isAuthString',
  align: 'center',
}];


class SalesOrder extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initList();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesOrderModel/setSearchData',
      payload: {
        searchData: {
          saleOrderNo: "", // 售后单号
          orderNO: '', // 订单号
          mobile: '', // 收货人手机 
          blackStartTime: '', // 下单开始时间
          blackEndTime: '', // 下单结束时间
          isAuth: 0, // 当前状态
          saleType: 0, // 退款类型
        },
      }
    });
  }

  // 初始化页面
  initList = () => {
    const { dispatch, salesOrderModel } = this.props;
    const { searchData } = salesOrderModel;
    dispatch({
      type: 'salesOrderModel/searchListData',
      payload: {
        ...searchData,
        enterpriseId: salesOrderModel.enterpriseId,
        shopId: salesOrderModel.shopId,
        pageNow: salesOrderModel.pageNow,
        pageSize: salesOrderModel.pageSize,
      },
    });
  }

  //设置PageSize
  setShowSizeChange = (current, pageSize) => {
    const { dispatch, salesOrderModel } = this.props;
    dispatch({ type: 'salesOrderModel/setPageShowSize', payload: { pageSize } });
    dispatch({ type: 'salesOrderModel/setPageNow', payload: { pageNow: 1 } });
    dispatch({
      type: 'salesOrderModel/searchListData',
      payload: {
        ...salesOrderModel.searchData,
        pageNow: 1,
        pageSize,
        enterpriseId: salesOrderModel.enterpriseId,
        shopId: salesOrderModel.shopId,
      }
    });
  };

  //设置PageNow
  setNewPageNow = (pageNow, pageSize) => {
    const { dispatch, salesOrderModel } = this.props;
    dispatch({ type: 'salesOrderModel/setPageNow', payload: { pageNow } });
    dispatch({
      type: 'salesOrderModel/searchListData',
      payload: {
        ...salesOrderModel.searchData,
        pageNow,
        enterpriseId: salesOrderModel.enterpriseId,
        shopId: salesOrderModel.shopId,
        pageSize: salesOrderModel.pageSize
      }
    });
  };

  //查询售后订单
  getSearchData = (values) => {
    const { dispatch, salesOrderModel } = this.props;
    dispatch({ type: 'salesOrderModel/setPageNow', payload: { pageNow: 1 } });
    dispatch({ type: 'salesOrderModel/setSearchData', payload: { searchData: values } });
    dispatch({
      type: 'salesOrderModel/searchListData',
      payload: {
        ...values,
        pageNow: 1,
        enterpriseId: salesOrderModel.enterpriseId,
        shopId: salesOrderModel.shopId,
        pageSize: salesOrderModel.pageSize
      }
    });
  }

  render() {
    const { salesOrderModel } = this.props;
    const { pageNow, total, searchData, salesOrderList, showListLoadding } = salesOrderModel
    return (
      <div className={styles.sales_order}>
        <OrderSearch ref={(form) => this.form = form}
          getSearchData={(e) => this.getSearchData(e)}
          searchData={searchData} />
        <Spin size="large" spinning={showListLoadding}>
          <Table columns={columns}
            className={styles.order_table}
            dataSource={salesOrderList}
            pagination={false}
            rowKey={(r, i) => i} />
          {salesOrderList.length > 0 ?
            <Pagination showSizeChanger current={pageNow}
              onShowSizeChange={this.setShowSizeChange}
              onChange={this.setNewPageNow} total={total}
              className={styles.pagination} showQuickJumper />
            : <div className="bottomDiv"></div>}
        </Spin>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { salesOrderModel: state.salesOrderModel }
}

export default connect(mapStateToProps)(SalesOrder)

