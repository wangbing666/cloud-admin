/**
 * Created by wangbing on 2018/6/8.
 * 活动管理
 */
import React from 'react';
import { Spin, Table, Pagination, Divider, Modal, Button } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';

import ActivitySearch from './components/activity-list/activitySearch';
import styles from './index.less';

const columns = [{
  title: '活动名称',
  dataIndex: 'groupActivityName',
  align: 'center',
  key: 'groupActivityName',
}, {
  title: '活动类型',
  dataIndex: 'type',
  align: 'center',
  key: 'type',
  render: (text, row, index) => {
    if (text == 0) {
      return "团购活动"
    }
  },
}, {
  title: '活动状态',
  dataIndex: 'isStatus',
  align: 'center',
  key: 'isStatus',
  render: (text, row, index) => {
    if (text == 0) {
      return "未发布"
    }
    if (text == 1) {
      return "等待开始"
    }
    if (text == 2) {
      return "活动进行中"
    }
    if (text == 3) {
      return "活动结束"
    }
  },
}, {
  title: '活动有效期',
  dataIndex: 'endTimeString',
  align: 'center',
  key: 'endTimeString',
  render: (text, row, index) => {
    return `${row.startTimeString} ~ ${row.endTimeString}`
  }
}, {
  title: '创建日期',
  dataIndex: 'createTimeString',
  align: 'center',
  key: 'createTimeString',
}];

class ActivityManagement extends React.Component {

  constructor(props) {
    super(props);
    /*
    * visible 添加模态框显示与隐藏
    * confirmLoading 点击模态框确定后请求loading
    * visibleDel 删除模态框显示与隐藏
    */
    this.state = {
      title: '',
      operationText: "",
      content: '',
      status: '',
      activityId: '',
      visible: false,
    };

    this.tableColumn = columns.concat({
      title: '操作',
      dataIndex: 'opration',
      key: 'opration',
      align: 'center',
      width: '15%',
      render: (text, record) => {
        let activity;
        if (record.isStatus == 2 || record.isStatus == 1) {
          activity = <a href="javascript:;" onClick={() => this.cancelActivity(record.groupBuyId)}>取消发布</a>
        }
        if (record.isStatus == 3 || record.isStatus == 0) {
          activity = <a href="javascript:;" onClick={() => this.delActivity(record.groupBuyId)}>删除活动</a>
        }
        return (
          <div>
            <Link to={`/business/activity-management/activity-edit/${record.groupBuyId}`}>
              <label>查看详情</label>
            </Link>
            <Divider type="vertical" />
            {activity}
          </div>
        );
      }
    })
  }

  componentDidMount() {
    this.handleRefresh();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityModel/setSearchData',
      payload: {
        searchData: {
          conditionValue: "", // 活动名称或商品名称搜索
          nameType: 0, // 活动名称 or 商品名称
          productName: '', // 商品名称
          type: '', // 活动类型
          isStatus: '', // 活动状态
          startTime: '', // 创建时间（起）
          endTime: '', // 创建时间(止)
        },
      }
    });
  }

  handleRefresh = () => {
    const { dispatch, activityModel } = this.props;
    dispatch({
      type: 'activityModel/searchListData',
      payload: {
        ...activityModel.searchData,
        pageNow: activityModel.pageNow,
        enterpriseId: activityModel.enterpriseId,
        pageSize: activityModel.pageSize
      }
    });
  }

  // 查询活动
  getSearchData = (values) => {
    // if (values.nameType == 1) {
    //   values.productName = values.groupActivityName;
    //   values.groupActivityName = '';
    // } else {
    //   values.productName = "";
    // };
    const { dispatch, activityModel } = this.props;
    dispatch({ type: 'activityModel/setPageNow', payload: { pageNow: 1 } });
    dispatch({ type: 'activityModel/setSearchData', payload: { searchData: values } });
    dispatch({
      type: 'activityModel/searchListData',
      payload: {
        ...values,
        pageNow: 1,
        enterpriseId: activityModel.enterpriseId,
        pageSize: activityModel.pageSize
      }
    });
  }

  //设置PageSize
  setShowSizeChange = (current, pageSize) => {
    const { dispatch, activityModel } = this.props;
    dispatch({ type: 'activityModel/setPageShowSize', payload: { pageSize } });
    dispatch({ type: 'activityModel/setPageNow', payload: { pageNow: 1 } });
    dispatch({
      type: 'activityModel/searchListData',
      payload: {
        ...activityModel.searchData,
        pageNow: 1,
        pageSize,
        enterpriseId: activityModel.enterpriseId,
      }
    });
  };

  //设置PageNow
  setNewPageNow = (pageNow) => {
    const { dispatch, activityModel } = this.props;
    dispatch({ type: 'activityModel/setPageNow', payload: { pageNow } });
    console.log(activityModel.searchData)
    dispatch({
      type: 'activityModel/searchListData',
      payload: {
        ...activityModel.searchData,
        pageNow,
        enterpriseId: activityModel.enterpriseId,
        pageSize: activityModel.pageSize
      }
    });
  };

  // 删除活动
  delActivity = (id) => {
    const { dispatch, } = this.props;
    this.setState({
      title: '确认删除',
      content: '是否确认删除该活动？',
      operationText: '确认删除',
      activityId: id,
      status: 2,
    });
    dispatch({
      type: 'activityModel/showModal',
    })
  }

  // 取消发布
  cancelActivity = (id) => {
    const { dispatch } = this.props;
    this.setState({
      title: '取消发布',
      content: '是否取消发布该活动？',
      operationText: '确认取消',
      activityId: id,
      status: 3,
    });
    dispatch({
      type: 'activityModel/showModal',
    })
  }

  // 发布活动
  releaseActivity = (id) => {
    const { dispatch } = this.props;
    this.setState({
      title: '确认发布',
      content: '是否确认发布该活动？',
      operationText: '确认发布',
      status: 1,
      activityId: id,
    });
    dispatch({
      type: 'activityModel/showModal',
    })
  }

  // 确认操作
  handleDelOk = (e) => {
    const { status, activityId } = this.state;
    const { dispatch, activityModel } = this.props;
    if (status == 1) { // 发布活动
      dispatch({
        type: 'activityModel/ReleaseActivity',
        payload: {
          shopId: activityModel.shopId,
          groupBuyId: activityId,
          isStatus: status,
        }
      })
        .then(() => {
          this.handleRefresh();
        })
    }
    if (status == 2) { // 删除活动
      dispatch({
        type: 'activityModel/DeleteActivity',
        payload: {
          shopId: activityModel.shopId,
          groupBuyId: activityId,
        }
      })
        .then(() => {
          this.handleRefresh();
        })
    }
    if (status == 3) { // 取消活动
      dispatch({
        type: 'activityModel/CancelActivity',
        payload: {
          groupBuyActivityId: activityId,
        }
      })
        .then(() => {
          this.handleRefresh();
        })
    }
  }

  // 取消操作
  handleCancel = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityModel/hideModal',
    })
    this.setState({
      visible: false,
    });
  }

  // 添加活动
  addActivity = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityModel/setSelectGoodsList',
      payload: {
        selectGoodsList: [],
      },
    });
    this.setState({
      visible: true,
    });
  }

  render() {
    const { activityModel } = this.props;
    const { title, operationText, content, visible } = this.state;
    const { searchData, pageNow, operationVisible, confirmLoading, total, showListLoadding, activityList } = activityModel;
    return (
      <div className={styles.activitylist}>
        <div className={styles.activityBody}>

          <div className={styles.cloudHead}>
            <div className={styles.cloudHeadLeft}>
              <span>活动列表</span>
            </div>
          </div>
          <ActivitySearch ref={(form) => this.form = form}
            getSearchData={(e) => this.getSearchData(e)}
            searchData={searchData} />
          <div className={styles.list_table}>
            <div className={styles.add_Activity}>
              <Button type="primary" ghost onClick={this.addActivity}>添加活动</Button>
            </div>
            <Spin size="large" spinning={showListLoadding}>
              <div className={styles.tableContent}>
                <Table columns={this.tableColumn}
                  dataSource={activityList}
                  pagination={false}
                  rowKey={(r, i) => i} />
              </div>
              {activityList.length > 0 ?
                <Pagination showSizeChanger current={pageNow}
                  onShowSizeChange={this.setShowSizeChange}
                  onChange={this.setNewPageNow} total={total}
                  className={styles.pagination} showQuickJumper />
                : <div className={styles.bottomDiv}></div>}
            </Spin>
          </div>
        </div>
        <Modal title={title}
          visible={operationVisible}
          onOk={this.handleDelOk}
          okText={operationText}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <p>{content}</p>
        </Modal>
        <Modal
          title="添加活动"
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <div className={styles.cluster_activity}>
            <Link to={`/business/activity-management/activity-edit/0`}>
              <div>团</div>
            </Link>
            <h3>团购活动</h3>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { activityModel: state.activityModel }
}

export default connect(mapStateToProps)(ActivityManagement)
